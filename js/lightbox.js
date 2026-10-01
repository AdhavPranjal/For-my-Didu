/**
 * Lightbox Modal Engine for Photo Gallery
 */

class PhotoLightbox {
  constructor() {
    this.currentIndex = 0;
    this.photos = [];
    this.initModal();
  }

  initModal() {
    // Create Lightbox Modal HTML
    const modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.className = 'fixed inset-0 z-50 hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-4 modal-overlay';
    modal.innerHTML = `
      <!-- Close Button -->
      <button id="lightbox-close" class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-all text-xl focus:outline-none z-50">
        <i class="fas fa-times"></i>
      </button>

      <!-- Navigation Left -->
      <button id="lightbox-prev" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-all text-xl focus:outline-none z-50">
        <i class="fas fa-chevron-left"></i>
      </button>

      <!-- Navigation Right -->
      <button id="lightbox-next" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-all text-xl focus:outline-none z-50">
        <i class="fas fa-chevron-right"></i>
      </button>

      <!-- Image Content Container -->
      <div class="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center text-center p-2 relative">
        <img id="lightbox-img" src="" alt="Photo" class="max-h-[70vh] max-w-full rounded-2xl shadow-2xl object-contain border-4 border-white/20 transition-all duration-300">
        
        <div class="mt-4 text-white">
          <h3 id="lightbox-title" class="text-2xl font-bold font-heading text-rose-300"></h3>
          <p id="lightbox-caption" class="text-sm text-gray-200 mt-1 max-w-lg mx-auto font-light"></p>
          <span id="lightbox-counter" class="inline-block mt-2 px-3 py-1 bg-white/10 rounded-full text-xs text-rose-200"></span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Bind event listeners
    this.modalEl = document.getElementById('lightbox-modal');
    this.imgEl = document.getElementById('lightbox-img');
    this.titleEl = document.getElementById('lightbox-title');
    this.captionEl = document.getElementById('lightbox-caption');
    this.counterEl = document.getElementById('lightbox-counter');

    document.getElementById('lightbox-close').addEventListener('click', () => this.close());
    document.getElementById('lightbox-prev').addEventListener('click', () => this.prev());
    document.getElementById('lightbox-next').addEventListener('click', () => this.next());

    // Close on backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.modalEl.classList.contains('hidden')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  open(photos, startIndex = 0) {
    this.photos = photos;
    this.currentIndex = startIndex;
    this.updateContent();
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  updateContent() {
    const item = this.photos[this.currentIndex];
    if (!item) return;

    this.imgEl.src = item.url;
    this.titleEl.textContent = item.title;
    this.captionEl.textContent = item.caption;
    this.counterEl.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.updateContent();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.updateContent();
  }
}

// Global instance
window.photoLightbox = new PhotoLightbox();
