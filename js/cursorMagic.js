/**
 * cursorMagic.js — Magical cursor trail for "For My Didu"
 *
 * Releases a dreamy mix of tiny hearts, sparkles, and micro-butterflies
 * as the cursor moves across any part of the page.
 *
 * Design rules:
 *  • Fixed, full-screen container — pointer-events: none — never blocks clicks
 *  • Particles auto-remove on animationend — zero memory leaks
 *  • Throttled spawn so it stays light even on fast mouse movements
 *  • Respects prefers-reduced-motion (disabled when user prefers it)
 *  • Touch: only a small burst on tap, NOT on scroll
 *  • Works across all sections: homepage, diary, letter, games, etc.
 */

(function () {
  'use strict';

  /* ── Respect prefers-reduced-motion ─────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Inject keyframe CSS ─────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .cm-particle {
      position: fixed;
      pointer-events: none !important;
      user-select: none;
      line-height: 1;
      transform-origin: center center;
      will-change: transform, opacity;
    }

    @keyframes cmHeart {
      0%   { transform: translate(0,0) rotate(0deg) scale(0.4);   opacity: 0.95; }
      18%  { transform: translate(calc(var(--sx)*0.22), calc(var(--sy)*0.18))
                        rotate(calc(var(--r)*0.28)) scale(1.05);   opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy))
                        rotate(var(--r))              scale(0.15);  opacity: 0; }
    }

    @keyframes cmSparkle {
      0%   { transform: translate(0,0) rotate(0deg) scale(0);   opacity: 1; }
      28%  { transform: translate(calc(var(--sx)*0.28), calc(var(--sy)*0.28))
                        rotate(calc(var(--r)*0.45))  scale(1.35); opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy))
                        rotate(var(--r))              scale(0);    opacity: 0; }
    }

    @keyframes cmButterfly {
      0%   { transform: translate(0,0) rotate(0deg)             scale(0.25); opacity: 0.85; }
      12%  { transform: translate(calc(var(--sx)*0.12), calc(var(--sy)*0.08))
                        rotate(calc(var(--r)*0.18))             scale(1.1);  opacity: 1; }
      48%  { transform: translate(calc(var(--sx)*0.52), calc(var(--sy)*0.48))
                        rotate(calc(var(--r)*0.62))             scale(0.88); opacity: 0.82; }
      100% { transform: translate(var(--sx), var(--sy))
                        rotate(var(--r))                        scale(0.05); opacity: 0; }
    }

    @keyframes cmPop {
      0%   { transform: translate(0,0) scale(0) rotate(0deg);   opacity: 1; }
      22%  { transform: translate(calc(var(--sx)*0.2), calc(var(--sy)*0.15))
                        scale(1.2) rotate(calc(var(--r)*0.3));  opacity: 1; }
      100% { transform: translate(var(--sx), var(--sy))
                        scale(0)   rotate(var(--r));            opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ── Particle container ──────────────────────────── */
  const wrap = document.createElement('div');
  wrap.id = 'cursor-magic-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99998;overflow:hidden';
  document.body.appendChild(wrap);

  /* ── Config ──────────────────────────────────────── */
  const CFG = {
    maxOnScreen: 90,
    spawnGap:    32,  // minimum ms between spawns
    minDist:     5,   // minimum pixel movement to trigger a spawn
  };

  /* ── Palettes ─────────────────────────────────────── */
  const HEARTS      = ['\u2661','\u2665','\uD83D\uDC97','\uD83D\uDC95','\u2764','\uD83D\uDC93'];
  const SPARKLES    = ['\u2728','\u2727','\u22C6','\u2726','\u2736','\u2738','\u2735','\u273C'];
  const BUTTERFLIES = ['\uD83E\uDD8B','\uD83C\uDF38','\uD83C\uDF3A','\u273F','\u2740'];
  const POPS        = ['\uD83D\uDCAB','\uD83C\uDF1F','\u2B50','\u2728'];

  const HEART_COLS   = ['#FF4D6D','#FF758F','#FFB3C1','#C77DFF','#FF9AA2','#FFD6E0','#FF85A1'];
  const SPARKLE_COLS = ['#FFD700','#FFFACD','#E0CFFF','#FFB3C1','#FFFFFF','#A8D8FF','#FFF0A0'];
  const BUTTER_COLS  = ['#FFB3C6','#C77DFF','#A8D8EA','#B5EAD7','#FFD6E0','#DEB3FF'];
  const POP_COLS     = ['#FFD700','#FFB3C1','#FFFFFF','#E0CFFF','#FFF0A0'];

  /* ── Helpers ─────────────────────────────────────── */
  const rng  = (a, b) => a + Math.random() * (b - a);
  const pick = (a)    => a[Math.floor(Math.random() * a.length)];

  /* ── Spawn ───────────────────────────────────────── */
  let alive = 0;

  function spawn(x, y) {
    if (alive >= CFG.maxOnScreen) return;

    // Weighted random type: hearts and sparkles are twice as likely
    const roll = Math.random();
    const kind = roll < 0.32 ? 'heart'
               : roll < 0.64 ? 'sparkle'
               : roll < 0.82 ? 'butterfly'
               : 'pop';

    const el = document.createElement('span');
    el.className = 'cm-particle';

    let char, color, size, sx, sy, rot, dur, anim, extraStyle;

    if (kind === 'heart') {
      char  = pick(HEARTS);
      color = pick(HEART_COLS);
      size  = rng(9, 18);
      sx    = rng(-35, 35);
      sy    = rng(-70, -120);
      rot   = rng(-28, 28);
      dur   = rng(900, 1700);
      anim  = 'cmHeart';
      extraStyle = `color:${color};text-shadow:0 0 7px ${color}cc,0 0 14px ${color}55;`;

    } else if (kind === 'sparkle') {
      char  = pick(SPARKLES);
      color = pick(SPARKLE_COLS);
      size  = rng(7, 15);
      sx    = rng(-22, 22);
      sy    = rng(-20, 20);
      rot   = rng(-200, 200);
      dur   = rng(500, 1100);
      anim  = 'cmSparkle';
      extraStyle = `color:${color};text-shadow:0 0 8px ${color},0 0 18px ${color}88;`;

    } else if (kind === 'butterfly') {
      char  = pick(BUTTERFLIES);
      color = pick(BUTTER_COLS);
      size  = rng(9, 17);
      sx    = rng(-55, 55);
      sy    = rng(-45, -90);
      rot   = rng(-35, 35);
      dur   = rng(1100, 1900);
      anim  = 'cmButterfly';
      extraStyle = `filter:drop-shadow(0 0 4px ${color});`;

    } else {
      char  = pick(POPS);
      color = pick(POP_COLS);
      size  = rng(7, 13);
      sx    = rng(-25, 25);
      sy    = rng(-30, 30);
      rot   = rng(-180, 180);
      dur   = rng(600, 1000);
      anim  = 'cmPop';
      extraStyle = `color:${color};text-shadow:0 0 6px ${color}bb;`;
    }

    el.style.cssText =
      `left:${x}px;top:${y}px;` +
      `font-size:${size}px;` +
      extraStyle +
      `animation:${anim} ${dur}ms cubic-bezier(0.22,1,0.36,1) forwards;` +
      `--sx:${sx}px;--sy:${sy}px;--r:${rot}deg;`;

    el.textContent = char;
    wrap.appendChild(el);
    alive++;

    el.addEventListener('animationend', () => { el.remove(); alive--; }, { once: true });
  }

  /* ── Mouse move (throttled + distance-gated) ─────── */
  let lastMs = 0, lastX = -999, lastY = -999;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMs < CFG.spawnGap) return;

    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (dx*dx + dy*dy < CFG.minDist * CFG.minDist) return;

    lastMs = now; lastX = e.clientX; lastY = e.clientY;

    // Occasionally burst 2 on fast swipes
    const burst = (dx*dx + dy*dy > 600 && Math.random() < 0.4) ? 2 : 1;
    for (let i = 0; i < burst; i++) {
      spawn(e.clientX + rng(-7, 7), e.clientY + rng(-7, 7));
    }
  }, { passive: true });

  /* ── Touch: burst on tap, silent on scroll ───────── */
  let slid = false;
  document.addEventListener('touchstart',  () => { slid = false; }, { passive: true });
  document.addEventListener('touchmove',   () => { slid = true;  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (slid) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const now = Date.now();
    if (now - lastMs < 200) return;
    lastMs = now;
    for (let i = 0; i < 5; i++) spawn(t.clientX + rng(-14,14), t.clientY + rng(-14,14));
  }, { passive: true });

})();
