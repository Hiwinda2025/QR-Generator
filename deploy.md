# Netlify 部署指南

## 前置条件
1. GitHub 账户
2. Netlify 账户 (可以用GitHub登录)
3. 项目已推送到GitHub

## 部署步骤

### 方式一：通过Netlify网站部署

1. 登录 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择 "GitHub" 作为Git提供商
4. 授权Netlify访问你的GitHub仓库
5. 选择你的 `qrcode` 仓库
6. 配置部署设置：
   - **Branch to deploy**: `main`
   - **Build command**: `npm install`
   - **Publish directory**: `public`
7. 点击 "Deploy site"

### 方式二：通过Netlify CLI部署

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录Netlify
netlify login

# 在项目目录中初始化
netlify init

# 部署
netlify deploy --prod
```

## 部署配置

项目包含 `netlify.toml` 配置文件：

```toml
[build]
  command = "npm install"
  functions = "netlify/functions"
  publish = "public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 功能说明

- **Serverless Functions**: API 路由转换为Netlify Functions
- **自动重定向**: API请求自动重定向到Functions
- **静态文件托管**: 前端文件托管在Netlify CDN
- **免费额度**: 
  - 每月125,000次函数调用
  - 每月100GB带宽
  - 无限制的静态文件托管

## 环境变量

如果需要设置环境变量：

1. 在Netlify控制台中进入你的站点
2. 点击 "Site settings" → "Environment variables"
3. 添加需要的环境变量

## 自定义域名

1. 在Netlify控制台中进入你的站点
2. 点击 "Domain settings"
3. 点击 "Add custom domain"
4. 输入你的域名并验证

## 监控和日志

- **Functions 日志**: 在Netlify控制台的 "Functions" 标签页查看
- **部署日志**: 在 "Deploys" 标签页查看部署历史
- **实时日志**: 使用 `netlify dev` 进行本地开发

## 故障排除

### 常见问题

1. **Functions 404错误**
   - 检查 `netlify.toml` 配置
   - 确保functions目录结构正确

2. **构建失败**
   - 检查Node.js版本兼容性
   - 确保所有依赖都在package.json中

3. **CORS错误**
   - Functions已包含CORS头配置
   - 检查前端API调用路径

### 本地测试

```bash
# 安装依赖
npm install

# 启动本地开发服务器
netlify dev
```

## 更新部署

每次推送到GitHub main分支时，Netlify会自动重新部署。

也可以手动触发部署：
1. 在Netlify控制台中点击 "Trigger deploy"
2. 或使用CLI: `netlify deploy --prod` 