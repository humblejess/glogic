# 多语言支持计划

## 📋 语言支持路线图

本项目计划支持 **18种语言**，分三批实现。

---

## ✅ 第一批（已实现 - 5种语言）

当前版本已实现以下语言：

1. **English** (`en`)
2. **中文简体** (`zh-CN`) - Simplified Chinese
3. **中文繁体** (`zh-TW`) - Traditional Chinese
4. **Spanish** (`es`) - Español
5. **French** (`fr`) - Français

### 实现状态
- ✅ 所有页面内容已翻译
- ✅ 语言选择器已实现
- ✅ 自动语言检测已实现（根据浏览器设置）
- ✅ 所有 UI 文本已翻译

---

## 🔄 第二批（计划中 - 7种语言）

计划在后续版本中添加：

1. **German** (`de`) - Deutsch
2. **Portuguese** (`pt`) - Português
3. **Italian** (`it`) - Italiano
4. **Russian** (`ru`) - Русский
5. **Arabic** (`ar`) - العربية
6. **Japanese** (`ja`) - 日本語
7. **Korean** (`ko`) - 한국어

### 实现要求
- 需要专业翻译或社区贡献
- 需要验证 RTL（从右到左）语言支持（如阿拉伯语）
- 需要测试所有页面和交互元素

---

## 🚀 第三批（未来计划 - 6种语言）

长期计划支持：

1. **Hindi** (`hi`) - हिन्दी
2. **Bengali** (`bn`) - বাংলা
3. **Indonesian** (`id`) - Bahasa Indonesia
4. **Urdu** (`ur`) - اردو
5. **Swahili** (`sw`) - Kiswahili
6. **Hebrew** (`he`) - עברית

### 实现要求
- 需要评估用户需求和优先级
- 需要专业翻译服务
- 需要验证复杂脚本语言支持

---

## 🔧 技术实现

### 语言文件结构

```
src/locales/
  en.json      ✅ 已实现
  zh-CN.json   ✅ 已实现
  zh-TW.json   ✅ 已实现
  es.json      ✅ 已实现
  fr.json      ✅ 已实现
  de.json      ⏳ 待实现
  pt.json      ⏳ 待实现
  it.json      ⏳ 待实现
  ru.json      ⏳ 待实现
  ar.json      ⏳ 待实现
  ja.json      ⏳ 待实现
  ko.json      ⏳ 待实现
  ...
```

### 语言检测

- **自动检测**：根据浏览器 `navigator.language` 自动选择语言
- **手动切换**：用户可通过顶部语言选择器手动切换
- **URL 路由**：每种语言有独立路径（如 `/en`, `/zh-CN`, `/fr`）

### 语言代码映射

浏览器语言代码会自动映射到支持的语言：
- `en`, `en-US`, `en-GB` → `en`
- `zh`, `zh-CN`, `zh-Hans` → `zh-CN`
- `zh-TW`, `zh-HK`, `zh-Hant` → `zh-TW`
- `es`, `es-ES`, `es-MX` → `es`
- `fr`, `fr-FR`, `fr-CA` → `fr`

---

## 📊 优先级说明

### 第一批（已完成）
- 覆盖主要英语、中文、西班牙语、法语用户
- 满足项目初期需求

### 第二批
- 覆盖欧洲主要语言（德语、意大利语、俄语）
- 覆盖亚洲主要语言（日语、韩语）
- 覆盖全球使用广泛的葡萄牙语和阿拉伯语

### 第三批
- 覆盖南亚和东南亚主要语言
- 覆盖非洲主要语言（斯瓦希里语）
- 覆盖中东主要语言（希伯来语、乌尔都语）

---

## 📝 添加新语言的步骤

1. **创建语言文件**：在 `src/locales/` 创建 `[lang].json`
2. **更新语言列表**：在 `src/utils/i18n.ts` 添加语言代码和名称
3. **翻译内容**：翻译所有页面和 UI 文本
4. **测试**：验证所有页面和交互功能
5. **更新文档**：更新本文档和 README

---

## 🔗 相关文件

- `src/utils/i18n.ts` - 语言配置和工具函数
- `src/locales/*.json` - 翻译文件
- `src/components/LanguageSelector.astro` - 语言选择器组件
- `src/pages/index.astro` - 自动语言检测逻辑

