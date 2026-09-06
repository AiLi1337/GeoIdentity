# GeoIdentity - 真实地址与本土化合理身份生成器

<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="GeoIdentity Logo" />
</p>

<p align="center">
  <strong>基于真实地理实体坐标与本土化现实逻辑的高质感全球 21 国跨国身份与真实地址生成器</strong><br>
  专为跨境出海、海淘转运、独立站外贸、海外软件合规测试与表单校验打造
</p>

<p align="center">
  <a href="https://github.com/AiLi1337/GeoIdentity/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3.5-emerald.svg" alt="Vue 3"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178c6.svg" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg" alt="Tailwind CSS"></a>
  <a href="https://pages.cloudflare.com/"><img src="https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020.svg" alt="Cloudflare Pages"></a>
</p>

---

🌐 **线上演示与正式访问**：[https://vllme.com/](https://vllme.com/) （备用镜像：[https://address.vllme.com/](https://address.vllme.com/)）

---

## 📸 项目界面预览 (Screenshots)

### 1. 身份与地址生成主控制台 (21 国网格选择与三方案切换)
![主界面概览与21国快速选择](docs/images/01-generator-overview.png)

### 2. 真实物理地址与全套本土化身份测试卡片 (含 OpenStreetMap 零送中地图)
![真实物理地址与测试身份卡片](docs/images/02-identity-card.png)

### 3. 全球 21 国真实矢量地图遥测监控大盘 (Natural Earth 1 标准地理疆界)
![全球矢量地图监控大盘](docs/images/03-world-map-monitor.png)

### 4. 21 国三大方案走廊与门牌容量日更统计明细
![地址库方案明细与日更统计表格](docs/images/04-address-breakdown-table.png)

---

## 🌟 核心特性

- 🎯 **三级真实物理地址生成模式体系（自由选择）**：
  1. **🏢 高精度真实地标种子库 (Landmark Seeds)**：100% 著名商业中心、名企总部、写字楼与转运仓实体，适合跨境电商入驻与商务业务。
  2. **⚡ 方案 A：真实街道门牌合法区间衍生 (Street Derivation)**：基于真实主干道路规划门牌范围与单双号规则动态衍生，结合经纬度线性插值，海量唯一且不重复（全球 74 条走廊，可衍生 **99,456** 独立门牌）。
  3. **🏡 方案 B：全球真实住宅/居民独栋地址库 (Residential Pool)**：采集自官方公开测绘的真实独栋住宅 (Single-Family Homes)，专为通过买家 **AVS 住宅评级校验** 打造（已收录 381 处真实独栋）。
- 🌍 **覆盖全球 21 个国家与地区 (100% 全方案覆盖)**：
  - **北美洲**：美国 (US)、加拿大 (CA)。
  - **欧洲**：英国 (GB)、德国 (DE)、法国 (FR)、意大利 (IT)、西班牙 (ES)、荷兰 (NL)、瑞士 (CH)、卢森堡 (LU)、爱尔兰 (IE)。
  - **东亚与亚太**：日本 (JP)、韩国 (KR)、中国香港 (HK)、中国台湾 (TW)、澳大利亚 (AU)。
  - **东南亚**：新加坡 (SG)、马来西亚 (MY)、泰国 (TH)、越南 (VN)、菲律宾 (PH)。
- 🏷️ **美国 5 大免税州与欧洲低税特区一键直达**：
  - 提供 **DE (特拉华)**、**OR (俄勒冈)**、**NH (新罕布什尔)**、**MT (蒙大拿)**、**AK (阿拉斯加)** 独立快捷直达胶囊按钮。
  - 支持 **CH (瑞士楚格)**、**LU (卢森堡)**、**IE (爱尔兰)**、**HK (香港)** 免税金标筛选。
  - 提供 `⚡️ 仅生成免税州地址` 快速开关。
- 🗺️ **三地图引擎与防“IP 送中”安全沙箱**：
  - 默认首选 **OpenStreetMap (OSM)**：国内 100% 免翻直连秒开，真实建筑门牌无偏移，零送中风险；
  - 备选 **Bing Maps (必应地图)**：微软官方全球道路图与高分辨率卫星图；
  - **Google Maps 隔离门禁**：默认绝不发起静默请求，支持点击确认加载；生成新身份自动重新上锁 (Auto-Relock)；物理拦截浏览器 HTML5 定位回传，保护海外 VPS 原生 IP。
- 📦 **电商与转运仓合规双行地址生成**：
  - **Address Line 1**：真实实体街道与门牌。
  - **Address Line 2**：智能转运仓单元号（方案 B 独栋住宅自动省略 Line 2，完美通过 AVS）。
  - **电商多行格式一键复制**：专为 Amazon、Shopify、PayPal 打造的标准化地址映射卡片。
- 🛠️ **全套生产力工具**：
  - 单字段一键复制（带打勾动画与 Toast 反馈）。
  - 一键复制完整结构化测试档案。
  - 批量生成（5/10/20/50 条）与 **CSV / JSON 导出**（含 Address Mode 与 AVS Tier）。
  - 本地 LocalStorage 历史记录抽屉与星标收藏夹。
  - 深色 / 浅色模式自适应，中英双语国际化无缝切换。

---

## ⚡ 使用 Cloudflare 部署教程

本项目为纯静态 SPA（单页面应用），天生完美契合 **Cloudflare Pages** 全球边缘分发网络，具备全球极速访问、自动 HTTPS 证书、DDoS 防护和 100% 免费额度。

### 方式一：连接 GitHub 仓库自动持续部署 (推荐，零运维)

这是最推荐的部署方式。绑定后，每次你向 GitHub 仓库 `push` 代码，Cloudflare Pages 会自动拉取、构建并分发到全球 300+ 数据中心。

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)；
2. 在左侧导航栏点击 **Workers 和 Pages (Workers & Pages)** ➔ **创建应用程序 (Create application)**；
3. 选择 **Pages** 选项卡 ➔ 点击 **连接到 Git (Connect to Git)**；
4. 授权并选择你的本开源仓库（例如 `AiLi1337/GeoIdentity`）；
5. 配置构建预设与命令：
   - **项目名称 (Project name)**：`geo-identity`（或自定义名称）
   - **生产分支 (Production branch)**：`main`
   - **框架预设 (Framework preset)**：`Vite`
   - **构建命令 (Build command)**：`npm run build`
   - **构建输出目录 (Build output directory)**：`dist`
   - **环境变量 (Environment variables)** *(可选，建议配置)*：
     - 添加变量：`NODE_VERSION` = `20` 或 `22`
