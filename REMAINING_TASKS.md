# 剩余待完成工作清单

## ✅ 已完成

1. ✅ 项目基础结构（Astro + Vue 3 + TypeScript + Tailwind）
2. ✅ 多语言框架（5种语言）
3. ✅ 5个主要页面框架
4. ✅ 排序功能（桌面拖拽 + 移动端点击）

---

## 🔴 核心功能（必须完成）

### 1. 场景挑战页动态化 ⭐ 重要

**当前状态：** 场景页是静态的，总是显示同一个场景

**需要实现：**
- [ ] 从 sessionStorage 读取用户的排序结果
- [ ] 根据排序结果决定展示哪个场景
  - 如果选项 a 或 b 在前两位 → 展示 trans-man 场景
  - 如果选项 a 或 b 在前两位 → 展示 trans-woman 场景
  - 其他情况 → 展示相应场景
- [ ] 实现场景选择逻辑
- [ ] 完善场景内容（目前只有 trans-man 场景，需要添加 trans-woman 场景）

**实现方式：**
```typescript
// 在 scenario.astro 中
// 1. 读取 sessionStorage 中的 ranking
// 2. 根据 ranking[0] 和 ranking[1] 判断
// 3. 选择对应的场景内容
```

---

### 2. 数据收集功能

**需要实现：**
- [ ] 设置 Cloudflare D1 数据库
- [ ] 创建数据库表结构
- [ ] 实现 API endpoints（Cloudflare Pages Functions）
  - `POST /api/ranking` - 提交用户排序
  - `GET /api/stats` - 获取统计数据
  - `POST /api/view` - 记录页面访问
- [ ] 在排序确认时调用 API 保存数据
- [ ] 在页面加载时记录访问

**数据库表结构：**
```sql
-- 用户排序记录
CREATE TABLE user_rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  ranking_order TEXT,  -- JSON: ["a","b","c","d","e","f"]
  language TEXT,
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
```

---

### 3. 统计数据展示

**需要实现：**
- [ ] 在结论页或行动呼吁页显示统计数据
- [ ] 展示内容：
  - 总访问数
  - 总排序提交数
  - 排序分布（每个选项被选为第1/2/3...的比例）
  - 语言分布（可选）
- [ ] 实现数据可视化（简单的图表或数字展示）
- [ ] 从 API 获取统计数据

---

## 🟡 功能完善（重要但可后续）

### 4. Discord 集成

**需要实现：**
- [ ] 在行动呼吁页添加 Discord 邀请链接
- [ ] 添加 Discord 服务器信息
- [ ] （可选）Discord Widget 显示在线成员

**当前状态：** Phase 2 实现，但可以现在添加链接

---

### 5. 场景内容完善

**需要实现：**
- [ ] 添加 trans-woman 场景的完整内容
- [ ] 完善其他语言的场景翻译
- [ ] （可选）添加更多场景
- [ ] 添加视觉元素（抽象插画）

---

## 🟢 优化和细节（可后续完善）

### 6. SEO 优化

- [ ] Meta 标签优化
- [ ] Open Graph 标签（社交媒体分享）
- [ ] 结构化数据（Schema.org）
- [ ] Sitemap 生成

### 7. 性能优化

- [ ] 图片优化
- [ ] 代码分割
- [ ] 懒加载

### 8. 用户体验优化

- [ ] 加载状态提示
- [ ] 错误处理
- [ ] 表单验证
- [ ] 动画效果优化

---

## 📋 建议的完成顺序

### Phase 1（立即完成）
1. **场景动态化** - 让场景页根据用户排序显示不同内容
2. **完善场景内容** - 添加 trans-woman 场景

### Phase 2（核心功能）
3. **数据收集** - 设置 D1 数据库和 API
4. **统计展示** - 显示统计数据

### Phase 3（完善）
5. **Discord 集成** - 添加链接
6. **SEO 优化** - 部署前完成

---

## 🎯 下一步行动

**建议先完成：**
1. 场景动态化（最重要，让整个流程完整）
2. 完善场景内容（添加 trans-woman 场景）

**然后：**
3. 数据收集功能
4. 统计展示

你希望我先实现哪个？我建议从**场景动态化**开始，这样整个用户流程就完整了。

