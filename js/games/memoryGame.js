/**
 * Game 2: Memory Card Matching Game
 */

class MemoryMatchingGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cardData = window.sisterData?.games?.memoryCards || [];
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isLockBoard = false;
    
    this.initDeck();
    this.render();
  }

  initDeck() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.isLockBoard = false;

    // Duplicate and shuffle cards
    const deck = [...this.cardData, ...this.cardData].map((item, index) => ({
      uniqueId: index,
      pairId: item.id,
      emoji: item.emoji,
      name: item.name,
      isFlipped: false,
      isMatched: false
    }));

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    this.cards = deck;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card p-4 md:p-6 max-w-xl mx-auto text-center border border-rose-200 shadow-xl">
        <div class="flex items-center justify-between mb-4 text-xs font-bold text-rose-600">
          <span>🧠 Memory Matching</span>
          <span>Moves: <strong id="moves-count" class="text-base text-rose-700">${this.moves}</strong></span>
          <span>Matches: <strong id="matches-count" class="text-base text-rose-700">${this.matchedPairs}/${this.cardData.length}</strong></span>
          <button id="reset-memory-btn" class="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-full text-xs">
            🔄 Restart
          </button>
        </div>

        <div class="grid grid-cols-4 gap-2 sm:gap-3 my-4">
          ${this.cards.map((card, idx) => `
            <div data-index="${idx}" class="memory-card flip-card h-20 sm:h-24 ${card.isFlipped || card.isMatched ? 'flipped' : ''}">
              <div class="flip-card-inner">
                <!-- Card Front (Cover) -->
                <div class="flip-card-front bg-gradient-to-tr from-rose-400 to-pink-300 border-2 border-white/60 shadow-md text-white text-2xl font-bold select-none rounded-2xl hover:scale-105 transition-transform">
                  🎁
                </div>
                <!-- Card Back (Emoji) -->
                <div class="flip-card-back bg-white border-2 ${card.isMatched ? 'border-green-400 bg-green-50' : 'border-rose-300'} shadow-md text-3xl select-none rounded-2xl">
                  ${card.emoji}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <p class="text-xs text-rose-400 font-medium mt-2">Find all matching emoji pairs to win!</p>
      </div>
    `;

    // Event handlers for cards
    const cardEls = this.container.querySelectorAll('.memory-card');
    cardEls.forEach(cardEl => {
      cardEl.addEventListener('click', (e) => {
        const index = parseInt(cardEl.getAttribute('data-index'));
        this.flipCard(index);
      });
    });

    document.getElementById('reset-memory-btn').addEventListener('click', () => {
      this.initDeck();
      this.render();
    });
  }

  flipCard(index) {
    if (this.isLockBoard) return;
    const card = this.cards[index];
    if (card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    this.flippedCards.push({ card, index });
    this.render();

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLockBoard = true;
    const [c1, c2] = this.flippedCards;

    if (c1.card.pairId === c2.card.pairId) {
      // Match found
      c1.card.isMatched = true;
      c2.card.isMatched = true;
      this.matchedPairs++;
      this.flippedCards = [];
      this.isLockBoard = false;
      this.render();

      if (this.matchedPairs === this.cardData.length) {
        setTimeout(() => {
          if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
          alert(`🎉 Outstanding! You matched all pairs in ${this.moves} moves!`);
        }, 300);
      }
    } else {
      // Not a match -> flip back after delay
      setTimeout(() => {
        c1.card.isFlipped = false;
        c2.card.isFlipped = false;
        this.flippedCards = [];
        this.isLockBoard = false;
        this.render();
      }, 900);
    }
  }
}

window.MemoryMatchingGame = MemoryMatchingGame;
