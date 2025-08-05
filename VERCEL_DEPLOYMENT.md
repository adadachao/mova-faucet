# Vercel 部署配置

## 环境变量配置

在 Vercel 部署时，需要在项目设置中添加以下环境变量：

### 必需的环境变量

1. **FAUCET_API_URL**
   - 描述：实际的 faucet API 地址
   - 示例：`https://your-faucet-api.com/api/faucet/v1/transfer`
   - 注意：替换为您的实际 API 地址

2. **FAUCET_API_KEY** (可选)
   - 描述：如果您的 API 需要认证，请添加此密钥
   - 示例：`your-api-key-here`

### 本地开发配置

创建 `.env.local` 文件：

```bash
# Faucet API 配置
FAUCET_API_URL=https://your-faucet-api.com/api/faucet/v1/transfer
FAUCET_API_KEY=your-api-key-here

# 其他配置
NEXT_PUBLIC_APP_NAME=Mova Faucet
```

## 部署步骤

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 在项目设置中添加环境变量
4. 部署项目

## 代理函数说明

项目包含了一个代理函数 (`src/app/api/faucet/v1/transfer/route.ts`)，用于：

- 转发前端请求到实际的 faucet API
- 处理 CORS 问题
- 添加必要的认证头
- 错误处理和日志记录

## 注意事项

- 确保 `FAUCET_API_URL` 指向正确的 API 地址
- 如果 API 需要认证，请设置 `FAUCET_API_KEY`
- 代理函数会保留原始 API 的响应格式 