/**
 * Game 4: Truth or Dare
 */

class TruthOrDareGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = window.sisterData?.games?.truthOrDare || { truths: [], dares: [] };
    this.currentMode = null;
    this.currentPrompt = null;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="glass-card p-6 md:p-8 max-w-xl mx-auto text-center border border-rose-200 shadow-xl">
        <div class="text-xs font-bold text-rose-600 mb-2">🎭 Sibling Bonding</div>
        <h4 class="text-2xl font-bold font-heading text-rose-700 mb-6">Truth or Dare?</h4>

        ${!this.currentMode ? `
          <div class="grid grid-cols-2 gap-4 my-8">
            <button id="pick-truth" class="p-6 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all">
              💬 TRUTH
            </button>
            <button id="pick-dare" class="p-6 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all">
              🔥 DARE
            </button>
          </div>
        ` : `
          <div class="p-8 rounded-3xl ${this.currentMode === 'truth' ? 'bg-rose-50 border-2 border-rose-300' : 'bg-purple-50 border-2 border-purple-300'} my-6 shadow-inner animate-float">
            <span class="inline-block px-3 py-1 ${this.currentMode === 'truth' ? 'bg-rose-500' : 'bg-purple-600'} text-white rounded-full text-xs font-bold uppercase mb-4">
              ${this.currentMode.toUpperCase()}
            </span>
            <p class="text-lg md:text-xl font-bold text-gray-800 leading-relaxed font-heading">
              "${this.currentPrompt}"
            </p>
          </div>

          <div class="flex items-center justify-center gap-4 mt-6">
            <button id="next-tod" class="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all">
              🎲 Draw Another
            </button>
            <button id="reset-tod" class="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs">
              ↩️ Switch Mode
            </button>
          </div>
        `}
      </div>
    `;

    if (!this.currentMode) {
      document.getElementById('pick-truth').addEventListener('click', () => this.draw('truth'));
      document.getElementById('pick-dare').addEventListener('click', () => this.draw('dare'));
    } else {
      document.getElementById('next-tod').addEventListener('click', () => this.draw(this.currentMode));
      document.getElementById('reset-tod').addEventListener('click', () => {
        this.currentMode = null;
        this.currentPrompt = null;
        this.render();
      });
    }
  }

  draw(mode) {
    this.currentMode = mode;
    const list = mode === 'truth' ? this.data.truths : this.data.dares;
    this.currentPrompt = list[Math.floor(Math.random() * list.length)];
    this.render();
  }
}

window.TruthOrDareGame = TruthOrDareGame;
