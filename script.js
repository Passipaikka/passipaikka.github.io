// ── Forest silhouette generator ──────────────────────────────
(function () {
  const W = 1440, H = 300;

  // Xorshift32 seeded PRNG for reproducible shapes
  function makePrng(seed) {
    let s = seed >>> 0;
    return function () {
      s ^= s << 13; s ^= s >> 17; s ^= s << 5;
      return (s >>> 0) / 4294967295;
    };
  }

  function buildForest(opts) {
    const { baseY, minY, maxY, minStep, maxStep, seed } = opts;
    const rng = makePrng(seed);

    let x = 0, y = baseY;
    let d = `M0,${H} L0,${y}`;

    while (x < W) {
      const step = minStep + Math.floor(rng() * (maxStep - minStep + 1));
      const nextX = Math.min(x + step, W);

      const mid  = (minY + maxY) / 2;
      const pull = (mid - y) * 0.12;
      const noise = (rng() - 0.45) * (maxY - minY) * 0.5;
      let nextY = Math.round(y + pull + noise);
      nextY = Math.max(minY, Math.min(maxY, nextY));

      d += ` L${nextX},${y} L${nextX},${nextY}`;
      y = nextY;
      x = nextX;
    }

    d += ` L${W},${H} Z`;
    return d;
  }

  document.getElementById('tree-back').setAttribute('d',
    buildForest({ baseY: 185, minY: 110, maxY: 200, minStep: 14, maxStep: 26, seed: 0x9e3779b9 })
  );
  document.getElementById('tree-mid2').setAttribute('d',
    buildForest({ baseY: 185, minY: 90,  maxY: 200, minStep: 10, maxStep: 20, seed: 0xf0e1d2c3 })
  );
  document.getElementById('tree-mid').setAttribute('d',
    buildForest({ baseY: 205, minY: 130, maxY: 220, minStep: 8,  maxStep: 16, seed: 0x6c62272e })
  );
  document.getElementById('tree-front').setAttribute('d',
    buildForest({ baseY: 220, minY: 155, maxY: 240, minStep: 7,  maxStep: 14, seed: 0xdeadbeef })
  );
})();

// ── Easter egg ───────────────────────────────────────────────
(function () {
  const trigger = document.getElementById('crosshair');
  const egg     = document.getElementById('egg');
  const eggImg  = egg.querySelector('img');
  let timer = null;

  trigger.addEventListener('click', function () {
    if (egg.classList.contains('active')) return;

    // Centre the image over the crosshair
    const rect = trigger.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    eggImg.style.left = cx + 'px';
    eggImg.style.top  = cy + 'px';

    egg.classList.add('active');
    // Restart CSS animation
    egg.style.animation = 'none';
    void egg.offsetWidth;
    egg.style.animation = '';

    clearTimeout(timer);
    timer = setTimeout(function () {
      egg.classList.remove('active');
    }, 2400);
  });

  egg.addEventListener('click', function () {
    clearTimeout(timer);
    egg.classList.remove('active');
  });
})();
// Positions fixed in px at load time so resizing the window doesn't move them
(function () {
  const container = document.getElementById('stars');
  const count = 120;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.style.left   = Math.round(Math.random() * vw) + 'px';
    star.style.top    = Math.round(Math.random() * vh * 0.72) + 'px';
    star.style.setProperty('--d', (2.5 + Math.random() * 4).toFixed(1) + 's');
    star.style.animationDelay = (Math.random() * 5).toFixed(1) + 's';
    const size = Math.random() < 0.15 ? 3 : 2;
    star.style.width  = size + 'px';
    star.style.height = size + 'px';
    container.appendChild(star);
  }
})();
