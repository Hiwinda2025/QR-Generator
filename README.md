# QR Code Generator - 在线二维码生成器

一个功能强大、界面优雅的在线二维码生成器，采用苹果风格设计，支持多种二维码类型和自定义选项。

## 🌟 功能特性

### 支持的二维码类型
- **网站URL** - 生成网站链接二维码
- **纯文本** - 将任意文本转换为二维码
- **电子邮件** - 创建邮件链接二维码
- **电话号码** - 生成拨号二维码
- **短信** - 创建预填短信二维码
- **WiFi** - 生成WiFi连接二维码
- **联系人卡片** - 创建vCard格式联系人信息
- **WhatsApp** - 生成WhatsApp聊天链接

### 自定义选项
- **颜色定制** - 自定义前景色和背景色
- **尺寸选择** - 支持多种尺寸输出（256px - 2048px）
- **Logo添加** - 在二维码中心添加自定义Logo
- **错误纠正** - 四种错误纠正级别可选
- **格式支持** - PNG和SVG格式下载

### 技术特性
- **实时预览** - 输入内容即时生成预览
- **响应式设计** - 完美适配桌面和移动设备
- **隐私保护** - 不存储用户数据，本地生成
- **批量生成** - API支持批量生成二维码
- **SEO优化** - 完整的SEO元数据和结构化数据

## 🚀 快速开始

### 环境要求
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd code
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:3000`

### 生产环境部署

1. **启动生产服务器**
```bash
npm start
```

2. **使用PM2部署（推荐）**
```bash
npm install -g pm2
pm2 start src/app.js --name "qr-generator"
```

## 📁 项目结构

```
code/
├── src/                    # 服务器端源码
│   ├── app.js             # 主应用文件
│   ├── routes/            # API路由
│   │   └── qrRoutes.js    # QR码生成路由
│   └── utils/             # 工具函数
├── public/                # 静态文件
│   ├── css/               # 样式文件
│   │   └── style.css      # 主样式文件
│   ├── js/                # 前端JavaScript
│   │   └── app.js         # 前端应用逻辑
│   ├── images/            # 图片资源
│   └── index.html         # 主页面
├── package.json           # 项目配置
└── README.md             # 项目文档
```

## 🔧 API 接口

### 生成二维码 (PNG格式)
```http
POST /api/qr/generate
Content-Type: multipart/form-data

{
  "type": "url",
  "data": {"url": "https://example.com"},
  "options": {
    "size": 512,
    "foregroundColor": "#000000",
    "backgroundColor": "#ffffff",
    "errorCorrectionLevel": "M"
  },
  "logo": [文件]
}
```

### 生成二维码 (SVG格式)
```http
POST /api/qr/generate-svg
Content-Type: application/json

{
  "type": "text",
  "data": {"text": "Hello World"},
  "options": {
    "size": 256,
    "foregroundColor": "#007AFF",
    "backgroundColor": "#ffffff"
  }
}
```

### 批量生成二维码
```http
POST /api/qr/batch-generate
Content-Type: application/json

{
  "items": [
    {
      "type": "url",
      "data": {"url": "https://example1.com"}
    },
    {
      "type": "text", 
      "data": {"text": "Sample text"}
    }
  ],
  "options": {
    "size": 512,
    "errorCorrectionLevel": "M"
  }
}
```

## 🎨 设计特色

### 苹果风格设计
- **简洁优雅** - 采用苹果设计语言，界面简洁大方
- **毛玻璃效果** - 导航栏使用backdrop-filter实现毛玻璃效果
- **渐变色彩** - 精心设计的渐变色方案
- **圆角设计** - 统一的圆角设计语言
- **阴影层次** - 多层次阴影营造空间感

### 交互体验
- **平滑动画** - 所有交互都有平滑的过渡动画
- **实时反馈** - 输入内容实时生成预览
- **响应式布局** - 完美适配各种屏幕尺寸
- **无障碍设计** - 支持键盘导航和屏幕阅读器

## 🔒 安全特性

- **输入验证** - 严格的输入数据验证
- **速率限制** - API请求速率限制防止滥用
- **文件上传限制** - Logo文件大小和类型限制
- **CORS配置** - 跨域请求安全配置
- **CSP头部** - 内容安全策略防止XSS攻击

## 📱 SEO优化

- **元数据完整** - 完整的meta标签配置
- **Open Graph** - 社交媒体分享优化
- **结构化数据** - JSON-LD格式的结构化数据
- **语义化HTML** - 使用语义化HTML标签
- **性能优化** - 图片懒加载、资源压缩

## 🚀 部署指南

### Netlify 部署 (推荐)

本项目已优化支持Netlify部署，包含完整的serverless functions配置。

#### 快速部署
1. 将项目推送到GitHub
2. 在 [Netlify](https://netlify.com) 中连接GitHub仓库
3. 选择仓库后，Netlify会自动检测配置并部署

#### 配置说明
- **构建命令**: `npm install`
- **发布目录**: `public`
- **Functions目录**: `netlify/functions`
- **Node.js版本**: 18

#### 特性支持
- ✅ **Serverless Functions** - API路由自动转换
- ✅ **自动部署** - GitHub推送触发自动部署
- ✅ **免费额度** - 每月125K函数调用 + 100GB带宽
- ✅ **HTTPS** - 自动SSL证书
- ✅ **自定义域名** - 支持绑定自己的域名

详细部署指南请查看 [deploy.md](deploy.md)

### 传统服务器部署

```bash
# 克隆项目
git clone https://github.com/yourusername/qr-generator.git
cd qr-generator

