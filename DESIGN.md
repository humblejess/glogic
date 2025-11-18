# Gender Logic 网站设计与技术方案

## 一、项目概述

### 1.1 项目目标
帮助人们通过逻辑思考理解性别识别，揭示理性选择与情感反应之间的不一致性，促进对性别议题的深度思考。

### 1.2 核心功能流程
1. **引言部分** - 引导思考的开场
2. **排序互动** - 用户对6个性别界定标准进行优先级排序
3. **场景挑战** - 通过真实场景挑战用户的理性选择
4. **结论阐述** - 总结核心观点
5. **行动呼吁** - 关注跨性别群体困境，引导加入Discord讨论

---

## 二、网站设计

### 2.1 视觉风格定位

**设计理念：**
- **温和而坚定** - 避免过于激进或政治化，采用科学、理性的视觉语言
- **包容性设计** - 使用柔和的色彩，避免二元对立的视觉元素
- **现代简约** - 清晰的信息层级，减少视觉干扰，突出内容

**色彩方案：**
- **主色调**：柔和的蓝紫色系（代表思考、理性）
  - 主色：`#6366f1` (Indigo-500) 或 `#8b5cf6` (Violet-500)
  - 辅助色：`#ec4899` (Pink-500) - 用于强调和情感表达
- **中性色**：灰色系
  - 背景：`#f9fafb` (Gray-50)
  - 文字：`#1f2937` (Gray-800)
- **强调色**：温暖的橙色/黄色 - 用于希望和积极信息

**视觉元素建议：**
1. **抽象图形**：
   - 使用渐变、流动的抽象形状，象征性别光谱的连续性
   - 避免具象的人物形象，使用几何图形或抽象插画
   
2. **图标系统**：
   - 使用简洁的线性图标（如 Feather Icons, Heroicons）
   - 为6个标准设计对应的图标：
     - DNA/染色体：双螺旋或科学符号
     - 先天器官：抽象医疗符号
     - 当前器官：更新/变化符号
     - 第二性征：人物轮廓（中性化）
     - 性别表达：服装/风格符号
     - 自我认同：心形或思维符号

3. **插画风格**（如需要人物元素）：
   - **建议**：使用极简的、示意性的人物剪影
   - 避免过于具体的性别特征
   - 可以使用渐变填充的抽象人形轮廓
   - 或者使用几何图形组合的人物示意

4. **动画效果**：
   - 温和的过渡动画（fade, slide）
   - 拖拽排序时的视觉反馈
   - 场景切换时的平滑过渡

### 2.2 页面布局设计

#### 页面1：引言页
- **布局**：居中单栏，最大宽度 800px
- **元素**：
  - 标题：大号字体，渐变文字效果
  - 引言文字：大段落，行间距宽松，易于阅读
  - 底部：温和的CTA按钮"开始思考" → 进入排序页

#### 页面2：排序互动页
- **布局**：移动端单栏，桌面端可考虑两栏（说明+排序区）
- **元素**：
  - 顶部说明文字
  - 6个可拖拽的卡片（或可点击排序的列表）
  - 每个卡片包含：图标、标题、简短描述
  - 拖拽时显示视觉反馈（阴影、高亮）
  - 底部：确认按钮

**交互方式建议：**
- **方案A（推荐）**：拖拽排序
  - 优点：直观、现代、体验好
  - 实现：使用 Vue Draggable 或原生拖拽API
  
- **方案B**：点击数字排序
  - 优点：移动端友好，无需拖拽
  - 实现：点击卡片后弹出数字选择（1-6）

- **方案C（混合）**：桌面端拖拽，移动端点击排序
  - 优点：兼顾不同设备体验

#### 页面3：场景挑战页
- **布局**：卡片式布局，每个场景一个卡片
- **元素**：
  - 场景标题
  - 场景描述文字
  - 图片展示区（如果需要）
    - 使用抽象插画或示意性图形
    - 避免真实人物照片（可能涉及隐私和敏感性）
  - 思考提示文字
  - 继续按钮

#### 页面4：结论页
- **布局**：类似引言页，居中单栏
- **元素**：
  - 核心结论文字（大段落）
  - 关键观点列表（带图标）
  - 数据统计展示（如果已收集）

#### 页面5：行动呼吁页
- **布局**：卡片式，信息丰富但不拥挤
- **元素**：
  - 跨性别群体面临的挑战（列表或卡片）
  - 统计数据（如果有）
  - Discord 链接按钮（突出显示）
  - 分享按钮

### 2.3 响应式设计

- **断点**：
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

- **移动端优化**：
  - 大号可点击区域（至少 44x44px）
  - 简化拖拽交互（使用点击排序替代）
  - 优化字体大小和行间距

---

## 三、技术方案

### 3.1 技术选型分析

#### 当前状态
- Vue 3 + Tailwind CSS（已配置）
- Vue CLI 构建工具

#### 技术路线图建议
- Astro + Tailwind + Vue/Alpine
- 后端：FastAPI/Go
- 数据库：Sqlite 或 Supabase

