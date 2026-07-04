/* ══════════════════════════════════════════════════════
   CWJ TOOLS — API LAYER
   All data operations go through this file.
   Currently uses localStorage; swap internals to fetch()
   when backend is ready — zero changes needed elsewhere.
   ══════════════════════════════════════════════════════ */
(function(window){
'use strict';

var BASE_URL = ''; // Set to 'https://api.cwj.tools' when backend is ready

/* ── HELPERS ── */
function storageGet(key, fallback){
  try{ var v=localStorage.getItem(key); return v?JSON.parse(v):fallback }
  catch(e){ return fallback }
}
function storageSet(key, val){ localStorage.setItem(key, JSON.stringify(val)) }
function storageDel(key){ localStorage.removeItem(key) }

/* Simulate network delay (remove in production) */
function mockResolve(data, ms){
  return new Promise(function(resolve){
    setTimeout(function(){ resolve({success:true, data:data}) }, ms||100)
  });
}

/* ═══════════════════════════════════════════════════════
   AUTH — 登录注册
   ═══════════════════════════════════════════════════════ */

var Auth = {

  /**
   * 邮箱密码登录
   * REAL API: POST /api/auth/login
   * Request:  { "email": "user@example.com", "password": "***" }
   * Response: { "success": true, "data": { "token": "jwt...", "user": {...} } }
   */
  login: function(email, password){
    var user = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      avatar: email.charAt(0).toUpperCase(),
      plan: 'Pro',
      createdAt: new Date().toISOString(),
      loginAt: Date.now()
    };
    storageSet('cwj_user', user);
    storageSet('cwj_token', 'mock_jwt_' + Date.now());
    return mockResolve({ token: 'mock_jwt_' + Date.now(), user: user });
  },

  /**
   * 用户注册
   * REAL API: POST /api/auth/register
   * Request:  { "username": "...", "email": "...", "password": "..." }
   * Response: { "success": true, "data": { "token": "jwt...", "user": {...} } }
   */
  register: function(username, email, password){
    var user = {
      id: 'usr_' + Date.now(),
      name: username,
      email: email,
      avatar: username.charAt(0).toUpperCase(),
      plan: 'Free',
      createdAt: new Date().toISOString(),
      loginAt: Date.now()
    };
    storageSet('cwj_user', user);
    storageSet('cwj_token', 'mock_jwt_' + Date.now());
    return mockResolve({ token: 'mock_jwt_' + Date.now(), user: user });
  },

  /**
   * 社交登录 (Google/GitHub/微信)
   * REAL API: POST /api/auth/social
   * Request:  { "provider": "google", "code": "oauth_code" }
   * Response: { "success": true, "data": { "token": "...", "user": {...} } }
   */
  socialLogin: function(provider){
    var user = {
      id: 'usr_' + Date.now(),
      name: 'user_' + provider.toLowerCase(),
      email: 'user@' + provider.toLowerCase() + '.com',
      avatar: 'U',
      plan: 'Pro',
      createdAt: new Date().toISOString(),
      loginAt: Date.now()
    };
    storageSet('cwj_user', user);
    storageSet('cwj_token', 'mock_jwt_' + Date.now());
    return mockResolve({ token: 'mock_jwt_' + Date.now(), user: user });
  },

  /**
   * 获取当前用户
   * REAL API: GET /api/auth/me
   * Headers:  { "Authorization": "Bearer <token>" }
   * Response: { "success": true, "data": { "user": {...} } }
   */
  getUser: function(){
    var user = storageGet('cwj_user', null);
    return mockResolve(user);
  },

  /**
   * 退出登录
   * REAL API: POST /api/auth/logout
   * Headers:  { "Authorization": "Bearer <token>" }
   * Response: { "success": true }
   */
  logout: function(){
    storageDel('cwj_user');
    storageDel('cwj_token');
    return mockResolve(true).then(function(){ location.href='login.html' });
  },

  /**
   * 检查是否已登录
   * (前端辅助方法，无对应 API)
   */
  isLoggedIn: function(){
    return !!storageGet('cwj_token', null);
  }
};

/* ═══════════════════════════════════════════════════════
   SETTINGS — 设置管理
   ═══════════════════════════════════════════════════════ */

var Settings = {

  /**
   * 获取用户设置
   * REAL API: GET /api/settings
   * Headers:  { "Authorization": "Bearer <token>" }
   * Response: { "success": true, "data": { "theme": "dark", "language": "zh-CN",
   *   "streamOutput": true, "contextMemory": 20, "autoSave": true, ... } }
   */
  get: function(){
    var defaults = {
      theme: 'dark',
      language: 'zh-CN',
      streamOutput: true,
      contextMemory: 20,
      autoSave: true,
      accentColor: '#6366f1',
      animations: true,
      cursorGlow: true,
      emailNotifications: true,
      agentNotifications: true,
      usageAlerts: true
    };
    var saved = storageGet('cwj_settings', {});
    return mockResolve(Object.assign({}, defaults, saved));
  },

  /**
   * 保存用户设置
   * REAL API: PUT /api/settings
   * Headers:  { "Authorization": "Bearer <token>" }
   * Request:  { "theme": "light", "language": "en", ... }
   * Response: { "success": true, "data": { "updated": true } }
   */
  save: function(data){
    var current = storageGet('cwj_settings', {});
    var merged = Object.assign({}, current, data);
    storageSet('cwj_settings', merged);
    return mockResolve({ updated: true });
  }
};

/* ═══════════════════════════════════════════════════════
   THEME — 主题管理
   ═══════════════════════════════════════════════════════ */

var ThemeApi = {

  /**
   * 获取当前主题
   * REAL API: GET /api/settings/theme
   * Response: { "success": true, "data": { "theme": "dark" } }
   */
  get: function(){
    return mockResolve(storageGet('cwj_theme', 'dark'));
  },

  /**
   * 设置主题
   * REAL API: PUT /api/settings/theme
   * Request:  { "theme": "light" }
   * Response: { "success": true }
   */
  set: function(theme){
    storageSet('cwj_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle i').forEach(function(i){
      i.className = theme==='dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
    return mockResolve(true);
  },

  /**
   * 切换主题
   * (前端辅助方法)
   */
  toggle: function(){
    var cur = document.documentElement.getAttribute('data-theme')||'dark';
    return this.set(cur==='dark'?'light':'dark');
  }
};

/* ═══════════════════════════════════════════════════════
   CHAT — AI 聊天
   ═══════════════════════════════════════════════════════ */

var Chat = {

  /**
   * 获取对话列表
   * REAL API: GET /api/chat/conversations
   * Headers:  { "Authorization": "Bearer <token>" }
   * Response: { "success": true, "data": { "conversations": [
   *   { "id": "conv_1", "title": "...", "model": "gpt-4o", "lastMessage": "...", "updatedAt": "..." }
   * ] } }
   */
  getConversations: function(){
    var convs = storageGet('cwj_conversations', [
      { id:'conv_1', title:'Python 快速排序实现', model:'GPT-4o', lastMessage:'好的，这是一个高效的...', updatedAt:'2 分钟前' },
      { id:'conv_2', title:'营销文案生成', model:'Claude 4', lastMessage:'根据您的品牌调性...', updatedAt:'15 分钟前' },
      { id:'conv_3', title:'产品需求分析', model:'Gemini', lastMessage:'从用户画像来看...', updatedAt:'1 小时前' }
    ]);
    return mockResolve(convs);
  },

  /**
   * 获取单个对话的消息
   * REAL API: GET /api/chat/conversations/:id/messages
   * Response: { "success": true, "data": { "messages": [...] } }
   */
  getMessages: function(convId){
    var msgs = storageGet('cwj_msgs_' + convId, []);
    return mockResolve(msgs);
  },

  /**
   * 发送消息
   * REAL API: POST /api/chat/conversations/:id/messages
   * Request:  { "content": "...", "model": "gpt-4o" }
   * Response: { "success": true, "data": { "userMsg": {...}, "aiMsg": {...} } }
   */
  sendMessage: function(convId, content, model){
    var userMsg = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: content,
      timestamp: new Date().toISOString()
    };
    var aiMsg = {
      id: 'msg_' + (Date.now()+1),
      role: 'ai',
      content: generateReply(content),
      model: model || 'gpt-4o',
      tokens: Math.floor(Math.random()*500)+100,
      timestamp: new Date().toISOString()
    };
    return mockResolve({ userMsg: userMsg, aiMsg: aiMsg }, 800);
  },

  /**
   * 导出对话
   * REAL API: GET /api/chat/conversations/:id/export?format=csv
   * Response: { "success": true, "data": { "url": "https://..." } }
   */
  exportConversation: function(convId, format){
    return mockResolve({ url: '#export_' + convId + '.' + (format||'csv') });
  }
};

function generateReply(input){
  var replies = [
    '好的，我来帮你分析这个问题。根据我的理解，核心要点有以下几点：\n\n1. 首先需要明确需求范围\n2. 然后进行技术选型评估\n3. 最后制定实施计划\n\n你觉得这个思路如何？',
    '这是一个很好的问题！让我从几个角度来回答：\n\n从技术可行性来看，目前主流方案都能支持。建议优先考虑可扩展性和维护成本。',
    '收到！我已经完成了初步分析。\n\n// 核心逻辑\nfunction solve(input) {\n  const result = process(input);\n  return optimize(result);\n}\n\n需要我进一步优化吗？',
    '根据最新数据，这个方向的 ROI 预计在 180%-250% 之间。建议分三阶段推进，每阶段 2 周。',
    '没问题，我帮你整理了一份详细方案。要点如下：\n\n✅ 第一周：需求调研与原型设计\n✅ 第二周：核心功能开发\n✅ 第三周：测试优化与上线'
  ];
  return replies[Math.floor(Math.random()*replies.length)];
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD — 仪表盘数据
   ═══════════════════════════════════════════════════════ */

var Dashboard = {

  /**
   * 获取概览统计
   * REAL API: GET /api/dashboard/stats
   * Response: { "success": true, "data": { "conversations": 1284, "tokens": "2.4M",
   *   "agents": 36, "images": 189, "changes": { "conversations": "+18.3%", ... } } }
   */
  getStats: function(){
    return mockResolve({
      conversations: { value: 1284, change: '+18.3%', direction: 'up' },
      tokens: { value: '2.4M', change: '-5.2%', direction: 'down' },
      agents: { value: 36, change: '+42.1%', direction: 'up' },
      images: { value: 189, change: '+67.8%', direction: 'up' }
    });
  },

  /**
   * 获取 API 调用趋势
   * REAL API: GET /api/dashboard/api-trend?period=24h
   * Response: { "success": true, "data": { "labels": [...], "apiCalls": [...], "tokens": [...] } }
   */
  getApiTrend: function(){
    return mockResolve({
      labels: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
      apiCalls: [1.2,0.8,0.5,0.9,2.1,4.5,6.8,8.2,7.5,9.1,10.3,11.8],
      tokens: [0.8,0.5,0.3,0.6,1.5,3.2,5.1,6.3,5.8,7.2,8.1,9.5]
    });
  },

  /**
   * 获取模型分布
   * REAL API: GET /api/dashboard/model-distribution
   * Response: { "success": true, "data": { "labels": [...], "values": [...] } }
   */
  getModelDistribution: function(){
    return mockResolve({
      labels: ['GPT-4o','Claude 4','Gemini','DeepSeek','其他'],
      values: [35,25,20,12,8]
    });
  },

  /**
   * 获取最近对话
   * REAL API: GET /api/dashboard/recent-conversations?limit=10
   * Response: { "success": true, "data": { "conversations": [...] } }
   */
  getRecentConversations: function(){
    return mockResolve([
      { title:'Python 快速排序实现', model:'GPT-4o', tokens:3241, time:'2 分钟前' },
      { title:'营销文案生成', model:'Claude 4', tokens:5892, time:'15 分钟前' },
      { title:'产品需求分析文档', model:'Gemini', tokens:8103, time:'1 小时前' },
      { title:'React 组件优化建议', model:'GPT-4o', tokens:2567, time:'3 小时前' }
    ]);
  },

  /**
   * 导出报告
   * REAL API: GET /api/dashboard/export?format=csv
   * Response: { "success": true, "data": { "url": "https://..." } }
   */
  exportReport: function(format){
    return mockResolve({ url: '#export_report.' + (format||'csv') });
  }
};

/* ═══════════════════════════════════════════════════════
   AGENTS — Agent 管理
   ═══════════════════════════════════════════════════════ */

var Agents = {

  /**
   * 获取 Agent 列表
   * REAL API: GET /api/agents
   * Response: { "success": true, "data": { "agents": [...] } }
   */
  list: function(){
    return mockResolve([
      { id:'agent_1', name:'代码审查 Agent', status:'online', tasks:247, successRate:'98.3%', avgTime:'12s' },
      { id:'agent_2', name:'竞品分析 Agent', status:'online', tasks:89, successRate:'95.7%', avgTime:'45s' },
      { id:'agent_3', name:'内容创作 Agent', status:'idle', tasks:512, successRate:'99.1%', avgTime:'8s' },
      { id:'agent_4', name:'数据分析 Agent', status:'online', tasks:156, successRate:'97.4%', avgTime:'22s' }
    ]);
  },

  /**
   * 创建 Agent
   * REAL API: POST /api/agents
   * Request:  { "name": "...", "description": "...", "config": {...} }
   * Response: { "success": true, "data": { "agent": {...} } }
   */
  create: function(name, description){
    return mockResolve({ id:'agent_'+Date.now(), name:name, description:description, status:'idle', tasks:0, successRate:'—', avgTime:'—' });
  }
};

/* ═══════════════════════════════════════════════════════
   MODELS — 模型管理
   ═══════════════════════════════════════════════════════ */

var Models = {

  /**
   * 获取可用模型列表
   * REAL API: GET /api/models
   * Response: { "success": true, "data": { "models": [...] } }
   */
  list: function(){
    return mockResolve([
      { id:'gpt-4o', name:'GPT-4o', provider:'OpenAI', context:'128K', price:'$2.50/1M', tags:['快速','多模态'] },
      { id:'claude-4-opus', name:'Claude 4 Opus', provider:'Anthropic', context:'200K', price:'$15.00/1M', tags:['创作','安全'] },
      { id:'gemini-2.5-pro', name:'Gemini 2.5 Pro', provider:'Google', context:'1M', price:'$1.25/1M', tags:['多模态','快速'] },
      { id:'deepseek-r1', name:'DeepSeek R1', provider:'DeepSeek', context:'128K', price:'$0.55/1M', tags:['推理','代码'] },
      { id:'llama-4-405b', name:'Llama 4 405B', provider:'Meta', context:'128K', price:'$0.80/1M', tags:['开源','代码'] },
      { id:'mistral-large-2', name:'Mistral Large 2', provider:'Mistral AI', context:'128K', price:'$2.00/1M', tags:['多语言','代码'] }
    ]);
  },

  /**
   * 设置默认模型
   * REAL API: PUT /api/models/default
   * Request:  { "modelId": "gpt-4o" }
   * Response: { "success": true }
   */
  setDefault: function(modelId){
    storageSet('cwj_default_model', modelId);
    return mockResolve(true);
  }
};

/* ═══════════════════════════════════════════════════════
   PROFILE — 用户资料
   ═══════════════════════════════════════════════════════ */

var Profile = {

  /**
   * 获取用户资料
   * REAL API: GET /api/profile
   * Response: { "success": true, "data": { "user": {...}, "usage": {...}, "achievements": [...] } }
   */
  get: function(){
    var user = storageGet('cwj_user', { name:'赛博行者', email:'user@example.com', avatar:'C', plan:'Pro' });
    return mockResolve({
      user: user,
      usage: {
        apiCalls: { used: 12847, limit: 50000 },
        tokens: { used: '2.4M', limit: '10M' },
        storage: { used: '1.2GB', limit: '5GB' },
        agentHours: { used: 18, limit: 100 }
      },
      achievements: [
        { icon:'⚡', name:'闪电手', desc:'单日对话超过 50 次' },
        { icon:'💻', name:'代码大师', desc:'使用代码助手超过 100 次' },
        { icon:'🎨', name:'创意画家', desc:'生成图片超过 100 张' },
        { icon:'🤖', name:'Agent 专家', desc:'创建 3 个以上 Agent' }
      ],
      stats: { conversations: 1284, agents: 36, images: 189, apps: 42 }
    });
  },

  /**
   * 更新用户资料
   * REAL API: PUT /api/profile
   * Request:  { "name": "...", "bio": "..." }
   * Response: { "success": true, "data": { "user": {...} } }
   */
  update: function(data){
    var user = storageGet('cwj_user', {});
    Object.assign(user, data);
    storageSet('cwj_user', user);
    return mockResolve(user);
  }
};

/* ═══════════════════════════════════════════════════════
   EXPORT — 全局导出
   ═══════════════════════════════════════════════════════ */
window.api = {
  auth: Auth,
  settings: Settings,
  theme: ThemeApi,
  chat: Chat,
  dashboard: Dashboard,
  agents: Agents,
  models: Models,
  profile: Profile
};

})(window);
