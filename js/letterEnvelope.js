/**
 * Love Letter Envelope — Prishu Edition
 * ─────────────────────────────────────
 * NEW SEQUENCE (with exact timing):
 *
 *  t=0ms    → User clicks "Read Letter"
 *  t=0ms    → Large butterflies emerge from CLOSED envelope (on body canvas)
 *  t=0–3500ms → Butterflies fly FAR in different directions (visible 3+ sec)
 *  t=2600ms → Butterflies begin gradual fade-out
 *  t=3100ms → Envelope flap begins opening (slow, elegant)
 *  t=3100ms → Warm glow activates inside envelope
 *  t=3700ms → Modal overlay fades in
 *  t=3900ms → Letter card springs into view
 *  t=4200ms → Flower burst from envelope center
 *  t=4800ms → Ambient petals start (continuous while reading)
 *  t=6000ms → Pre-open canvas removed from DOM
 */

class LetterEnvelope {
  constructor() {
    this.letterData       = window.sisterData?.letter;
    this.particles        = [];           // in-modal canvas particles
    this._rafId           = null;
    this._ambientActive   = false;
    this._ambientTimer    = null;
    this._envelopeOrigin  = { x: 0, y: 0 };

    // Pre-open phase (body-level canvas)
    this._preCanvas       = null;
    this._preCtx          = null;
    this._preParticles    = [];
    this._preRafId        = null;

    this.init();
  }

  /* ════════════════════════════════════════════════════════════
     INIT
  ════════════════════════════════════════════════════════════ */
  init() {
    const container = document.getElementById('letter-container');
    if (!container || !this.letterData) return;

    container.innerHTML = `
      <div class="max-w-3xl mx-auto text-center">

        <!-- ── Envelope ── -->
        <div id="envelope-card" class="envelope-wrapper my-8">
          <div id="envelope" class="envelope flex items-center justify-center cursor-pointer group">
            <div class="envelope-flap"></div>
            <div class="envelope-pocket"></div>
            <div id="envelope-glow" class="envelope-glow"></div>
            <div class="envelope-letter-preview flex flex-col items-center justify-center">
              <span class="text-3xl mb-1">💌</span>
              <p class="font-bold text-rose-600 text-sm font-heading">Click To Open Letter</p>
              <p class="text-[10px] text-gray-400">For My Dearest Prishu</p>
            </div>
            <div class="absolute z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-700 to-pink-500 shadow-lg border-2 border-amber-300 flex items-center justify-center text-white text-lg font-bold">
              ❤️
            </div>
          </div>
        </div>

        <button id="open-letter-btn" class="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-rose-300/50 hover:scale-105 transition-all duration-300">
          <i class="fas fa-envelope-open mr-2"></i> Read My Letter
        </button>

        <!-- ══════════════════════════════════════════════
             FULL LETTER MODAL
        ══════════════════════════════════════════════ -->
        <div id="letter-modal" class="letter-modal-overlay fixed inset-0 z-50 hidden flex items-center justify-center p-4">

          <!-- Sisters background -->
          <div class="letter-sisters-bg">
            <div class="letter-sisters-overlay"></div>
            <div class="letter-sisters-silhouette">
              <svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" class="sisters-svg">
                <ellipse cx="138" cy="90" rx="44" ry="46" fill="rgba(255,182,193,0.6)"/>
                <path d="M72 520 Q88 290 138 250 Q188 290 204 520Z" fill="rgba(255,182,193,0.5)"/>
                <ellipse cx="268" cy="86" rx="42" ry="44" fill="rgba(255,149,168,0.6)"/>
                <path d="M202 520 Q218 285 268 250 Q318 285 334 520Z" fill="rgba(255,149,168,0.5)"/>
                <text x="203" y="195" font-size="34" text-anchor="middle" fill="rgba(255,100,130,0.45)">❤️</text>
              </svg>
            </div>
          </div>

          <!-- In-modal particle canvas (flower burst + ambient petals) -->
          <canvas id="letter-particle-canvas" class="letter-particle-canvas"></canvas>

          <div id="letter-bloom-ring" class="letter-bloom-ring" aria-hidden="true"></div>

          <!-- ── Letter Card ── -->
          <div id="letter-card" class="letter-card-inner relative z-10">

            <button id="close-letter-btn" class="letter-close-btn absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center focus:outline-none z-20" aria-label="Close letter">
              <i class="fas fa-times"></i>
            </button>

            <span class="letter-corner letter-corner--tl" aria-hidden="true">🌸</span>
            <span class="letter-corner letter-corner--tr" aria-hidden="true">✨</span>
            <span class="letter-corner letter-corner--bl" aria-hidden="true">💖</span>
            <span class="letter-corner letter-corner--br" aria-hidden="true">🌸</span>

            <div class="flex items-center justify-between border-b border-rose-200/60 pb-4 mb-6">
              <div class="flex items-center gap-2">
                <span class="text-3xl">💌</span>
                <span class="text-xs uppercase tracking-widest text-rose-500 font-bold">${this.letterData.date}</span>
              </div>
              <span class="text-rose-400 font-handwriting text-xl">Forever Sibling Love</span>
            </div>

            <h3 class="text-3xl font-bold font-handwriting text-rose-600 mb-5">${this.letterData.salutation}</h3>

            <div class="space-y-4 text-gray-700 leading-relaxed font-sans text-base md:text-lg text-left">
              ${this.letterData.paragraphs.map(p =>
                `<p class="first-letter:text-2xl first-letter:font-bold first-letter:text-rose-500">${p}</p>`
              ).join('')}
            </div>

            <div class="mt-8 pt-6 border-t border-rose-200/60 text-right">
              <p class="text-rose-500 font-handwriting text-2xl">${this.letterData.closing}</p>
              <h4 class="text-3xl font-bold font-handwriting text-rose-700 mt-1">${this.letterData.signature}</h4>
            </div>

          </div>
        </div>

      </div>
    `;

    this._wireEvents();
  }

