// 浏览器换肤插件 - 后台服务 worker
// 插件安装时初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('浏览器换肤插件已安装');
  // 设置默认值
  chrome.storage.sync.set({
    currentTheme: 'classic',
    customBackground: '',
    opacity: 100,
    brightness: 1.0,
    maskStyle: 'none',
    typingEffectsEnabled: true,
    lampEnabled: true
  });
  // 创建右键菜单
  createContextMenus();
});

// 创建右键菜单
function createContextMenus() {
  // 清理现有菜单
  chrome.contextMenus.removeAll(() => {
    // 主题切换菜单
    chrome.contextMenus.create({
      id: 'change-theme',
      title: '切换主题',
      contexts: ['page']
    });
    // 主题子菜单
    const themes = [
      { id: 'theme-classic', title: '经典主题' },
      { id: 'theme-retro', title: '复古主题' },
      { id: 'theme-clean', title: '清醒主题' },
      { id: 'theme-parchment', title: '羊皮纸主题' },
      { id: 'theme-dark', title: '深色主题' },
      { id: 'theme-nature', title: '自然主题' },
      { id: 'theme-ocean', title: '海洋主题' },
      { id: 'theme-sunset', title: '日落主题' }
    ];
    themes.forEach(theme => {
      chrome.contextMenus.create({
        id: theme.id,
        parentId: 'change-theme',
        title: theme.title,
        contexts: ['page']
      });
    });
    // 分隔符
    chrome.contextMenus.create({
      type: 'separator',
      parentId: 'change-theme',
      contexts: ['page']
    });
    // 随机主题
    chrome.contextMenus.create({
      id: 'theme-random',
      parentId: 'change-theme',
      title: '随机主题',
      contexts: ['page']
    });
    // 其他功能菜单
    chrome.contextMenus.create({
      id: 'toggle-effects',
      title: '切换动效',
      contexts: ['page']
    });
    chrome.contextMenus.create({
      id: 'toggle-lamp',
      title: '显示/隐藏灯绳',
      contexts: ['page']
    });
  });
}

// 监听右键菜单点击 - ✅ 修复：添加 API 可用性检查
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId.startsWith('theme-')) {
      handleThemeChange(info.menuItemId, tab);
    } else if (info.menuItemId === 'toggle-effects') {
      toggleTypingEffects(tab);
    } else if (info.menuItemId === 'toggle-lamp') {
      toggleLamp(tab);
    }
  });
}

// 处理主题切换
function handleThemeChange(menuItemId, tab) {
  if (menuItemId === 'theme-random') {
    // 随机主题
    const themes = ['classic', 'retro', 'clean', 'parchment', 'dark', 'nature', 'ocean', 'sunset'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    chrome.storage.sync.set({ currentTheme: randomTheme });
    // 发送消息给内容脚本
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'themeChanged',
        theme: randomTheme
      });
    }
  } else {
    // 特定主题
    const themeMap = {
      'theme-classic': 'classic',
      'theme-retro': 'retro',
      'theme-clean': 'clean',
      'theme-parchment': 'parchment',
      'theme-dark': 'dark',
      'theme-nature': 'nature',
      'theme-ocean': 'ocean',
      'theme-sunset': 'sunset'
    };
    const theme = themeMap[menuItemId];
    if (theme) {
      chrome.storage.sync.set({ currentTheme: theme });
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'themeChanged',
          theme: theme
        });
      }
    }
  }
}

// 切换打字动效
function toggleTypingEffects(tab) {
  chrome.storage.sync.get(['typingEffectsEnabled'], (result) => {
    const newState = !result.typingEffectsEnabled;
    chrome.storage.sync.set({ typingEffectsEnabled: newState });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'toggleEffects',
        enabled: newState
      });
    }
  });
}

// 切换灯绳显示
function toggleLamp(tab) {
  chrome.storage.sync.get(['lampEnabled'], (result) => {
    const newState = !result.lampEnabled;
    chrome.storage.sync.set({ lampEnabled: newState });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'toggleLamp',
        enabled: newState
      });
    }
  });
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request);
  switch (request.action) {
    case 'getSettings':
      chrome.storage.sync.get([
        'currentTheme',
        'customBackground',
        'opacity',
        'brightness',
        'maskStyle',
        'typingEffectsEnabled',
        'lampEnabled'
      ], (result) => {
        sendResponse(result);
      });
      return true; // 保持消息通道开放
    case 'updateSettings':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true });
      });
      return true;
    case 'searchImage':
      searchUnsplashImage(request.query, sendResponse);
      return true;
    case 'resetToDefault':
      chrome.storage.sync.set({
        currentTheme: 'classic',
        customBackground: '',
        opacity: 100,
        brightness: 1.0,
        maskStyle: 'none'
      }, () => {
        sendResponse({ success: true });
      });
      return true;
  }
});

// 搜索 Unsplash 图片
async function searchUnsplashImage(query, sendResponse) {
  try {
    // Unsplash API（需要替换为您的 API 密钥）
    const apiKey = 'YOUR_UNSPLASH_API_KEY'; // 注意：需要替换为真实 API 密钥
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=10&client_id=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const images = data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        description: photo.description || photo.alt_description || 'Unsplash Image',
        author: photo.user.name,
        authorUrl: photo.user.links.html
      }));
      sendResponse({ success: true, images });
    } else {
      sendResponse({ success: false, error: '未找到相关图片' });
    }
  } catch (error) {
    console.error('搜索图片失败:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // 页面加载完成后，可以发送初始化消息
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, {
        action: 'pageLoaded'
      }).catch(() => {
        // 忽略错误（可能是内容脚本未加载）
      });
    }, 1000);
  }
});

// 导出功能（如果需要）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleThemeChange,
    toggleTypingEffects,
    toggleLamp,
    searchUnsplashImage
  };
}
