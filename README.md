# SketchToArt

AI 驱动的草图转画作工具。在画布上绘制草图，选择艺术风格，AI 瞬间生成精美画作。

## 功能特性

- **自由绘制** — 基于 tldraw 的专业画布工具，支持多种画笔和形状
- **12 种艺术风格** — 水彩、油画、二次元、国风水墨、赛博朋克等
- **AI 生成** — 基于智谱 CogView-3-Plus，秒级生成 1024px 高清画作
- **批量创作** — 一次生成多张不同效果，挑选最满意的结果
- **积分系统** — 注册送 50 积分，每日签到领 10 积分
- **暗色模式** — 完整的 light/dark 主题切换
- **作品管理** — 保存、浏览、下载、删除创作历史

## 技术栈

- **框架** — Next.js 16 (App Router, RSC)
- **语言** — TypeScript
- **样式** — Tailwind CSS 4
- **画布** — tldraw v4
- **数据库** — PostgreSQL + Drizzle ORM
- **认证** — NextAuth v5 (Credentials Provider)
- **存储** — 腾讯云 COS
- **AI** — 智谱 CogView-3-Plus 图像生成
- **UI** — Radix UI + shadcn/ui

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 数据库
- 智谱 API Key
- 腾讯云 COS 配置（可选，不上传时回退到临时 URL）

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 并填写配置：

```bash
cp .env.example .env.local
```

需要配置的环境变量：

```env
# 数据库
DATABASE_URL=postgresql://user:password@host:5432/dbname

# 认证
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3006

# 智谱 AI
GLM_API_KEY=your-glm-api-key
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
IMAGE_MODEL=cogview-3-plus

# 腾讯云 COS（可选，不配置则使用临时 URL）
COS_SECRET_ID=your-secret-id
COS_SECRET_KEY=your-secret-key
COS_BUCKET=your-bucket
COS_REGION=ap-shanghai
```

### 初始化数据库

```bash
npm run db:push
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3006](http://localhost:3006)

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
├── app/                    # Next.js App Router 页面和 API
│   ├── api/                # API 路由
│   │   ├── auth/           # 认证（登录/注册）
│   │   ├── artworks/       # 作品 CRUD
│   │   ├── credits/        # 积分查询/签到
│   │   ├── generate/       # AI 生成（单张/批量）
│   │   └── styles/         # 风格列表
│   ├── create/             # 创作页面
│   ├── dashboard/          # 作品管理
│   ├── signin/             # 登录
│   └── signup/             # 注册
├── components/             # React 组件
│   ├── providers/          # Session / Theme Provider
│   ├── ui/                 # shadcn/ui 组件
│   ├── ArtworkCard.tsx     # 作品卡片
│   ├── CanvasPanel.tsx     # tldraw 画布
│   ├── ErrorBoundary.tsx   # 错误边界
│   ├── GenerateButton.tsx  # 生成按钮
│   ├── Header.tsx / Footer.tsx
│   ├── ResultGallery.tsx   # 结果画廊
│   └── StyleSelector.tsx   # 风格选择器
├── lib/                    # 核心逻辑
│   ├── ai/                 # AI 图像生成
│   ├── auth.ts             # NextAuth 配置
│   ├── auth-helpers.ts     # 认证辅助函数
│   ├── cos.ts              # 腾讯云 COS 上传
│   ├── db/                 # Drizzle ORM schema & client
│   ├── styles.ts           # 艺术风格预设
│   └── utils.ts            # 通用工具
├── types/                  # 共享类型定义
│   └── artwork.ts          # ArtworkItem 类型
└── public/                 # 静态资源
```

## 积分规则

| 操作 | 消耗/获得积分 |
|------|-------------|
| 新用户注册 | +50 |
| 每日签到 | +10（每天限领一次） |
| 单张生成 | -3 |
| 批量生成（2 张） | -6 |

## 部署

项目使用 `output: "standalone"` 配置，支持 Docker 部署：

```bash
docker build -t sketch-to-art .
docker run -p 3006:3006 --env-file .env sketch-to-art
```

## License

MIT