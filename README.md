# 视频样片水印工具（Cloudflare Pages）

纯前端网页应用。视频不会上传服务器，FFmpeg 在浏览器中本地运行。Cloudflare Pages 只托管静态文件。

支持 **多线程加速**（需要浏览器支持 SharedArrayBuffer），不支持时自动回退单线程。

## 项目结构

```
logoadder/
├── index.html              # 入口 HTML
├── src/
│   ├── main.js             # 应用逻辑（单文件）
│   └── style.css           # 样式
├── public/
│   ├── _headers            # Cloudflare Pages HTTP 头（COOP/COEP）
│   ├── 竖屏.png             # 竖屏水印
│   └── 横屏.png             # 横屏水印
├── scripts/
│   └── copy-ffmpeg-core.mjs # 构建前复制 FFmpeg 核心文件
├── vite.config.js          # Vite 配置
├── wrangler.toml           # Cloudflare Pages 配置
└── package.json
```

> `public/ffmpeg/`、`public/ffmpeg-mt/`、`public/ffmpeg-worker/`、`src/ffmpeg-worker/` 都是 `npm run prebuild` 从 node_modules 自动生成的，已在 .gitignore 中排除，不需要手动管理。

## 本地运行

需要 Node.js 18+：

```powershell
npm install
npm run dev
```

## 部署到 Cloudflare Pages

### 方式一：GitHub 自动部署（推荐）

1. 把项目推送到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择仓库，填写构建配置：

| 设置项 | 值 |
|--------|-----|
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |

4. 点击 **Save and Deploy**，等待构建完成即可

之后每次 push 到 GitHub，Cloudflare 会自动重新构建部署。

### 方式二：Wrangler 命令行手动部署

```powershell
npm install
npm run build
npx wrangler pages deploy dist --project-name video-watermark-tool
```

首次运行 wrangler 会弹出浏览器要求登录 Cloudflare 账号。

## 换水印

在处理设置下方选择 **竖屏** 或 **横屏**，本批视频统一使用所选水印；可展开 **预览水印** 查看图片。下次打开网页会记住上次选择，默认使用竖屏。

两种处理引擎（WebAV、FFmpeg）均支持切换。处理中会锁定水印和其他设置，避免同一批次中途更改。

- `public/竖屏.png`：480×854，原有竖屏水印。
- `public/横屏.png`：1920×1080，用户提供的横屏水印。

两张图片均保留原图透明通道，未添加背景、未改变透明度。替换相应 PNG 文件，重新构建部署即可。水印会覆盖视频完整画面，视频方向、分辨率和输出命名保持不变。

## 限制

- 大视频需要较多内存，处理速度取决于本机 CPU
- 输出统一为 MP4 格式
- 首次使用需加载约 30MB 的 FFmpeg WASM 文件（浏览器会缓存）
- 多线程需要 COOP/COEP 头支持（已在 `_headers` 中配置）
