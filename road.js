(function () {
  'use strict';

  const LAZY_MARGIN = 600;
  const SCROLL_AMOUNT = 460;
  let games = [];
  let isDragging = false;
  let dragStartX = 0;
  let scrollStartX = 0;

  // --- Stars ---
  function createStars() {
    const container = document.getElementById('stars');
    const count = Math.min(200, Math.floor(window.innerWidth * 0.15));
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 60 + '%';
      const size = Math.random() * 2 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
      star.style.setProperty('--from-op', (0.1 + Math.random() * 0.3).toFixed(2));
      star.style.setProperty('--to-op', (0.7 + Math.random() * 0.3).toFixed(2));
      star.style.animationDelay = (Math.random() * 4) + 's';
      container.appendChild(star);
    }
  }

  // --- Fetch games ---
  async function loadGames() {
    try {
      const resp = await fetch('games.json?v=' + Date.now());
      games = await resp.json();
    } catch (e) {
      games = [];
    }
    renderRoad();
    setupLazyLoading();
    handleDeepLink();
  }

  // --- Render booths ---
  function renderRoad() {
    const road = document.getElementById('road');
    road.innerHTML = '';

    if (games.length === 0) {
      road.innerHTML = `
        <div id="empty-state">
          <h2>The midway is quiet...</h2>
          <p>No games yet! Be the first to suggest one.</p>
          <p><a href="https://github.com/r3dial/LatentCarnival/issues/new" target="_blank" rel="noopener">Open an issue</a> with your game idea.</p>
        </div>`;
      return;
    }

    games.forEach(function (game) {
      var booth = document.createElement('div');
      booth.className = 'booth';
      booth.id = 'booth-' + game.id;
      booth.dataset.gameId = game.id;
      booth.dataset.file = game.file;

      booth.innerHTML =
        '<div class="booth-awning"></div>' +
        '<div class="booth-sign">' +
          '<div class="booth-name">' + escapeHtml(game.name) + '</div>' +
          '<div class="booth-desc">' + escapeHtml(game.description) + '</div>' +
        '</div>' +
        '<div class="booth-frame">' +
          '<div class="booth-curtain">' +
            '<div class="curtain-emoji">🎪</div>' +
            '<div class="curtain-text">Step right up!</div>' +
          '</div>' +
          '<div class="booth-score"></div>' +
        '</div>';

      road.appendChild(booth);
    });
  }

  // --- Lazy loading ---
  function setupLazyLoading() {
    var booths = document.querySelectorAll('.booth');
    if (booths.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var booth = entry.target;
        if (booth.dataset.loaded) return;
        booth.dataset.loaded = 'true';

        var frame = booth.querySelector('.booth-frame');
        var curtain = booth.querySelector('.booth-curtain');
        var file = booth.dataset.file;

        var iframe = document.createElement('iframe');
        iframe.sandbox = 'allow-scripts';
        iframe.loading = 'lazy';
        iframe.src = 'games/' + file;
        iframe.title = booth.querySelector('.booth-name').textContent;

        iframe.onload = function () {
          curtain.classList.add('open');
        };

        frame.appendChild(iframe);
      });
    }, {
      root: document.getElementById('road-container'),
      rootMargin: '0px ' + LAZY_MARGIN + 'px'
    });

    booths.forEach(function (b) { observer.observe(b); });
  }

  // --- Scroll controls ---
  function setupScrolling() {
    var container = document.getElementById('road-container');

    // Mouse wheel → horizontal scroll
    container.addEventListener('wheel', function (e) {
      if (window.innerWidth <= 768) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
    }, { passive: false });

    // Drag scrolling
    container.addEventListener('mousedown', function (e) {
      if (window.innerWidth <= 768) return;
      isDragging = true;
      dragStartX = e.pageX;
      scrollStartX = container.scrollLeft;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.pageX - dragStartX;
      container.scrollLeft = scrollStartX - dx;
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
      container.style.cursor = '';
    });

    // Nav arrows
    document.getElementById('scroll-left').addEventListener('click', function () {
      container.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    });

    document.getElementById('scroll-right').addEventListener('click', function () {
      container.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        container.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        container.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
      }
    });
  }

  // --- postMessage listener ---
  function setupMessageListener() {
    window.addEventListener('message', function (e) {
      if (!e.data || typeof e.data !== 'object') return;

      var type = e.data.type;
      var gameId = e.data.gameId;
      var score = e.data.score;

      if ((type === 'game:score' || type === 'game:complete') && gameId) {
        var booth = document.getElementById('booth-' + gameId);
        if (!booth) return;
        var badge = booth.querySelector('.booth-score');
        if (badge) {
          badge.textContent = 'Score: ' + score;
          badge.classList.add('visible');
        }
      }
    });
  }

  // --- Deep linking ---
  function handleDeepLink() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return;
    var booth = document.getElementById('booth-' + hash);
    if (!booth) return;
    setTimeout(function () {
      booth.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 500);
  }

  window.addEventListener('hashchange', handleDeepLink);

  // --- Utility ---
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Init ---
  createStars();
  setupScrolling();
  setupMessageListener();
  loadGames();
})();
