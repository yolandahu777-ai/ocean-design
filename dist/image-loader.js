/* Common image formats and responsive sizes for mobile and in-app browsers. */
(function () {
  var pending = new Set();

  window.preparePortfolioImage = function (image, source, options) {
    options = options || {};
    var asset = (window.portfolioImageAssets || {})[source];
    var fullSource = asset ? asset.src : source;
    var attempts = 0;
    var timer = null;
    var state = {image: image, retry: retry};

    function retry() {
      clearTimeout(timer);
      if (!image.isConnected) { pending.delete(state); return; }
      attempts += 1;
      // A failed srcset candidate must not keep overriding the retry URL.
      image.removeAttribute('srcset');
      image.src = fullSource + (fullSource.indexOf('?') === -1 ? '?' : '&') + 'retry=' + attempts;
    }

    image.addEventListener('load', function () {
      clearTimeout(timer);
      pending.delete(state);
    });
    image.addEventListener('error', function () {
      pending.add(state);
      if (attempts < 2) timer = setTimeout(retry, attempts ? 1800 : 600);
    });
    image.loading = options.eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (asset) {
      image.width = asset.width;
      image.height = asset.height;
      image.sizes = options.sizes || '(max-width: 700px) calc(100vw - 40px), 100vw';
      if (asset.srcset && options.responsive !== false) image.srcset = asset.srcset;
    }
    if (options.priority) image.setAttribute('fetchpriority', 'high');
    image.src = fullSource;
    return image;
  };

  window.portfolioImagePoster = function (source) {
    var asset = (window.portfolioImageAssets || {})[source];
    return asset ? asset.src : source;
  };

  window.addEventListener('online', function () {
    pending.forEach(function (state) {
      if (state.image.isConnected) state.retry();
      else pending.delete(state);
    });
  });
}());
