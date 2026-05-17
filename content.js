/**
 * 浏览器换肤插件 - Content Script (最终修复版)
 * 修复内容：
 * 1. 所有模板字符串变量插值补全（核心问题）
 * 2. DOM 元素使用正确的 class 名称
 * 3. 拉灯绳三层嵌套结构
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
    
    this.elements = {
      themeLayer: null,
      customBg: null,
      lampContainer: null,
      lampRope: null,
      lampBulb: null,
      effectsContainer: null
    };
    
    this.init();
  }
  
  init() {
    this.createThemeLayer();
    this.createEffectsContainer();
    this.createLampCord();
    this.loadSettings();
    this.attachEventListeners();
    console.log('✅ 浏览器换肤插件已加载');
  }
  
  createThemeLayer() {
    const themeLayer = document.createElement('div');
    themeLayer.className = 'browser-skin-theme-layer';
    document.documentElement.appendChild(themeLayer);
    this.elements.themeLayer = themeLayer;
    
    const customBg = document.createElement('div');
    customBg.className = 'browser-skin-custom-bg';
    themeLayer.appendChild(customBg);
    this.elements.customBg = customBg;
  }
  
  createEffectsContainer() {
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'typing-effects-container';
    document.body.appendChild(effectsContainer);
    this.elements.effectsContainer = effectsContainer;
  }
  
  createLampCord() {
    const lampContainer = document.createElement('div');
    lampContainer.className = 'browser-skin-lamp';
    document.body.appendChild(lampContainer);
    this.elements.lampContainer = lampContainer;
    
    const rope = document.createElement('div');
    rope.className = 'lamp-rope';
    lampContainer.appendChild(rope);
    this.elements.lampRope = rope;
    
    const bulb = document.createElement('div');
    bulb.className = 'lamp-bulb lit';
    rope.appendChild(bulb);
    this.elements.lampBulb = bulb;
    
    lampContainer.addEventListener('click', () => this.toggleLight());
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
    particle.className = 'typing-particle';
    const hue = Math.floor(Math.random() * 360);
    const size = Math.random() * 8 + 4;
    const tx = (Math.random() - 0.5) * 120;
    const ty = (Math.random() - 0.5) * 120;
    
    // ✅ 修复：补全所有变量插值
    particle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${1 + Math.random()}s`;
    
    const rect = target.getBoundingClientRect();
    particle.style.left = `${rect.x + rect.width / 2}px`;
    particle.style.top = `${rect.y + rect.height / 2}px`;
    
    this.elements.effectsContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
  
  createRipple(target) {
    const ripple = document.createElement('div');
    ripple.className = 'typing-ripple';
    const hue = Math.floor(Math.random() * 360);
    const size = 60 + Math.random() * 40;
    
    // ✅ 修复：补全所有变量插值
    ripple.style.color = `hsl(${hue}, 100%, 70%)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    
    const rect = target.getBoundingClientRect();
    ripple.style.left = `${rect.x + rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.y + rect.height / 2 - size / 2}px`;
    
    this.elements.effectsContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  }
  
  createGlowRing(target) {
    const glowRing = document.createElement('div');
    glowRing.className = 'typing-glow-ring';
    const hue = Math.floor(Math.random() * 360);
    const size = 80 + Math.random() * 60;
    
    // ✅ 修复：补全所有变量插值
    glowRing.style.color = `hsl(${hue}, 100%, 70%)`;
    glowRing.style.width = `${size}px`;
    glowRing.style.height = `${size}px`;
    
    const rect = target.getBoundingClientRect();
    glowRing.style.left = `${rect.x + rect.width / 2 - size / 2}px`;
    glowRing.style.top = `${rect.y + rect.height / 2 - size / 2}px`;
    
    this.elements.effectsContainer.appendChild(glowRing);
    setTimeout(() => glowRing.remove(), 150
