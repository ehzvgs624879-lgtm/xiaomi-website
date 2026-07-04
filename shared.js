/* ══════════════════════════════════════════════════════
   CWJ TOOLS V4 — ENGINE
   Theme toggle, loading, transitions, chat sim, export
   ══════════════════════════════════════════════════════ */
(function(){
'use strict';
var rAF=requestAnimationFrame;
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isMobile=matchMedia('(hover:none)').matches;

/* ── THEME ── */
var Theme={
  KEY:'cwj-theme',
  init:function(){
    var saved=localStorage.getItem(this.KEY)||'dark';
    this.apply(saved);
    document.querySelectorAll('.theme-toggle').forEach(function(btn){
      btn.addEventListener('click',function(){Theme.toggle()});
    });
  },
  apply:function(mode){
    document.documentElement.setAttribute('data-theme',mode);
    localStorage.setItem(this.KEY,mode);
    document.querySelectorAll('.theme-toggle i').forEach(function(i){
      i.className=mode==='dark'?'fas fa-sun':'fas fa-moon';
    });
  },
  toggle:function(){
    var cur=document.documentElement.getAttribute('data-theme')||'dark';
    this.apply(cur==='dark'?'light':'dark');
  }
};

/* ── LOADING ── */
var Loader={
  show:function(msg){
    var el=document.querySelector('.loading-overlay');
    if(!el){
      el=document.createElement('div');el.className='loading-overlay';
      el.innerHTML='<div class="loading-spinner"></div><div class="loading-text">'+(msg||'加载中...')+'</div>';
      document.body.appendChild(el);
    }
    el.classList.remove('hide');
  },
  hide:function(){
    var el=document.querySelector('.loading-overlay');
    if(el)el.classList.add('hide');
  }
};

/* ── PAGE TRANSITION ── */
function initPageTransition(){
  document.body.classList.add('page-transition');
  requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.add('enter')})});
}

/* ── CURSOR GLOW ── */
(function(){
  if(reduced||isMobile)return;
  var glow=document.createElement('div');glow.className='cursor-glow';glow.setAttribute('aria-hidden','true');
  document.body.appendChild(glow);
  var tx=0,ty=0,cx=0,cy=0,active=false;
  document.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;if(!active){active=true;glow.classList.add('active')}},{passive:true});
  document.addEventListener('mouseleave',function(){active=false;glow.classList.remove('active')});
  (function tick(){cx+=(tx-cx)*0.08;cy+=(ty-cy)*0.08;glow.style.left=cx+'px';glow.style.top=cy+'px';rAF(tick)})();
})();

/* ── NAV SCROLL ── */
(function(){
  var nav=document.querySelector('.nav');if(!nav)return;
  var ticking=false;
  window.addEventListener('scroll',function(){if(!ticking){rAF(function(){nav.classList.toggle('scrolled',window.scrollY>30);ticking=false});ticking=true}},{passive:true});
})();

/* ── MOBILE MENU ── */
(function(){
  var btn=document.getElementById('navToggle'),menu=document.getElementById('mobileMenu');
  if(!btn||!menu)return;
  btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false')})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus()}});
})();

/* ── SCROLL REVEAL ── */
function initReveal(){
  var els=document.querySelectorAll('.reveal:not([data-rv])');if(!els.length)return;
  if(!reduced&&typeof gsap!=='undefined'&&typeof ScrollTrigger!=='undefined'){
    gsap.registerPlugin(ScrollTrigger);
    els.forEach(function(el){el.dataset.rv='1';gsap.fromTo(el,{opacity:0,y:20},{opacity:1,y:0,duration:0.55,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})});
  } else {
    var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){el.dataset.rv='1';obs.observe(el)});
  }
}

