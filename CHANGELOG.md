# CHANGELOG

## v4.0.0 (2026-07-05)

### 🎨 主题系统
- 新增暗色/浅色主题一键切换
- CSS 变量全面支持双主题
- 主题偏好 localStorage 持久化
- Chart.js 图表自动适配主题

### 🔐 登录注册系统
- 全新登录页，支持登录/注册双 Tab 切换
- 邮箱+密码表单验证
- Google/GitHub/微信社交登录模拟
- AuthMock 用户状态管理
- 登录成功自动跳转

### 📊 Dashboard 增强
- 新增双线实时 API 调用图表
- 模型使用分布饼图
- RealtimeChart 实时数据模拟引擎
- 数据每 3 秒自动更新

### 💬 AI 聊天模拟
- ChatSim 引擎：发送消息自动触发 AI 回复
- 打字指示器动画 (● ● ●)
- 5 种预设智能回复模板
- 对话导出 CSV 功能

### 🎭 动画与交互
- 全局 Loading 遮罩 + 自动消失
- 页面入场过渡动画 (fade + slide)
- 鼠标跟随光效 (桌面端)
- 3D 卡片倾斜 (桌面端)
- 磁吸按钮效果
- GSAP ScrollTrigger 滚动揭示

### 📤 数据导出/分享
- ExportUtil 工具库 (CSV/JSON/Web Share)
- Dashboard 导出报告按钮
- 聊天记录导出按钮
- 一键分享链接 (Web Share API / Clipboard fallback)

### 📱 响应式
- 移动端导航栏优化 (56px)
- 平板端双列布局
- 桌面端完整侧边栏
- 所有表格横向滚动

### ♿ 无障碍
- 全页面 skip-link
- 导航 aria-label
- Toggle role="switch" + aria-checked
- Toast aria-live="polite"
- focus-visible 焦点环
- Escape 关闭移动菜单
- prefers-reduced-motion 全局支持

### 🔍 SEO
- 每页独立 meta description
- og:title / og:description / og:type
- theme-color meta tag
- Google Fonts display=swap

### ⚡ 性能
- scroll/mousemove passive: true
- requestAnimationFrame 节流
- will-change 优化合成层
- GSAP + Chart.js defer 加载
- DocumentFragment 批量 DOM 操作
- hover:none 设备跳过桌面动画

### 🐛 Bug 修复
- 修复 Google Fonts URL 格式错误
- 修复 4 页面重复 id="main"
- 修复登录页 HTML 结构缺失闭合标签
- 修复 Chart.js 主题切换不跟随
- 修复移动端菜单 Escape 无法关闭

---

## v3.0.0 (2026-07-04)

- 全面代码审查优化
- ARIA 属性、preconnect、passive events
- prefers-reduced-motion 支持
- CSS 变量语义化重构

## v2.0.0 (2026-07-04)

- 多页面架构 (8 个页面)
- 共享 CSS/JS 设计系统
- 侧边栏导航
- Chart.js 图表
- 响应式布局

## v1.0.0 (2026-07-04)

- 初始版本
- 单页 AI SaaS 官网
- 暗色主题
- 工具矩阵展示