6. 点击 **保存并部署 (Save and Deploy)**；
7. 等待约 1 分钟，Cloudflare 即构建完成并提供一个类似 `https://geo-identity.pages.dev` 的全球访问网址。

---

### 方式二：使用 Cloudflare Wrangler CLI 命令行一键部署

如果你习惯在本地终端直接构建并发布，可以通过官方 CLI 工具 `wrangler`：

```bash
# 1. 在本地克隆并进入项目目录
git clone https://github.com/AiLi1337/GeoIdentity.git
cd GeoIdentity

# 2. 安装项目依赖
npm install

# 3. 本地打包构建生成 dist 产物
npm run build

# 4. 首次使用请登录 Cloudflare 账户 (会弹出浏览器授权)
npx wrangler login

# 5. 一键发布构建产物到 Cloudflare Pages
npx wrangler pages deploy dist --project-name geo-identity --branch main
```

部署完成后，终端会立即输出本次部署的生产预览链接。

---

### 绑定自定义域名 (Custom Domains)

想要使用自己的域名（如 `vllme.com` 或 `address.yourdomain.com`）：

1. 进入 Cloudflare Dashboard ➔ **Workers & Pages** ➔ 点击你的 Pages 项目；
2. 切换到 **自定义域 (Custom domains)** 选项卡；
3. 点击 **设置自定义域 (Set up a custom domain)**，输入你的域名并按提示一键完成 DNS 解析绑定；
4. Cloudflare 会在数分钟内自动完成全球 CDN 广播并签发免费的 SSL/TLS 证书。

---

### 开启每日地址库自动健康同步 (GitHub Actions)

项目仓库内已内置每日自动化调度工作流 [`.github/workflows/daily-address-sync.yml`](.github/workflows/daily-address-sync.yml)：
* **定时运行**：每天 UTC 00:00（北京时间 08:00）自动在 GitHub 云端执行 `npm run sync:addresses`；
* **全面审计**：自动扫描 21 国三大方案地址的经纬度合法性并重新统计容量；
* **持续集成**：同步更新 `metadata.json` 后自动构建与提交，直接联动 Cloudflare Pages 实现生产数据日更。

---

## 🚀 本地开发与测试

确保本地已安装 [Node.js](https://nodejs.org/) (推荐 v18+ 或 v20+)。

```bash
# 1. 安装依赖
npm install

# 2. 运行自动化测试套件 (包含 2,462 项端到端规则与隔离断言)
npm test

# 3. 运行地址库同步与元数据校验
npm run sync:addresses

# 4. 启动本地开发服务器 (支持 Vite HMR 热更新)
npm run dev

# 5. 构建生产代码
npm run build

# 6. 本地预览生产构建产物
npm run preview
```

---

## 📄 开源协议 (License)

本项目基于 [MIT License](LICENSE) 协议完全开源。欢迎 Star ⭐、Fork 与提交 Pull Request！

---

## ⚖️ 法律合规免责声明 (Disclaimer)

1. 本项目所生成的个人姓名、证件号码、虚拟银行卡号及联系电话等均为前端算法伪随机生成的**虚拟合成测试数据 (Synthetic Data)**，仅供合规软件开发、UI排版与表单校验测试使用。
2. 实体街道与建筑地址源自公开地理测绘与地籍信息，真实存在但与算法生成的虚构人名没有任何从属、产权或居住关联。
3. 严禁将本项目用于任何金融欺诈、电信网络诈骗、冒用他人身份等违法犯罪行为。