/* ── NUMBER COUNTER ── */
/* ③ NUMBER SCROLL: 800ms ease-out */
function animateCounters(root){
  (root||document).querySelectorAll('[data-count]:not([data-ct])').forEach(function(el){
    el.dataset.ct='1';
    var target=parseFloat(el.dataset.count),
        suffix=el.dataset.suffix||'',
        prefix=el.dataset.prefix||'',
        dec=parseInt(el.dataset.decimals)||0,
        large=el.dataset.large==='true',
        dur=reduced?0:800,
        start=performance.now();
    if(dur===0){
      el.textContent=prefix+(large?(target>=1e6?(target/1e6).toFixed(1)+'M':Math.floor(target/1e3)+'K'):target.toFixed(dec))+suffix;
      return;
    }
    function easeOut(t){return 1-Math.pow(1-t,3)}
    (function step(now){
      var raw=Math.min((now-start)/dur,1);
      var p=easeOut(raw);
      var val=target*p;
      if(large){
        el.textContent=prefix+(val>=1e6?(val/1e6).toFixed(1)+'M':val>=1e3?Math.floor(val/1e3)+'K':Math.floor(val))+suffix;
      } else {
        el.textContent=prefix+val.toFixed(dec)+suffix;
      }
      if(raw<1)rAF(step);
    })(start);
  });
}

