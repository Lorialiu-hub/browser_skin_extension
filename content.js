// 浏览器换肤插件 - 内容脚本（完整版）
// 包含打字动效、拉灯绳、主题应用等所有功能

class BrowserSkinExtension {
  constructor() {
    this.currentTheme = 'classic';
    this.customBackground = '';
    this.opacity = 100;
    this.brightness = 1.0;
    this.maskStyle = 'none';
    this.isInitialized = false;
    
    this.elements = {
      themeLayer: null,
      customBg: null,
      mask: null,
      effectsContainer: null,
      lamp: null
    };
    
    this.initialize();
  }
  
  // 初始化插件
  async initialize() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
    
    // 监听存储变化
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        this.handleStorageChanges(changes);
      }
    });
    
    // 加载初始设置
    await this.loadSettings();
  }
  
  // 设置DOM元素
  setup() {
    this.createDOMElements();
    this.setupTypingEffects();
    this.setupLampInteraction();
    this.applyCurrentTheme();
    this.isInitialized = true;
    
    console.log('浏览器换肤插件已初始化');
  }
  
  // 创建DOM元素
  createDOMElements() {
    // 主题层
    this.elements.themeLayer = document.createElement('div');
    this.elements.themeLayer.className = 'browser-skin-theme-layer';
    document.body.appendChild(this.elements.themeLayer);
    
    // 自定义背景层
    this.elements.customBg = document.createElement('div');
    this.elements.customBg.className = 'browser-skin-custom-bg';
    document.body.appendChild(this.elements.customBg);
    
    // 蒙版层
    this.elements.mask = document.createElement('div');
    this.elements.mask.className = 'browser-skin-mask';
    document.body.appendChild(this.elements.mask);
    
    // 动效容器
    this.elements.effectsContainer = document.createElement('div');
    this.elements.effectsContainer.className = 'typing-effects-container';
    document.body.appendChild(this.elements.effectsContainer);
    
    // 拉灯绳
    this.createLamp();
  }
  
  // 创建拉灯绳
  createLamp() {
    const lampContainer = document.createElement('div');
    lampContainer.className = 'browser-skin-lamp';
    lampContainer.innerHTML = `
      <div class="lamp-rope"></div>
      <div class="lamp-bulb"></div>
    `;
    document.body.appendChild(lampContainer);
    this.elements.lamp = lampContainer;
    
    // 灯绳元素
    this.elements.lampRope = lampContainer.querySelector('.lamp-rope');
    this.elements.lampBulb = lampContainer.querySelector('.lamp-bulb');
  }
  
  // ========== 打字动效系统 ==========
  setupTypingEffects() {
    // 监听所有输入事件
    document.addEventListener('input', (e) => {
      if (this.isInputElement(e.target)) {
        this.handleTypingEvent(e);
      }
    });
    
    // 监听焦点事件
    document.addEventListener('focusin', (e) => {
      if (this.isInputElement(e.target)) {
        this.enhanceGlowEffect(e.target);
      }
    });
    
    document.addEventListener('focusout', (e) => {
      if (this.isInputElement(e.target)) {
        this.reduceGlowEffect(e.target);
      }
    });
  }
  
  // 判断是否为输入元素
  isInputElement(element) {
    const tagName = element.tagName.toLowerCase();
    const inputTypes = ['text', 'email', 'password', 'search', 'tel', 'url'];
    
    if (tagName === 'input') {
      return inputTypes.includes(element.type) || !element.type;
    }
    
    return tagName === 'textarea' || element.isContentEditable;
  }
  
  // 处理打字事件
  handleTypingEvent(event) {
    const input = event.target;
    const rect = input.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;
    
    // 创建粒子动效
    this.createParticles(centerX, centerY);
    
    // 创建水波纹动效
    this.createRipple(centerX, centerY);
    
    // 更新环绕光晕
    this.updateGlowRing(input, centerX, centerY);
  }
  
  // 创建粒子
  createParticles(x, y) {
    const particleCount = Math.floor(Math.random() * 4) + 5; // 5-8个粒子
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'typing-particle';
      
      // 随机颜色
      const hue = Math.floor(Math.random() * 360);
      particle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
      
      // 随机位置偏移
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      
      // 随机大小
      const size = 2 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // 随机动画时长
      const duration = 0.8 + Math.random() * 0.7;
      particle.style.animationDuration = `${duration}s`;
      
      // 设置位置
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      this.elements.effectsContainer.appendChild(particle);
      
      // 动画结束后移除
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, duration * 1000);
    }
  }
  
  // 创建水波纹
  createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'typing-ripple';
    
    // 随机颜色
    const hue = Math.floor(Math.random() * 360);
    ripple.style.color = `hsl(${hue}, 100%, 70%)`;
    
    // 设置位置和大小
    const size = 20 + Math.random() * 30;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size/2}px`;
    ripple.style.top = `${y - size/2}px`;
    
    this.elements.effectsContainer.appendChild(ripple);
    
    // 动画结束后移除
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 1000);
  }
  
  // 更新环绕光晕
  updateGlowRing(input, x, y) {
    let glowRing = input.dataset.glowRingId ? 
      document.getElementById(input.dataset.glowRingId) : null;
    
    if (!glowRing) {
      glowRing = document.createElement('div');
      glowRing.className = 'typing-glow-ring';
      glowRing.id = `glow-ring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      input.dataset.glowRingId = glowRing.id;
      
      // 设置颜色
      const hue = Math.floor(Math.random() * 360);
      glowRing.style.color = `hsl(${hue}, 100%, 70%)`;
      
      this.elements.effectsContainer.appendChild(glowRing);
    }
    
    // 更新位置和大小
    const rect = input.getBoundingClientRect();
    const ringSize = Math.max(rect.width, rect.height) + 40;
    
    glowRing.style.width = `${ringSize}px`;
    glowRing.style.height = `${ringSize}px`;
    glowRing.style.left = `${rect.left + window.scrollX - 20}px`;
    glowRing.style.top = `${rect.top + window.scrollY - 20}px`;
    
    // 重置动画以创建闪烁效果
    glowRing.style.animation = 'none';
    setTimeout(() => {
      glowRing.style.animation = '';
    }, 10);
  }
  
  // 增强光晕效果（输入框获得焦点时）
  enhanceGlowEffect(input) {
    const glowRing = input.dataset.glowRingId ? 
      document.getElementById(input.dataset.glowRingId) : null;
    
    if (glowRing) {
      glowRing.style.opacity = '0.8';
      glowRing.style.animationDuration = '1s';
    }
  }
  
  // 减弱光晕效果（输入框失去焦点时）
  reduceGlowEffect(input) {
    const glowRing = input.dataset.glowRingId ? 
      document.getElementById(input.dataset.glowRingId) : null;
    
    if (glowRing) {
      glowRing.style.opacity = '0.5';
      glowRing.style.animationDuration = '3s';
    }
  }
  
  // ========== 拉灯绳交互 ==========
  setupLampInteraction() {
    if (!this.elements.lamp) return;
    
    let isDragging = false;
    let startY = 0;
    let startHeight = 60;
    
    this.elements.lamp.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startHeight = parseInt(getComputedStyle(this.elements.lampRope).height);
      this.elements.lampRope.classList.add('pulling');
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaY = e.clientY - startY;
      const newHeight = Math.min(Math.max(60, startHeight + deltaY), 100);
      
      this.elements.lampRope.style.height = `${newHeight}px`;
      
      // 如果下拉超过阈值，触发切换
      if (newHeight >= 85) {
        this.pullLampToSwitch();
        isDragging = false;
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        this.elements.lampRope.classList.remove('pulling');
        this.elements.lampRope.style.height = '';
      }
    });
    
    // 触摸设备支持
    this.elements.lamp.addEventListener('touchstart', (e) => {
      isDragging = true;
      startY = e.touches[0].clientY;
      startHeight = parseInt(getComputedStyle(this.elements.lampRope).height);
      this.elements.lampRope.classList.add('pulling');
      e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const deltaY = e.touches[0].clientY - startY;
      const newHeight = Math.min(Math.max(60, startHeight + deltaY), 100);
      
      this.elements.lampRope.style.height = `${newHeight}px`;
      
      if (newHeight >= 85) {
        this.pullLampToSwitch();
        isDragging = false;
      }
    });
    
    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        this.elements.lampRope.classList.remove('pulling');
        this.elements.lampRope.style.height = '';
      }
    });
  }
  
  // 拉灯绳切换主题
  async pullLampToSwitch() {
    // 灯泡闪烁
    this.elements.lampBulb.classList.add('lit');
    
    // 创建闪光效果
    const flash = document.createElement('div');
    flash.className = 'theme-transition-flash';
    document.body.appendChild(flash);
    
    // 随机选择新主题
    const themes = ['classic', 'retro', 'clean', 'parchment', 'dark', 'nature', 'ocean', 'sunset'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    
    // 保存新主题
    await chrome.storage.sync.set({ currentTheme: randomTheme });
    
    // 应用新主题
    this.currentTheme = randomTheme;
    this.applyCurrentTheme();
    
    // 清理动画
    setTimeout(() => {
      this.elements.lampBulb.classList.remove('lit');
      if (flash.parentNode) {
        flash.remove();
      }
      this.elements.lampRope.classList.remove('pulling');
      this.elements.lampRope.style.height = '';
    }, 500);
  }
  
  // ========== 主题系统 ==========
  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'currentTheme',
        'customBackground',
        'opacity',
        'brightness',
        'maskStyle'
      ]);
      
      this.currentTheme = result.currentTheme || 'classic';
      this.customBackground = result.customBackground || '';
      this.opacity = result.opacity !== undefined ? result.opacity : 100;
      this.brightness = result.brightness !== undefined ? result.brightness : 1.0;
      this.maskStyle = result.maskStyle || 'none';
      
      if (this.isInitialized) {
        this.applyCurrentTheme();
        this.updateCustomBackground();
        this.updateMaskStyle();
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  }
  
  handleStorageChanges(changes) {
    if (changes.currentTheme) {
      this.currentTheme = changes.currentTheme.newValue;
      this.applyCurrentTheme();
    }
    
    if (changes.customBackground) {
      this.customBackground = changes.customBackground.newValue;
      this.updateCustomBackground();
    }
    
    if (changes.opacity) {
      this.opacity = changes.opacity.newValue;
      this.updateCustomBackground();
    }
    
    if (changes.brightness) {
      this.brightness = changes.brightness.newValue;
      this.updateCustomBackground();
    }
    
    if (changes.maskStyle) {
      this.maskStyle = changes.maskStyle.newValue;
      this.updateMaskStyle();
    }
  }
  
  applyCurrentTheme() {
    if (!this.elements.themeLayer) return;
    
    // 移除所有主题类
    this.elements.themeLayer.className = 'browser-skin-theme-layer';
    
    // 添加当前主题类
    this.elements.themeLayer.classList.add(`theme-${this.currentTheme}`);
    
    // 应用对应的CSS变量
    const themeProperties = {
      classic: {
        background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
        opacity: '0.3'
      },
      retro: {
        background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
        opacity: '0.3'
      },
      clean: {
        background: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
        opacity: '0.2'
      },
      parchment: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        opacity: '0.4'
      },
      dark: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        opacity: '0.4'
      },
      nature: {
        background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
        opacity: '0.3'
      },
      ocean: {
        background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
        opacity: '0.3'
      },
      sunset: {
        background: 'linear-gradient(135deg, #dc2626 0%, #f97316 50%, #3b82f6 100%)',
        opacity: '0.3'
      }
    };
    
    const theme = themeProperties[this.currentTheme] || themeProperties.classic;
    this.elements.themeLayer.style.background = theme.background;
    this.elements.themeLayer.style.opacity = theme.opacity;
  }
  
  updateCustomBackground() {
    if (!this.elements.customBg) return;
    
    if (this.customBackground) {
      this.elements.customBg.style.backgroundImage = `url("${this.customBackground}")`;
      this.elements.customBg.style.opacity = `${this.opacity / 100}`;
      this.elements.customBg.style.filter = `brightness(${this.brightness})`;
      this.elements.customBg.style.display = 'block';
    } else {
      this.elements.customBg.style.display = 'none';
    }
  }
  
  updateMaskStyle() {
    if (!this.elements.mask) return;
    
    // 移除所有蒙版类
    this.elements.mask.className = 'browser-skin-mask';
    
    if (this.maskStyle === 'frosted') {
      this.elements.mask.classList.add('frosted');
    } else if (this.maskStyle === 'dark') {
      this.elements.mask.classList.add('dark');
    }
    // 'none' 时不添加任何类
  }
  
  // 清理函数
  cleanup() {
    if (this.elements.themeLayer && this.elements.themeLayer.parentNode) {
      this.elements.themeLayer.remove();
    }
    if (this.elements.customBg && this.elements.customBg.parentNode) {
      this.elements.customBg.remove();
    }
    if (this.elements.mask && this.elements.mask.parentNode) {
      this.elements.mask.remove();
    }
    if (this.elements.effectsContainer && this.elements.effectsContainer.parentNode) {
      this.elements.effectsContainer.remove();
    }
    if (this.elements.lamp && this.elements.lamp.parentNode) {
      this.elements.lamp.remove();
    }
  }
}

// 初始化插件
let browserSkin = null;

function initBrowserSkin() {
  if (!browserSkin) {
    browserSkin = new BrowserSkinExtension();
  }
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrowserSkin);
} else {
  initBrowserSkin();
}

// 导出给popup使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BrowserSkinExtension };
}