  /* ════════════════════════════════════════════════════════════
     EVENTS
  ════════════════════════════════════════════════════════════ */
  _wireEvents() {
    const envelopeEl  = document.getElementById('envelope');
    const letterModal = document.getElementById('letter-modal');
    const openBtn     = document.getElementById('open-letter-btn');
    const closeBtn    = document.getElementById('close-letter-btn');

    // Prevent double-triggering
    let opening = false;

    const openLetter = () => {
      if (opening) return;
      opening = true;

      // Capture envelope center (before anything moves)
      const rect = envelopeEl.getBoundingClientRect();
      this._envelopeOrigin = {
        x: rect.left + rect.width  / 2,
        y: rect.top  + rect.height / 2,
      };

      this._runOpenSequence(envelopeEl, letterModal, () => { opening = false; });
    };

    const closeLetter = () => {
      letterModal.classList.remove('letter-modal-visible');
      document.body.style.overflow = '';
      envelopeEl.classList.remove('open');
      document.getElementById('envelope-glow').classList.remove('glow-active');
      this._stopAmbient();
      this._cleanupPreCanvas();
      setTimeout(() => {
        letterModal.classList.add('hidden');
        this._clearModalParticles();
      }, 420);
    };

    envelopeEl.addEventListener('click', openLetter);
    openBtn.addEventListener('click', openLetter);
    closeBtn.addEventListener('click', closeLetter);
    letterModal.addEventListener('click', e => {
      if (e.target === letterModal) closeLetter();
    });
  }

