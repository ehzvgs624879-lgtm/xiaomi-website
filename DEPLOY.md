# 部署文档 — CWJ TOOLS

## 方式一：本地预览

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# 直接打开
open index.html  # macOS
start index.html # Windows
```

## 方式二：GitHub Pages

1. 推送到 GitHub 仓库
2. Settings → Pages → Source: main branch
3. 访问 `https://用户名.github.io/cwj-tools/`

## 方式三：Vercel

```bash
npm i -g vercel
vercel --prod
```

## 方式四：Netlify

1. 拖拽项目文件夹到 Netlify Drop
2. 或连接 Git 仓库自动部署

## 方式五：Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/cwj-tools;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|svg|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/css application/javascript text/html;
}
```

## 环境要求

- 无需构建步骤，纯静态文件
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- 需要网络连接加载 CDN 资源 (GSAP, Chart.js, Font Awesome, Google Fonts)

## CDN 依赖

| 资源 | 版本 | 用途 |
|------|------|------|
| GSAP | 3.12.2 | 滚动动画 |
| Chart.js | 4.4.0 | 数据图表 |
| Font Awesome | 6.5.1 | 图标 |
| Google Fonts | - | Inter + JetBrains Mono |

## 离线部署

如需完全离线运行：

1. 下载所有 CDN 资源到本地
2. 修改 HTML 中的 `<link>` 和 `<script>` 标签指向本地文件
3. 字体文件下载到 `fonts/` 目录
