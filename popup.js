Settings.theme = themeId;
    this.updatePreview();
}

  initEventListeners() {
    document.getElementById('search-btn').addEventListener('click', () => this.searchImages());
    document.getElementById('image-search').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchImages();
      }
    });
    document.getElementById('apply-btn').addEventListener('click', () => this.applySettings());
    document.getElementById('reset-btn').addEventListener('click', () => this.resetToDefault());
    document.getElementById('test-effects').addEventListener('click', () => this.testEffects());

    document.getElementById('typing-effects-toggle').addEventListener('change', (e) => {
      this.currentSettings.typingEffectsEnabled = e.target.checked;
    });
    document.getElementById('lamp-toggle').addEventListener('change', (e) =>// 浏览器换肤插件 - 弹出窗口逻辑

class PopupManager {
  constructor() {
    this.currentSettings = {
      theme: 'classic',
      customBackground: '',
      opacity: 100,
      brightness: 1.0,
      maskStyle: 'none',
      typingEffectsEnabled: true,
      lampEnabled: true
    };
    
    this.selectedImage = null;
    this.imageResults = [];
    
    this.initialize();
  }
  
  // 初始化
  async initialize() {
    // 加载当前设置
    await this.loadSettings();
    
    // 初始化UI
    this.initThemeGrid();
    this.initEventListeners();
    this.initSliders();
    this.updatePreview();
    
    console.log('弹出窗口已初始化');
  }
  
  // 加载设置
  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      
      if (response) {
        this.currentSettings = {
          theme: response.currentTheme || 'classic',
          customBackground: response.customBackground || '',
          opacity: response.opacity !== undefined ? response.opacity : 100,
          brightness: response.brightness !== undefined ? response.brightness : 1.0,
          maskStyle: response.maskStyle || 'none',
          typingEffectsEnabled: response.typingEffectsEnabled !== false,
          lampEnabled: response.lampEnabled !== false
        };
        
        this.updateUIFromSettings();
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      this.showStatus('加载设置失败，使用默认值', 'error');
    }
  }
  
  // 更新UI从设置
  updateUIFromSettings() {
    // 更新主题按钮
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.theme === this.currentSettings.theme) {
        btn.classList.add('active');
      }
    });
    
    // 更新滑块
    document.getElementById('opacity-slider').value = this.currentSettings.opacity;
    document.getElementById('opacity-value').textContent = `${this.currentSettings.opacity}%`;
    
    document.getElementById('brightness-slider').value = this.currentSettings.brightness;
    document.getElementById('brightness-value').textContent = this.currentSettings.brightness.toFixed(1);
    
    // 更新下拉选择
    document.getElementById('mask-style').value = this.currentSettings.maskStyle;
    
    // 更新开关
    document.getElementById('typing-effects-toggle').checked = this.currentSettings.typingEffectsEnabled;
    document.getElementById('lamp-toggle').checked = this.currentSettings.lampEnabled;
    
    // 如果有自定义背景，显示预览
    if (this.currentSettings.customBackground) {
      this.showSelectedImagePreview(this.currentSettings.customBackground);
    }
  }
  
  // 初始化主题网格
  initThemeGrid() {
    const themeGrid = document.getElementById('theme-grid');
    
    const themes = [
      {
        id: 'classic',
        name: '经典',
        desc: '优雅紫色渐变',
        color1: '#6d28d9',
        color2: '#8b5cf6'
      },
      {
        id: 'retro',
        name: '复古',
        desc: '怀旧暖色调',
        color1: '#92400e',
        color2: '#b45309'
      },
      {
        id: 'clean',
        name: '清醒',
        desc: '简约灰白色',
        color1: '#374151',
        color2: '#6b7280'
      },
      {
        id: 'parchment',
        name: '羊皮纸',
        desc: '温暖米黄色',
        color1: '#fef3c7',
        color2: '#fde68a'
      },
      {
        id: 'dark',
        name: '深色',
        desc: '深邃蓝黑色',
        color1: '#1e293b',
        color2: '#0f172a'
      },
      {
        id: 'nature',
        name: '自然',
        desc: '清新绿色系',
        color1: '#065f46',
        color2: '#10b981'
      },
      {
        id: 'ocean',
        name: '海洋',
        desc: '蔚蓝海洋色',
        color1: '#0369a1',
        color2: '#0ea5e9'
      },
      {
        id: 'sunset',
        name: '日落',
        desc: '橙红蓝渐变',
        color1: '#dc2626',
        color2: '#f97316',
        color3: '#3b82f6'
      }
    ];
    
    themeGrid.innerHTML = themes.map(theme => `
      <button class="theme-btn theme-${theme.id}" data-theme="${theme.id}">
        <span class="theme-name">${theme.name}</span>
        <span class="theme-desc">${theme.desc}</span>
      </button>
    `).join('');
    
    // 添加点击事件
    themeGrid.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => this.selectTheme(btn.dataset.theme));
    });
  }
  
  // 选择主题
  selectTheme(themeId) {
    // 更新按钮状态
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新设置
    this.currentSettings.theme = themeId;
    this.updatePreview();
  }
  
  // 初始化事件监听器
  initEventListeners() {
    // 搜索按钮
    document.getElementById('search-btn').addEventListener('click', () => this.searchImages());
    
    // 图片搜索输入框（回车搜索）
    document.getElementById('image-search').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchImages();
      }
    });
    
    // 应用设置按钮
    document.getElementById('apply-btn').addEventListener('click', () => this.applySettings());
    
    // 重置按钮
    document.getElementById('reset-btn').addEventListener('click', () => this.resetToDefault());
    
    // 测试动效按钮
    document.getElementById('test-effects').addEventListener('click', () => this.testEffects());
    
    // 功能开关
    document.getElementById('typing-effects-toggle').addEventListener('change', (e) => {
      this.currentSettings.typingEffectsEnabled = e.target.checked;
    });
    
    document.getElementById('lamp-toggle').addEventListener('change', (e) => {
      this.currentSettings.lampEnabled = e.target.checked;
    });
    
    // 蒙版样式选择
    document.getElementById('mask-style').addEventListener('change', (e) => {
      this.currentSettings.maskStyle = e.target.value;
      this.updatePreview();
    });
  }
  
  // 初始化滑块
  initSliders() {
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    
    opacitySlider.addEventListener('input', (e) => {
      const value = e.target.value;
      opacityValue.textContent = `${value}%`;
      this.currentSettings.opacity = parseInt(value);
      this.updatePreview();
    });
    
    const brightnessSlider = document.getElementById('brightness-slider');
    const brightnessValue = document.getElementById('brightness-value');
    
    brightnessSlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      brightnessValue.textContent = value.toFixed(1);
      this.currentSettings.brightness = value;
      this.updatePreview();
    });
  }
  
  // 搜索图片
  async searchImages() {
    const query = document.getElementById('image-search').value.trim();
    
    if (!query) {
      this.showStatus('请输入搜索关键词', 'error');
      return;
    }
    
    this.showStatus('搜索中...', 'info');
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'searchImage',
        query: query
      });
      
      if (response.success) {
        this.imageResults = response.images;
        this.displayImageResults();
        this.showStatus(`找到 ${response.images.length} 张图片`, 'success');
      } else {
        this.showStatus(response.error || '搜索失败', 'error');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      this.showStatus('搜索失败，请检查网络连接', 'error');
      
      // 显示示例图片（用于测试）
      this.showSampleImages();
    }
  }
  
  // 显示图片搜索结果
  displayImageResults() {
    const resultsContainer = document.getElementById('image-results');
    
    if (this.imageResults.length === 0) {
      resultsContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">未找到相关图片</p>';
      return;
    }
    
    resultsContainer.innerHTML = this.imageResults.map((image, index) => `
      <div class="image-result ${this.selectedImage === image.url ? 'selected' : ''}" 
           data-index="${index}" 
           data-url="${image.url}"
           title="${image.description}">
        <img src="${image.thumb || image.url}" alt="${image.description}" loading="lazy">
      </div>
    `).join('');
    
    // 添加点击事件
    resultsContainer.querySelectorAll('.image-result').forEach(item => {
      item.addEventListener('click', () => this.selectImage(item));
    });
  }
  
  // 显示示例图片（用于测试）
  showSampleImages() {
    const sampleImages = [
      {
        url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
        thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=150&fit=crop',
        description: '自然风景'
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=150&fit=crop',
        description: '星空'
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
        thumb: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=150&fit=crop',
        description: '城市夜景'
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=150&fit=crop',
        description: '海洋'
      }
    ];
    
    this.imageResults = sampleImages;
    this.displayImageResults();
    this.showStatus('显示示例图片（需要配置API密钥才能真实搜索）', 'info');
  }
  
  // 选择图片
  selectImage(imageElement) {
    // 移除之前的选择
    document.querySelectorAll('.image-result').forEach(item => {
      item.classList.remove('selected');
    });
    
    // 添加当前选择
    imageElement.classList.add('selected');
    
    // 保存选择的图片
    const url = imageElement.dataset.url;
    this.selectedImage = url;
    this.currentSettings.customBackground = url;
    
    // 显示预览
    this.showSelectedImagePreview(url);
    this.updatePreview();
  }
  
  // 显示选择的图片预览
  showSelectedImagePreview(url) {
    const resultsContainer = document.getElementById('image-results');
    
    // 如果没有图片结果，创建一个预览区域
    if (this.imageResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="image-result selected" style="width: 100%; max-width: 300px; margin: 0 auto;">
          <img src="${url}" alt="已选择图片" style="height: 150px;">
          <p style="text-align: center; margin-top: 10px; color: #6b7280;">已选择图片</p>
        </div>
      `;
    }
  }
  
  // 更新预览
  updatePreview() {
    const previewBox = document.getElementById('preview-box');
    
    // 设置背景
    if (this.currentSettings.customBackground) {
      previewBox.style.backgroundImage = `url("${this.currentSettings.customBackground}")`;
      previewBox.style.backgroundSize = 'cover';
      previewBox.style.backgroundPosition = 'center';
      previewBox.style.opacity = `${this.currentSettings.opacity / 100}`;
      previewBox.style.filter = `brightness(${this.currentSettings.brightness})`;
    } else {
      // 使用主题颜色
      const themeColors = {
        classic: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
        retro: 'linear-gradient(135deg, #92400e, #b45309)',
        clean: 'linear-gradient(135deg, #374151, #6b7280)',
        parchment: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        dark: 'linear-gradient(135deg, #1e293b, #0f172a)',
        nature: 'linear-gradient(135deg, #065f46, #10b981)',
        ocean: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
        sunset: 'linear-gradient(135deg, #dc2626, #f97316, #3b82f6)'
      };
      
      previewBox.style.background = themeColors[this.currentSettings.theme] || themeColors.classic;
      previewBox.style.backgroundImage = '';
      previewBox.style.opacity = '1';
      previewBox.style.filter = 'none';
    }
    
    // 添加蒙版效果预览
    if (this.currentSettings.maskStyle === 'frosted') {
      previewBox.style.backdropFilter = 'blur(5px)';
      previewBox.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    } else if (this.currentSettings.maskStyle === 'dark') {
      previewBox.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    } else {
      previewBox.style.backdropFilter = 'none';
      previewBox.style.backgroundColor = 'transparent';
    }
  }
  
  // 应用设置
  async applySettings() {
    this.showStatus('应用中...', 'info');
    
    try {
      const settingsToSave = {
        currentTheme: this.currentSettings.theme,
        customBackground: this.currentSettings.customBackground,
        opacity: this.currentSettings.opacity,
        brightness: this.currentSettings.brightness,
        maskStyle: this.currentSettings.maskStyle,
        typingEffectsEnabled: this.currentSettings.typingEffectsEnabled,
        lampEnabled: this.currentSettings.lampEnabled
      };
      
      const response = await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: settingsToSave
      });
      
      if (response && response.success) {
        this.showStatus('设置已应用成功！', 'success');
        
        // 3秒后关闭弹出窗口
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        this.showStatus('应用设置失败', 'error');
      }
    } catch (error) {
      console.error('应用设置失败:', error);
      this.showStatus('应用设置失败，请重试', 'error');
    }
  }
  
  // 重置为默认
  async resetToDefault() {
    if (!confirm('确定要恢复默认设置吗？')) {
      return;
    }
    
    this.showStatus('重置中...', 'info');
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'resetToDefault'
      });
      
      if (response && response.success) {
        // 重新加载设置
        await this.loadSettings();
        this.updatePreview();
        this.showStatus('已恢复默认设置', 'success');
      } else {
        this.showStatus('重置失败', 'error');
      }
    } catch (error) {
      console.error('重置失败:', error);
      this.showStatus('重置失败，请重试', 'error');
    }
  }
  
  // 测试动效
  testEffects() {
    this.showStatus('测试动效中...', 'info');
    
    // 在当前页面测试动效
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'testEffects'
        }, (response) => {
          if (chrome.runtime.lastError) {
            this.showStatus('请刷新页面后重试', 'error');
          } else {
            this.showStatus('动效测试已发送', 'success');
          }
        });
      }
    });
  }
  
  // 显示状态消息
  showStatus(message, type = 'info') {
    const statusElement = document.getElementById('status-message');
    
    statusElement.textContent = message;
    statusElement.className = `status-message status-${type}`;
    statusElement.style.display = 'block';
    
    // 3秒后自动隐藏（成功/错误消息）
    if (type !== 'info') {
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 3000);
    }
  }
}

// 初始化弹出窗口
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
