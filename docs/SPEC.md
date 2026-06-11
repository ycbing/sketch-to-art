# Spec: SketchToArt 高 Star 开源项目升级

## 背景

SketchToArt 是一个 AI 手绘转画作平台（Next.js + tldraw + CogView），当前功能完整（12 种风格、积分系统、COS 存储、批量生成），但 GitHub 0 Star、零推广。项目本身具备高 Star 潜力——"草图→画作"概念视觉冲击力强，适合 GIF/视频传播。

## 目标

1. **1 个月内 GitHub Star 突破 500**
2. 让开发者看到 README 就想 Star + 一键部署
3. 保持"草图→画作"核心概念不变，不新增生图能力

## 非目标

- ❌ 不做新的 AI 生图功能（不接新的供应商）
- ❌ 不做积分系统/商业化
- ❌ 不做移动端适配
- ❌ 不重构核心架构

## 用户故事

- 作为开发者，我希望打开 README 就被酷炫的 GIF 吸引，以便我 Star 并一键部署。
- 作为技术爱好者，我希望自己跑起来就能用，以便我体验"草图→画作"的乐趣。
- 作为项目评估者，我希望看到清晰的项目结构和技术文档，以便我信任这个项目的质量。

## 功能需求

### 1. 超酷示例素材（P0）
- 5 个精心准备的"草图→画作"示例对
  - 每个包含：原始草图 + 生成结果 + 风格名
  - 用 CogView-3-Plus 生成，选效果最好的
- 3 个 GIF 动图（草图→画作变形动画）
  - 用于 README Hero 区 + 社交传播
- 素材类型建议：
  - 简笔画猫 → 水彩猫咪
  - 火柴人 → 油画骑士
  - 几何图形 → 赛博朋克城市
  - 花朵草图 → 国风水墨牡丹
  - 简约建筑 → 像素风城堡

### 2. README 重写（P0）
- 英文为主（GitHub 主战场是英文）
- 结构：
  - Hero 区：项目名 + 一句话描述 + Star/Fork badge
  - Demo GIF：展示草图→画作的魔法过程
  - 功能特性：用 emoji 列表
  - 截图展示：3-5 张核心页面截图
  - 快速开始：一键部署按钮（Vercel / Docker / npm）
  - 技术栈：图标列表
  - 架构图（可选）
  - 致谢 + License
- 每个区块之间视觉节奏好，不冗长

### 3. Landing Page 重做（P0）
- 现有首页是普通 Next.js 页面，需要重做为产品级 Landing Page
- 结构：
  - Hero 区：大标题 + 副标题 + CTA（Try Now / GitHub）
  - 示例展示区：草图→画作前后对比卡片
  - 功能区：核心功能介绍（3 列卡片）
  - How It Works：3 步流程（画草图 → 选风格 → AI 生成）
  - 一键部署区：Vercel / Docker 按钮
  - Footer：GitHub 链接 + License
- 暗色主题为主，科技感设计
- 响应式，桌面端优先

### 4. 一键部署优化（P0）
- Docker：
  - 优化 Dockerfile（多阶段构建）
  - docker-compose.yml（一键启动 PostgreSQL + 应用）
  - `.env.example` 完善
- Vercel：
  - 添加 vercel.json
  - 确保 standalone 模式正常工作
- Badge：`[![Deploy with Vercel](https://vercel.com/button)]` + `[![Deploy with Docker](https://img.shields.io/badge/Docker-Deploy-blue)]`

### 5. GitHub 优化（P0）
- Topics 标签：
  ```
  ai-art, sketch-to-art, tldraw, image-generation, nextjs,
  ai-painting, art-style-transfer, stable-diffusion, openai,
  cognitiive-services
  ```
- GitHub Social Preview（og:image）
- CONTRIBUTING.md（欢迎贡献）
- .github/FUNDING.yml（可选）

### 6. 示例页面/模式（P1）
- 新增 `/demo` 页面：
  - 预设 5 个示例草图（内置 SVG/tldraw data）
  - 用户点击示例 → 自动填入画布 → 一键生成
  - 方便新手立即体验，不需要自己画
- 这个功能也让演示视频/截图更好拍

### 7. 社交传播优化（P1）
- OG 标签配置（社交分享卡片）
- Twitter/X 分享预览
- README 末尾加 "If you like this project, please star it ⭐"

## 技术约束

- 框架：Next.js 16 (App Router)
- 画布：tldraw v4（已集成，不换）
- AI 生图：CogView-3-Plus（不新增供应商）
- 部署：Docker + Vercel
- 设计：暗色主题为主，Tailwind CSS

## 验收标准

- [ ] README 有 3+ 个 GIF/动图展示
- [ ] README 有 Deploy to Vercel / Docker 一键部署按钮
- [ ] README 有功能截图（3+ 张）
- [ ] Landing Page 在桌面端视觉冲击力强
- [ ] `/demo` 页面有 5 个可点击的预设示例
- [ ] `docker-compose up` 一键启动成功
- [ ] Vercel 部署成功
- [ ] GitHub Topics 标签已设置
- [ ] 所有代码 commit 到 GitHub

## 开放问题

1. Landing Page 是否需要英文+中文双语？→ 建议先英文，后续加
2. 示例 GIF 的生成质量是否够好？→ 需要实际测试
3. 是否需要中文 README？→ 建议英文为主，底部附中文简介