/* ── 3D TILT ── */
/* ② 3D CARD TILT: ±8deg, preserve-3d */
function initTilt(){
  if(reduced||isMobile)return;
  document.querySelectorAll('[data-tilt]').forEach(function(card){
    card.classList.add('tilt-card');
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-0.5;
      var y=(e.clientY-r.top)/r.height-0.5;
      var rotX=(-y*8).toFixed(2);
      var rotY=(x*8).toFixed(2);
      card.style.transform='perspective(800px) rotateX('+rotX+'deg) rotateY('+rotY+'deg) scale3d(1.02,1.02,1.02)';
    },{passive:true});
    card.addEventListener('mouseleave',function(){
      card.style.transform='perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
    /* Touch support */
    card.addEventListener('touchmove',function(e){
      if(e.touches.length!==1)return;
      var r=card.getBoundingClientRect();
      var x=(e.touches[0].clientX-r.left)/r.width-0.5;
      var y=(e.touches[0].clientY-r.top)/r.height-0.5;
      card.style.transform='perspective(800px) rotateX('+(-y*8).toFixed(2)+'deg) rotateY('+(x*8).toFixed(2)+'deg) scale3d(1.02,1.02,1.02)';
    },{passive:true});
    card.addEventListener('touchend',function(){
      card.style.transform='perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });
}

/* ── MAGNETIC BUTTONS ── */
function initMagnetic(){
  if(reduced||isMobile)return;
  document.querySelectorAll('[data-magnetic]').forEach(function(btn){
    btn.addEventListener('mousemove',function(e){var r=btn.getBoundingClientRect();btn.style.transform='translate('+(e.clientX-r.left-r.width/2)*0.15+'px,'+(e.clientY-r.top-r.height/2)*0.15+'px)'},{passive:true});
    btn.addEventListener('mouseleave',function(){btn.style.transform=''});
  });
}

/* ── PARTICLES ── */
function initParticles(el,count){
  if(reduced)return;el=el||document.querySelector('.hero');if(!el)return;
  var frag=document.createDocumentFragment();
  for(var i=0;i<(count||8);i++){var p=document.createElement('div');p.className='particle';p.setAttribute('aria-hidden','true');var s=3+Math.random()*6;p.style.cssText='width:'+s+'px;height:'+s+'px;left:'+Math.random()*100+'%;bottom:-20px;animation-duration:'+(12+Math.random()*16)+'s;animation-delay:'+Math.random()*10+'s;opacity:'+(0.12+Math.random()*0.2);frag.appendChild(p)}
  el.appendChild(frag);
}

/* ── SMOOTH ANCHOR ── */
function initSmoothScroll(){document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a)return;var h=a.getAttribute('href');if(h==='#'||h.length<2)return;var t=document.querySelector(h);if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})}

/* ── SIDEBAR ── */
function initSidebar(){document.querySelectorAll('.dash-sidebar').forEach(function(bar){bar.addEventListener('click',function(e){var item=e.target.closest('.dash-sidebar-item');if(!item)return;bar.querySelectorAll('.dash-sidebar-item').forEach(function(i){i.classList.remove('active')});item.classList.add('active')})})}

/* ── TABS ── */
function initTabs(){document.querySelectorAll('.tabs').forEach(function(g){g.addEventListener('click',function(e){var t=e.target.closest('.tab');if(!t)return;g.querySelectorAll('.tab').forEach(function(x){x.classList.remove('active')});t.classList.add('active')})})}

/* ── TOGGLE ── */
function initToggles(){document.querySelectorAll('.toggle').forEach(function(t){t.setAttribute('role','switch');var inp=t.querySelector('input');if(inp)t.setAttribute('aria-checked',inp.checked);t.addEventListener('click',function(){if(inp){inp.checked=!inp.checked;t.setAttribute('aria-checked',inp.checked)}});t.addEventListener('keydown',function(e){if(e.key===' '||e.key==='Enter'){e.preventDefault();t.click()}})})}

/* ── TOAST ── */
window.showToast=function(msg,dur){
  var old=document.querySelector('.toast-msg');if(old)old.remove();
  var t=document.createElement('div');t.className='toast-msg';t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.textContent=msg;
  t.style.cssText='position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-16px);background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.2);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-radius:10px;padding:10px 20px;font-size:13px;color:var(--accent-3);z-index:9999;opacity:0;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);font-family:var(--font);font-weight:500;white-space:nowrap;pointer-events:none';
  document.body.appendChild(t);
  rAF(function(){t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)'});
  setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(-16px)';setTimeout(function(){t.remove()},350)},dur||2000);
};

/* ── CHAT SIMULATION ── */
window.ChatSim={
  messages:[],
  container:null,
  input:null,
  init:function(containerId,inputId){
    this.container=document.getElementById(containerId);
    this.input=document.getElementById(inputId);
    if(!this.container||!this.input)return;
    var self=this;
    var sendBtn=this.input.closest('.chat-input-row')?this.input.closest('.chat-input-row').querySelector('.chat-send'):null;
    if(sendBtn)sendBtn.addEventListener('click',function(){self.send()});
    this.input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();self.send()}});
  },
  send:function(){
    var text=this.input.value.trim();if(!text)return;
    this.input.value='';this.input.style.height='auto';
    this.addMsg(text,'user');
    var self=this;
    setTimeout(function(){self.showTyping()},400);
    setTimeout(function(){self.removeTyping();self.addMsg(self.generateReply(text),'ai')},1200+Math.random()*800);
  },
  addMsg:function(text,role,typing){
    var div=document.createElement('div');div.className='msg '+role;
    var avatar=role==='ai'?'<i class="fas fa-bolt"></i>':'C';
    var time=new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
    var bodyDiv=document.createElement('div');bodyDiv.className='msg-body';
    var wrapper=document.createElement('div');
    wrapper.innerHTML='<div class="msg-avatar">'+avatar+'</div><div></div>';
    wrapper.querySelector('div:last-child').appendChild(bodyDiv);
    var timeDiv=document.createElement('div');timeDiv.className='msg-time';timeDiv.textContent=time;
    wrapper.querySelector('div:last-child').appendChild(timeDiv);
    div.appendChild(wrapper);
    this.container.appendChild(div);
    this.container.scrollTop=this.container.scrollHeight;
    if(typing&&role==='ai'&&typeof TypingEffect!=='undefined'){
      TypingEffect.typeHtml(bodyDiv,text,20).then(function(){});
    } else {
      bodyDiv.innerHTML=text;
    }
  },
  showTyping:function(){
    var div=document.createElement('div');div.className='msg ai typing-indicator';
    div.innerHTML='<div class="msg-avatar"><i class="fas fa-bolt"></i></div><div><div class="msg-body" style="display:flex;gap:4px;padding:14px 18px"><span class="dot-anim">●</span><span class="dot-anim" style="animation-delay:0.15s">●</span><span class="dot-anim" style="animation-delay:0.3s">●</span></div></div>';
    this.container.appendChild(div);this.container.scrollTop=this.container.scrollHeight;
  },
  removeTyping:function(){var el=this.container.querySelector('.typing-indicator');if(el)el.remove()},
  generateReply:function(input){
    var replies=[
      '好的，我来帮你分析这个问题。根据我的理解，核心要点有以下几点：<br><br>1. 首先需要明确需求范围<br>2. 然后进行技术选型评估<br>3. 最后制定实施计划<br><br>你觉得这个思路如何？',
      '这是一个很好的问题！让我从几个角度来回答：<br><br>从<b>技术可行性</b>来看，目前主流方案都能支持。建议优先考虑可扩展性和维护成本。',
      '收到！我已经完成了初步分析。<br><br><pre><code>// 核心逻辑\nfunction solve(input) {\n  const result = process(input);\n  return optimize(result);\n}</code></pre>需要我进一步优化吗？',
      '根据最新数据，这个方向的 ROI 预计在 <b>180%-250%</b> 之间。建议分三阶段推进，每阶段 2 周。',
      '没问题，我帮你整理了一份详细方案。要点如下：<br><br>✅ 第一周：需求调研与原型设计<br>✅ 第二周：核心功能开发<br>✅ 第三周：测试优化与上线'
    ];
    return replies[Math.floor(Math.random()*replies.length)];
  }
};

