# 流量统计和答案统计实现方案

## 📊 需求分析

1. **流量统计**
   - 页面访问量（PV）
   - 独立访客数（UV，基于 session_id）
   - 语言分布
   - 国家/地区分布（基于 Cloudflare CF-IPCountry）
   - 访问时间分布

2. **答案统计**
   - 用户排序提交数
   - 每个选项被选为第1/2/3...位的次数
   - 排序模式分析（最常见的排序组合）
   - 语言分布

## 🗄️ 数据库设计（Cloudflare D1）

### 表结构

```sql
-- 用户排序记录
CREATE TABLE user_rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,           -- 匿名会话ID（用于区分用户）
  ranking_order TEXT NOT NULL,        -- JSON: ["a","b","c","d","e","f"]
  language TEXT,                       -- 用户使用的语言
  user_agent TEXT,                     -- 浏览器信息（可选）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 页面访问统计
CREATE TABLE page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,            -- 页面路径，如 "/en", "/zh-CN"
  language TEXT,
  referrer TEXT,                       -- 来源页面（可选）
  user_agent TEXT,                     -- 浏览器信息（可选）
  country_code TEXT,                   -- 国家代码（ISO 3166-1 alpha-2，如 US, CN, FR）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX idx_rankings_created ON user_rankings(created_at);
CREATE INDEX idx_rankings_language ON user_rankings(language);
CREATE INDEX idx_views_created ON page_views(created_at);
CREATE INDEX idx_views_language ON page_views(language);
CREATE INDEX idx_views_session ON page_views(session_id);
CREATE INDEX idx_views_country ON page_views(country_code);
```

## 🔧 实现步骤

### 步骤 1: 创建 Cloudflare D1 数据库

在 Cloudflare Dashboard 中：
1. 进入 Workers & Pages → D1
2. 点击 "Create database"
3. 数据库名称：`glogic-db`
4. 记录数据库 ID（后续配置需要）

### 步骤 2: 初始化数据库

创建 `schema.sql` 文件：

```sql
-- schema.sql
CREATE TABLE IF NOT EXISTS user_rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  ranking_order TEXT NOT NULL,
  language TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  language TEXT,
  referrer TEXT,
  user_agent TEXT,
  country_code TEXT,                   -- 国家代码（ISO 3166-1 alpha-2）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rankings_created ON user_rankings(created_at);
CREATE INDEX IF NOT EXISTS idx_rankings_language ON user_rankings(language);
CREATE INDEX IF NOT EXISTS idx_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_views_language ON page_views(language);
CREATE INDEX IF NOT EXISTS idx_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_views_country ON page_views(country_code);
```

执行初始化：
```bash
# 使用 Wrangler CLI（Cloudflare 官方工具）
npx wrangler d1 execute glogic-db --file=./schema.sql
```

### 步骤 3: 创建 Cloudflare Pages Functions

在项目根目录创建 `functions` 目录：

```
functions/
  api/
    ranking.ts      # POST /api/ranking - 提交排序
    stats.ts        # GET /api/stats - 获取统计
    view.ts         # POST /api/view - 记录访问
```

