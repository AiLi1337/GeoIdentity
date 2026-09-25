# GeoIdentity - OSM 建筑门牌与合成测试身份

<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="GeoIdentity Logo" />
</p>

<p align="center">
  <strong>仅从可回溯 OpenStreetMap 对象的公寓建筑门牌生成地址</strong><br>
  个人资料为合成测试数据；建筑门牌不代表住户、房号、可投递地址或 AVS 认证
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

### 1. 身份与地址生成主控制台（历史截图；现已采用来源严格模式）
![主界面概览与21国快速选择](docs/images/01-generator-overview-v2.png)

### 2. 建筑地址来源与合成身份测试卡片（历史截图）
![真实物理地址与测试身份卡片](docs/images/02-identity-card-v2.png)

### 3. 历史全球覆盖视图（已由 OSM 来源清单替代）
![全球矢量地图监控大盘](docs/images/03-world-map-monitor-v2.png)

### 4. 历史地址样本统计（旧模式不再作为来源地址生成）
![地址库方案明细与日更统计表格](docs/images/04-address-breakdown-table-v2.png)

---

## 🌟 核心特性

- **可核对地址来源**：目前收录美国 Wilmington（DE）和 Portland（OR）的 51 条 OSM 公寓建筑门牌，每条可打开原始 OSM 对象。其他国家/州没有可核对数据时明确提示，不跨地区兜底。
- **边界**：OSM 是众包数据。建筑门牌及坐标有来源链接，但没有独立的邮政投递、住户、房号、产权或 AVS 认证；本站不承诺“绝对真实”到上述层级。
- **旧数据**：内置 21 国住宅样本和街道插值规则仍在源码中供历史/测试兼容，但网页标准、批量和 IP 生成不再使用它们当作可核对地址。
- 🗺️ **三地图引擎与防“IP 送中”安全沙箱**：
  - 默认首选 **OpenStreetMap (OSM)**：国内 100% 免翻直连秒开，真实建筑门牌无偏移，零送中风险；
  - 备选 **Bing Maps (必应地图)**：微软官方全球道路图与高分辨率卫星图；
  - **Google Maps 隔离门禁**：默认绝不发起静默请求，支持点击确认加载；生成新身份自动重新上锁 (Auto-Relock)；物理拦截浏览器 HTML5 定位回传，保护海外 VPS 原生 IP。
- 📦 **电商与转运仓合规双行地址生成**：
  - **Address Line 1**：真实实体街道与门牌。
  - **Address Line 2**：保持空白，不虚构房号。
  - **多行格式复制**：仅用于合规开发测试，不用于真实收件或付款验证。
- 🛠️ **全套生产力工具**：
  - 单字段一键复制（带打勾动画与 Toast 反馈）。
  - 一键复制完整结构化测试档案。
  - 批量生成（5/10/20/50 条）与 **CSV / JSON 导出**（含 Address Mode 与 AVS Tier）。
  - 本地 LocalStorage 历史记录抽屉与星标收藏夹。
  - 深色 / 浅色模式自适应，中英双语国际化无缝切换。

---

## ⚡ 使用 Cloudflare 部署教程

本项目为纯静态 SPA（单页面应用），天生完美契合 **Cloudflare Pages** 全球边缘分发网络，具备全球极速访问、自动 HTTPS 证书、DDoS 防护和 100% 免费额度。

### Cloudflare Pages 直接部署

`address.vllme.com` 绑定到 `geo-identity` Pages 项目。该项目当前未连接 Git 提供商：只推送 GitHub 不会自动更新网站，必须运行下方的每日任务或手动上传构建产物。普通 GitHub 构建不带广告；Cloudflare 发布构建从私有环境变量注入 AdSense 脚本和 `ads.txt`。

手动发布（在本地私有环境中设置 `VITE_ADSENSE_ID`，不要提交 `.env` 或 `dist`）：

```bash
# 1. 在本地克隆并进入项目目录
git clone https://github.com/AiLi1337/GeoIdentity.git
cd GeoIdentity

# 2. 安装项目依赖
npm install

# 3. 从私有环境提供 VITE_ADSENSE_ID 后打包生成 dist
npm run build

# 4. 首次使用请登录 Cloudflare 账户 (会弹出浏览器授权)
npx wrangler login

# 5. 发布构建产物到 Cloudflare Pages
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
* **定时运行**：计划每天 UTC 00:00（北京时间 08:00）运行；GitHub 的定时任务可能延迟。
* **公开数据采样**：从 [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL) 获取特拉华州 Wilmington 与俄勒冈州 Portland 的公开公寓建筑门牌、邮编、城市和坐标，过滤无效或重复记录，写入 `osmApartments.json`，并加入方案 C。只代表 OSM 有建筑门牌，**不保证可投递或通过 AVS**，不关联住户。
* **失败处理**：上游查询失败时任务失败，保留仓库已有数据和上次成功时间。页面显示的是已部署包的数据快照，并非实时查询；页面按钮只校验本地字段和数量。
* **部署设置**：在 GitHub 仓库 Secrets 设置 `CLOUDFLARE_API_TOKEN`（对目标 Pages 项目有部署权限）、`CLOUDFLARE_ACCOUNT_ID` 与 `VITE_ADSENSE_ID`，在 Variables 设置 `CF_PAGES_PROJECT`（当前为 `geo-identity`）。任务先检查凭据，再同步数据；无广告构建仅用于校验，然后提交地址数据。带广告的 `dist` 只上传 Cloudflare，不推送 GitHub。缺少部署配置时任务会在同步前失败；上游 OSM 不可用时也不会覆盖旧数据。
* **许可**：新增 OSM 数据受 [Open Database License](https://opendatacommons.org/licenses/odbl/) 约束，使用或再分发时保留归属与许可要求。原有静态地址库不由 OSM 同步验证。

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
