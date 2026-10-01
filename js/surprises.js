/**
 * surprises.js — Magical Surprise Features
 * For My Didu (Prishu) Website
 *
 * Features:
 *  1. A Message From My Heart   (#heart-messages)
 *  2. Open When You Need a Hug  (#open-when)
 *  3. Virtual Hug Experience    (#virtual-hug)
 *  4. 100 Reasons Why I Love You (#reasons-jar)
 *  5. Wish Upon a Star          (#wish-upon-star)
 *  6. Sister Quiz               (#sister-quiz)
 */

(function () {
  'use strict';

  /* ================================================================
     ✏️  EDITABLE DATA — change all messages, questions, and reasons here
     ================================================================ */

  // ── Feature 1: Heart Messages ──────────────────────────────────────
  const HEART_MESSAGES = [
    { emoji: '💗', msg: "You are not just my sister, you are my safe place. No matter what happens in the world, you make everything feel okay." },
    { emoji: '💖', msg: "Every single day is better simply because I have you in my life. You make ordinary moments feel like magic." },
    { emoji: '💝', msg: "No matter how old we grow, you will always be my most favourite person in the entire world. That will never change." },
    { emoji: '💓', msg: "When I think of home, I think of you. You are my favourite feeling of warmth, safety, and love." },
    { emoji: '💕', msg: "Thank you for always believing in me even when I didn't believe in myself. Your faith in me means the whole world." },
    { emoji: '❤️', msg: "I pray for your happiness every single day — because you deserve every blessing this world has to offer." },
    { emoji: '🌸', msg: "The way you love people — so completely, so gently, so genuinely — it makes me want to be a better person." },
    { emoji: '✨', msg: "I don't say it enough, but I am so proud of you. You are strong, kind, and absolutely wonderful." },
    { emoji: '💗', msg: "Some days I just want to say — thank you for being you. The real you. The you that only our family gets to see." },
  ];

  // ── Feature 3: Open When Envelopes ───────────────────────────────
  const ENVELOPES = [
    {
      icon:   '😢',
      label:  "Open When You're Sad",
      color:  ['#FF6B9D', '#C77DFF'],
      text:   "Hey, my Didu. I know right now it feels heavy and the world feels a little too loud. But please remember — you are so much stronger than you know. Every storm passes. Every hard day ends. And through all of it, I am always here — not just in distance, but in heart. Your tears are valid. Your feelings are real. Let yourself feel it, and then remember — brighter days are coming, and I will be right there beside you when they do. I love you so much. 💕",
    },
    {
      icon:   '🥺',
      label:  "Open When You Miss Me",
      color:  ['#FF4D6D', '#FF9F6B'],
      text:   "My dearest Didu, if you are reading this, it means you thought of me and that alone makes my heart so full. Distance is just a number. Every single morning I wake up thinking about you, hoping your day is beautiful. You are never really far from me — because a part of my heart is always with you, wherever you are. The next time we meet, I promise it will be the best day ever. Until then — this hug is just for you. 🤗",
    },
    {
      icon:   '😊',
      label:  "Open When You Need a Smile",
      color:  ['#FFD166', '#FF6B9D'],
      text:   "Okay, smile right now — because you deserve it! 😄 Remember that time you were being totally dramatic about something tiny and we both ended up laughing until we couldn't breathe? That's my favourite version of us. You have the most beautiful laugh in the world and I wish I could bottle it. Here's a virtual smile from me to you — because the world is always a little brighter when you're smiling. Keep going, sunshine! ☀️",
    },
    {
      icon:   '🤗',
      label:  "Open When You Need a Hug",
      color:  ['#C77DFF', '#FF4D6D'],
      text:   "Come here. Just for a moment, imagine that I am right next to you, wrapping my arms around you as tight as I possibly can. Because that's exactly what I want to do right now. You are loved more than words can say. You are so important to me — your wellbeing, your happiness, your peace. Whatever it is you're going through right now, you don't have to carry it alone. I've got you. Always and forever. 💖",
    },
  ];

  // ── Feature 5: 100 Reasons ────────────────────────────────────────
  const REASONS = [
    "Because you are the kindest person I have ever known.",
    "Because your devotion and faith inspire me every single day.",
    "Because you loved me like a real sister from the very beginning.",
    "Because you never made me feel like an outsider.",
    "Because your smile is literally sunshine.",
    "Because you always know what to say when I am upset.",
    "Because you give love so freely without expecting anything in return.",
    "Because you are genuinely one of the most beautiful people inside and out.",
    "Because you are so determined — when you decide something, nothing stops you.",
    "Because watching you pray fills my heart with the most peaceful feeling.",
    "Because you take your future and your dreams seriously.",
    "Because you treat every person with the same warmth and kindness.",
    "Because you have never made me feel small or unimportant.",
    "Because you always have time for me, no matter how busy you are.",
    "Because you check on me even when you're the one going through hard times.",
    "Because your ambition and drive make me so unbelievably proud.",
    "Because you remember little things that matter to me.",
    "Because your laughter is absolutely contagious.",
    "Because you bring calm into every room you enter.",
    "Because you stand up for people you love without hesitation.",
    "Because you are strong in ways most people will never see.",
    "Because you keep your word — always.",
    "Because you are honest even when it's not easy.",
    "Because you genuinely care about everyone around you.",
    "Because you have your own rules and your own discipline.",
    "Because you have a quiet confidence that I truly admire.",
    "Because you handle difficult people with so much grace.",
    "Because you never gossip or bring people down.",
    "Because you have real friendships built on genuine love.",
    "Because even when things are hard, you keep showing up.",
    "Because you made our shared memories some of my best ones.",
    "Because you always find a reason to be grateful.",
    "Because you are someone people want to be around.",
    "Because you are my safe place in a complicated world.",
    "Because you remind me what real unconditional love looks like.",
    "Because every time I am with you, time feels perfect.",
    "Because you are the first person I want to call when something good happens.",
    "Because you are the first person I want when something goes wrong.",
    "Because you believe in me even when I forget to believe in myself.",
    "Because you make ordinary moments feel like something to treasure.",
    "Because you have a faith that is quiet, deep, and absolutely beautiful.",
    "Because you take care of the people you love with your whole heart.",
    "Because you are someone I genuinely look up to.",
    "Because you make being a good person look effortless.",
    "Because your presence alone makes things better.",
    "Because you have never once made me feel judged.",
    "Because you accept me exactly as I am.",
    "Because you are one of the most genuine humans I know.",
    "Because you always make space for other people's feelings.",
    "Because you are my favourite memory in almost every story I tell.",
    "Because you fill every room with warmth without even trying.",
    "Because you are endlessly patient — even with the most difficult people.",
    "Because your heart is bigger than anyone I have ever met.",
    "Because you love deeply and loyally and without conditions.",
    "Because you are someone worth being proud of — and I am.",
    "Because you work so hard for your dreams and never quit.",
    "Because you make me want to be a better person just by being you.",
    "Because there is nobody in this world I trust more.",
    "Because you are the most real, genuine, unfiltered person I know.",
    "Because time with you is always the best use of time.",
    "Because you remember to celebrate small wins — mine and yours.",
    "Because you are curious and thoughtful and deeply kind.",
    "Because your eyes are full of warmth when you look at people you love.",
    "Because you never make someone feel alone in a room.",
    "Because you know when to talk and when to just sit with someone.",
    "Because you care about things that actually matter.",
    "Because you have a quiet strength that carries everyone around you.",
    "Because you never gave up on any relationship worth having.",
    "Because your integrity is something I deeply respect.",
    "Because you are proud of where you come from.",
    "Because you appreciate simple things in a world obsessed with noise.",
    "Because you are my person. My absolute favourite person.",
    "Because even on hard days, you find something to be thankful for.",
    "Because you protect the people you love with everything you have.",
    "Because you make every celebration feel more special.",
    "Because you have such a beautiful, open, generous soul.",
    "Because you make me feel safe when the world feels uncertain.",
    "Because you have always been consistent — not perfect, but always there.",
    "Because you put your family first, always.",
    "Because you are the kind of person people remember forever.",
    "Because you never stopped being kind even when the world wasn't kind to you.",
    "Because you have grace in how you handle things I know are difficult.",
    "Because you keep going — quietly, steadily, beautifully.",
    "Because you carry so much love for everyone around you.",
    "Because you remind me that family is the greatest gift.",
    "Because you are not just my sister, you are my home.",
    "Because you bring out the best version of me.",
    "Because every memory I have with you is one I cherish.",
    "Because you are irreplaceable. Fully, completely, forever irreplaceable.",
    "Because I could not imagine my life without you.",
    "Because you were there for every important moment of my life.",
    "Because even your flaws make me love you more.",
    "Because you are real. Authentically, beautifully real.",
    "Because loving you is the easiest and most natural thing in the world.",
    "Because you will always be my Didu — my big sister, my best friend.",
    "Because there are 100 reasons and more — and this list will never be long enough.",
    "Because you are everything this website could never fully capture.",
    "Because I love you. Simply, deeply, endlessly. I love you. 💖",
  ];

  // ── Feature 6: Wishes ────────────────────────────────────────────
  const STAR_WISHES = [
    "I wish for you endless happiness, good health, and every dream you carry in your heart to come true. 🌟",
    "I wish for you beautiful mornings filled with peace, and evenings filled with joy and gratitude. 💫",
    "I wish for your future to be as bright and warm as you make every room you walk into. ✨",
    "I wish for every prayer you whisper to be answered with blessings beyond what you imagined. 🙏",
    "I wish for you to always feel as loved as you truly are — because you deserve it all. 💕",
    "I wish for us to make a hundred more beautiful memories together. That's my biggest wish of all. 🌸",
  ];

  const MAKE_A_WISH_MSGS = [
    "Your wish has been sent to the stars, Didu! May every beautiful thing you've dreamed of find its way to you. 🌟",
    "The stars heard you! Sending love, light, and magic your way from me to you. ✨",
    "Wishing on a star — and my wish is always the same: your happiness, your peace, and your joy. 💫",
  ];

  // ── Feature 7: Sister Quiz ────────────────────────────────────────
  const QUIZ_QUESTIONS = [
    {
      q: "What is Prishu's greatest superpower?",
      options: [
        "Making anyone feel better just by being there 💕",
        "Finding calm and peace in every situation 🌿",
        "Knowing what you need before you even ask 🌸",
        "All of the above — she is a total superhero! 🦸‍♀️",
      ],
      correct: 3,
      note: "She genuinely has ALL of these powers — and then some! 🌟",
    },
    {
      q: "What is the fastest way to make Prishu's heart happy?",
      options: [
        "Her peaceful morning पूजा time 🪔",
        "Her favourite playlist playing softly 🎶",
        "A big genuine warm hug from someone she loves 🤗",
        "All of these together — the holy trinity! ✨",
      ],
      correct: 3,
      note: "Devotion + music + warmth = a very happy Prishu! 🌸",
    },
    {
      q: "Which word best describes Prishu?",
      options: [
        "Kind — to her core, always 💕",
        "Strong — quietly, beautifully strong 💪",
        "Devoted — in faith, in love, in life 🙏",
        "All three. She is all three! 💖",
      ],
      correct: 3,
      note: "She is kind AND strong AND devoted. All at once. That's our Prishu! 💖",
    },
    {
      q: "What does Pranjal love most about Prishu?",
      options: [
        "Her contagious, room-filling laughter 😄",
        "The way she loves people so completely and freely 💗",
        "How she makes everyone feel like they belong 🏠",
        "Honestly... everything. Literally everything. 🌸",
      ],
      correct: 3,
      note: "All of it. Every single bit of her. That's the truth. 💕",
    },
    {
      q: "What is the official Pranjal & Prishu sibling motto?",
      options: [
        "Together always — no matter the distance 💕",
        "Laughter is our love language ✨",
        "No secrets, only snacks, only love 🍕",
        "All of the above — and we mean every word! ❤️",
      ],
      correct: 3,
      note: "Our motto is all three rolled into one big, warm, chaotic love! 💖",
    },
  ];

  const QUIZ_RESULT_MSGS = {
    perfect: { emoji: '👑', msg: "100% Perfect! Just like Prishu! 💖", sub: "You know our bond so perfectly — because it was built with so much love, laughter, and years of being each other's favourite person. 🌸" },
    great:   { emoji: '🌟', msg: "Amazing! You Know Us So Well! ✨", sub: "So close to perfect — and honestly, this just proves how strong our bond really is. Always and forever. 💕" },
    good:    { emoji: '💕', msg: "Great Job! Love Wins Always! 🌸", sub: "You got some beautifully right — because our love is real, warm, and something you just feel in your heart. 💗" },
    sweet:   { emoji: '🌸', msg: "So Sweet of You to Try! 💝", sub: "No matter the score, the love here is always a perfect 100/100. That's all that matters. 🌸" },
  };

  /* ================================================================
     UTILITY HELPERS
     ================================================================ */
  function qs(sel, parent) { return (parent || document).querySelector(sel); }
  function qsa(sel, parent) { return [...(parent || document).querySelectorAll(sel)]; }

  function spawnHeartParticles(container, count = 6) {
    const emojis = ['💕', '❤️', '💖', '🌸', '✨', '💗'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'hfh-particle';
      el.textContent = emojis[i % emojis.length];
      el.style.setProperty('--dur', (1.1 + Math.random() * 0.8) + 's');
      el.style.left = (10 + Math.random() * 80) + '%';
      el.style.animationDelay = (Math.random() * 0.5) + 's';
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  function revealOnScroll() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    qsa('.reveal').forEach(el => obs.observe(el));
  }

  /* ================================================================
     FEATURE 7: SISTER QUIZ
     ================================================================ */
  function initSisterQuiz() {
    const section = document.getElementById('sister-quiz');
    if (!section) return;

    let currentQ = 0;
    let score    = 0;
    let answered = false;

    const card       = qs('.quiz-card', section);
    const progressBar = qs('.quiz-progress-bar', section);
    const stepLabel  = qs('.quiz-step-label', section);
    const questionEl = qs('.quiz-question', section);
    const optionsEl  = qs('.quiz-options', section);
    const explanEl   = qs('.quiz-explanation', section);
    const prevBtn    = qs('#quiz-prev', section);
    const nextBtn    = qs('#quiz-next', section);
    const resultEl   = qs('.quiz-result', section);
    const gameEl     = qs('.quiz-game', section);

    function renderQ() {
      answered = false;
      const q = QUIZ_QUESTIONS[currentQ];
      const total = QUIZ_QUESTIONS.length;
      const pct   = (currentQ / total) * 100;

      progressBar.style.width = pct + '%';
      stepLabel.textContent   = `Question ${currentQ + 1} of ${total}`;
      questionEl.textContent  = q.q;
      explanEl.classList.remove('visible');
      explanEl.textContent = '';
      nextBtn.disabled = true;

      const letters = ['A', 'B', 'C', 'D'];
      optionsEl.innerHTML = q.options.map((opt, i) => `
        <button class="quiz-option" data-i="${i}">
          <span class="quiz-option-letter">${letters[i]}</span>
          ${opt}
        </button>
      `).join('');

      qsa('.quiz-option', optionsEl).forEach(btn => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const chosen = parseInt(btn.dataset.i);
          const correct = q.correct;

          qsa('.quiz-option', optionsEl).forEach((b, idx) => {
            b.disabled = true;
            if (idx === correct)  b.classList.add('correct');
            if (idx === chosen && chosen !== correct) b.classList.add('wrong');
          });

          if (chosen === correct) {
            score++;
            if (typeof confetti === 'function') {
              confetti({ particleCount: 40, spread: 55, origin: { y: 0.65 }, colors: ['#FF4D6D','#C77DFF','#FFD166'] });
            }
          }
          explanEl.textContent = q.note;
          explanEl.classList.add('visible');
          nextBtn.disabled = false;
        });
      });

      prevBtn.disabled = currentQ === 0;
    }

    function showResult() {
      gameEl.style.display  = 'none';
      resultEl.style.display = 'block';

      const pct  = score / QUIZ_QUESTIONS.length;
      const res  = pct === 1 ? QUIZ_RESULT_MSGS.perfect
                 : pct >= 0.8 ? QUIZ_RESULT_MSGS.great
                 : pct >= 0.5 ? QUIZ_RESULT_MSGS.good
                 : QUIZ_RESULT_MSGS.sweet;

      qs('.quiz-score-circle span', section).textContent = `${score}/${QUIZ_QUESTIONS.length}`;
      qs('.quiz-score-emoji', section).textContent = res.emoji;
      qs('.quiz-result-msg', section).textContent   = res.msg;
      qs('.quiz-result-sub', section).textContent   = res.sub;

      if (typeof confetti === 'function') {
        setTimeout(() => {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#FF4D6D','#C77DFF','#FFD166','#fff'] });
        }, 300);
      }
    }

    nextBtn.addEventListener('click', () => {
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        currentQ++;
        renderQ();
      } else {
        showResult();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentQ > 0) { currentQ--; score = Math.max(0, score - 1); renderQ(); }
    });

    qs('#quiz-replay', section)?.addEventListener('click', () => {
      currentQ = 0; score = 0;
      resultEl.style.display = 'none';
      gameEl.style.display   = 'block';
      renderQ();
    });

    renderQ();
  }

  /* ================================================================
     FEATURE 1: HEART MESSAGES
     ================================================================ */
  function initHeartMessages() {
    const section = document.getElementById('heart-messages');
    if (!section) return;

    const grid    = qs('.hearts-grid', section);
    const overlay = qs('.heart-modal-overlay', section);
    const msgText = qs('.heart-msg-text', section);
    const msgIcon = qs('.heart-msg-icon', section);
    const closeBtn = qs('.heart-msg-close', section);
    const floatContainer = qs('.heart-floating-hearts', section);

    const colors = ['#FF4D6D','#FF758F','#C77DFF','#FF85A1','#FFB3C1','#E879A0','#D45B87'];

    HEART_MESSAGES.forEach((m, i) => {
      const dur   = (3.5 + Math.random() * 2).toFixed(1);
      const delay = (Math.random() * 2).toFixed(1);
      const col   = colors[i % colors.length];

      const btn = document.createElement('button');
      btn.className = 'heart-bubble';
      btn.style.setProperty('--dur',   dur + 's');
      btn.style.setProperty('--delay', delay + 's');
      btn.setAttribute('aria-label', `Heart message ${i + 1}`);
      btn.innerHTML = `
        <svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="hg${i}" cx="35%" cy="30%">
              <stop offset="0%" stop-color="${col}ee"/>
              <stop offset="100%" stop-color="${col}"/>
            </radialGradient>
          </defs>
          <path d="M50 85 C50 85 5 55 5 28 A25 25 0 0 1 50 18 A25 25 0 0 1 95 28 C95 55 50 85 50 85Z"
                fill="url(#hg${i})" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
        </svg>
        <span class="heart-num">${i + 1}</span>
      `;

      btn.addEventListener('click', () => {
        msgIcon.textContent = m.emoji;
        msgText.textContent = m.msg;
        overlay.classList.add('open');
        if (floatContainer) {
          floatContainer.innerHTML = '';
          setTimeout(() => spawnHeartParticles(floatContainer, 8), 200);
        }
      });

      grid.appendChild(btn);
    });

    function closeModal() { overlay.classList.remove('open'); }
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  /* ================================================================
     FEATURE 3: OPEN WHEN ENVELOPES
     ================================================================ */
  function initOpenWhen() {
    const section = document.getElementById('open-when');
    if (!section) return;

    const grid   = qs('.envelopes-grid', section);
    const reader = qs('.envelope-reader', section);
    const paper  = qs('.envelope-paper', section);

    ENVELOPES.forEach((env, i) => {
      const card = document.createElement('div');
      card.className = 'envelope-card reveal';
      card.style.setProperty('--ec-color-a', env.color[0]);
      card.style.setProperty('--ec-color-b', env.color[1]);
      card.innerHTML = `
        <span class="ec-icon">${env.icon}</span>
        <div class="ec-label">${env.label}</div>
        <div class="ec-sublabel">Tap to open ♡</div>
      `;
      card.addEventListener('click', () => openEnvelope(env));
      grid.appendChild(card);
    });

    function openEnvelope(env) {
      grid.style.display = 'none';
      reader.classList.add('active');

      paper.innerHTML = `
        <div class="envelope-paper-header">
          <span class="envelope-paper-icon">${env.icon}</span>
          <span class="envelope-paper-title">${env.label}</span>
        </div>
        <div class="envelope-paper-text">${env.text}</div>
        <div class="hug-response" id="ow-hug-resp">
          <div class="hug-anim">🫂</div>
          <p class="hug-response-text">A big hug from your Pranjal! No matter where we are, my heart is always with you. 💖</p>
        </div>
        <div style="margin-top:1rem;">
          <button class="hug-btn ow-hug-btn">🫂 Send a Virtual Hug</button>
          <button class="back-btn ow-back-btn">← Back</button>
        </div>
      `;

      qs('.ow-hug-btn', paper).addEventListener('click', () => {
        const resp = qs('#ow-hug-resp', paper);
        resp.classList.add('active');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#FF4D6D','#C77DFF','#FFD166'] });
        }
      });

      qs('.ow-back-btn', paper).addEventListener('click', () => {
        reader.classList.remove('active');
        paper.innerHTML = '';
        grid.style.display = '';
      });
    }
  }

  /* ================================================================
     FEATURE 5: 100 REASONS WHY I LOVE YOU
     ================================================================ */
  function initReasonsJar() {
    const section = document.getElementById('reasons-jar');
    if (!section) return;

    const notesGrid = qs('.jar-notes-grid', section);
    const overlay   = qs('.reason-modal-overlay', section);
    const reasonNum = qs('.reason-num', section);
    const reasonText = qs('.reason-text', section);
    let currentIdx  = 0;

    // Note button colors cycling
    const noteGrads = [
      ['#FF4D6D','#FF758F'],
      ['#C77DFF','#A855F7'],
      ['#FF85A1','#FF4D6D'],
      ['#F59E0B','#EF4444'],
      ['#EC4899','#C77DFF'],
    ];

    REASONS.forEach((reason, i) => {
      const btn = document.createElement('button');
      btn.className = 'jar-note-btn';
      btn.textContent = i + 1;
      const g = noteGrads[i % noteGrads.length];
      btn.style.setProperty('--jn-a', g[0]);
      btn.style.setProperty('--jn-b', g[1]);
      btn.setAttribute('aria-label', `Reason ${i + 1}`);
      btn.setAttribute('title', `Reason ${i + 1}`);
      btn.addEventListener('click', () => { currentIdx = i; openReason(i); btn.classList.add('seen'); });
      notesGrid.appendChild(btn);
    });

    // Jar click → open a random unseen reason
    qs('.jar-visual', section)?.addEventListener('click', () => {
      const unseen = [...Array(REASONS.length).keys()].filter(i => !qsa('.jar-note-btn', notesGrid)[i]?.classList.contains('seen'));
      const idx = unseen.length > 0 ? unseen[Math.floor(Math.random() * unseen.length)] : Math.floor(Math.random() * REASONS.length);
      currentIdx = idx;
      openReason(idx);
    });

    function openReason(idx) {
      currentIdx = idx;
      reasonNum.textContent  = `Reason ${idx + 1} of ${REASONS.length}`;
      reasonText.textContent = REASONS[idx];
      overlay.classList.add('open');
    }

    function closeReason() { overlay.classList.remove('open'); }

    qs('.reason-close', section)?.addEventListener('click', closeReason);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeReason(); });

    qs('#reason-prev', section)?.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + REASONS.length) % REASONS.length;
      openReason(currentIdx);
    });
    qs('#reason-next', section)?.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % REASONS.length;
      openReason(currentIdx);
    });
    qs('#reason-random', section)?.addEventListener('click', () => {
      const idx = Math.floor(Math.random() * REASONS.length);
      openReason(idx);
    });

    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeReason();
      if (e.key === 'ArrowRight') qs('#reason-next', section)?.click();
      if (e.key === 'ArrowLeft')  qs('#reason-prev', section)?.click();
    });
  }

  /* ================================================================
     FEATURE 6: WISH UPON A STAR
     ================================================================ */
  function initWishStar() {
    const section = document.getElementById('wish-upon-star');
    if (!section) return;

    const starsField = qs('.stars-field', section);
    const wishMsgBox = qs('.wish-message-box', section);
    const shootingStar = qs('.shooting-star', section);

    // Generate tiny background stars
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      s.className = 'star-dot';
      const sz = 1 + Math.random() * 2.5;
      s.style.width  = sz + 'px';
      s.style.height = sz + 'px';
      s.style.left   = Math.random() * 100 + '%';
      s.style.top    = Math.random() * 100 + '%';
      s.style.setProperty('--dur',    (2 + Math.random() * 4) + 's');
      s.style.setProperty('--delay',  (Math.random() * 4) + 's');
      s.style.setProperty('--min-op', (0.2 + Math.random() * 0.4).toString());
      starsField.appendChild(s);
    }

    // Clickable stars
    const starPositions = [
      { top: '22%', left: '15%', sz: '2.2rem', dur: '4.5s', delay: '0s' },
      { top: '35%', left: '72%', sz: '2rem',   dur: '5s',   delay: '0.8s' },
      { top: '55%', left: '25%', sz: '1.8rem', dur: '3.8s', delay: '1.5s' },
      { top: '42%', left: '52%', sz: '2.5rem', dur: '4.2s', delay: '0.3s' },
      { top: '18%', left: '55%', sz: '1.7rem', dur: '5.5s', delay: '2s' },
      { top: '65%', left: '68%', sz: '2rem',   dur: '4s',   delay: '1s' },
      { top: '28%', left: '88%', sz: '1.9rem', dur: '3.5s', delay: '0.5s' },
    ];

    starPositions.forEach((pos, i) => {
      const star = document.createElement('button');
      star.className = 'clickable-star';
      star.setAttribute('aria-label', `Star ${i + 1} — click for a wish`);
      star.textContent = '⭐';
      star.style.top   = pos.top;
      star.style.left  = pos.left;
      star.style.setProperty('--sz',    pos.sz);
      star.style.setProperty('--dur',   pos.dur);
      star.style.setProperty('--delay', pos.delay);
      star.style.fontSize = pos.sz;

      star.addEventListener('click', (e) => {
        // Show wish popup near the star
        star.classList.add('glowing');
        setTimeout(() => star.classList.remove('glowing'), 800);

        const wish = STAR_WISHES[i % STAR_WISHES.length];
        showStarPopup(wish, e.clientX, e.clientY);
      });

      section.appendChild(star);
    });

    // Star popup
    const popup = document.createElement('div');
    popup.className = 'star-wish-popup';
    popup.innerHTML = `<div class="star-wish-bubble"></div>`;
    document.body.appendChild(popup);
    let popupTimer = null;

    function showStarPopup(text, x, y) {
      const bubble = qs('.star-wish-bubble', popup);
      bubble.textContent = text;
      popup.style.left = Math.min(x - 20, window.innerWidth - 260) + 'px';
      popup.style.top  = Math.max(y - 120, 80) + 'px';
      popup.classList.remove('show');
      void popup.offsetWidth; // reflow
      popup.classList.add('show');
      clearTimeout(popupTimer);
      popupTimer = setTimeout(() => popup.classList.remove('show'), 4200);
    }

    // Make a Wish button
    let wishIdx = 0;
    qs('.make-wish-btn', section)?.addEventListener('click', () => {
      // Trigger shooting star
      if (shootingStar) {
        shootingStar.classList.remove('fly');
        void shootingStar.offsetWidth;
        shootingStar.classList.add('fly');
      }
      // Show wish message
      const msg = MAKE_A_WISH_MSGS[wishIdx % MAKE_A_WISH_MSGS.length];
      wishIdx++;
      if (wishMsgBox) {
        qs('p', wishMsgBox).textContent = msg;
        wishMsgBox.classList.remove('show');
        void wishMsgBox.offsetWidth;
        wishMsgBox.classList.add('show');
      }
      // Confetti
      if (typeof confetti === 'function') {
        setTimeout(() => {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.55 }, colors: ['#C77DFF','#FFD166','#FF4D6D','#fff'] });
        }, 800);
      }
    });
  }

  /* ================================================================
     FEATURE 4: VIRTUAL HUG
     ================================================================ */
  function initVirtualHug() {
    const section = document.getElementById('virtual-hug');
    if (!section) return;

    const chars   = qs('.hug-chars', section);
    const msg     = qs('.hug-message', section);
    const trigBtn = qs('.hug-trigger-btn', section);
    const replayBtn = qs('.hug-replay-btn', section);
    const burstEl = qs('.hug-hearts-burst', section);

    let hugging = false;

    function startHug() {
      if (hugging) return;
      hugging = true;
      chars.classList.add('hugging');
      trigBtn.style.display = 'none';

      // Burst hearts
      const emojis = ['💕','❤️','💖','🌸','✨','💗','💫'];
      const angles = [0, 45, 90, 135, 180, 225, 270, 315];
      burstEl.innerHTML = '';
      angles.forEach((ang, i) => {
        const el = document.createElement('span');
        el.className = 'hug-heart-p';
        el.textContent = emojis[i % emojis.length];
        const rad  = (ang * Math.PI) / 180;
        const dist = 80 + Math.random() * 50;
        el.style.setProperty('--tx', Math.cos(rad) * dist + 'px');
        el.style.setProperty('--ty', Math.sin(rad) * dist - 60 + 'px');
        el.style.setProperty('--dur', (0.9 + Math.random() * 0.5) + 's');
        el.style.setProperty('--delay', (i * 0.08) + 's');
        burstEl.appendChild(el);
        el.classList.add('burst');
      });

      setTimeout(() => {
        msg.classList.add('show');
        replayBtn.classList.add('show');
      }, 600);

      if (typeof confetti === 'function') {
        setTimeout(() => {
          confetti({ particleCount: 60, spread: 55, origin: { y: 0.55 }, colors: ['#FF4D6D','#C77DFF','#FFD166'] });
        }, 700);
      }
    }

    function resetHug() {
      hugging = false;
      chars.classList.remove('hugging');
      msg.classList.remove('show');
      replayBtn.classList.remove('show');
      trigBtn.style.display = '';
      burstEl.innerHTML = '';
    }

    trigBtn.addEventListener('click', startHug);
    replayBtn.addEventListener('click', resetHug);
  }

  /* ================================================================
     NAV DROPDOWN
     ================================================================ */
  function initNavDropdown() {
    const dropBtn  = document.getElementById('nav-surprises-btn');
    const dropMenu = document.getElementById('nav-surprises-menu');
    if (!dropBtn || !dropMenu) return;

    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropMenu.classList.toggle('open');
      dropBtn.classList.toggle('open', isOpen);
    });
    document.addEventListener('click', () => {
      dropMenu.classList.remove('open');
      dropBtn.classList.remove('open');
    });
    dropMenu.addEventListener('click', () => {
      dropMenu.classList.remove('open');
      dropBtn.classList.remove('open');
    });
  }

  /* ================================================================
     BOOTSTRAP
     ================================================================ */
  function init() {
    initNavDropdown();
    initSisterQuiz();
    initHeartMessages();
    initOpenWhen();
    initReasonsJar();
    initWishStar();
    initVirtualHug();
    revealOnScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