#### 原始需求
- React.js + TypeScript
- 部署：Vercel

### 3.2 推荐技术方案

#### 方案A：保持 Vue 3（推荐，符合当前状态）
**前端：**
- Vue 3 + TypeScript（迁移现有代码）
- Tailwind CSS（已配置）
- Vue Router（路由）
- Pinia（状态管理，可选）
- Vue Draggable（拖拽排序）
- i18n（多语言支持）

**优势：**
- 项目已使用 Vue，迁移成本低
- Vue 3 性能优秀，生态成熟
- 与 Tailwind 配合良好

**部署：**
- Cloudflare Pages（DNS已在Cloudflare）
- 或 Vercel（原始计划）

#### 方案B：迁移到 Astro + Vue（符合技术路线图）
**前端：**
- Astro（静态站点生成）
- Vue 3 组件（交互部分）
- Tailwind CSS
- Alpine.js（轻量交互，替代部分Vue组件）

**优势：**
- 更好的SEO和性能（静态生成）
- 更小的JavaScript包体积
- 符合技术路线图建议

**劣势：**
- 需要重构现有代码
- 学习曲线

#### 方案C：迁移到 React + TypeScript（符合原始需求）
**前端：**
- React 18 + TypeScript
- Tailwind CSS
- React Router
- React DnD（拖拽排序）
- i18next（多语言）

**优势：**
- 符合原始需求
- React 生态丰富

**劣势：**
- 需要完全重写
- 迁移成本最高

### 3.3 最终推荐：方案A（Vue 3 + TypeScript）

**理由：**
1. 项目已有Vue基础，快速启动
2. Vue 3 + TypeScript 满足需求
3. 可以后续迁移到Astro（渐进式）

### 3.4 后端与数据库方案

#### 需求分析
- 用户排序数据收集
- 访问统计
- 数据持久化

#### 方案选择

**方案1：纯前端 + Cloudflare Pages Functions（推荐）**
- 使用 Cloudflare Pages Functions（Serverless Functions）
- 数据存储：
  - **选项A**：Cloudflare D1（SQLite数据库，Serverless）
  - **选项B**：Supabase（PostgreSQL，云服务）
- **优势**：
  - DNS已在Cloudflare，部署简单
  - D1是Serverless SQLite，免费额度充足
  - 无需单独管理后端服务
- **劣势**：
  - D1相对较新，文档可能不如Supabase完善

**方案2：Vercel + Vercel Functions + Supabase**
- 使用 Vercel Serverless Functions
- Supabase 作为数据库
- **优势**：
  - 符合原始Vercel部署计划
  - Supabase功能完善，有实时功能
- **劣势**：
  - 需要配置Supabase
  - DNS在Cloudflare，可能需要额外配置

**方案3：独立后端（FastAPI/Go）**
- 单独部署后端服务
- **优势**：
  - 完全控制
  - 符合技术路线图
- **劣势**：
  - 需要额外服务器/服务
  - 部署复杂度增加
  - 对于当前需求可能过度设计

#### 最终推荐：方案1（Cloudflare Pages + D1）

**技术栈：**
- 前端：Vue 3 + TypeScript + Tailwind
- 后端：Cloudflare Pages Functions
- 数据库：Cloudflare D1（SQLite）
- 部署：Cloudflare Pages

