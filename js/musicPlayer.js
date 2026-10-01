/**
 * Music Player Controller
 * Handles background music playback using YouTube IFrame Player API,
 * user interaction toggles, volume slider, and track info.
 */

class MusicPlayer {
  constructor() {
    this.audioData = window.sisterData?.audio || {
      youtubeId: "SQ4jZ-EAL88",
      title: "Vaaroon Forever",
      artist: "For My Prishu"
    };

    this.videoId = this.audioData.youtubeId || "SQ4jZ-EAL88";
    this.isPlaying = false;
    this.isReady = false;
    this.pendingPlay = false;
    this.player = null;

    this.initUI();
    this.loadYouTubeAPI();
  }

  initUI() {
    // Create hidden YouTube container if not present
    if (!document.getElementById('yt-player-container')) {
      const ytContainer = document.createElement('div');
      ytContainer.id = 'yt-player-container';
      ytContainer.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px;left:-9999px;overflow:hidden;';
      ytContainer.innerHTML = '<div id="yt-player"></div>';
      document.body.appendChild(ytContainer);
    }

    // Create Floating Music Controller Widget
    const widget = document.createElement('div');
    widget.id = 'music-widget';
    widget.className = 'fixed bottom-6 right-6 z-40 glass-card px-4 py-3 flex items-center gap-3 shadow-xl border border-rose-300 rounded-full transition-all duration-300 hover:scale-105';
    widget.innerHTML = `
      <button id="music-toggle-btn" class="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md focus:outline-none transition-transform hover:scale-110">
        <i id="music-icon" class="fas fa-music text-sm"></i>
      </button>
      <div class="hidden sm:block text-xs">
        <p class="font-bold text-rose-700 truncate max-w-[120px]" id="music-title">${this.audioData.title || 'Vaaroon Forever'}</p>
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
      const vol = Math.round(parseFloat(e.target.value) * 100);
      if (this.player && typeof this.player.setVolume === 'function') {
        this.player.setVolume(vol);
      }
    });

    // Also connect navbar music toggle if exists
    const navMusicBtn = document.getElementById('nav-music-btn');
    if (navMusicBtn) {
      navMusicBtn.addEventListener('click', () => this.togglePlay());
    }
  }

  loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      this.initYTPlayer();
      return;
    }

    const previousOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousOnReady === 'function') {
        previousOnReady();
      }
      this.initYTPlayer();
    };

    // Inject YouTube IFrame API script if not present
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Fallback interval in case window.YT initializes asynchronously
    const checkYTInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYTInterval);
        this.initYTPlayer();
      }
    }, 100);
    setTimeout(() => clearInterval(checkYTInterval), 10000);
  }

  initYTPlayer() {
    if (this.player) return;

    this.player = new YT.Player('yt-player', {
      height: '0',
      width: '0',
      videoId: this.videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        loop: 1,
        playlist: this.videoId,
        playsinline: 1
      },
      events: {
        onReady: (event) => this.onPlayerReady(event),
        onStateChange: (event) => this.onPlayerStateChange(event),
        onError: (err) => console.log('YouTube Player Error:', err)
      }
    });
  }

  onPlayerReady(event) {
    this.isReady = true;
    if (this.player && typeof this.player.setVolume === 'function') {
      const initialVol = Math.round((parseFloat(this.volumeSlider.value) || 0.5) * 100);
      this.player.setVolume(initialVol);
    }

    if (this.pendingPlay) {
      this.pendingPlay = false;
      this.play();
    }
  }

  onPlayerStateChange(event) {
    if (!window.YT) return;
    if (event.data === window.YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.updatePlayingUI();
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.updatePausedUI();
    } else if (event.data === window.YT.PlayerState.ENDED) {
      if (this.player && typeof this.player.playVideo === 'function') {
        this.player.playVideo();
      }
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
    if (this.isReady && this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
      } catch (err) {
        console.log('Error calling playVideo:', err);
      }
    } else {
      this.pendingPlay = true;
    }
    this.isPlaying = true;
    this.updatePlayingUI();
  }

  pause() {
    this.pendingPlay = false;
    if (this.isReady && this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch (err) {
        console.log('Error calling pauseVideo:', err);
      }
    }
    this.isPlaying = false;
    this.updatePausedUI();
  }

  updatePlayingUI() {
    if (this.icon) this.icon.className = 'fas fa-pause text-sm';
    if (this.statusText) this.statusText.textContent = 'Now Playing';
    if (this.toggleBtn) this.toggleBtn.classList.add('animate-spin-slow');

    const navIcon = document.getElementById('nav-music-icon');
    if (navIcon) navIcon.className = 'fas fa-volume-up text-rose-500';
  }

  updatePausedUI() {
    if (this.icon) this.icon.className = 'fas fa-music text-sm';
    if (this.statusText) this.statusText.textContent = 'Paused';
    if (this.toggleBtn) this.toggleBtn.classList.remove('animate-spin-slow');

    const navIcon = document.getElementById('nav-music-icon');
    if (navIcon) navIcon.className = 'fas fa-volume-mute text-gray-400';
  }
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.musicPlayerInstance = new MusicPlayer();
});
