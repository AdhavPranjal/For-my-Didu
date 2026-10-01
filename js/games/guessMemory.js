/**
 * Game 5: Guess the Secret Memory
 */

class GuessMemoryGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.memories = window.sisterData?.games?.guessMemory || [];
    this.currentIndex = 0;
    this.revealedClues = 1;
    this.isAnswerRevealed = false;
    this.render();
  }

  render() {
    if (!this.container || this.memories.length === 0) return;

    const m = this.memories[this.currentIndex];
    // Blur strength decreases as clues are revealed
    const blurAmount = this.isAnswerRevealed ? 0 : Math.max(0, 20 - (this.revealedClues * 6));

    this.container.innerHTML = `
      <div class="glass-card p-6 md:p-8 max-w-xl mx-auto text-center border border-rose-200 shadow-xl">
        <div class="flex items-center justify-between text-xs font-bold text-rose-600 mb-4">
          <span>🔍 Guess The Secret Memory</span>
          <span>Memory ${this.currentIndex + 1}/${this.memories.length}</span>
        </div>

        <h4 class="text-xl font-bold font-heading text-rose-800 mb-4">${m.title}</h4>

        <!-- Blurred Photo Preview -->
        <div class="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden my-4 border-4 border-rose-200 shadow-md">
          <img src="${m.image}" alt="Secret Memory" style="filter: blur(${blurAmount}px); transition: filter 0.5s ease;" class="w-full h-full object-cover">
          ${!this.isAnswerRevealed ? `
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span class="px-4 py-2 rounded-full bg-black/60 text-white font-bold text-xs backdrop-blur-sm">
                🔒 Image ${this.revealedClues}/${m.clues.length} Clues Unblurred
              </span>
            </div>
          ` : ''}
        </div>

        <!-- Clues List -->
        <div class="space-y-2 my-4 text-left">
          ${m.clues.slice(0, this.revealedClues).map((clue, idx) => `
            <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-900 animate-fadeIn">
              💡 ${clue}
            </div>
          `).join('')}
        </div>

        ${this.isAnswerRevealed ? `
          <div class="p-4 bg-green-100 border-2 border-green-500 rounded-2xl text-green-900 font-bold text-sm my-4 animate-bounce">
            🎉 Secret Memory Revealed: "${m.answer}"
          </div>
        ` : ''}

        <!-- Game Controls -->
        <div class="flex flex-wrap items-center justify-center gap-3 mt-6">
          ${this.revealedClues < m.clues.length && !this.isAnswerRevealed ? `
            <button id="next-clue-btn" class="px-5 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs">
              💡 Reveal Next Clue
            </button>
          ` : ''}

          ${!this.isAnswerRevealed ? `
            <button id="reveal-ans-btn" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all">
              🔓 Reveal Answer!
            </button>
          ` : `
            <button id="next-memory-btn" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all">
              Next Secret Memory ➡️
            </button>
          `}
        </div>
      </div>
    `;

    const nextClueBtn = document.getElementById('next-clue-btn');
    const revealAnsBtn = document.getElementById('reveal-ans-btn');
    const nextMemBtn = document.getElementById('next-memory-btn');

    if (nextClueBtn) {
      nextClueBtn.addEventListener('click', () => {
        this.revealedClues++;
        this.render();
      });
    }

    if (revealAnsBtn) {
      revealAnsBtn.addEventListener('click', () => {
        this.isAnswerRevealed = true;
        this.render();
        if (typeof confetti === 'function') confetti({ particleCount: 70, spread: 60 });
      });
    }

    if (nextMemBtn) {
      nextMemBtn.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex + 1) % this.memories.length;
        this.revealedClues = 1;
        this.isAnswerRevealed = false;
        this.render();
      });
    }
  }
}

window.GuessMemoryGame = GuessMemoryGame;