#### `functions/api/ranking.ts`

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, platform }) => {
  try {
    const { ranking, language, sessionId } = await request.json();
    
    if (!ranking || !Array.isArray(ranking) || ranking.length !== 6) {
      return new Response(JSON.stringify({ error: 'Invalid ranking data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = platform?.env?.DB; // D1 数据库实例
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 插入排序记录
    const result = await db.prepare(
      `INSERT INTO user_rankings (session_id, ranking_order, language, user_agent)
       VALUES (?, ?, ?, ?)`
    ).bind(
      sessionId || 'unknown',
      JSON.stringify(ranking),
      language || 'en',
      request.headers.get('user-agent') || ''
    ).run();

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.meta.last_row_id 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving ranking:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

#### `functions/api/view.ts`

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, platform, url }) => {
  try {
    const { sessionId, language } = await request.json();
    const pagePath = url.searchParams.get('path') || '/';
    
    const db = platform?.env?.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 从 Cloudflare 请求头获取国家代码（CF-IPCountry）
    // 这是 Cloudflare 自动添加的，基于 IP 地址的地理位置
    // 格式：ISO 3166-1 alpha-2 国家代码（如 US, CN, FR, GB 等）
    const countryCode = request.headers.get('CF-IPCountry') || 'XX'; // XX 表示未知

    // 插入访问记录
    await db.prepare(
      `INSERT INTO page_views (session_id, page_path, language, referrer, user_agent, country_code)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      sessionId || 'unknown',
      pagePath,
      language || 'en',
      request.headers.get('referer') || '',
      request.headers.get('user-agent') || '',
      countryCode
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving page view:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

#### `functions/api/stats.ts`

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ platform }) => {
  try {
    const db = platform?.env?.DB;
    
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database not available' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 获取总访问数
    const totalViews = await db.prepare(
      'SELECT COUNT(*) as count FROM page_views'
    ).first();

    // 获取独立访客数（基于 session_id）
    const uniqueVisitors = await db.prepare(
      'SELECT COUNT(DISTINCT session_id) as count FROM page_views'
    ).first();

    // 获取总排序提交数
    const totalRankings = await db.prepare(
      'SELECT COUNT(*) as count FROM user_rankings'
    ).first();

    // 获取排序分布（每个选项被选为第1位的次数）
    const firstChoiceStats = await db.prepare(`
      SELECT 
        json_extract(ranking_order, '$[0]') as first_choice,
        COUNT(*) as count
      FROM user_rankings
      GROUP BY first_choice
      ORDER BY count DESC
    `).all();

    // 获取语言分布
    const languageStats = await db.prepare(`
      SELECT 
        language,
        COUNT(*) as count
      FROM page_views
      GROUP BY language
      ORDER BY count DESC
    `).all();

    // 获取国家/地区分布
    const countryStats = await db.prepare(`
      SELECT 
        country_code,
        COUNT(*) as count
      FROM page_views
      WHERE country_code != 'XX'
      GROUP BY country_code
      ORDER BY count DESC
      LIMIT 20
    `).all();

    return new Response(JSON.stringify({
      totalViews: totalViews?.count || 0,
      uniqueVisitors: uniqueVisitors?.count || 0,
      totalRankings: totalRankings?.count || 0,
      firstChoiceStats: firstChoiceStats?.results || [],
      languageStats: languageStats?.results || [],
      countryStats: countryStats?.results || []
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // 缓存60秒
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### 步骤 4: 配置 Cloudflare Pages

在 Cloudflare Dashboard 中：
1. 进入 Pages → 你的项目 → Settings → Functions
2. 添加 D1 数据库绑定：
   - Variable name: `DB`
   - D1 database: 选择你创建的 `glogc-db`

### 步骤 5: 前端集成

#### 创建 Session ID 工具

`src/utils/session.ts`:

```typescript
// 生成或获取会话ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}
```

#### 在 RankingComponent 中保存排序

修改 `src/components/RankingComponent.vue` 的 `confirmRanking` 方法：

```typescript
async function confirmRanking() {
  const ranking = slots.value
    .filter(Boolean)
    .map(item => item!.key);
  
  if (ranking.length !== 6) {
    alert(t.value?.ranking?.completeAll || 'Please place all options in the slots.');
    return;
  }
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('ranking', JSON.stringify(ranking));
    
    // 保存到数据库
    try {
      const sessionId = getSessionId();
      const currentLang = props.currentLang || 'en';
      
      await fetch('/api/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ranking,
          language: currentLang,
          sessionId
        })
      });
    } catch (error) {
      console.error('Failed to save ranking:', error);
      // 不阻止用户继续，静默失败
    }
    
    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('rankingUpdated'));
    
    // 滚动到场景部分
    const scenarioSection = document.getElementById('scenario');
    if (scenarioSection) {
      scenarioSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  emit('confirm', ranking);
}
```

#### 在页面加载时记录访问

在 `src/pages/[lang]/index.astro` 中添加：

```astro
<script>
  // 记录页面访问
  if (typeof window !== 'undefined') {
    import { getSessionId } from '../utils/session';
    
    const sessionId = getSessionId();
    const currentLang = window.location.pathname.split('/')[1] || 'en';
    
    // 异步发送，不阻塞页面加载
    fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        language: currentLang
      })
    }).catch(err => console.error('Failed to log page view:', err));
  }
</script>
```

### 步骤 6: 显示统计数据（可选）

在结论页或行动呼吁页显示统计数据：

```vue
<template>
  <div class="stats-section">
    <h3>Statistics</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.totalViews }}</div>
        <div class="stat-label">Total Views</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.totalRankings }}</div>
        <div class="stat-label">Total Rankings</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const stats = ref({
  totalViews: 0,
  totalRankings: 0,
  uniqueVisitors: 0
});

onMounted(async () => {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();
    stats.value = data;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
});
</script>
```

## 📝 配置文件

### `wrangler.toml` (可选，用于本地开发)

```toml
name = "glogic"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "glogic-db"
database_id = "your-database-id-here"  # 从 Cloudflare Dashboard 获取
```

## 🚀 部署流程

1. **创建 D1 数据库**（在 Cloudflare Dashboard）
2. **初始化数据库表**（使用 Wrangler CLI）
3. **配置 Pages Functions**（在 Cloudflare Dashboard 绑定 D1）
4. **部署代码**（推送到 GitHub，Cloudflare Pages 自动部署）

## 💡 注意事项

1. **隐私保护**：使用 session_id 而不是 IP 地址，更符合隐私要求
2. **性能优化**：统计数据可以缓存，减少数据库查询
3. **错误处理**：API 调用失败不应影响用户体验，使用 try-catch 静默处理
4. **数据清理**：定期清理旧数据（可选，D1 免费额度充足）

## 🔄 替代方案

如果不想使用数据库，可以考虑：

1. **Cloudflare Analytics**（流量统计）
   - Cloudflare 自带，无需配置
   - 但无法自定义答案统计

2. **第三方服务**
   - Google Analytics（流量 + 自定义事件）
   - Plausible Analytics（隐私友好）
   - 但数据在第三方，可能不符合需求

## 📊 成本

- **Cloudflare D1 免费额度**：
  - 读取：100,000 次/天
  - 写入：1,000 次/天
  - 存储：5 GB
  - 对于中小型网站完全够用

