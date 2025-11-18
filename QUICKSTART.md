# 快速开始指南

## 已完成的工作

✅ **项目基础结构**
- Astro + Vue 3 + TypeScript 配置完成
- Tailwind CSS 配置完成
- 多语言框架（5种语言）已设置

✅ **5个主要页面**
1. 引言页 (`/` 或 `/[lang]`)
2. 排序页 (`/[lang]/ranking`)
3. 场景挑战页 (`/[lang]/scenario`)
4. 结论页 (`/[lang]/conclusion`)
5. 行动呼吁页 (`/[lang]/action`)

✅ **核心功能**
- 排序交互（桌面拖拽，移动端点击）
- 多语言切换
- 响应式设计

## 下一步：安装依赖并运行

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev
```

访问 `http://localhost:4321` 查看网站。

## 待完善的功能

### 1. 场景内容动态化
当前场景页面是静态的。需要根据用户的排序选择动态展示不同的场景。

**实现思路：**
- 在排序页保存用户的排序结果（已实现，存储在 sessionStorage）
- 在场景页读取排序结果
- 根据排序结果（特别是选项 a/b 是否在前两位）展示相应的场景

**需要实现：**
- 创建场景内容映射（不同排序组合 → 不同场景）
- 动态场景组件

### 2. 数据收集和统计
- 设置 Cloudflare D1 数据库
- 创建 API endpoints（Cloudflare Pages Functions）
- 实现数据收集功能
- 实现统计展示功能

### 3. Discord 集成
- 添加 Discord 服务器邀请链接（Phase 2）

### 4. 内容完善
- 完善法文和西班牙文翻译
- 优化场景描述文字
- 添加更多场景（根据用户反馈）

## 场景动态化实现建议

### 场景映射逻辑

```typescript
// 根据用户排序的前两位决定展示哪个场景
function getScenarioForRanking(ranking: string[]) {
  const first = ranking[0];
  const second = ranking[1];
  
  // 如果 a 或 b 在前两位，展示 trans-man 场景
  if (first === 'a' || first === 'b' || second === 'a' || second === 'b') {
    return 'restroom-transman';
  }
  
  // 其他情况展示其他场景
  // ...
}
```

### 场景内容库

需要创建不同场景的内容：
- `restroom-transman` - 公共卫生间 trans-man 场景
- `restroom-transwoman` - 公共卫生间 trans-woman 场景
- 其他场景...

每个场景需要：
- 标题（多语言）
- 描述文字（多语言）
- 思考提示（多语言）

## 开发建议

1. **先测试基础功能**
   - 运行 `yarn dev` 查看网站
   - 测试排序功能
   - 测试多语言切换

2. **完善场景内容**
   - 根据你的需求，完善场景描述
   - 实现场景动态选择逻辑

3. **添加数据收集**
   - 设置 Cloudflare D1
   - 实现 API endpoints
   - 添加统计展示

4. **优化和部署**
   - 性能优化
   - SEO 优化
   - 部署到 Cloudflare Pages

