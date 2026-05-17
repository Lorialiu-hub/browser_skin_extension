/**
 * 浏览器换肤插件 - Content Script (完全修复版)
 * 修复内容：
 * 1. 所有 DOM 元素使用 class 而非 ID，与 styles.css 完全匹配
 * 2. 拉灯绳结构修正为三层嵌套
 * 3. 模板字符串变量插值补全
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
    // 创建主题层 - 使用 class 而非 ID
    const themeLayer = document.createElement('div');
    themeLayer.className = 'browser-skin-theme-layer';  // ✅ 修复：使用 class
    document.documentElement.appendChild(themeLayer);
    this.elements.themeLayer = themeLayer;
    
    // 创建自定义背景层 - 使用 class 而非 ID
    const customBg = document.createElement('div');
    customBg.className = 'browser-skin-custom-bg';  // ✅ 修复：使用 class
    themeLayer.appendChild(customBg);
    this.elements.customBg = customBg;
  }
  
  createEffectsContainer() {
    // 创建打字特效容器 - 使用 class
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'typing-effects-container';  // ✅ 修复：使用 class
    document.body.appendChild(effectsContainer);
    this.elements.effectsContainer = effectsContainer;
  }
  
  createLampCord() {
    // 创建外层容器 - 使用 class
    const lampContainer = document.createElement('div');
    lampContainer.className = 'browser-skin-lamp';  // ✅ 修复：添加外层容器
    document.body.appendChild(lampContainer);
    this.elements.lampContainer = lampContainer;
    
    // 创建绳子 - 使用 class
    const rope = document.createElement('div');
    rope.className = 'lamp-rope';  // ✅ 修复：添加 rope 类名
    lampContainer.appendChild(rope);
    this.elements.lampRope = rope;
    
    // 创建灯泡 - 使用 class
    const bulb = document.createElement('div');
    bulb.className = 'lamp-bulb lit';  // ✅ 修复：使用 class
    rope.appendChild(bulb);
    this.elements.lampBulb = bulb;
    
    // 绑定点击事件
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
    particle.className = 'typing-particle';  // ✅ 修复：使用正确的 class
    const hue = Math.floor(Math.random() * 360);
    const size = Math.random() * 8 + 4;
    const tx = (Math.random() - 0.5) * 120;
    const ty = (Math.random() - 0.5) * 120;
    
    // ✅ 修复：模板字符串变量插值补全
    particle.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${1 + Math.random()}s`;
    
    const rect = target.getBoundingClientRect();
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    this.elements.effectsContainer.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
  
  createRipple(target) {
    const ripple = document.createElement('div');
    ripple.className = 'typing-ripple';  // ✅ 修复：使用正确的 class
    const hue = Math.floor(Math.random() * 360);
    const size = 60 + Math.random() * 40;
    
    // ✅ 修复：模板字符串变量插值补全
    ripple.style.color = `hsl(${hue}, 100%, 70%)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    
    const rect = target.getBoundingClientRect();
    ripple.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
    
    this.elements.effectsContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  }
  
  createGlowRing(target) {
    const glowRing = document.createElement('div');
    glowRing.className = 'typing-glow-ring';  // ✅ 修复：使用正确的 class
    const id = `glow-ring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    glowRing.id = id;
    const hue = Math.floor(Math.random() * 360);
    const size = 80 + Math.random() * 60;
    
    // ✅ 修复：模板字符串变量插值补全
    glowRing.style.color = `hsl(${hue}, 100%, 70%)`;
    glowRing.style.width = `${size}px`;
    glowRing.style.height = `${size}px`;
    
    const rect = target.getBoundingClientRect();
    glowRing.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
    glowRing.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
    
    this.elements.effectsContainer.appendChild(glowRing);
    setTimeout(() => glowRing.remove(), 1500);
  }
  
  toggleLight() {
    this.lightOn = !this.lightOn;
    
    // 更新灯泡状态
    if (this.elements.lampBulb) {
      this.elements.lampBulb.classList.toggle('lit', this.lightOn);
    }
    
    // 更新绳子状态
    if (this.elements.lampRope) {
      this.elements.lampRope.classList.toggle('pulling', !this.lightOn);
    }
    
    this.updateLampRopeHeight();
    chrome.storage.sync.set({ lightOn: this.lightOn });
  }
  
  updateLampRopeHeight() {
    const ropeHeight = this.lightOn ? 60 : 80;  // ✅ 修复：使用正确的高度值
    if (this.elements.lampRope) {
      this.elements.lampRope.style.height = `${ropeHeight}px`;  // ✅ 修复：模板字符串补全
    }
  }
  
  applyTheme(themeName) {
    this.currentTheme = themeName;
    if (this.elements.themeLayer) {
      // 清除旧主题类名
      this.elements.themeLayer.className = 'browser-skin-theme-layer';
      // 添加新主题类名 - ✅ 修复：模板字符串补全
      this.elements.themeLayer.classList.add(`theme-${themeName}`);
    }
  }
  
  applyCustomBackground() {
    if (this.elements.customBg) {
      if (this.customBackground) {
        // ✅ 修复：模板字符串变量插值补全
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