/* ── REALTIME DATA ── */
window.RealtimeChart={
  charts:{},
  intervals:[],
  addChart:function(id,config){
    var ctx=document.getElementById(id);if(!ctx||typeof Chart==='undefined')return;
    this.charts[id]=new Chart(ctx,config);
    return this.charts[id];
  },
  startSimulation:function(chartId,dataIdx,min,max,interval){
    var chart=this.charts[chartId];if(!chart)return;
    var iv=setInterval(function(){
      var data=chart.data.datasets[dataIdx].data;
      data.shift();
      data.push(min+Math.random()*(max-min));
      chart.update('none');
    },interval||2000);
    this.intervals.push(iv);
  },
  stopAll:function(){this.intervals.forEach(clearInterval);this.intervals=[]}
};

/* ── EXPORT ── */
window.ExportUtil={
  csv:function(headers,rows,filename){
    var csv=headers.join(',')+'\n';
    rows.forEach(function(r){csv+=r.join(',')+'\n'});
    var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename||'export.csv';a.click();
    showToast('CSV 已导出');
  },
  json:function(data,filename){
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename||'export.json';a.click();
    showToast('JSON 已导出');
  },
  share:function(url,title){
    if(navigator.share){navigator.share({title:title||'CWJ TOOLS',url:url||location.href}).catch(function(){})}
    else{navigator.clipboard.writeText(url||location.href).then(function(){showToast('链接已复制')})}
  }
};

/* ── CHART DEFAULTS ── */
if(typeof Chart!=='undefined'){
  Chart.defaults.font.family="'Inter',sans-serif";
  Chart.defaults.font.size=11;
  Chart.defaults.plugins.legend.labels.usePointStyle=true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth=8;
  Chart.defaults.plugins.legend.labels.padding=12;
  Chart.defaults.elements.line.borderWidth=2;
  Chart.defaults.elements.point.radius=0;
  Chart.defaults.elements.point.hoverRadius=4;
  function applyChartTheme(){
    var isDark=(document.documentElement.getAttribute('data-theme')||'dark')==='dark';
    Chart.defaults.color=isDark?'#71717a':'#52525b';
    Chart.defaults.borderColor=isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.06)';
  }
  applyChartTheme();
  new MutationObserver(applyChartTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}

/* ── LOGIN MOCK ── */
window.AuthMock={
  KEY:'cwj-user',
  login:function(email){
    var user={name:email.split('@')[0],email:email,avatar:email.charAt(0).toUpperCase(),plan:'Pro',loginAt:Date.now()};
    localStorage.setItem(this.KEY,JSON.stringify(user));
    return user;
  },
  getUser:function(){try{return JSON.parse(localStorage.getItem(this.KEY))}catch(e){return null}},
  logout:function(){localStorage.removeItem(this.KEY);location.href='login.html'}
};

/* ── EXPORT ── */
window.CWJ={initReveal:initReveal,animateCounters:animateCounters,initTilt:initTilt,initMagnetic:initMagnetic,initParticles:initParticles,initSmoothScroll:initSmoothScroll,initSidebar:initSidebar,initTabs:initTabs,initToggles:initToggles};


/* ═══ V4.3 EFFECTS ═══ */

/* ① SPLASH SCREEN */
function initSplash(){
  var splash=document.getElementById('splashScreen');
  if(!splash)return;
  // Block scroll during splash
  document.body.style.overflow='hidden';
  setTimeout(function(){
    splash.classList.add('hide');
    document.body.style.overflow='';
    setTimeout(function(){splash.remove()},600);
  },2000);
}

