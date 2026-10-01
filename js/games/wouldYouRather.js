/**
 * Game 1: Would You Rather
 */

class WouldYouRatherGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.questions = window.sisterData?.games?.wouldYouRather || [];
    this.currentIndex = 0;
    this.render();
  }

  render() {
    if (!this.container || this.questions.length === 0) return;

    const q = this.questions[this.currentIndex];

    this.container.innerHTML = `
      <div class="glass-card p-6 md:p-8 max-w-xl mx-auto text-center border border-rose-200 shadow-xl">
        <div class="flex items-center justify-between text-xs text-rose-500 font-bold mb-4">
          <span>🎮 Would You Rather?</span>
          <span>Question ${this.currentIndex + 1} of ${this.questions.length}</span>
        </div>

        <h4 class="text-xl md:text-2xl font-bold font-heading text-rose-700 mb-6">Choose One!</h4>

        <div class="grid grid-cols-1 gap-4 my-6">
          <button id="option-a" class="p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-100 border-2 border-rose-300 hover:border-rose-500 text-rose-800 font-semibold text-left transition-all hover:scale-[1.02] flex flex-col justify-between">
            <span class="text-base">${q.optionA}</span>
            <span id="stats-a" class="hidden text-xs text-rose-600 font-bold mt-2 pt-2 border-t border-rose-200">${q.statsA}% of Sibling Votes</span>
          </button>

          <div class="text-xs font-bold text-rose-400 uppercase tracking-widest my-1">- OR -</div>

          <button id="option-b" class="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-100 border-2 border-purple-300 hover:border-purple-500 text-purple-900 font-semibold text-left transition-all hover:scale-[1.02] flex flex-col justify-between">
            <span class="text-base">${q.optionB}</span>
            <span id="stats-b" class="hidden text-xs text-purple-600 font-bold mt-2 pt-2 border-t border-purple-200">${q.statsB}% of Sibling Votes</span>
          </button>
        </div>

        <div class="flex items-center justify-between mt-6">
          <button id="wyr-prev" ${this.currentIndex === 0 ? 'disabled' : ''} class="px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-bold text-xs hover:bg-rose-200 disabled:opacity-40">
            Previous
          </button>
          <button id="wyr-next" class="px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all">
            ${this.currentIndex === this.questions.length - 1 ? 'Finish Game' : 'Next Question'}
          </button>
        </div>
      </div>
    `;

    const optA = document.getElementById('option-a');
    const optB = document.getElementById('option-b');
    const statsA = document.getElementById('stats-a');
    const statsB = document.getElementById('stats-b');
    const nextBtn = document.getElementById('wyr-next');
    const prevBtn = document.getElementById('wyr-prev');

    const handleSelect = (selected) => {
      statsA.classList.remove('hidden');
      statsB.classList.remove('hidden');
      if (selected === 'a') {
        optA.classList.add('bg-rose-200', 'border-rose-600');
      } else {
        optB.classList.add('bg-purple-200', 'border-purple-600');
      }
    };

    optA.addEventListener('click', () => handleSelect('a'));
    optB.addEventListener('click', () => handleSelect('b'));

    nextBtn.addEventListener('click', () => {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.render();
      } else {
        alert('🎉 Yay! You finished Would You Rather!');
        this.currentIndex = 0;
        this.render();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.render();
        }
      });
    }
  }
}

window.WouldYouRatherGame = WouldYouRatherGame;