# 安装依赖
npm install

# 启动生产服务器
npm start
```

服务器将在 `http://localhost:3000` 运行

## 🛠️ 开发指南

### 添加新的二维码类型

1. **更新路由验证**
在 `src/routes/qrRoutes.js` 中的 `validateQRData` 函数添加新类型验证

2. **添加数据生成逻辑**
在 `generateQRData` 函数中添加新类型的数据生成逻辑

3. **更新前端界面**
在 `public/index.html` 中添加新的表单组件

4. **更新前端逻辑**
在 `public/js/app.js` 中添加相应的事件处理

### 自定义样式

所有样式都在 `public/css/style.css` 中定义，使用CSS变量便于主题定制：

```css
:root {
  --primary-color: #007AFF;
  --secondary-color: #5856D6;
  /* 更多变量... */
}
```

## 📊 性能优化

- **图片压缩** - 使用Sharp库进行图片处理和压缩
- **缓存策略** - 静态资源缓存配置
- **代码分割** - 按需加载JavaScript模块
- **CDN支持** - 支持CDN部署静态资源

## 🐛 故障排除

### 常见问题

1. **二维码生成失败**
   - 检查输入数据是否有效
   - 确认网络连接正常
   - 查看浏览器控制台错误信息

2. **Logo上传失败**
   - 确认文件大小不超过5MB
   - 支持的格式：PNG, JPG, JPEG, GIF
   - 检查文件是否损坏

3. **预览不显示**
   - 确认QRCode.js库已正确加载
   - 检查浏览器是否支持Canvas
   - 清除浏览器缓存重试

### 日志查看

开发环境下，服务器日志会输出到控制台：
```bash
npm run dev
```

生产环境建议使用PM2查看日志：
```bash
pm2 logs qr-generator
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目主页：[GitHub Repository]
- 问题反馈：[GitHub Issues]
- 邮箱：support@example.com

## 🙏 致谢

- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - 前端二维码生成库
- [node-qrcode](https://github.com/soldair/node-qrcode) - Node.js二维码生成库
- [Sharp](https://github.com/lovell/sharp) - 高性能图像处理库
- [Inter Font](https://rsms.me/inter/) - 优秀的开源字体

---

## 📈 更新日志

### v1.2.1 (2024-06-10)
- 🔧 修复QRCode库兼容性问题 - 从qrcode-generator切换到qrcodejs库
- ⚡ 重构QR生成逻辑 - 使用新的QRCode.js API提高稳定性
- 🐛 解决预览生成问题 - 修复QR码无法正常显示的核心问题
- 🎯 优化类型切换功能 - 确保所有QR类型按钮都能正常响应
- 💡 改进错误处理 - 更好的库加载检测和错误恢复机制
- 🧹 代码优化 - 简化了QR生成流程，提升性能

### v1.2.0 (2024-06-10)
- 🔧 修复API路由404错误 - 统一路由从/api/qr改为/api
- 📚 更换QRCode库 - 使用更可靠的qrcode-generator库
- 🎨 简化英雄区域 - 删除无用的虚线框展示
- ⚡ 优化QR生成 - 直接使用canvas绘制，更快更稳定
- 🌐 修复库加载问题 - 解决QRCode库加载失败的问题
- 💡 改进错误提示 - 更友好的中文错误信息
- 🧹 代码清理 - 移除冗余的英雄区域QR初始化代码

### v1.1.0 (2024-06-10)
- 🐛 修复类型切换功能 - 所有二维码类型现在都可以正常切换
- ✨ 重写JavaScript核心逻辑 - 改进了事件处理和数据管理
- 🎯 修复预览生成功能 - 实时预览现在正常工作
- 📥 修复下载功能 - PNG和SVG下载现在都能正常工作
- 🔧 改进API端点 - 统一了后端API处理逻辑
- 🎨 优化用户界面 - 添加了加载状态和错误提示
- 📱 改进交互反馈 - 添加了中文通知消息
- 🚀 性能优化 - 减少了防抖延迟，提升响应速度

### v1.0.0 (2024-06-10)
- ✨ 初始版本发布
- 🎨 苹果风格界面设计
- 📱 响应式布局支持
- 🔧 支持8种二维码类型
- 🎯 实时预览功能
- 📥 PNG/SVG格式下载
- 🔒 安全防护措施
- 📊 SEO优化完成

### 计划中的功能
- [ ] 批量生成界面
- [ ] 二维码模板系统
- [ ] 用户账户系统
- [ ] 二维码统计分析
- [ ] 更多自定义选项
- [ ] 移动端App
- [ ] API文档页面
- [ ] 多语言支持 