/* ② COLLAPSIBLE LONG MESSAGES */
function initMsgCollapse(){
  var container=document.getElementById('chatMessages');
  if(!container)return;
  // Observe new messages added via ChatSim
  var obs=new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      m.addedNodes.forEach(function(node){
        if(node.nodeType!==1)return;
        var body=node.querySelector('.msg-body');
        if(!body)return;
        checkAndCollapse(body);
      });
    });
  });
  obs.observe(container,{childList:true,subtree:true});
  // Process existing messages
  container.querySelectorAll('.msg-body').forEach(checkAndCollapse);
}
function checkAndCollapse(body){
  if(body.dataset.collapseChecked)return;
  body.dataset.collapseChecked='1';
  var text=body.textContent||'';
  if(text.length<200)return;
  // Create summary (first 120 chars)
  var summary=text.substring(0,120).replace(/\s+$/,'')+'…';
  var fullHtml=body.innerHTML;
  // Build collapse structure
  body.innerHTML='<div class="msg-summary">'+summary+'</div><div class="msg-collapsed">'+fullHtml+'</div>';
  // Add trigger button
  var trigger=document.createElement('div');
  trigger.className='msg-collapse-trigger';
  trigger.innerHTML='<span class="arrow">▶</span> 展开全文 ('+text.length+'字)';
  trigger.addEventListener('click',function(){
    var collapsed=body.querySelector('.msg-collapsed');
    var isOpen=collapsed.classList.toggle('open');
    trigger.classList.toggle('open',isOpen);
    trigger.innerHTML=isOpen?'<span class="arrow">▶</span> 收起':'<span class="arrow">▶</span> 展开全文 ('+text.length+'字)';
  });
  body.appendChild(trigger);
}

/* ③ FONT WEIGHT BREATHING */
function initWeightBreathe(){
  document.querySelectorAll('.hero-metric .num,.stat-num,.level-badge').forEach(function(el){
    el.classList.add('weight-breathe');
  });
}

/* ④ BADGE/NOTIFICATION TOAST */
window.BadgeToast={
  show:function(msg,icon,type){
    var old=document.querySelector('.badge-toast');if(old)old.remove();
    var el=document.createElement('div');el.className='badge-toast';
    var iconCls=type||'success';
    var iconSymbol=icon||(type==='warning'?'⚠':type==='info'?'ℹ':'✓');
    el.innerHTML='<div class="badge-icon '+iconCls+'">'+iconSymbol+'</div><span>'+msg+'</span>';
    document.body.appendChild(el);
    requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('show')})});
    setTimeout(function(){el.classList.remove('show');setTimeout(function(){el.remove()},500)},3000);
  }
};

/* ⑤ MOBILE VIBRATION */
window.HapticFeedback={
  tap:function(){if(navigator.vibrate)navigator.vibrate(10)},
  confirm:function(){if(navigator.vibrate)navigator.vibrate([10,30,10])},
  error:function(){if(navigator.vibrate)navigator.vibrate([20,50,20,50,20])}
};

/* ═══ V4.2 EFFECTS ═══ */

/* ① TYPING EFFECT (chat.html) */
window.TypingEffect={
  type:function(el,text,speed){
    speed=speed||30;
    return new Promise(function(resolve){
      el.textContent='';
      var cursor=document.createElement('span');cursor.className='typing-cursor';
      el.appendChild(cursor);
      var i=0;
      function tick(){
        if(i<text.length){
          cursor.before(document.createTextNode(text.charAt(i)));
          i++;
          setTimeout(tick,speed+Math.random()*20);
        } else {
          setTimeout(function(){cursor.remove();resolve()},400);
        }
      }
      tick();
    });
  },
  typeHtml:function(el,html,speed){
    speed=speed||25;
    return new Promise(function(resolve){
      el.innerHTML='';
      var cursor=document.createElement('span');cursor.className='typing-cursor';
      el.appendChild(cursor);
      var chars=html.split(''),i=0,tag=false,buf='';
      function tick(){
        if(i>=chars.length){cursor.remove();resolve();return}
        var ch=chars[i];
        if(ch==='<')tag=true;
        if(tag){buf+=ch;if(ch==='>'){tag=false;el.innerHTML=el.innerHTML.replace(cursor.outerHTML,'')+buf+cursor.outerHTML;buf=''}}
        else{cursor.before(document.createTextNode(ch))}
        i++;
        setTimeout(tick,tag?0:speed+Math.random()*15);
      }
      tick();
    });
  }
};

