# Astro + Vue 使用方式详解

## Vue 3 SPA vs Astro + Vue：使用方式差异

### 核心差异：Vue 的使用范围

#### Vue 3 SPA（单页应用）
**所有内容都用 Vue：**
```vue
<!-- 整个应用都是 Vue 组件 -->
<template>
  <div>
    <Header />
    <Introduction />  <!-- 纯文字内容也用 Vue -->
    <RankingPage />   <!-- 交互部分用 Vue -->
    <Conclusion />    <!-- 纯文字内容也用 Vue -->
  </div>
</template>
```

**特点：**
- 整个网站是一个大的 Vue 应用
- 所有页面都是 Vue 组件
- 所有内容都需要 JavaScript 渲染
- 路由在客户端完成（Vue Router）

#### Astro + Vue
**只有交互部分用 Vue，内容用 Astro：**
```astro
---
// Astro 页面文件 (.astro)
import RankingComponent from '../components/Ranking.vue'
---

<html>
  <head>
    <title>Gender Logic</title>
  </head>
  <body>
    <!-- 纯文字内容直接用 HTML，无需 Vue -->
    <section>
      <h1>Introduction</h1>
      <p>Despite the political or religious opinion...</p>
    </section>
    
    <!-- 只有需要交互的部分才用 Vue 组件 -->
    <RankingComponent client:load />
    
    <!-- 更多纯文字内容 -->
    <section>
      <h2>Conclusion</h2>
      <p>No matter what political view...</p>
    </section>
  </body>
</html>
```

**特点：**
- 大部分内容是静态 HTML（Astro 在构建时生成）
- 只有需要交互的部分才使用 Vue 组件
- Vue 组件按需加载（"部分水合"）
- 路由可以是静态页面或 SPA 模式

---

## 具体使用示例

### 示例1：引言页（纯内容）

#### Vue 3 SPA 方式：
```vue
<!-- Introduction.vue -->
<template>
  <div class="introduction">
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
    <button @click="goToRanking">开始思考</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToRanking = () => router.push('/ranking')
</script>
```
**问题：** 纯文字内容也需要 Vue 框架支持

#### Astro + Vue 方式：
```astro
---
// introduction.astro
import { useRouter } from 'vue-router' // 不需要！
---

<html>
  <body>
    <div class="introduction">
      <h1>Gender Logic</h1>
      <p>Despite the political or religious opinion...</p>
      <a href="/ranking">开始思考</a>
    </div>
  </body>
</html>
```
**优势：** 纯 HTML，无需 JavaScript，加载极快

---

### 示例2：排序页（需要交互）

#### Vue 3 SPA 方式：
```vue
<!-- RankingPage.vue -->
<template>
  <div>
    <h2>请排序</h2>
    <DraggableList :items="options" @update="handleUpdate" />
  </div>
</template>

<script setup>
import DraggableList from './DraggableList.vue'
// 整个页面都是 Vue
</script>
```

#### Astro + Vue 方式：
```astro
---
// ranking.astro
import RankingComponent from '../components/Ranking.vue'
---

<html>
  <body>
    <!-- 说明文字用 HTML -->
    <h2>请排序</h2>
    <p>请按照重要程度排序以下选项...</p>
    
    <!-- 只有交互部分用 Vue -->
    <RankingComponent client:load />
    
    <!-- client:load 表示这个组件需要 JavaScript -->
    <!-- 其他 Vue 组件可以用 client:idle（页面空闲时加载） -->
  </body>
</html>
```

**优势：**
- 说明文字是 HTML，无需 JS
- 只有排序功能需要 Vue
- 如果用户只看不操作，几乎不加载 JS

---

### 示例3：结论页（纯内容 + 统计图表）

#### Vue 3 SPA 方式：
```vue
<template>
  <div>
    <p>{{ conclusionText }}</p>
    <StatsChart :data="stats" /> <!-- 需要 Vue -->
  </div>
</template>
```

#### Astro + Vue 方式：
```astro
---
import StatsChart from '../components/StatsChart.vue'
---

<html>
  <body>
    <!-- 结论文字是 HTML -->
    <p>No matter what political view...</p>
    
    <!-- 只有图表需要 Vue -->
    <StatsChart client:load :data={stats} />
  </body>
</html>
```

---

## 实际开发中的差异

### 文件结构对比

#### Vue 3 SPA：
```
src/
  components/
    Introduction.vue
    RankingPage.vue
    Conclusion.vue
  router/
    index.js
  App.vue
  main.js
```

#### Astro + Vue：
```
src/
  pages/
    index.astro          # 引言页（HTML）
    ranking.astro        # 排序页（HTML + Vue组件）
    conclusion.astro    # 结论页（HTML）
  components/
    Ranking.vue         # 只有交互部分用 Vue
    StatsChart.vue      # 只有交互部分用 Vue
```

---

## 关键概念：部分水合（Partial Hydration）

**Astro 的核心优势：**

1. **构建时**：Astro 将所有 `.astro` 文件转换为静态 HTML
2. **运行时**：只有标记了 `client:load` 的 Vue 组件才加载 JavaScript
3. **结果**：大部分页面是纯 HTML，只有交互部分需要 JS

**水合选项：**
- `client:load` - 立即加载（用于重要交互）
- `client:idle` - 页面空闲时加载（用于次要交互）
- `client:visible` - 滚动到可见时加载（用于懒加载）
- `client:media` - 特定媒体查询时加载

---

## 对于这个项目的实际影响

### 页面分析：

1. **引言页** - 纯文字内容
   - Vue 3 SPA：需要 Vue 框架
   - Astro：纯 HTML，无需 JS

2. **排序页** - 需要拖拽交互
   - Vue 3 SPA：整个页面是 Vue
   - Astro：说明文字是 HTML，只有排序组件是 Vue

3. **场景挑战页** - 主要是文字 + 图片
   - Vue 3 SPA：需要 Vue 框架
   - Astro：纯 HTML，图片可以用 `<img>` 标签

4. **结论页** - 文字 + 统计图表
   - Vue 3 SPA：需要 Vue 框架
   - Astro：文字是 HTML，只有图表是 Vue

5. **行动呼吁页** - 文字 + Discord 链接
   - Vue 3 SPA：需要 Vue 框架
   - Astro：纯 HTML

---

## 总结

### Vue 3 SPA：
- **所有内容**都用 Vue 组件
- 整个应用是一个 Vue 应用
- 所有页面都需要 JavaScript

### Astro + Vue：
- **只有交互部分**用 Vue 组件
- 大部分内容是静态 HTML
- 按需加载 JavaScript

### 对于你的项目：
- 5个页面中，只有排序页需要复杂交互
- 其他页面主要是文字内容
- **Astro 可以大幅减少 JavaScript 体积**

---

## 开发体验差异

### Vue 3 SPA：
```vue
<!-- 熟悉的标准 Vue 开发 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

### Astro + Vue：
```astro
---
// Astro 部分（在 --- 之间）
const title = "Gender Logic"
---

<!-- HTML 部分 -->
<h1>{title}</h1>

<!-- Vue 组件 -->
<MyComponent client:load />
```

**学习成本：** 需要理解 Astro 的语法，但 Vue 组件写法完全相同

---

## 结论

**Astro + Vue 的优势：**
- ✅ 更小的 JavaScript 体积
- ✅ 更快的首次加载
- ✅ 更好的 SEO
- ✅ 相同的 Vue 组件开发体验

**唯一需要适应：**
- 学习 Astro 的页面语法（`.astro` 文件）
- 理解"部分水合"概念

**对于你的项目，Astro 是更好的选择！**

