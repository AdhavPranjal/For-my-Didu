/**
 * Gift Box Surprise Section Controller
 * Includes canvas confetti fireworks & unwrap animation
 */

class GiftSurprise {
  constructor() {
    this.surpriseData = window.sisterData?.surprise;
    this.init();
  }

  init() {
    const container = document.getElementById('surprise-container');
    if (!container || !this.surpriseData) return;

    container.innerHTML = `
      <div class="max-w-3xl mx-auto text-center py-8">
        <h3 class="text-3xl md:text-4xl font-extrabold font-heading text-rose-700 mb-2">${this.surpriseData.giftTitle}</h3>
        <p class="text-rose-500 font-medium mb-8">Tap the gift box below to unlock your special surprise!</p>

        <!-- Animated Gift Box -->
        <div id="gift-box-trigger" class="relative w-48 h-48 md:w-56 md:h-56 mx-auto cursor-pointer group animate-wobble">
          <div class="w-full h-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 rounded-3xl shadow-2xl relative overflow-hidden border-4 border-white/50 group-hover:scale-105 transition-transform duration-300">
            <!-- Ribbon Vertical -->
            <div class="ribbon-vertical"></div>
            <!-- Ribbon Horizontal -->
            <div class="ribbon-horizontal"></div>
            <!-- Bow Bow Top -->
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl z-10 animate-bounce">
              🎀
            </div>
            <!-- Center Sparkle Badge -->
            <div class="absolute inset-0 flex items-center justify-center z-10">
              <span class="w-16 h-16 rounded-full bg-white/90 text-rose-600 flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-125 transition-transform">
                🎁
              </span>
            </div>
          </div>
        </div>

        <p class="mt-6 text-sm font-bold uppercase tracking-wider text-rose-600 animate-pulse">
          ✨ Click to Open Your Gift! ✨
        </p>

        <!-- Gift Reveal Modal -->
        <div id="surprise-modal" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-4 modal-overlay">
          <div class="glass-card max-w-xl w-full p-8 md:p-10 relative max-h-[90vh] overflow-y-auto border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-white to-rose-50 text-center">
            
            <button id="close-surprise-btn" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200 transition-all focus:outline-none">
              <i class="fas fa-times"></i>
            </button>

            <span class="text-6xl inline-block mb-3 animate-bounce">🎉</span>
            <h3 class="text-3xl font-extrabold font-heading text-rose-600 mb-3">${this.surpriseData.messageTitle}</h3>
            <p class="text-gray-700 leading-relaxed text-base md:text-lg mb-6">${this.surpriseData.message}</p>

            <div class="border-t border-b border-rose-200 py-4 my-6">
              <h4 class="text-lg font-bold text-rose-700 mb-3 font-heading">💖 Special Sibling Gift Coupons 💖</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                ${this.surpriseData.giftCoupons.map(coupon => `
                  <div class="p-3 bg-white/90 rounded-xl border border-rose-200 shadow-sm text-xs font-semibold text-rose-700 flex items-center gap-2">
                    ${coupon}
                  </div>
                `).join('')}
              </div>
            </div>

            <p class="text-rose-500 font-handwriting text-3xl">Forever & Always ❤️</p>
          </div>
        </div>
      </div>
    `;

    const giftTrigger = document.getElementById('gift-box-trigger');
    const surpriseModal = document.getElementById('surprise-modal');
    const closeBtn = document.getElementById('close-surprise-btn');

    giftTrigger.addEventListener('click', () => {
      this.triggerConfetti();
      surpriseModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
      surpriseModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    });

    surpriseModal.addEventListener('click', (e) => {
      if (e.target === surpriseModal) {
        surpriseModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    });
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      // Fire confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF4D6D', '#FF758F', '#FFD166', '#FFB3C1', '#FFF']
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new GiftSurprise();
});