/* ② ICON BOUNCE (auto-apply to common icons) */
function initIconAnimations(){
  document.querySelectorAll('.tool-icon,.stat-icon,.footer-social a,.nav-avatar,.theme-toggle').forEach(function(el){
    if(!el.classList.contains('icon-bounce'))el.classList.add('icon-bounce');
  });
  document.querySelectorAll('.dash-sidebar-item i,.nav-item .nav-icon').forEach(function(el){
    el.classList.add('icon-pop');
  });
}

/* ③ RIPPLE EFFECT */
function initRipple(){
  document.addEventListener('click',function(e){
    var target=e.target.closest('.nav-item,.dash-sidebar-item,.btn,.tab,.filter-btn,.social-btn,.theme-toggle');
    if(!target)return;
    var rect=target.getBoundingClientRect();
    var ripple=document.createElement('span');ripple.className='ripple';
    var size=Math.max(rect.width,rect.height);
    ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=(e.clientX-rect.left-size/2)+'px';
    ripple.style.top=(e.clientY-rect.top-size/2)+'px';
    target.style.position=target.style.position||'relative';
    target.style.overflow='hidden';
    target.appendChild(ripple);
    setTimeout(function(){ripple.remove()},600);
  });
}

/* ④ DYNAMIC SHADOW (virtual light source) */
function initDynamicShadow(){
  if(reduced||isMobile)return;
  var cards=document.querySelectorAll('.card,.tool-card,.stat-card');
  cards.forEach(function(c){c.classList.add('dynamic-shadow')});
  var ticking=false;
  window.addEventListener('scroll',function(){
    if(ticking)return;
    ticking=true;
    rAF(function(){
      var viewH=window.innerHeight;
      cards.forEach(function(card){
        var r=card.getBoundingClientRect();
        var centerY=r.top+r.height/2;
        var normY=centerY/viewH;
        var shadowY=Math.round((normY-0.5)*20);
        var shadowBlur=Math.round(20+Math.abs(normY-0.5)*30);
        var alpha=(0.15+Math.abs(normY-0.5)*0.15).toFixed(2);
        card.style.boxShadow='0 '+shadowY+'px '+shadowBlur+'px rgba(0,0,0,'+alpha+')';
      });
      ticking=false;
    });
  },{passive:true});
}

/* ⑤ SVG HERO TITLE STROKE REVEAL */
function initSvgReveal(){
  var svg=document.querySelector('.hero-title-svg');
  if(!svg)return;
  svg.classList.add('svg-reveal');
  /* Play once: remove animation after done */
  setTimeout(function(){
    svg.querySelectorAll('path,text,line').forEach(function(el){
      el.style.strokeDasharray='none';
      el.style.strokeDashoffset='0';
      el.style.animation='none';
    });
  },2600);
}

/* ⑥ STAGGER FADE-IN (IntersectionObserver) */
function initStagger(){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
    });
  },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('[data-stagger]').forEach(function(el){obs.observe(el)});
}

