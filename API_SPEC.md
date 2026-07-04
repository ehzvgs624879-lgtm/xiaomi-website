# CWJ TOOLS — API 接口规范

> Base URL: `https://api.cwj.tools/v1`
> 所有接口需 `Authorization: Bearer <token>` 头（除登录/注册）

## 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/login` | 邮箱密码登录 |
| POST | `/auth/register` | 用户注册 |
| POST | `/auth/social` | 社交登录 |
| GET | `/auth/me` | 获取当前用户 |
| POST | `/auth/logout` | 退出登录 |

### POST /auth/login
```
Request:
{ "email": "user@example.com", "password": "***" }

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "usr_abc123",
      "name": "user",
      "email": "user@example.com",
      "avatar": "U",
      "plan": "Pro",
      "createdAt": "2026-01-15T08:00:00Z"
    }
  }
}
```

### POST /auth/register
```
Request:
{ "username": "cyber_walker", "email": "user@example.com", "password": "***" }

Response: (同 login)
```

### POST /auth/social
```
Request:
{ "provider": "google", "code": "oauth_authorization_code" }

Response: (同 login)
```

---

## 设置接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/settings` | 获取用户设置 |
| PUT | `/settings` | 更新用户设置 |
| PUT | `/settings/theme` | 切换主题 |

### GET /settings
```
Response:
{
  "success": true,
  "data": {
    "theme": "dark",
    "language": "zh-CN",
    "streamOutput": true,
    "contextMemory": 20,
    "autoSave": true,
    "accentColor": "#6366f1",
    "animations": true,
    "cursorGlow": true,
    "emailNotifications": true,
    "agentNotifications": true,
    "usageAlerts": true
  }
}
```

### PUT /settings
```
Request:
{ "theme": "light", "language": "en", "streamOutput": false }

Response:
{ "success": true, "data": { "updated": true } }
```

---

## 聊天接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/chat/conversations` | 获取对话列表 |
| GET | `/chat/conversations/:id/messages` | 获取对话消息 |
| POST | `/chat/conversations/:id/messages` | 发送消息 |
| GET | `/chat/conversations/:id/export` | 导出对话 |

### GET /chat/conversations
```
Response:
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_abc123",
        "title": "Python 快速排序",
        "model": "gpt-4o",
        "lastMessage": "好的，这是一个...",
        "messageCount": 12,
        "updatedAt": "2026-07-05T00:30:00Z"
      }
    ]
  }
}
```

### POST /chat/conversations/:id/messages
```
Request:
{ "content": "帮我写一个排序算法", "model": "gpt-4o" }

Response:
{
  "success": true,
  "data": {
    "userMsg": {
      "id": "msg_001",
      "role": "user",
      "content": "帮我写一个排序算法",
      "timestamp": "2026-07-05T00:30:00Z"
    },
    "aiMsg": {
      "id": "msg_002",
      "role": "ai",
      "content": "好的，这是一个快速排序实现...",
      "model": "gpt-4o",
      "tokens": 342,
      "timestamp": "2026-07-05T00:30:01Z"
    }
  }
}
```

---

## 仪表盘接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/dashboard/stats` | 概览统计 |
| GET | `/dashboard/api-trend` | API 调用趋势 |
| GET | `/dashboard/model-distribution` | 模型使用分布 |
| GET | `/dashboard/recent-conversations` | 最近对话 |
| GET | `/dashboard/export` | 导出报告 |

### GET /dashboard/stats
```
Response:
{
  "success": true,
  "data": {
    "conversations": { "value": 1284, "change": "+18.3%", "direction": "up" },
    "tokens": { "value": "2.4M", "change": "-5.2%", "direction": "down" },
    "agents": { "value": 36, "change": "+42.1%", "direction": "up" },
    "images": { "value": 189, "change": "+67.8%", "direction": "up" }
  }
}
```

---

## Agent 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/agents` | Agent 列表 |
| POST | `/agents` | 创建 Agent |
| PUT | `/agents/:id` | 更新 Agent |
| DELETE | `/agents/:id` | 删除 Agent |

### GET /agents
```
Response:
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "agent_001",
        "name": "代码审查 Agent",
        "description": "自动审查代码质量",
        "status": "online",
        "tasks": 247,
        "successRate": "98.3%",
        "avgTime": "12s"
      }
    ]
  }
}
```

---

## 模型接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/models` | 可用模型列表 |
| PUT | `/models/default` | 设置默认模型 |

### GET /models
```
Response:
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "OpenAI",
        "context": "128K",
        "price": "$2.50/1M tokens",
        "tags": ["快速", "多模态"],
        "description": "OpenAI 旗舰多模态模型"
      }
    ]
  }
}
```

---

## 用户资料接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/profile` | 获取用户资料 |
| PUT | `/profile` | 更新用户资料 |

### GET /profile
```
Response:
{
  "success": true,
  "data": {
    "user": { "id": "usr_001", "name": "赛博行者", "email": "...", "plan": "Pro" },
    "usage": {
      "apiCalls": { "used": 12847, "limit": 50000 },
      "tokens": { "used": "2.4M", "limit": "10M" },
      "storage": { "used": "1.2GB", "limit": "5GB" },
      "agentHours": { "used": 18, "limit": 100 }
    },
    "achievements": [
      { "icon": "⚡", "name": "闪电手", "desc": "单日对话超过 50 次" }
    ],
    "stats": { "conversations": 1284, "agents": 36, "images": 189, "apps": 42 }
  }
}
```
