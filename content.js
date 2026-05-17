/**
 * 浏览器换肤插件 - Content Script
 * 功能：打字特效（粒子/水波纹/光晕）、拉灯绳开关灯、主题切换、自定义背景
 */

class BrowserSkinExtension {
  constructor() {
    this.currentTheme = 'default';
    this.customBackground = '';
    this.opacity = 1;
    this.brightness = 1;
    this.lightOn = true;
    this.effectEnabled = true;
    this.lastKeyTime = 0;
    this.keyStreak = 0;
    
    // 特效元素池
    this.particles = [];
    this.ripples = [];
    this.glowRings = [];
    
    // 初始化 DOM 元素
    this.elements = {
      themeLayer: null,
      customBg: null,
      lampRope: null,
      lampBulb: null,
      overlay: null
    };
    
    this.init();
  }
  
  init() {
    this.createThemeLayer();
    this.createLampCord();
    this.loadSettings();
    this.attachEventListeners();
    console.log('浏览器换肤插件已加载');
  }
  
  createThemeLayer() {
    const themeLayer = document.createElement('div');
    themeLayer.id = 'browser-skin-theme-layer';
    document.documentElement.appendChild(themeLayer);
    this.elements.themeLayer = themeLayer;
    
    const customBg = document.createElement('div');
    customBg.id = 'browser-skin-custom-bg';
    themeLayer.appendChild(customBg);
    this.elements.customBg = customBg;
  }
  
  createLampCord() {
    const rope = document.createElement('div');
    rope.id = 'browser-skin-lamp-rope';
    rope.innerHTML = '<div class="lamp-bulb"></div>';
    document.body.appendChild(rope);
    this.elements.lampRope = rope;
    this.elements.lampBulb = rope.querySelector('.lamp-bulb');
    
    rope.addEventListener('click', () => this.toggleLight());
  }
  
  loadSettings() {
    chrome.storage.sync.get(['currentTheme', 'customBackground', 'opacity', 'brightness', 'effectEnabled'], (result) => {
      if (result.currentTheme) this.currentTheme = result.currentTheme;
      if (result.customBackground) this.customBackground = result.customBackground;
      if (result.opacity !== undefined) this.opacity = result.opacity;
      if (result.brightness !== undefined) this.brightness = result.brightness;
      if (result.effectEnabled !== undefined) this.effectEnabled = result.effectEnabled;
      
      this.applyTheme(this.currentTheme);
      this.applyCustomBackground();
      this.updateLampRopeHeight();
    });
  }
  
  attachEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    chrome.storage.onChanged((changes, namespace) => {
      if (namespace === 'sync') {
        if (changes.currentTheme) this.applyTheme(changes.currentTheme.newValue);
        if (changes.customBackground) {
          this.customBackground = changes.customBackground.newValue;
          this.applyCustomBackground();
        }
        if (changes.opacity !== undefined) {
          this.opacity = changes.opacity.newValue;
          this.applyCustomBackground();
        }
        if (changes.brightness !== undefined) {
          this.brightness = changes.brightness.newValue;
          this.applyCustomBackground();
        }
        if (changes.effectEnabled !== undefined) {
          this.effectEnabled = changes.effectEnabled.newValue;
        }
      }
    });
  }
  
  handleKeyPress(e) {
    if (!this.effectEnabled || e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
      const now = Date.now();
      if (now - this.lastKeyTime < 300) {
        this.keyStreak++;
      } else {
        this.keyStreak = 1;
      }
      this.lastKeyTime = now;
      
      if (this.keyStreak % 3 === 0) {
        this.createParticle(e.target);
      }
      if (this.keyStreak % 5 === 0) {
        this.createRipple(e.target);
      }
      if (this.keyStreak % 8 === 0) {
        this.createGlowRing(e.target);
      }
    }
  }
  
  createParticle(target) {
    const particle = document.createElement('div');
    particle.className = 'skin-particle';
    const hue = Math.floor(Math.random() * 360);
    const size = Math.random() * 8 + 4;
    const tx = (Math.random() - 0.5) * 120;
    const ty = (Math.random() - 0.5) * 120;
    
    particle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${0.8 + Math.random() * 0.4}s`;
    
    const rect = target.getBoundingClientRect();
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
  
  createRipple(target) {
    const ripple = document.createElement('div');
    ripple.className = 'skin-ripple';
    const hue = Math.floor(Math.random() * 360);
    const size = 60 + Math.random() * 40;
    
    ripple.style.color = `hsl(${hue}, 100%, 70%)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    
    const rect = target.getBoundingClientRect();
    ripple.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
    
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  }
  
  createGlowRing(target) {
    const glowRing = document.createElement('div');
    const id = `glow-ring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    glowRing.id = id;
    glowRing.className = 'skin-glow-ring';
    const hue = Math.floor(Math.random() * 360);
    const size = 80 + Math.random() * 60;
    
    glowRing.style.color = `hsl(${hue}, 100%, 70%)`;
    glowRing.style.width = `${size}px`;
    glowRing.style.height = `${size}px`;
    
    const rect = target.getBoundingClientRect();
    glowRing.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
    glowRing.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
    
    document.body.appendChild(glowRing);
    setTimeout(() => glowRing.remove(), 1500);
  }
  
  toggleLight() {
    this.lightOn = !this.lightOn;
    document.body.classList.toggle('light-off', !this.lightOn);
    this.updateLampRopeHeight();
    chrome.storage.sync.set({ lightOn: this.lightOn });
  }
  
  updateLampRopeHeight() {
    const ropeHeight = this.lightOn ? 180 : 240;
    if (this.elements.lampRope) {
      this.elements.lampRope.style.height = `${ropeHeight}px`;
    }
  }
  
  applyTheme(themeName) {
    this.currentTheme = themeName;
    if (this.elements.themeLayer) {
      this.elements.themeLayer.className = 'theme-layer';
      this.elements.themeLayer.classList.add(`theme-${themeName}`);
    }
  }
  
  applyCustomBackground() {
    if (this.elements.customBg) {
      if (this.customBackground) {
        this.elements.customBg.style.backgroundImage = `url("${this.customBackground}")`;
        this.elements.customBg.style.opacity = this.opacity.toString();
        this.elements.customBg.style.filter = `brightness(${this.brightness})`;
        this.elements.customBg.style.display = 'block';
      } else {
        this.elements.customBg.style.display = 'none';
      }
    }
  }
}

// 启动插件
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new BrowserSkinExtension());
} else {
  new BrowserSkinExtension();
}