/* ── GLOBAL BUTTON HANDLERS ── */
(function(){
  document.addEventListener('click',function(e){
    var btn=e.target.closest('button');
    if(!btn)return;

    /* Chat: copy message */
    if(btn.querySelector('.fa-copy')){
      var body=btn.closest('.msg-actions');
      if(body){var msgBody=body.previousElementSibling;if(msgBody){navigator.clipboard.writeText(msgBody.textContent.trim()).then(function(){showToast('已复制')}).catch(function(){showToast('复制失败')})}}
      return;
    }
    /* Chat: regenerate */
    if(btn.querySelector('.fa-redo')){showToast('正在重新生成...');return}
    /* Chat: thumbs up */
    if(btn.querySelector('.fa-thumbs-up')){btn.style.color='var(--green)';showToast('感谢反馈');return}
    /* Chat: share */
    if(btn.title==='分享'){ExportUtil.share(null,'CWJ TOOLS 对话');return}
    /* Chat: export */
    if(btn.title==='导出'){var msgs=[];document.querySelectorAll('.chat-messages .msg').forEach(function(m){msgs.push([m.classList.contains('ai')?'AI':'User',m.querySelector('.msg-body').textContent.trim()])});ExportUtil.csv(['角色','内容'],msgs,'chat.csv');return}
    /* Chat: more */
    if(btn.title==='更多'){showToast('更多选项开发中');return}
    /* Chat: new conversation */
    if(btn.classList.contains('chat-new')){showToast('新对话已创建');return}
    /* Chat: tool buttons (附件/图片/代码/联网) */
    if(btn.querySelector('.fa-paperclip')){showToast('附件上传功能开发中');return}
    if(btn.querySelector('.fa-image')){showToast('图片上传功能开发中');return}
    if(btn.querySelector('.fa-code')){showToast('代码模式已开启');return}
    if(btn.querySelector('.fa-globe')){showToast('联网搜索已开启');return}

    /* Models: use button */
    if(btn.classList.contains('model-use')){showToast('已切换到该模型');return}
    /* Models: filter buttons - handled by inline script */

    /* Settings: save */
    if(btn.textContent.includes('保存设置')){
  if(window.api){api.settings.save({}).then(function(){showToast('设置已保存');BadgeToast.show('设置已保存成功','✓','success')})}
  else{showToast('设置已保存');BadgeToast.show('设置已保存成功','✓','success')}
  return
}
    /* Settings: reset */
    if(btn.textContent.includes('重置默认')){showToast('已恢复默认设置');return}
    /* Settings: copy API key */
    if(btn.textContent==='复制'){navigator.clipboard.writeText('sk-cwj-xxxxxxxxxxxxxxxx').then(function(){showToast('API Key 已复制')});return}

    /* Profile: edit */
    if(btn.textContent.includes('编辑资料')){location.href='settings.html';return}

    /* Agent: create */
    if(btn.textContent.includes('创建 Agent')){showToast('Agent 创建功能开发中');return}

    /* Social login */
    if(btn.classList.contains('social-btn')){return}

    /* ⑤ Haptic feedback on all button clicks */
    HapticFeedback.tap();
  });
  /* Haptic confirm for success actions */
  document.addEventListener('click',function(e){
    var btn=e.target.closest('button');
    if(!btn)return;
    if(btn.textContent.includes('保存')||btn.textContent.includes('登录')||
       btn.textContent.includes('注册')||btn.textContent.includes('复制')||
       btn.classList.contains('model-use')){
      HapticFeedback.confirm();
    }
  });
})();

/* ④ LIQUID BUTTON */
function initLiquidButtons(){
  document.querySelectorAll('.btn-primary,.btn-secondary,.btn-sm').forEach(function(btn){
    if(!btn.classList.contains('btn-liquid'))btn.classList.add('btn-liquid');
  });
}

/* ⑥ SVG LOADER (replace CSS spinner) */
function initSvgLoader(){
  var overlay=document.querySelector('.loading-overlay');
  if(!overlay)return;
  var spinner=overlay.querySelector('.loading-spinner');
  if(!spinner)return;
  spinner.innerHTML='<svg class="svg-loader" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/></svg>';
}

/* ⑦ EMPTY STATE (auto-render where needed) */
function initEmptyStates(){
  document.querySelectorAll('[data-empty]').forEach(function(el){
    var icon=el.dataset.emptyIcon||'📭';
    var title=el.dataset.emptyTitle||'暂无数据';
    var desc=el.dataset.emptyDesc||'这里还没有内容';
    var action=el.dataset.emptyAction||'';
    el.innerHTML='<div class="empty-state"><div class="empty-icon">'+icon+'</div><div class="empty-title">'+title+'</div><div class="empty-desc">'+desc+'</div>'+(action?'<div class="empty-action">'+action+'</div>':'')+'</div>';
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',function(){
  Theme.init();
  initPageTransition();
  initReveal();initTilt();initMagnetic();initParticles();
  initSmoothScroll();initSidebar();initTabs();initToggles();
  initLiquidButtons();initSvgLoader();initEmptyStates();initIconAnimations();initRipple();initDynamicShadow();initSvgReveal();initStagger();initSplash();initMsgCollapse();initWeightBreathe();
  /* Hide loader after page load */
  setTimeout(function(){Loader.hide()},300);
});

})();