**数据模型（D1）：**
```sql
-- 用户排序记录
CREATE TABLE user_rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,  -- 匿名会话ID
  ranking_order TEXT,  -- JSON: [1,2,3,4,5,6] 对应选项顺序
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 访问统计
CREATE TABLE page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT,
  session_id TEXT,
  language TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 聚合统计（可选，或通过查询计算）
CREATE TABLE statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_rankings INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 四、部署规划

### 4.1 Cloudflare Pages 部署方案

#### 步骤概览
1. **准备项目**
   - 配置构建命令：`yarn build`
   - 输出目录：`dist`
   - Node.js 版本：18 或 20

2. **配置 Cloudflare Pages**
   - 连接 GitHub 仓库
   - 设置构建配置
   - 配置环境变量（如需要）

3. **设置 Cloudflare D1**
   - 创建 D1 数据库
   - 初始化数据库表结构
   - 配置 Pages Functions 访问 D1

4. **配置自定义域名**
   - 在 Cloudflare Pages 添加 `genderlogic.net`
   - DNS 已在 Cloudflare，自动配置

5. **设置 Pages Functions**
   - 创建 `/functions` 目录
   - 实现 API 端点：
     - `POST /api/ranking` - 提交排序
     - `GET /api/stats` - 获取统计
     - `POST /api/view` - 记录访问

### 4.2 多语言支持

#### 实现方案
- 使用 `vue-i18n` 或 `@intlify/vue-i18n`
- 语言文件结构：
  ```
  src/locales/
    en.json
    fr.json
    es.json
    zh-CN.json
    zh-TW.json
    ja.json
    it.json
    ru.json
    de.json
    pt.json
    ko.json
    th.json
  ```

#### 语言切换
- 顶部导航栏语言选择器
- 默认语言：根据浏览器语言或IP检测
- URL参数支持：`?lang=en`

### 4.3 Discord 集成

#### 实现方式
1. **Discord 邀请链接**
   - 在网站底部和行动呼吁页添加Discord服务器邀请链接
   - 使用永久邀请链接

2. **Discord Widget（可选）**
   - 嵌入Discord服务器小部件（显示在线成员数等）

3. **Discord OAuth（可选，未来）**
   - 允许用户使用Discord账号登录
   - 关联Discord身份与网站数据

---

## 五、待确定问题

### 5.1 技术选型
- [ ] **确认前端框架**：保持Vue 3还是迁移到React/Astro？
- [ ] **确认部署平台**：Cloudflare Pages还是Vercel？
- [ ] **确认数据库**：Cloudflare D1还是Supabase？

### 5.2 设计相关
- [ ] **视觉风格确认**：是否需要人物元素？抽象程度如何？
- [ ] **插画/图标**：是否需要定制插画？还是使用图标库？
- [ ] **色彩方案**：确认最终色彩搭配

### 5.3 功能细节
- [ ] **排序交互方式**：拖拽、点击数字、还是混合？
- [ ] **场景挑战页**：是否需要真实图片？还是使用抽象插画？
- [ ] **统计数据展示**：展示哪些统计？实时更新频率？
- [ ] **用户隐私**：是否需要收集任何个人信息？还是完全匿名？

### 5.4 内容相关
- [ ] **多语言内容**：是否需要专业翻译？还是先实现框架后补充？
- [ ] **场景内容**：具体场景描述和图片需要确认
- [ ] **结论文字**：最终文案需要确认和优化

### 5.5 部署相关
- [ ] **域名配置**：`www.genderlogic.net` 和 `genderlogic.net` 都指向？
- [ ] **HTTPS/SSL**：Cloudflare自动配置，需确认
- [ ] **CDN缓存策略**：静态资源缓存配置

### 5.6 未来扩展
- [ ] **用户账号系统**：是否需要？还是保持匿名？
- [ ] **数据导出**：是否需要导出统计数据？
- [ ] **分享功能**：是否需要社交媒体分享？

---

## 六、开发计划建议

### Phase 1: 基础框架（1-2周）
1. 配置 TypeScript
2. 设置路由（Vue Router）
3. 配置多语言框架（i18n）
4. 基础布局组件
5. 响应式设计实现

### Phase 2: 核心功能（2-3周）
1. 引言页实现
2. 排序互动页实现（拖拽/点击排序）
3. 场景挑战页框架
4. 结论页实现
5. 行动呼吁页实现

### Phase 3: 后端与数据（1-2周）
1. 设置 Cloudflare D1 数据库
2. 实现 Pages Functions API
3. 数据收集功能
4. 统计展示功能

### Phase 4: 优化与完善（1-2周）
1. 多语言内容填充
2. 场景内容完善
3. Discord 集成
4. 性能优化
5. SEO 优化

### Phase 5: 测试与部署（1周）
1. 跨浏览器测试
2. 移动端测试
3. 多语言测试
4. 部署到生产环境
5. 监控设置

---

## 七、设计风格参考

### 7.1 可参考的设计方向

1. **科学教育类网站**
   - 清晰的信息层级
   - 温和的色彩
   - 数据可视化元素

2. **社会议题网站**
   - 包容性设计
   - 避免刻板印象
   - 强调共情和理解

3. **互动式工具网站**
   - 清晰的交互反馈
   - 渐进式信息披露
   - 引导式流程

### 7.2 关于人物元素的设计建议

**如果使用人物元素，建议：**
- 使用**极简的抽象人形**（如渐变填充的轮廓）
- 使用**几何图形组合**（圆形、矩形组合成人物示意）
- 使用**等距插画风格**（isometric illustration）
- 避免过于具体的性别特征
- 使用**多样化的示意**（不同体型、不同表达方式）

**示例风格：**
- 类似 Notion 的插画风格（简洁、现代）
- 类似 Stripe 的插画风格（抽象、几何）
- 使用 CSS 绘制的简单图形人物

---

## 八、总结

### 推荐技术栈
- **前端**：Vue 3 + TypeScript + Tailwind CSS
- **构建**：Vite（迁移自Vue CLI，性能更好）
- **路由**：Vue Router
- **状态管理**：Pinia（如需要）
- **多语言**：vue-i18n
- **拖拽**：vue-draggable-plus 或 @vueuse/core
- **部署**：Cloudflare Pages
- **后端**：Cloudflare Pages Functions
- **数据库**：Cloudflare D1

### 设计方向
- 现代简约风格
- 温和包容的视觉语言
- 抽象图形为主，避免具象人物
- 清晰的交互反馈
- 响应式设计优先

### 下一步行动
1. 确认技术选型
2. 确认设计风格方向
3. 开始 Phase 1 开发

