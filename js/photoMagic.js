/**
 * photoMagic.js — Magical Interactive Hover Animations for Photo Gallery
 * For My Didu (Prishu) website
 *
 * Strategy:
 *  - Observes #gallery-grid for new .photo-card elements (re-rendered on filter)
 *  - Each photo gets a particle canvas + emoji overlay on hover
 *  - Per-photo theme driven by photo ID / category
 *  - Pure CSS keyframes + lightweight JS canvas for particles
 *  - Touch-friendly: works on tap (toggles on/off)
 *  - Preserves lightbox click, existing styles, and all photo paths
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     PHOTO THEME MAP  (keyed by photo id)
     Each theme defines the particle set and
     the CSS animation class added on hover.
  ───────────────────────────────────────── */
  const THEMES = {
    1: { // Celebration Vibes ✨
      name:      'celebration',
      particles: ['🎉','🎊','✨','🎈','💛','🎶','⭐'],
      colors:    ['#FFD700','#FF6B6B','#FF4D6D','#FFF','#FFB347'],
      shapes:    ['circle','star'],
      count:     18,
      speed:     'fast',
    },
    2: { // Crazy & Cute 😂
      name:      'funny',
      particles: ['😂','🤣','✨','💥','⭐','🎉','😜'],
      colors:    ['#FFD166','#FF4D6D','#C77DFF','#06D6A0'],
      shapes:    ['circle'],
      count:     14,
      speed:     'medium',
    },
    3: { // My Prishu 🌸
      name:      'blossom',
      particles: ['🌸','💕','🌺','✨','💖','🦋'],
      colors:    ['#FF85A1','#FFB3C1','#FFC2D1','#fff','#C77DFF'],
      shapes:    ['petal','circle'],
      count:     16,
      speed:     'slow',
    },
    4: { // Simply Beautiful 💖
      name:      'butterfly',
      particles: ['🦋','🌸','💖','✨','🌺','💕'],
      colors:    ['#C77DFF','#FF85A1','#FFD166','#fff'],
      shapes:    ['petal','circle'],
      count:     14,
      speed:     'slow',
    },
    5: { // Sunshine & Smiles ☀️
      name:      'sunshine',
      particles: ['☀️','✨','⭐','💛','🌟','😊','🌼'],
      colors:    ['#FFD700','#FFB347','#FFF','#FFFACD','#FFEAA7'],
      shapes:    ['star','circle'],
      count:     16,
      speed:     'medium',
    },
    6: { // Prishu's Glow ✨
      name:      'glam',
      particles: ['✨','💎','⭐','💜','🌟','👑','💫'],
      colors:    ['#C77DFF','#FFD700','#fff','#FF85A1','#E0AAFF'],
      shapes:    ['star','circle'],
      count:     20,
      speed:     'medium',
    },
    7: { // Forever Favourite 💕
      name:      'hearts',
      particles: ['💕','❤️','💖','🌸','✨','💗','💓'],
      colors:    ['#FF4D6D','#FF85A1','#FFB3C1','#FFF0F3'],
      shapes:    ['heart','circle'],
      count:     16,
      speed:     'slow',
    },
  };

  // Default theme for any unlisted photo
  const DEFAULT_THEME = {
    name:      'sparkle',
    particles: ['✨','💖','🌸','⭐','💫'],
    colors:    ['#FF4D6D','#FFB3C1','#C77DFF','#FFD700'],
    shapes:    ['circle','star'],
    count:     12,
    speed:     'medium',
  };

  /* ─────────────────────────────────────────
     PARTICLE ENGINE  (lightweight canvas)
  ───────────────────────────────────────── */
  class ParticleEngine {
    constructor(canvas, theme) {
      this.canvas  = canvas;
      this.ctx     = canvas.getContext('2d');
      this.theme   = theme;
      this.particles = [];
      this.running = false;
      this.raf     = null;
      this._resize();
    }

    _resize() {
      const parent = this.canvas.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      this.canvas.width  = r.width;
      this.canvas.height = r.height;
      this.W = r.width;
      this.H = r.height;
    }

    _spawn() {
      const theme = this.theme;
      const speedMult = { slow: 0.6, medium: 1.0, fast: 1.5 }[theme.speed] ?? 1;
      const count = theme.count;

      this.particles = [];
      for (let i = 0; i < count; i++) {
        const isEmoji = Math.random() < 0.6;
        const emoji   = theme.particles[Math.floor(Math.random() * theme.particles.length)];
        const color   = theme.colors[Math.floor(Math.random() * theme.colors.length)];
        const shape   = theme.shapes[Math.floor(Math.random() * theme.shapes.length)];

        this.particles.push({
          x:    Math.random() * this.W,
          y:    this.H + Math.random() * 20,    // start just below bottom edge
          vx:   (Math.random() - 0.5) * 1.8 * speedMult,
          vy:  -(0.8 + Math.random() * 2.2) * speedMult,
          size: 10 + Math.random() * 18,
          alpha: 0,
          alphaTarget: 0.7 + Math.random() * 0.3,
          rot:  Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.08,
          delay: Math.random() * 900,          // ms stagger
          born:  performance.now(),
          isEmoji,
          emoji,
          color,
          shape,
          life: 0,
          maxLife: 2200 + Math.random() * 1800, // ms alive
        });
      }
    }

    _drawHeart(ctx, x, y, size, alpha, color) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const s = size * 0.5;
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.3);
      ctx.bezierCurveTo(x - s, y + s * 0.7, x, y + s * 1.2, x, y + s * 1.2);
      ctx.bezierCurveTo(x, y + s * 1.2, x + s, y + s * 0.7, x + s, y + s * 0.3);
      ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
      ctx.fill();
      ctx.restore();
    }

    _drawStar(ctx, x, y, size, alpha, color) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const ia = a + (2 * Math.PI) / 10;
        if (i === 0) ctx.moveTo(x + size * Math.cos(a), y + size * Math.sin(a));
        else ctx.lineTo(x + size * Math.cos(a), y + size * Math.sin(a));
        ctx.lineTo(x + (size * 0.4) * Math.cos(ia), y + (size * 0.4) * Math.sin(ia));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    _drawPetal(ctx, x, y, size, alpha, color, rot) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.5, size * 0.35, size * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    _tick(now) {
      if (!this.running) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.W, this.H);

      for (const p of this.particles) {
        const age = now - p.born - p.delay;
        if (age < 0) continue;  // not yet born

        p.life = age;
        const lifeRatio = Math.min(1, age / p.maxLife);

        // Fade in fast, fade out slow
        const fadeIn  = Math.min(1, age / 300);
        const fadeOut = lifeRatio > 0.7 ? 1 - ((lifeRatio - 0.7) / 0.3) : 1;
        p.alpha = p.alphaTarget * fadeIn * fadeOut;

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;

        // Slight wobble in x
        p.x += Math.sin(age * 0.003 + p.rot) * 0.4;

        if (p.alpha <= 0.01) continue;

        ctx.save();
        if (p.isEmoji) {
          ctx.globalAlpha = p.alpha;
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillText(p.emoji, 0, 0);
        } else if (p.shape === 'heart') {
          this._drawHeart(ctx, p.x, p.y, p.size, p.alpha, p.color);
        } else if (p.shape === 'star') {
          this._drawStar(ctx, p.x, p.y, p.size * 0.5, p.alpha, p.color);
        } else if (p.shape === 'petal') {
          this._drawPetal(ctx, p.x, p.y, p.size, p.alpha, p.color, p.rot);
        } else {
          // circle
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Recycle dead particles with fresh position
        if (lifeRatio >= 1) {
          p.x = Math.random() * this.W;
          p.y = this.H + 5;
          p.born = now;
          p.life = 0;
          p.maxLife = 2200 + Math.random() * 1800;
          p.delay = Math.random() * 400;
          p.vx = (Math.random() - 0.5) * 1.8;
          p.vy = -(0.8 + Math.random() * 2.2);
          p.alpha = 0;
        }
      }

      this.raf = requestAnimationFrame((t) => this._tick(t));
    }

    start() {
      if (this.running) return;
      this.running = true;
      this._resize();
      this._spawn();
      this.raf = requestAnimationFrame((t) => this._tick(t));
    }

    stop() {
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
      // Fade out existing particles naturally — just clear after short delay
      setTimeout(() => {
        if (!this.running && this.ctx) {
          this.ctx.clearRect(0, 0, this.W, this.H);
        }
      }, 600);
    }
  }

  /* ─────────────────────────────────────────
     HOVER AURA  (CSS class-based glow ring)
  ───────────────────────────────────────── */
  const AURA_CLASSES = {
    celebration: 'pm-aura-gold',
    funny:       'pm-aura-rainbow',
    blossom:     'pm-aura-pink',
    butterfly:   'pm-aura-purple',
    sunshine:    'pm-aura-sun',
    glam:        'pm-aura-glam',
    hearts:      'pm-aura-rose',
    sparkle:     'pm-aura-pink',
  };

  /* ─────────────────────────────────────────
     ATTACH MAGIC to a single .photo-card
  ───────────────────────────────────────── */
  function attachMagic(card) {
    if (card.dataset.pmDone) return;  // idempotent
    card.dataset.pmDone = '1';

    // Determine photo id from data-index and the rendered photo list
    const photoId = parseInt(card.dataset.photoId || card.dataset.index || '0', 10) + 1;
    const theme   = THEMES[photoId] ?? DEFAULT_THEME;

    // The image container (has aspect-ratio:3/4)
    const imgWrap = card.querySelector('.relative.overflow-hidden');
    if (!imgWrap) return;

    // Add perspective to imgWrap for 3D tilt
    imgWrap.style.perspective = '800px';

    // ── Particle canvas overlay ──────────────
    const canvas = document.createElement('canvas');
    canvas.className = 'pm-particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    imgWrap.appendChild(canvas);

    const engine = new ParticleEngine(canvas, theme);

    // ── Aura class name ──────────────────────
    const auraClass = AURA_CLASSES[theme.name] ?? 'pm-aura-pink';

    // ── 3D tilt on mousemove ─────────────────
    let tiltRaf = null;
    function applyTilt(e) {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(() => {
        const rect = imgWrap.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5…0.5
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;
        const rx = ny * -12;   // tilt up/down
        const ry = nx *  12;   // tilt left/right
        imgWrap.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.06)`;
      });
    }

    function resetTilt() {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      imgWrap.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    }

    // ── Touch toggle ─────────────────────────
    let touchActive = false;

    // ── Enter ────────────────────────────────
    function onEnter() {
      card.classList.add('pm-active', auraClass);
      engine.start();
    }

    // ── Leave ────────────────────────────────
    function onLeave() {
      card.classList.remove('pm-active', auraClass);
      resetTilt();
      engine.stop();
    }

    // Mouse events
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove',  applyTilt);
    card.addEventListener('mouseleave', onLeave);

    // Touch events (tap to toggle)
    card.addEventListener('touchstart', (e) => {
      // Distinguish tap from scroll
      touchActive = !touchActive;
      if (touchActive) {
        onEnter();
      } else {
        onLeave();
      }
    }, { passive: true });

    // Ensure tilt resets on transition end too
    imgWrap.addEventListener('transitionend', () => {
      if (!card.classList.contains('pm-active')) {
        imgWrap.style.transform = '';
      }
    });
  }

  /* ─────────────────────────────────────────
     PATCH renderGallery to stamp photo IDs
  ───────────────────────────────────────── */
  function patchAppGallery() {
    // Wait for DiduApp to be initialised
    const tryPatch = setInterval(() => {
      if (!window.diduApp) return;
      clearInterval(tryPatch);

      const origRenderGallery = window.diduApp.renderGallery.bind(window.diduApp);
      window.diduApp.renderGallery = function () {
        origRenderGallery();
        // After re-render, stamp each card with the real photo id
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;
        const photos = this.currentCategory === 'All'
          ? this.data.photos
          : this.data.photos.filter(p => p.category === this.currentCategory);

        grid.querySelectorAll('.photo-card').forEach((card, i) => {
          const photo = photos[i];
          if (photo) card.dataset.photoId = photo.id;
          // Reset pm-done so we re-attach after filter re-render
          delete card.dataset.pmDone;
        });
        attachAllCards();
      };
    }, 80);
  }

  /* ─────────────────────────────────────────
     ATTACH to all current cards
  ───────────────────────────────────────── */
  function attachAllCards() {
    document.querySelectorAll('#gallery-grid .photo-card').forEach(attachMagic);
  }

  /* ─────────────────────────────────────────
     MutationObserver — catches initial render
  ───────────────────────────────────────── */
  function observe() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    const obs = new MutationObserver(() => attachAllCards());
    obs.observe(grid, { childList: true });
    attachAllCards(); // run once immediately (in case already rendered)
  }

  /* ─────────────────────────────────────────
     BOOTSTRAP
  ───────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      patchAppGallery();
      observe();
    });
  } else {
    patchAppGallery();
    observe();
  }

})();