  /* ════════════════════════════════════════════════════════════
     MAIN SEQUENCE — full choreography
  ════════════════════════════════════════════════════════════ */
  _runOpenSequence(envelopeEl, letterModal, onDone) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // Instant open for accessibility
      envelopeEl.classList.add('open');
      letterModal.classList.remove('hidden');
      requestAnimationFrame(() => letterModal.classList.add('letter-modal-visible'));
      document.body.style.overflow = 'hidden';
      onDone();
      return;
    }

    const ox = this._envelopeOrigin.x;
    const oy = this._envelopeOrigin.y;

    /* ── Phase 1: t=0 — Butterflies emerge from CLOSED envelope ── */
    this._createPreCanvas();
    this._spawnPreButterflies(ox, oy);   // large, fast, far
    this._runPreRenderLoop();

    /* ── Phase 2: t=2600ms — butterflies begin fading out ── */
    setTimeout(() => {
      this._preParticles.forEach(p => { p.fadeDelay = 0; });
    }, 2600);

    /* ── Phase 3: t=3100ms — envelope begins opening (slow, elegant) ── */
    setTimeout(() => {
      envelopeEl.classList.add('open');
      document.getElementById('envelope-glow').classList.add('glow-active');
    }, 3100);

    /* ── Phase 4: t=3700ms — modal overlay fades in ── */
    setTimeout(() => {
      letterModal.classList.remove('hidden');
      requestAnimationFrame(() => {
        letterModal.classList.add('letter-modal-visible');
      });
      document.body.style.overflow = 'hidden';
    }, 3700);

    /* ── Phase 5: t=4200ms — in-modal flower burst ── */
    setTimeout(() => {
      this._startModalParticles();
    }, 4200);

    /* ── Phase 6: t=6000ms — remove pre-canvas ── */
    setTimeout(() => {
      this._cleanupPreCanvas();
      onDone();
    }, 6000);
  }

  /* ════════════════════════════════════════════════════════════
     PRE-OPEN CANVAS  (body-level, fixed, z-index 999)
     Exists BEFORE the modal — shows butterflies on the page
  ════════════════════════════════════════════════════════════ */
  _createPreCanvas() {
    if (this._preCanvas) return;

    const c = document.createElement('canvas');
    c.id    = 'letter-pre-canvas';
    c.style.cssText = [
      'position:fixed',
      'inset:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'z-index:999',
    ].join(';');
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    document.body.appendChild(c);

    this._preCanvas = c;
    this._preCtx    = c.getContext('2d');
  }

  _cleanupPreCanvas() {
    cancelAnimationFrame(this._preRafId);
    if (this._preCanvas) {
      this._preCanvas.remove();
      this._preCanvas  = null;
      this._preCtx     = null;
    }
    this._preParticles = [];
  }

  /* ════════════════════════════════════════════════════════════
     SPAWN PRE-OPEN BUTTERFLIES
     Large, high-speed, 8 distinct direction vectors
  ════════════════════════════════════════════════════════════ */
  _spawnPreButterflies(ox, oy) {
    // 8 clearly distinct flight directions
    const directions = [
      { vx:  0.0,  vy: -1.0 },   // straight up
      { vx: -0.50, vy: -0.87 },  // upper-left
      { vx:  0.50, vy: -0.87 },  // upper-right
      { vx: -0.87, vy: -0.50 },  // left-up diagonal
      { vx:  0.87, vy: -0.50 },  // right-up diagonal
      { vx: -1.0,  vy:  0.0  },  // pure left
      { vx:  1.0,  vy:  0.0  },  // pure right
      { vx: -0.65, vy:  0.76 },  // lower-left (graceful arc)
      { vx:  0.65, vy:  0.76 },  // lower-right
    ];

    // Wing colour palettes
    const palettes = [
      ['rgba(255,150,180,0.90)', 'rgba(255,190,215,0.80)'],   // pink
      ['rgba(200,160,230,0.88)', 'rgba(225,200,255,0.78)'],   // lavender
      ['rgba(255,175,195,0.88)', 'rgba(255,210,230,0.78)'],   // blush
      ['rgba(180,210,255,0.85)', 'rgba(210,230,255,0.75)'],   // ice blue
    ];

    directions.forEach((dir, i) => {
      // Base speed: fast enough to travel far in 3+ seconds
      const speed   = 3.8 + Math.random() * 2.2;   // px/frame at 60fps → ~230–360px/s
      const palette = palettes[i % palettes.length];

      this._preParticles.push({
        x:         ox + (Math.random() - 0.5) * 30,
        y:         oy + (Math.random() - 0.5) * 20,
        vx:        dir.vx * speed,
        vy:        dir.vy * speed,
        gravity:   0.012,            // very light gravity
        driftAmp:  0.8 + Math.random() * 1.2,
        driftFreq: 0.025 + Math.random() * 0.025,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 0.13 + Math.random() * 0.10,
        size:      38 + Math.random() * 18,          // LARGE: 38–56px
        alpha:     1.0,
        fadeDelay: 2600,             // 2.6s of full visibility
        born:      Date.now(),
        colorA:    palette[0],
        colorB:    palette[1],
        delay:     i * 60,           // stagger each butterfly by 60ms
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     PRE-OPEN RENDER LOOP
  ════════════════════════════════════════════════════════════ */
  _runPreRenderLoop() {
    const startTime = Date.now();

    const tick = () => {
      if (!this._preCanvas || !this._preCtx) return;

      this._preCtx.clearRect(0, 0, this._preCanvas.width, this._preCanvas.height);
      const now = Date.now();

      this._preParticles = this._preParticles.filter(p => p.alpha > 0.01);

      for (const p of this._preParticles) {
        // Respect per-butterfly stagger delay
        if (now - startTime < p.delay) continue;

        // Physics
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += p.gravity;

        // Organic drift (sine wave lateral)
        const elapsed = (now - p.born - p.delay) / 1000;
        p.x += Math.sin(elapsed * p.driftFreq * 60) * p.driftAmp * 0.08;

        // Wing flap
        p.wingPhase += p.wingSpeed;

        // Fade
        const age = now - p.born;
        if (age > p.fadeDelay) {
          p.alpha -= 0.008;   // slow fade over ~1.2s
        }

        this._drawButterfly(this._preCtx, p);
      }

      this._preRafId = requestAnimationFrame(tick);
    };

    this._preRafId = requestAnimationFrame(tick);
  }

  /* ════════════════════════════════════════════════════════════
     DRAW BUTTERFLY (shared between pre and modal canvases)
  ════════════════════════════════════════════════════════════ */
  _drawButterfly(ctx, p) {
    const wingSpread = Math.abs(Math.sin(p.wingPhase)) * p.size;
    const bx = p.x, by = p.y;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);

    // Upper left wing
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.bezierCurveTo(
      bx - wingSpread * 1.15, by - p.size * 0.85,
      bx - wingSpread * 1.55, by + p.size * 0.10,
      bx, by + p.size * 0.18
    );
    ctx.fillStyle = p.colorA;
    ctx.fill();

    // Upper right wing
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.bezierCurveTo(
      bx + wingSpread * 1.15, by - p.size * 0.85,
      bx + wingSpread * 1.55, by + p.size * 0.10,
      bx, by + p.size * 0.18
    );
    ctx.fillStyle = p.colorB;
    ctx.fill();

    // Lower left wing
    ctx.beginPath();
    ctx.moveTo(bx, by + p.size * 0.18);
    ctx.bezierCurveTo(
      bx - wingSpread * 0.75, by + p.size * 0.55,
      bx - wingSpread * 0.85, by + p.size * 0.88,
      bx, by + p.size * 0.58
    );
    ctx.fillStyle = p.colorA.replace(/[\d.]+\)$/, '0.60)');
    ctx.fill();

    // Lower right wing
    ctx.beginPath();
    ctx.moveTo(bx, by + p.size * 0.18);
    ctx.bezierCurveTo(
      bx + wingSpread * 0.75, by + p.size * 0.55,
      bx + wingSpread * 0.85, by + p.size * 0.88,
      bx, by + p.size * 0.58
    );
    ctx.fillStyle = p.colorB.replace(/[\d.]+\)$/, '0.55)');
    ctx.fill();

    // Wing shimmer veins
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth   = 0.8;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - wingSpread * 0.7, by - p.size * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + wingSpread * 0.7, by - p.size * 0.5);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.ellipse(bx, by + p.size * 0.30, 2.5, p.size * 0.38, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(140, 50, 80, 0.70)';
    ctx.fill();

    // Antennae
    ctx.strokeStyle = 'rgba(140,50,80,0.50)';
    ctx.lineWidth   = 1.2;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 7, by - p.size * 0.60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 7, by - p.size * 0.60); ctx.stroke();
    // Antennas tips
    ctx.beginPath(); ctx.arc(bx - 7, by - p.size * 0.60, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(140,50,80,0.55)'; ctx.fill();
    ctx.beginPath(); ctx.arc(bx + 7, by - p.size * 0.60, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ════════════════════════════════════════════════════════════
     IN-MODAL PARTICLES  (flower burst + ambient petals)
     Called at t=4200ms after letter opens
  ════════════════════════════════════════════════════════════ */
  _startModalParticles() {
    const canvas = document.getElementById('letter-particle-canvas');
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx     = canvas.getContext('2d');

    const ox = Math.min(Math.max(this._envelopeOrigin.x, 60), canvas.width  - 60);
    const oy = Math.min(Math.max(this._envelopeOrigin.y, 60), canvas.height - 60);

    // Flower burst
    this._spawnFlowerBurst(ox, oy, 18);
    // Ambient petals (continuous while reading)
    setTimeout(() => this._startAmbientPetals(canvas), 600);

    this._runModalLoop(ctx, canvas);
  }

  _spawnFlowerBurst(ox, oy, count) {
    const emojis = ['🌸','🌺','🌼','🌷','✿','❀','💐'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 1.6 + Math.random() * 3.0;
      this.particles.push({
        type:      'flower',
        x: ox, y: oy,
        vx:        Math.cos(angle) * speed,
        vy:        Math.sin(angle) * speed - 1.0,
        gravity:   0.055,
        friction:  0.993,
        emoji:     emojis[Math.floor(Math.random() * emojis.length)],
        size:      16 + Math.random() * 16,
        alpha:     1,
        rotation:  Math.random() * Math.PI * 2,
        rotSpeed:  (Math.random() - 0.5) * 0.10,
        fadeDelay: 1600 + Math.random() * 1200,
        born:      Date.now(),
      });
    }
  }

  _startAmbientPetals(canvas) {
    this._ambientActive = true;
    const petals = ['🌸','✿','❀','🌷','🌺'];

    const emit = () => {
      if (!this._ambientActive) return;
      const fromSide = Math.random() < 0.3;
      const spawnX   = fromSide ? (Math.random() < 0.5 ? -20 : canvas.width + 20) : Math.random() * canvas.width;
      const spawnY   = fromSide ? Math.random() * canvas.height * 0.6 : -24;
      const vxDir    = fromSide ? (spawnX < 0 ? 1 : -1) : 0;

      this.particles.push({
        type:      'flower',
        x: spawnX, y: spawnY,
        vx:        vxDir * (0.3 + Math.random() * 0.6) + (Math.random() - 0.5) * 0.5,
        vy:        0.5 + Math.random() * 0.8,
        gravity:   0.008,
        friction:  1,
        emoji:     petals[Math.floor(Math.random() * petals.length)],
        size:      12 + Math.random() * 10,
        alpha:     0.70 + Math.random() * 0.25,
        rotation:  Math.random() * Math.PI * 2,
        rotSpeed:  (Math.random() - 0.5) * 0.03,
        fadeDelay: 5000,
        born:      Date.now(),
        ambient:   true,
      });
      this._ambientTimer = setTimeout(emit, 280 + Math.random() * 270);
    };

    emit();
  }

  _runModalLoop(ctx, canvas) {
    const tick = () => {
      const modal = document.getElementById('letter-modal');
      if (!modal || modal.classList.contains('hidden')) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      this.particles = this.particles.filter(p => p.alpha > 0.008);

      for (const p of this.particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += p.gravity;
        if (p.friction) p.vx *= p.friction;

        const age = now - p.born;
        if (age > p.fadeDelay) {
          p.alpha -= p.ambient ? 0.006 : 0.010;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'flower') {
          p.rotation += p.rotSpeed;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.font         = `${p.size}px serif`;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        }

        ctx.restore();
      }

      this._rafId = requestAnimationFrame(tick);
    };

    this._rafId = requestAnimationFrame(tick);
  }

  /* ════════════════════════════════════════════════════════════
     CLEANUP
  ════════════════════════════════════════════════════════════ */
  _stopAmbient() {
    this._ambientActive = false;
    clearTimeout(this._ambientTimer);
    this.particles.forEach(p => { if (p.ambient) p.fadeDelay = 0; });
  }

  _clearModalParticles() {
    cancelAnimationFrame(this._rafId);
    this.particles = [];
    const canvas = document.getElementById('letter-particle-canvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new LetterEnvelope();
});
