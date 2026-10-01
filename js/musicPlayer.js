/**
 * Music Player Controller
 * Handles background music playback, user interaction toggles, volume slider, and track info.
 */

class MusicPlayer {
  constructor() {
    this.audioData = window.sisterData?.audio || {
      url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=sweet-piano-romantic-113884.mp3",
      title: "Sweet Piano Love",
      artist: "For My Prishu"
    };

    this.isPlaying = false;
    this.audio = new Audio(this.audioData.url);
    this.audio.loop = true;
    this.audio.volume = 0.5;

    this.initUI();
  }

  initUI() {
    // Create Floating Music Controller Widget
    const widget = document.createElement('div');
    widget.id = 'music-widget';
    widget.className = 'fixed bottom-6 right-6 z-40 glass-card px-4 py-3 flex items-center gap-3 shadow-xl border border-rose-300 rounded-full transition-all duration-300 hover:scale-105';
    widget.innerHTML = `
      <button id="music-toggle-btn" class="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md focus:outline-none transition-transform hover:scale-110">
        <i id="music-icon" class="fas fa-music text-sm"></i>
      </button>
      <div class="hidden sm:block text-xs">
        <p class="font-bold text-rose-700 truncate max-w-[120px]" id="music-title">${this.audioData.title}</p>
        <p class="text-rose-400 text-[10px]" id="music-status">Click to Play</p>
      </div>
      <input type="range" id="music-volume" min="0" max="1" step="0.05" value="0.5" class="w-16 accent-rose-500 cursor-pointer hidden sm:block">
    `;
    document.body.appendChild(widget);

    // Bind event listeners
    this.toggleBtn = document.getElementById('music-toggle-btn');
    this.icon = document.getElementById('music-icon');
    this.statusText = document.getElementById('music-status');
    this.volumeSlider = document.getElementById('music-volume');

    this.toggleBtn.addEventListener('click', () => this.togglePlay());
    this.volumeSlider.addEventListener('input', (e) => {
      this.audio.volume = e.target.value;
    });

    // Also connect navbar music toggle if exists
    const navMusicBtn = document.getElementById('nav-music-btn');
    if (navMusicBtn) {
      navMusicBtn.addEventListener('click', () => this.togglePlay());
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.icon.className = 'fas fa-pause text-sm';
      this.statusText.textContent = 'Now Playing';
      this.toggleBtn.classList.add('animate-spin-slow');
      
      const navIcon = document.getElementById('nav-music-icon');
      if (navIcon) navIcon.className = 'fas fa-volume-up text-rose-500';
    }).catch(err => {
      console.log('Audio playback error / user gesture needed:', err);
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.icon.className = 'fas fa-music text-sm';
    this.statusText.textContent = 'Paused';
    this.toggleBtn.classList.remove('animate-spin-slow');
    
    const navIcon = document.getElementById('nav-music-icon');
    if (navIcon) navIcon.className = 'fas fa-volume-mute text-gray-400';
  }
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.musicPlayerInstance = new MusicPlayer();
});
