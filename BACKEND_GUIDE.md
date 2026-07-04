# CWJ TOOLS — 后端实现指南

> 推荐技术栈：Node.js + Express + PostgreSQL + Redis + JWT

## 项目结构

```
cwj-tools-backend/
├── src/
│   ├── app.js                 # Express 入口
│   ├── config/
│   │   └── database.js        # 数据库配置
│   ├── middleware/
│   │   ├── auth.js            # JWT 验证中间件
│   │   ├── rateLimit.js       # 限流中间件
│   │   └── errorHandler.js    # 统一错误处理
│   ├── routes/
│   │   ├── auth.routes.js     # /api/auth/*
│   │   ├── settings.routes.js # /api/settings/*
│   │   ├── chat.routes.js     # /api/chat/*
│   │   ├── dashboard.routes.js# /api/dashboard/*
│   │   ├── agents.routes.js   # /api/agents/*
│   │   ├── models.routes.js   # /api/models/*
│   │   └── profile.routes.js  # /api/profile/*
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── settings.controller.js
│   │   ├── chat.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── agents.controller.js
│   │   ├── models.controller.js
│   │   └── profile.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── ai.service.js      # AI 模型调用封装
│   │   └── storage.service.js # 文件存储
│   └── models/                # 数据库模型 (Sequelize/Prisma)
│       ├── User.js
│       ├── Conversation.js
│       ├── Message.js
│       ├── Agent.js
│       └── Settings.js
├── prisma/
│   └── schema.prisma          # 数据库 Schema
├── .env
├── package.json
└── README.md
```

## 数据库表结构

### users 表
```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(50) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255),           -- bcrypt 哈希
  avatar      VARCHAR(10),
  plan        VARCHAR(20) DEFAULT 'Free',
  provider    VARCHAR(20),            -- google/github/wechat
  provider_id VARCHAR(255),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### settings 表
```sql
CREATE TABLE settings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  theme               VARCHAR(10) DEFAULT 'dark',
  language            VARCHAR(10) DEFAULT 'zh-CN',
  stream_output       BOOLEAN DEFAULT true,
  context_memory      INT DEFAULT 20,
  auto_save           BOOLEAN DEFAULT true,
  accent_color        VARCHAR(20) DEFAULT '#6366f1',
  animations          BOOLEAN DEFAULT true,
  cursor_glow         BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  agent_notifications BOOLEAN DEFAULT true,
  usage_alerts        BOOLEAN DEFAULT true,
  UNIQUE(user_id)
);
```

### conversations 表
```sql
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  model           VARCHAR(50) DEFAULT 'gpt-4o',
  message_count   INT DEFAULT 0,
  total_tokens    INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_conv_user ON conversations(user_id);
```

### messages 表
```sql
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role            VARCHAR(10) NOT NULL,  -- user / ai / system
  content         TEXT NOT NULL,
  model           VARCHAR(50),
  tokens          INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_msg_conv ON messages(conversation_id);
```

### agents 表
```sql
CREATE TABLE agents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'idle',
  config          JSONB DEFAULT '{}',
  task_count      INT DEFAULT 0,
  success_count   INT DEFAULT 0,
  total_time_ms   BIGINT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_agent_user ON agents(user_id);
```

### usage_logs 表 (统计用)
```sql
CREATE TABLE usage_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  action      VARCHAR(50) NOT NULL,  -- chat_send, agent_run, image_gen
  model       VARCHAR(50),
  tokens      INT DEFAULT 0,
  cost_cents  INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_usage_user_date ON usage_logs(user_id, created_at);
```

## 路由文件示例

### auth.routes.js
```javascript
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/login',       ctrl.login);
router.post('/register',    ctrl.register);
router.post('/social',      ctrl.socialLogin);
router.get('/me',           auth, ctrl.getMe);
router.post('/logout',      auth, ctrl.logout);

module.exports = router;
```

### chat.routes.js
```javascript
const router = require('express').Router();
const ctrl = require('../controllers/chat.controller');
const auth = require('../middleware/auth');

router.get('/conversations',                auth, ctrl.listConversations);
router.get('/conversations/:id/messages',   auth, ctrl.getMessages);
router.post('/conversations/:id/messages',  auth, ctrl.sendMessage);
router.get('/conversations/:id/export',     auth, ctrl.exportConversation);

module.exports = router;
```

## 启动命令

```bash
npm init -y
npm install express pg prisma jsonwebtoken bcryptjs cors dotenv
npx prisma init
npx prisma db push
node src/app.js
```

## 环境变量 (.env)

```
DATABASE_URL=postgresql://user:pass@localhost:5432/cwj_tools
JWT_SECRET=your-secret-key
PORT=3000
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```
