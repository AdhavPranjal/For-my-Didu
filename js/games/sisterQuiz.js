/**
 * Game 3: Sister Trivia Quiz
 */

class SisterQuizGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.questions = window.sisterData?.games?.quiz || [];
    this.currentIndex = 0;
    this.score = 0;
    this.isCompleted = false;
    this.selectedOption = null;
    this.render();
  }

  render() {
    if (!this.container || this.questions.length === 0) return;

    if (this.isCompleted) {
      this.renderResults();
      return;
    }

    const q = this.questions[this.currentIndex];

    this.container.innerHTML = `
      <div class="glass-card p-6 md:p-8 max-w-xl mx-auto text-center border border-rose-200 shadow-xl">
        <div class="flex items-center justify-between text-xs font-bold text-rose-600 mb-4">
          <span>👑 How Well Do You Know Prishu?</span>
          <span>Question ${this.currentIndex + 1}/${this.questions.length}</span>
          <span>Score: ${this.score}</span>
        </div>

        <h4 class="text-xl font-bold font-heading text-rose-800 mb-6">${q.question}</h4>

        <div class="space-y-3 my-4">
          ${q.options.map((opt, idx) => `
            <button data-index="${idx}" class="quiz-option w-full p-4 rounded-xl border-2 border-rose-200 bg-white/80 hover:bg-rose-50 hover:border-rose-400 text-left font-semibold text-rose-900 transition-all text-sm flex items-center justify-between">
              <span>${opt}</span>
              <span class="text-xs font-bold text-rose-400 hidden check-icon">✓</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-explanation" class="hidden my-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800 text-left">
          💡 <span id="exp-text"></span>
        </div>

        <div class="mt-6 flex justify-end">
          <button id="quiz-next-btn" disabled class="px-6 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md disabled:opacity-50">
            ${this.currentIndex === this.questions.length - 1 ? 'See Results 🏆' : 'Next Question ➡️'}
          </button>
        </div>
      </div>
    `;

    const optionBtns = this.container.querySelectorAll('.quiz-option');
    const expDiv = document.getElementById('quiz-explanation');
    const expText = document.getElementById('exp-text');
    const nextBtn = document.getElementById('quiz-next-btn');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        optionBtns.forEach(b => b.classList.add('pointer-events-none', 'opacity-60'));
        btn.classList.remove('opacity-60');

        if (idx === q.correctIndex) {
          btn.classList.add('bg-green-100', 'border-green-500', 'text-green-900');
          this.score++;
        } else {
          btn.classList.add('bg-rose-100', 'border-rose-500', 'text-rose-900');
          optionBtns[q.correctIndex].classList.add('bg-green-100', 'border-green-500', 'text-green-900');
        }

        expText.textContent = q.explanation;
        expDiv.classList.remove('hidden');
        nextBtn.removeAttribute('disabled');
      });
    });

    nextBtn.addEventListener('click', () => {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.render();
      } else {
        this.isCompleted = true;
        this.render();
      }
    });
  }

  renderResults() {
    const percentage = Math.round((this.score / this.questions.length) * 100);
    let title = "Awesome Sibling! 💖";
    if (percentage === 100) title = "🏆 Perfect Score! Prishu's Ultimate Bestie!";
    else if (percentage >= 50) title = "🌟 Great Job! True Sister Bond!";

    this.container.innerHTML = `
      <div class="glass-card p-8 max-w-xl mx-auto text-center border-2 border-rose-300 shadow-2xl bg-white/90">
        <span class="text-6xl inline-block mb-3 animate-bounce">🏆</span>
        <h4 class="text-2xl font-bold font-heading text-rose-700 mb-2">${title}</h4>
        <p class="text-rose-500 font-medium text-sm mb-6">You scored ${this.score} out of ${this.questions.length} (${percentage}%)!</p>

        <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 mb-6">
          <p class="text-xs text-rose-800 font-semibold">Official Badge Awarded:</p>
          <span class="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-md">
            👑 #1 Sister Expert
          </span>
        </div>

        <button id="restart-quiz-btn" class="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all">
          🔄 Play Again
        </button>
      </div>
    `;

    document.getElementById('restart-quiz-btn').addEventListener('click', () => {
      this.currentIndex = 0;
      this.score = 0;
      this.isCompleted = false;
      this.render();
    });
  }
}

window.SisterQuizGame = SisterQuizGame;
