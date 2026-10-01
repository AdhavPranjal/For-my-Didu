/**
 * Games Section Hub Controller
 * Manages tab switching between 5 games and back-to-menu navigation.
 */

class GamesHub {
  constructor() {
    this.activeGame = null;
    this.init();
  }

  init() {
    const hubContainer = document.getElementById('games-hub-container');
    const viewContainer = document.getElementById('game-view-container');
    if (!hubContainer || !viewContainer) return;

    this.hubContainer = hubContainer;
    this.viewContainer = viewContainer;

    this.renderHub();
  }

  renderHub() {
    this.viewContainer.classList.add('hidden');
    this.hubContainer.classList.remove('hidden');

    this.hubContainer.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        <!-- Game 1 Card -->
        <div data-game="wyr" class="game-select-card glass-card p-6 text-center cursor-pointer group hover:scale-105 transition-all">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
            🤔
          </div>
          <h4 class="text-xl font-bold font-heading text-rose-700 mb-2">Would You Rather</h4>
          <p class="text-xs text-gray-600 mb-4">Choose between fun sister dilemmas & see vote stats!</p>
          <span class="inline-block px-4 py-2 rounded-full bg-rose-100 group-hover:bg-rose-500 group-hover:text-white text-rose-700 font-bold text-xs transition-colors">
            Play Game 🎮
          </span>
        </div>

        <!-- Game 2 Card -->
        <div data-game="memory" class="game-select-card glass-card p-6 text-center cursor-pointer group hover:scale-105 transition-all">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-400 text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
            🧠
          </div>
          <h4 class="text-xl font-bold font-heading text-pink-700 mb-2">Memory Match</h4>
          <p class="text-xs text-gray-600 mb-4">Match sister emoji pairs & beat your move record!</p>
          <span class="inline-block px-4 py-2 rounded-full bg-pink-100 group-hover:bg-pink-500 group-hover:text-white text-pink-700 font-bold text-xs transition-colors">
            Play Game 🎮
          </span>
        </div>

        <!-- Game 3 Card -->
        <div data-game="quiz" class="game-select-card glass-card p-6 text-center cursor-pointer group hover:scale-105 transition-all">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
            👑
          </div>
          <h4 class="text-xl font-bold font-heading text-amber-700 mb-2">Sister Quiz</h4>
          <p class="text-xs text-gray-600 mb-4">Test your knowledge about Prishu & win official badges!</p>
          <span class="inline-block px-4 py-2 rounded-full bg-amber-100 group-hover:bg-amber-500 group-hover:text-white text-amber-800 font-bold text-xs transition-colors">
            Play Game 🎮
          </span>
        </div>

        <!-- Game 4 Card -->
        <div data-game="tod" class="game-select-card glass-card p-6 text-center cursor-pointer group hover:scale-105 transition-all">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-rose-400 text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
            🎭
          </div>
          <h4 class="text-xl font-bold font-heading text-purple-700 mb-2">Truth or Dare</h4>
          <p class="text-xs text-gray-600 mb-4">Cute sister bonding challenges & honest secrets!</p>
          <span class="inline-block px-4 py-2 rounded-full bg-purple-100 group-hover:bg-purple-500 group-hover:text-white text-purple-700 font-bold text-xs transition-colors">
            Play Game 🎮
          </span>
        </div>

        <!-- Game 5 Card -->
        <div data-game="guess" class="game-select-card glass-card p-6 text-center cursor-pointer group hover:scale-105 transition-all sm:col-span-2 lg:col-span-1">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-400 to-red-400 text-white text-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform">
            🔍
          </div>
          <h4 class="text-xl font-bold font-heading text-rose-700 mb-2">Guess The Memory</h4>
          <p class="text-xs text-gray-600 mb-4">Unblur the mystery photos clue-by-clue!</p>
          <span class="inline-block px-4 py-2 rounded-full bg-rose-100 group-hover:bg-rose-500 group-hover:text-white text-rose-700 font-bold text-xs transition-colors">
            Play Game 🎮
          </span>
        </div>

      </div>
    `;

    // Click handler for game cards
    const cards = this.hubContainer.querySelectorAll('.game-select-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const gameKey = card.getAttribute('data-game');
        this.launchGame(gameKey);
      });
    });
  }

  launchGame(gameKey) {
    this.hubContainer.classList.add('hidden');
    this.viewContainer.classList.remove('hidden');

    this.viewContainer.innerHTML = `
      <div class="mb-6 flex justify-start">
        <button id="back-to-hub-btn" class="px-5 py-2 rounded-full bg-white/90 hover:bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs shadow-md flex items-center gap-2 hover:scale-105 transition-all">
          ⬅️ Back to Games Menu
        </button>
      </div>
      <div id="active-game-board"></div>
    `;

    document.getElementById('back-to-hub-btn').addEventListener('click', () => {
      this.renderHub();
    });

    if (gameKey === 'wyr') {
      new window.WouldYouRatherGame('active-game-board');
    } else if (gameKey === 'memory') {
      new window.MemoryMatchingGame('active-game-board');
    } else if (gameKey === 'quiz') {
      new window.SisterQuizGame('active-game-board');
    } else if (gameKey === 'tod') {
      new window.TruthOrDareGame('active-game-board');
    } else if (gameKey === 'guess') {
      new window.GuessMemoryGame('active-game-board');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new GamesHub();
});
