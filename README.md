# CWJ TOOLS — AI 全能工具平台

> 一站式 AI SaaS 平台，集成 180+ 模型，覆盖聊天、Agent、绘图、代码助手全场景。

## 📸 预览

暗色/浅色主题、响应式设计、流畅动画、Linear/Notion 级别 UI 质感。

## 🚀 功能

| 模块 | 说明 |
|------|------|
| **首页** | Hero 动画、工具矩阵、数据统计、核心能力展示 |
| **AI 聊天** | 多模型对话界面、打字机效果、消息操作、导出 |
| **AI Agent** | 智能代理管理、任务队列、执行统计 |
| **模型管理** | 180+ 模型浏览、筛选、一键切换 |
| **控制台** | Chart.js 实时图表、用量分析、快捷操作 |
| **设置中心** | 通用/主题/通知/API 密钥/隐私全配置 |
| **用户中心** | 个人资料、用量统计、成就徽章、订阅管理 |
| **登录注册** | 邮箱/社交登录、表单验证、前端模拟 |

## 🎨 设计特性

- 🌙 暗色/浅色主题一键切换
- ✨ 鼠标跟随光效 + 3D 卡片倾斜
- 🎯 GSAP ScrollTrigger 滚动动画
- 📱 完整移动端/平板适配
- ♿ 无障碍 (ARIA + skip-link + keyboard)
- 🔍 SEO 优化 (meta + og tags)
- ⚡ 性能优化 (passive events + debounce + RAF)

## 📂 项目结构

```
cwj-tools/
├── shared.css       # 设计系统 (CSS 变量 + 组件)
├── shared.js        # 动画引擎 + 工具库
├── index.html       # 首页
├── login.html       # 登录/注册
├── dashboard.html   # 控制台
├── chat.html        # AI 聊天
├── agent.html       # Agent 中心
├── models.html      # 模型管理
├── settings.html    # 设置中心
├── profile.html     # 用户中心
├── README.md        # 本文件
├── CHANGELOG.md     # 更新日志
└── DEPLOY.md        # 部署文档
```

## 🛠️ 技术栈

- **HTML5** + **CSS3** (CSS Variables, Grid, Flexbox)
- **Vanilla JavaScript** (零框架依赖)
- **GSAP 3.12** + ScrollTrigger (动画)
- **Chart.js 4.4** (数据可视化)
- **Font Awesome 6.5** (图标)
- **Google Fonts** (Inter + JetBrains Mono)

## 📦 部署

详见 [DEPLOY.md](./DEPLOY.md)

### 快速开始

```bash
# 本地预览
python3 -m http.server 8080

# 或使用 Node
npx serve .

# 或直接打开
open index.html
```

## 📄 许可

MIT License
