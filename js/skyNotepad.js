/**
 * Diary / Sky Notepad — Fixed & Enhanced
 * For My Didu (Prishu) website
 *
 * Fixes:
 *  - Clear button: resets composite op, uses correct coord space, clears reliably
 *  - Eraser: larger default size (24px), +/- buttons, custom SVG cursor
 *  - All pointer/touch events preserved
 *  - Canvas resize preserves drawing
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     DiaryCanvas — handles all drawing on canvas
  ───────────────────────────────────────────── */
  class DiaryCanvas {
    constructor(canvas) {
      this.canvas  = canvas;
      this.ctx     = canvas.getContext('2d');
      this.isDrawing  = false;
      this.history    = [];   // ImageData undo stack
      this.redoStack  = [];
      this.color      = '#2D3047';
      this.brushSize  = 4;
      this.eraserSize = 24;  // FIX: separate, larger default eraser size
      this.tool       = 'pencil'; // pencil | pen | brush | eraser
      this.pendingSticker = null; // emoji string when sticker mode is active
      this._lastX = 0;
      this._lastY = 0;
      this._resize();
      this._bindEvents();
      window.addEventListener('resize', () => this._resize());
    }

    /* ── Size the canvas to match its CSS-rendered parent size ── */
    _resize() {
      const dpr  = window.devicePixelRatio || 1;
      const page = this.canvas.parentElement;
      const rect = page.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.max(Math.round(rect.height), 400);

      // Snapshot existing content before resizing
      let snapshot = null;
      if (this.canvas.width > 0 && this.canvas.height > 0) {
        try {
          const tmp = document.createElement('canvas');
          tmp.width  = this.canvas.width;
          tmp.height = this.canvas.height;
          tmp.getContext('2d').drawImage(this.canvas, 0, 0);
          snapshot = tmp;
        } catch (e) { /* ignore */ }
      }

      this.canvas.width  = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width  = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.W = w;
      this.H = h;
      this.dpr = dpr;

      // Restore content
      if (snapshot && snapshot.width > 0) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // pixel-space
        this.ctx.drawImage(snapshot, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    _getPos(e) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    _bindEvents() {
      const c = this.canvas;
      c.addEventListener('pointerdown',  e => this._onDown(e));
      c.addEventListener('pointermove',  e => this._onMove(e));
      c.addEventListener('pointerup',    e => this._onUp(e));
      c.addEventListener('pointerleave', e => this._onUp(e));
      c.addEventListener('pointercancel',e => this._onUp(e));
      // Prevent page scroll while drawing on touch
      c.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
      c.addEventListener('touchmove',  e => e.preventDefault(), { passive: false });
    }

    _onDown(e) {
      e.preventDefault();
      this.canvas.setPointerCapture(e.pointerId);
      const pos = this._getPos(e);

      // Sticker mode: place emoji on click
      if (this.pendingSticker) {
        this._saveHistory();
        this._placeSticker(this.pendingSticker, pos.x, pos.y);
        this.redoStack = [];
        return;
      }

      this._saveHistory();
      this.isDrawing = true;
      this._lastX = pos.x;
      this._lastY = pos.y;
      this._applyStrokeStyle(e.pressure);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    }

    _onMove(e) {
      if (!this.isDrawing) return;
      e.preventDefault();
      const pos = this._getPos(e);
      this._applyStrokeStyle(e.pressure);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
      this._lastX = pos.x;
      this._lastY = pos.y;
    }

    _onUp(e) {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.ctx.closePath();
      // FIX: Always reset composite so nothing bleeds into later draws
      this.ctx.globalAlpha = 1;
      this.ctx.globalCompositeOperation = 'source-over';
      this.redoStack = [];
    }

    _applyStrokeStyle(pressure = 0.5) {
      const ctx  = this.ctx;
      const p    = Math.max(0.1, Math.min(1, pressure || 0.5));
      const tool = this.tool;

      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha  = 1;
        ctx.strokeStyle  = 'rgba(0,0,0,1)';
        // FIX: use dedicated eraserSize instead of brushSize
        ctx.lineWidth    = this.eraserSize;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = this.color;

        if (tool === 'pencil') {
          ctx.globalAlpha = 0.78 + p * 0.14;
          ctx.lineWidth   = Math.max(1, this.brushSize * 0.78 * (0.5 + p * 0.65));
        } else if (tool === 'pen') {
          ctx.globalAlpha = 0.95 + p * 0.05;
          ctx.lineWidth   = this.brushSize * (0.7 + p * 0.45);
        } else { // brush
          ctx.globalAlpha = 0.55 + p * 0.2;
          ctx.lineWidth   = this.brushSize * 2.1 * (0.65 + p * 0.45);
        }
      }
    }

    _placeSticker(emoji, x, y) {
      const ctx = this.ctx;
      const sz  = Math.max(22, this.brushSize * 4 + 14);
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.font = `${sz}px serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x, y);
      ctx.restore();
    }

    /* ── History ── */
    _saveHistory() {
      if (this.history.length >= 40) this.history.shift();
      try {
        this.history.push(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
      } catch (e) { /* cross-origin guard */ }
    }

    undo() {
      if (this.history.length === 0) return;
      try {
        this.redoStack.push(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
        this.ctx.putImageData(this.history.pop(), 0, 0);
      } catch (e) {}
    }

    redo() {
      if (this.redoStack.length === 0) return;
      try {
        this.history.push(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
        this.ctx.putImageData(this.redoStack.pop(), 0, 0);
      } catch (e) {}
    }

    /* ── FIX: Reliable clear ── */
    clear() {
      this._saveHistory();
      const ctx = this.ctx;
      // Reset ALL compositing state before clearing
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      // Save and reset transform so we work in physical pixel space
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
      // Re-apply DPR transform
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.redoStack = [];
    }

    /* ── Tool setters ── */
    setTool(name) {
      this.tool = name;
      this.pendingSticker = null;
      if (name === 'eraser') {
        this._updateEraserCursor();
      } else {
        this.canvas.style.cursor = 'crosshair';
      }
    }

    /* ── FIX: SVG cursor that matches the actual eraser size ── */
    _updateEraserCursor() {
      if (this.tool !== 'eraser') return;
      const sz = Math.max(8, this.eraserSize);
      // Create an SVG circle cursor at the right size
      const half = Math.ceil(sz / 2);
      const cursorSize = sz + 4; // add 2px border room
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}' height='${cursorSize}'><circle cx='${cursorSize/2}' cy='${cursorSize/2}' r='${sz/2}' fill='rgba(255,255,255,0.5)' stroke='rgba(200,50,100,0.85)' stroke-width='2'/></svg>`;
      const encoded = encodeURIComponent(svg);
      const hotspot = Math.floor(cursorSize / 2);
      this.canvas.style.cursor = `url("data:image/svg+xml,${encoded}") ${hotspot} ${hotspot}, crosshair`;
    }

    setStickerMode(emoji) {
      this.pendingSticker = emoji;
      this.canvas.style.cursor = 'copy';
    }

    clearStickerMode() {
      this.pendingSticker = null;
      this.canvas.style.cursor = 'crosshair';
    }

    setColor(c)  { this.color     = c; }
    setSize(s)   { this.brushSize = s; }

    /* ── FIX: dedicated eraser size setter ── */
    setEraserSize(s) {
      this.eraserSize = Math.max(6, Math.min(100, s));
      this._updateEraserCursor();
    }

    /* ── Export ── */
    getDataURL() {
      return this.canvas.toDataURL('image/png');
    }

    loadFromDataURL(dataURL) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          // Draw scaled to logical dimensions (already DPR-scaled via setTransform)
          this.ctx.drawImage(img, 0, 0, this.W, this.H);
          resolve();
        };
        img.onerror = resolve;
        img.src = dataURL;
      });
    }
  }

  /* ─────────────────────────────────────────────
     PNG Compositor — builds download image
  ───────────────────────────────────────────── */
  async function exportDiaryPNG(drawingDataURL, currentUser) {
    const W = 1100, H = 780;
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const ctx = off.getContext('2d');

    // Paper background
    const paper = ctx.createLinearGradient(0, 0, W, H);
    paper.addColorStop(0,   '#fffdf8');
    paper.addColorStop(0.5, '#fff9f2');
    paper.addColorStop(1,   '#fffaf5');
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);

    // Ruled lines
    ctx.strokeStyle = 'rgba(160,195,240,0.22)';
    ctx.lineWidth = 1;
    for (let y = 40; y < H; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Left margin
    ctx.strokeStyle = 'rgba(255,150,170,0.32)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(62, 0); ctx.lineTo(62, H);
    ctx.stroke();

    // Drawing overlay (transparent)
    await new Promise(resolve => {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, W, H); resolve(); };
      img.onerror = resolve;
      img.src = drawingDataURL;
    });

    // Pink ribbon
    ctx.fillStyle = '#FF4D6D';
    const rx = W - 55, rw = 20;
    ctx.fillRect(rx, 0, rw, 80);
    ctx.fillStyle = '#C9184A';
    ctx.fillRect(rx - 5, 0, rw + 10, 7);

    // Corner fold
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(W, H); ctx.lineTo(W - 44, H); ctx.lineTo(W, H - 44);
    ctx.closePath();
    ctx.fillStyle = '#ede0f8';
    ctx.fill();
    ctx.restore();

    // Decorative hearts
    const heartEmojis = ['💕', '🌸', '✨', '💫'];
    ctx.font = '20px serif';
    ctx.globalAlpha = 0.35;
    const hPos = [[30, 60],[30, 200],[30, 380],[W-30, 120],[W-30, 300],[W-30, 500]];
    for (const [hx, hy] of hPos) {
      ctx.fillText(heartEmojis[Math.floor(Math.random() * heartEmojis.length)], hx, hy);
    }
    ctx.globalAlpha = 1;

    // Title strip at top
    ctx.save();
    ctx.fillStyle = 'rgba(220,190,255,0.18)';
    ctx.fillRect(0, 0, W, 34);
    ctx.font = 'bold 16px "Dancing Script", Georgia, serif';
    ctx.fillStyle = 'rgba(140,70,120,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('✨  Our Little Sky Diary  ✨', W / 2, 22);
    ctx.restore();

    // User stamp
    ctx.save();
    ctx.font = 'italic 15px "Dancing Script", Georgia, serif';
    ctx.fillStyle = 'rgba(140,60,100,0.52)';
    ctx.textAlign = 'left';
    ctx.fillText('✍️  ' + currentUser, 68, H - 16);
    ctx.restore();

    // Date stamp
    ctx.save();
    ctx.font = 'italic 13px Georgia, serif';
    ctx.fillStyle = 'rgba(140,60,100,0.45)';
    ctx.textAlign = 'right';
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    ctx.fillText('📅 ' + today, W - 10, H - 16);
    ctx.restore();

    return off.toDataURL('image/png', 1.0);
  }

  /* ─────────────────────────────────────────────
     LocalStorage helpers
  ───────────────────────────────────────────── */
  const STORE_KEY = 'diduDiary_v3';

  function saveDiary(dataURL) {
    try { localStorage.setItem(STORE_KEY, dataURL); return true; }
    catch (e) { return false; }
  }

  function loadDiary() {
    try { return localStorage.getItem(STORE_KEY); }
    catch (e) { return null; }
  }

  /* ─────────────────────────────────────────────
     DiaryUI — wires all elements together
  ───────────────────────────────────────────── */
  class DiaryUI {
    constructor() {
      this.dc          = null;
      this.currentUser = 'Pranjal';
      this._toastTimer = null;
      this._init();
    }

    _init() {
      const canvas = document.getElementById('diary-draw-canvas');
      if (!canvas) return;

      this.dc = new DiaryCanvas(canvas);

      // Load previously saved diary
      const saved = loadDiary();
      if (saved) {
        this.dc.loadFromDataURL(saved).then(() => {
          const hint = document.getElementById('diary-hint');
          if (hint) hint.classList.add('diary-hint-gone');
        });
      }

      this._bindHint();
      this._bindTurnToggle();
      this._bindTools();
      this._bindColors();
      this._bindSize();
      this._bindEraserControls(); // FIX: new eraser +/- controls
      this._bindStickers();
      this._bindHistory();
      this._bindSave();
      this._bindDownload();
    }

    /* ── Hide hint on first interaction ── */
    _bindHint() {
      const canvas = document.getElementById('diary-draw-canvas');
      const hint   = document.getElementById('diary-hint');
      if (!canvas || !hint) return;
      canvas.addEventListener('pointerdown', () => {
        hint.classList.add('diary-hint-gone');
      }, { once: true });
    }

    /* ── Turn toggle (does NOT clear canvas) ── */
    _bindTurnToggle() {
      const pBtn = document.getElementById('diary-turn-pranjal');
      const dBtn = document.getElementById('diary-turn-didu');
      const tag  = document.getElementById('diary-tag-text');

      const setTurn = (user) => {
        this.currentUser = user;
        const isP = user === 'Pranjal';

        pBtn?.classList.toggle('diary-turn-active', isP);
        dBtn?.classList.toggle('diary-turn-active', !isP);
        pBtn?.setAttribute('aria-pressed', String(isP));
        dBtn?.setAttribute('aria-pressed', String(!isP));

        if (tag) tag.textContent = isP ? '✍️ Pranjal' : '🌸 Didu';
      };

      pBtn?.addEventListener('click', () => setTurn('Pranjal'));
      dBtn?.addEventListener('click', () => setTurn('Didu'));
    }

    /* ── Tool selection (pencil/pen/brush/eraser) ── */
    _bindTools() {
      const toolIds = ['dt-pencil', 'dt-pen', 'dt-brush', 'dt-eraser'];

      toolIds.forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
          // Deactivate all
          toolIds.forEach(tid => {
            document.getElementById(tid)?.classList.remove('diary-tool-active');
            document.getElementById(tid)?.setAttribute('aria-pressed', 'false');
          });
          // Activate clicked
          btn.classList.add('diary-tool-active');
          btn.setAttribute('aria-pressed', 'true');

          // Clear sticker mode highlight
          document.querySelectorAll('.diary-sticker-btn')
            .forEach(b => b.classList.remove('diary-sticker-active'));

          this.dc.setTool(btn.dataset.tool);

          // FIX: show/hide eraser size controls based on active tool
          const eraserControls = document.getElementById('dt-eraser-controls');
          if (eraserControls) {
            eraserControls.style.display = btn.dataset.tool === 'eraser' ? 'flex' : 'none';
          }
        });
      });
    }

    /* ── Color selection ── */
    _bindColors() {
      document.querySelectorAll('.diary-color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          document.querySelectorAll('.diary-color-dot')
            .forEach(d => d.classList.remove('diary-color-active'));
          dot.classList.add('diary-color-active');
          this.dc.setColor(dot.dataset.color);
          this.dc.clearStickerMode();
          // If in eraser, switch back to pencil
          if (this.dc.tool === 'eraser') {
            this._activateTool('dt-pencil', 'pencil');
          }
        });
      });

      const customInput = document.getElementById('dt-custom-color');
      if (customInput) {
        customInput.addEventListener('input', () => {
          document.querySelectorAll('.diary-color-dot')
            .forEach(d => d.classList.remove('diary-color-active'));
          this.dc.setColor(customInput.value);
          this.dc.clearStickerMode();
          if (this.dc.tool === 'eraser') {
            this._activateTool('dt-pencil', 'pencil');
          }
        });
      }
    }

    _activateTool(btnId, toolName) {
      ['dt-pencil','dt-pen','dt-brush','dt-eraser'].forEach(id => {
        document.getElementById(id)?.classList.remove('diary-tool-active');
      });
      document.getElementById(btnId)?.classList.add('diary-tool-active');
      this.dc.setTool(toolName);
      // Also hide eraser controls if switching away
      const eraserControls = document.getElementById('dt-eraser-controls');
      if (eraserControls) {
        eraserControls.style.display = toolName === 'eraser' ? 'flex' : 'none';
      }
    }

    /* ── Brush size slider ── */
    _bindSize() {
      const slider = document.getElementById('dt-size');
      const label  = document.getElementById('dt-size-label');
      if (!slider) return;
      slider.addEventListener('input', () => {
        const v = parseInt(slider.value, 10);
        this.dc.setSize(v);
        if (label) label.textContent = v;
      });
    }

    /* ── FIX: Eraser size +/- controls ── */
    _bindEraserControls() {
      const minusBtn  = document.getElementById('dt-eraser-minus');
      const plusBtn   = document.getElementById('dt-eraser-plus');
      const sizeLabel = document.getElementById('dt-eraser-size-label');

      const MIN_ERASER = 6;
      const MAX_ERASER = 100;
      const STEP       = 4;

      const updateLabel = () => {
        if (sizeLabel) sizeLabel.textContent = this.dc.eraserSize + 'px';
      };

      // Initialize label
      updateLabel();

      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          this.dc.setEraserSize(this.dc.eraserSize - STEP);
          updateLabel();
        });
      }

      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          this.dc.setEraserSize(this.dc.eraserSize + STEP);
          updateLabel();
        });
      }
    }

    /* ── Sticker buttons (click to arm, click canvas to stamp) ── */
    _bindStickers() {
      document.querySelectorAll('.diary-sticker-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const emoji = btn.dataset.sticker;

          if (this.dc.pendingSticker === emoji) {
            // Toggle off
            this.dc.clearStickerMode();
            document.querySelectorAll('.diary-sticker-btn')
              .forEach(b => b.classList.remove('diary-sticker-active'));
          } else {
            // Arm sticker mode
            this.dc.setStickerMode(emoji);
            document.querySelectorAll('.diary-sticker-btn')
              .forEach(b => b.classList.remove('diary-sticker-active'));
            btn.classList.add('diary-sticker-active');
          }
        });
      });
    }

    /* ── FIX: Undo / Redo / Clear (reliable clear) ── */
    _bindHistory() {
      document.getElementById('dt-undo')?.addEventListener('click', () => this.dc.undo());
      document.getElementById('dt-redo')?.addEventListener('click', () => this.dc.redo());
      document.getElementById('dt-clear')?.addEventListener('click', () => {
        if (confirm('Clear the entire diary page? This will erase all drawings. (You can still Undo afterwards.)')) {
          this.dc.clear();
          this._toast('🗑️ Diary page cleared!');
        }
      });
    }

    /* ── Save to localStorage ── */
    _bindSave() {
      const btn = document.getElementById('dt-save');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const ok = saveDiary(this.dc.getDataURL());
        this._toast(ok
          ? '✨ Diary saved! Your memories are safe 🌸'
          : '⚠️ Storage full — please download instead!');
      });
    }

    /* ── Download composite PNG ── */
    _bindDownload() {
      const btn = document.getElementById('dt-download');
      if (!btn) return;
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        const orig = btn.innerHTML;
        btn.innerHTML = '⏳ Preparing…';
        try {
          const url = await exportDiaryPNG(this.dc.getDataURL(), this.currentUser);
          const a   = document.createElement('a');
          a.href = url;
          a.download = `our-diary-${Date.now()}.png`;
          a.click();
          this._toast('⬇️ Downloaded successfully!');
        } catch (err) {
          console.error('[Diary] download error', err);
          alert('Download failed — please try again!');
        }
        btn.disabled = false;
        btn.innerHTML = orig;
      });
    }

    /* ── Toast ── */
    _toast(msg) {
      const el = document.getElementById('diary-toast');
      if (!el) return;
      el.textContent = msg;
      el.classList.remove('diary-toast--hidden');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        el.classList.add('diary-toast--hidden');
      }, 3200);
    }
  }

  /* ─────────────────────────────────────────────
     Bootstrap
  ───────────────────────────────────────────── */
  window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sky-notepad')) {
      window.diaryUI = new DiaryUI();
    }
  });

})();
