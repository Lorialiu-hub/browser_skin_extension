';
      return;
}

    resultsContainer.innerHTML = this.imageResults.map((image, index) => `
      <div class="image-result image-${index}"
           data-index="${index}"
           data-url="${image.url}"ion: '自然风景' },
      { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=150&fit=crop', description: '星空' },
      { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b', thumb: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=150&fit=crop', description: '城市夜景' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=150&fit=crop', description: '海洋' }
    ];
    this.imageResults = sampleImages;
    this.displayImageResults();
    this.showStatus('显示示例图片（需要配置 API 密钥才能真实搜索）', 'info');
  }

  selectImage(imageElement) {
    document.querySelectorAll('.image-result').forEach(item => {
      item.classList.remove('selected')











           title="${image.description}">
        <img src="${image.thumb}" alt="${image.description}" loading="lazy">
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.image-result').forEach(item => {
      item.addEventListener('click', () => this.selectImage(item));
    });
}

  showSampleImages() {
    const sampleImages = [
      { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b', thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=150&fit=crop', descript
















