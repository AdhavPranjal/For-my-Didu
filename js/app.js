/**
 * Main Application Script - Prishu
 * Orchestrates Navbar, Hero, About, Photo Gallery, Memories, Navigation, ScrollSpy
 */

class DiduApp {
  constructor() {
    this.data = window.sisterData;
    this.currentCategory = 'All';
    this.init();
  }

  init() {
    if (!this.data) return;

    this.renderHero();
    this.renderAbout();
    this.renderGallery();
    this.renderMemories();
    this.setupNavbar();
    this.setupScrollSpy();
  }

  renderHero() {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroBtn = document.getElementById('hero-open-btn');

    if (heroTitle) heroTitle.textContent = `${this.data.sisterInfo.name} 🌸`;
    if (heroSubtitle) heroSubtitle.textContent = this.data.sisterInfo.tagline;

    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        const aboutSec = document.getElementById('about');
        if (aboutSec) {
          aboutSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  renderAbout() {
    const container = document.getElementById('about-content');
    if (!container) return;

    const info = this.data.sisterInfo;

    container.innerHTML = `
      <!-- Sister Intro Header Card -->
      <div class="glass-card p-8 md:p-12 mb-12 text-center border-2 border-rose-200 shadow-xl bg-white/80 relative overflow-hidden">
        <!-- Subtle decorative hearts -->
        <div class="absolute top-4 left-6 text-rose-200 text-3xl select-none pointer-events-none animate-float">🌸</div>
        <div class="absolute top-4 right-6 text-rose-200 text-3xl select-none pointer-events-none animate-float" style="animation-delay:1s">✨</div>
        <div class="absolute bottom-4 left-10 text-rose-100 text-2xl select-none pointer-events-none animate-float" style="animation-delay:0.5s">💖</div>
        <div class="absolute bottom-4 right-10 text-rose-100 text-2xl select-none pointer-events-none animate-float" style="animation-delay:1.5s">🌸</div>
        <span class="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider mb-4">
          ✨ Know About Prishu ✨
        </span>
        <h3 class="text-3xl md:text-4xl font-extrabold font-heading text-rose-700 mb-2">${info.fullName}</h3>
        <p class="text-rose-500 font-semibold text-lg font-handwriting mb-5">${info.role}</p>
        <p class="text-gray-700 max-w-2xl mx-auto leading-relaxed text-base">${info.bio}</p>
      </div>

      <!-- Section Label -->
      <div class="text-center mb-8">
        <p class="text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">What Makes Her So Special</p>
        <h3 class="text-2xl md:text-3xl font-extrabold font-heading text-rose-700">The Real Prishu 💖</h3>
        <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">These are not just words — these are the things I have seen, felt, and will always be grateful for.</p>
      </div>

      <!-- 10 Quality Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
        ${info.qualities.map((q, i) => {
          // Alternate subtle accent tints for visual rhythm
          const accents = [
            'border-rose-200 hover:border-rose-400',
            'border-pink-200 hover:border-pink-400',
            'border-fuchsia-100 hover:border-fuchsia-300',
          ];
          const accent = accents[i % accents.length];
          return `
            <div class="glass-card p-6 border-2 ${accent} hover:scale-[1.03] hover:shadow-rose-200/60 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
              <!-- Subtle bg glow on hover -->
              <div class="absolute inset-0 bg-gradient-to-br from-rose-50/60 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
              <div class="relative flex flex-col h-full">
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-3xl w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">${q.icon}</span>
                  <h4 class="text-base font-extrabold font-heading text-rose-800 leading-tight">${q.title}</h4>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed flex-1">${q.description}</p>
                <!-- Bottom accent line -->
                <div class="mt-4 h-0.5 w-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Things I Love & Funny Memories Dual Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Things I Love -->
        <div class="glass-card p-6 md:p-8 border border-rose-200">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl">💖</span>
            <h4 class="text-2xl font-bold font-heading text-rose-700">Things I Love About Her</h4>
          </div>
          <ul class="space-y-3">
            ${info.thingsILove.map(item => `
              <li class="flex items-start gap-3 text-sm text-gray-700 font-medium">
                <span class="text-rose-500 mt-1">❤️</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Funny / Cute Habits -->
        <div class="glass-card p-6 md:p-8 border border-rose-200">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl">🤪</span>
            <h4 class="text-2xl font-bold font-heading text-rose-700">Funny Sibling Moments</h4>
          </div>
          <ul class="space-y-3">
            ${info.funnyMemories.map(item => `
              <li class="flex items-start gap-3 text-sm text-gray-700 font-medium">
                <span class="text-rose-500 mt-1">✨</span>
                <span>${item}</span>
              </li>
            `).join('')}
          </ul>
        </div>

      </div>
    `;
  }


  renderGallery() {
    const filterContainer = document.getElementById('gallery-filters');
    const gridContainer = document.getElementById('gallery-grid');
    if (!gridContainer || !filterContainer) return;

    // Get categories
    const categories = ['All', ...new Set(this.data.photos.map(p => p.category))];

    // Render Filter Buttons
    filterContainer.innerHTML = categories.map(cat => `
      <button data-cat="${cat}" class="gallery-filter-btn px-5 py-2 rounded-full text-xs font-bold transition-all ${cat === this.currentCategory ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'bg-white/80 text-rose-700 hover:bg-rose-100'}">
        ${cat}
      </button>
    `).join('');

    // Filter click handler
    filterContainer.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.getAttribute('data-cat');
        this.renderGallery();
      });
    });

    // Filter photos
    const filteredPhotos = this.currentCategory === 'All' 
      ? this.data.photos 
      : this.data.photos.filter(p => p.category === this.currentCategory);

    // Render Photo Cards
    gridContainer.innerHTML = filteredPhotos.map((photo, index) => `
      <div data-index="${index}" class="photo-card glass-card overflow-hidden group cursor-pointer hover:scale-[1.03] transition-all duration-300">
        <div class="relative overflow-hidden bg-rose-100" style="aspect-ratio:3/4;">
          <img
            src="${photo.url}"
            alt="${photo.title}"
            class="w-full h-full transition-transform duration-500 group-hover:scale-110"
            style="object-fit:cover;object-position:center top;"
            loading="lazy"
            onerror="this.onerror=null;this.src='images/placeholder.svg';this.style.objectFit='contain';"
          >
          <span class="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-[10px] font-bold">
            ${photo.category}
          </span>
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span class="text-white text-xs font-bold flex items-center gap-1">
              <i class="fas fa-search-plus"></i> View Full Photo
            </span>
          </div>
        </div>
        <div class="p-4 text-left">
          <h4 class="font-bold text-base text-rose-800 font-heading">${photo.title}</h4>
          <p class="text-xs text-gray-600 line-clamp-2 mt-1">${photo.caption}</p>
        </div>
      </div>
    `).join('');

    // Lightbox click handler
    gridContainer.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-index'));
        if (window.photoLightbox) {
          window.photoLightbox.open(filteredPhotos, index);
        }
      });
    });
  }

  renderMemories() {
    const container = document.getElementById('memories-timeline');
    if (!container) return;

    const memories = this.data.memories;

    container.innerHTML = `
      <div class="relative max-w-4xl mx-auto py-6">
        <!-- Vertical Line -->
        <div class="hidden sm:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-300 via-pink-400 to-rose-300 -translate-x-1/2 rounded-full"></div>

        <div class="space-y-12">
          ${memories.map((m, idx) => {
            const isEven = idx % 2 === 0;
            return `
              <div class="relative flex flex-col sm:flex-row items-center ${isEven ? 'sm:flex-row-reverse' : ''}">
                
                <!-- Content Box -->
                <div class="w-full sm:w-1/2 p-4">
                  <div class="glass-card p-6 border border-rose-200 hover:scale-105 transition-transform">
                    <span class="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
                      ${m.badge} • ${m.year}
                    </span>
                    <h4 class="text-xl font-bold font-heading text-rose-800 mb-2">${m.title}</h4>
                    <p class="text-xs text-gray-600 leading-relaxed mb-4">${m.description}</p>
                    <div class="h-40 rounded-xl overflow-hidden shadow-md">
                      <img src="${m.image}" alt="${m.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onerror="this.onerror=null;this.src='images/placeholder.svg';">
                    </div>
                  </div>
                </div>

                <!-- Center Heart Icon -->
                <div class="my-2 sm:my-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white z-10">
                  ❤️
                </div>

                <div class="hidden sm:block sm:w-1/2"></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  setupNavbar() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('hidden');
      });

      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.add('hidden');
        });
      });
    }
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) {
          current = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('text-rose-600', 'font-bold', 'border-b-2', 'border-rose-500');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('text-rose-600', 'font-bold', 'border-b-2', 'border-rose-500');
        }
      });
    });
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.diduApp = new DiduApp();
});
