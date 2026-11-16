const openLetter = document.querySelector('#openLetter');
const letterSection = document.querySelector('#letter');
const letterCard = document.querySelector('#letterCard');
const pages = [...document.querySelectorAll('.letter-page')];
const nextPage = document.querySelector('#nextPage');
const nextLabel = document.querySelector('#nextLabel');
const pageCounter = document.querySelector('#pageCounter');
const dots = [...document.querySelectorAll('.progress-dot')];
const revealSection = document.querySelector('#reveal');
const surpriseButton = document.querySelector('#surpriseButton');
const quietToggle = document.querySelector('#quietToggle');
const quietLabel = document.querySelector('#quietLabel');
const toast = document.querySelector('#toast');
const burstLayer = document.querySelector('#heartBurstLayer');
const memoryCards = [...document.querySelectorAll('.memory-card')];

let currentPage = 0;
let toastTimer;

function playChime() {
  if (document.body.classList.contains('quiet-mode')) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(659.25, context.currentTime + 0.22);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.32);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.34);
    oscillator.addEventListener('ended', () => context.close(), { once: true });
  } catch (error) {
    // Audio is an enhancement only; the letter remains fully functional without it.
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

function createHeartBurst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 14) {
  const safeCount = Math.min(count, 26);
  for (let index = 0; index < safeCount; index += 1) {
    const heart = document.createElement('span');
    const angle = (Math.PI * 2 * index) / safeCount + (Math.random() - 0.5) * 0.35;
    const distance = 55 + Math.random() * 145;
    heart.className = 'burst-heart';
    heart.textContent = index % 3 === 0 ? '✦' : '♥';
    heart.style.left = `${originX}px`;
    heart.style.top = `${originY}px`;
    heart.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    heart.style.setProperty('--y', `${Math.sin(angle) * distance - 55}px`);
    heart.style.setProperty('--r', `${Math.round(Math.random() * 80 - 40)}deg`);
    heart.style.setProperty('--size', `${0.7 + Math.random() * 0.9}rem`);
    heart.style.animationDelay = `${Math.random() * 0.12}s`;
    burstLayer.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1500);
  }
}

function updatePage(nextIndex) {
  currentPage = Math.max(0, Math.min(nextIndex, pages.length - 1));
  pages.forEach((page, index) => {
    const active = index === currentPage;
    page.classList.toggle('is-active', active);
    page.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, index) => dot.classList.toggle('is-current', index === currentPage));
  pageCounter.textContent = `${String(currentPage + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
  nextLabel.textContent = currentPage === pages.length - 1 ? 'seal the letter' : 'turn the page';
  letterCard.classList.toggle('final-ready', currentPage === pages.length - 1);
}

function unlockFinal() {
  revealSection.classList.add('is-open');
  revealSection.setAttribute('aria-hidden', 'false');
  playChime();
  createHeartBurst(window.innerWidth / 2, window.innerHeight * 0.5, 20);
  window.setTimeout(() => revealSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 180);
  showToast('One last little truth, Maha.');
}

openLetter.addEventListener('click', () => {
  letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    letterSection.classList.add('is-visited');
    openLetter.blur();
  }, 450);
  playChime();
});

nextPage.addEventListener('click', () => {
  if (currentPage === pages.length - 1) {
    unlockFinal();
    return;
  }
  updatePage(currentPage + 1);
  playChime();
  createHeartBurst(window.innerWidth * 0.5, window.innerHeight * 0.58, 5);
});

surpriseButton.addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
  playChime();
  showToast('This little light is yours to keep.');
});

quietToggle.addEventListener('click', () => {
  const quiet = document.body.classList.toggle('quiet-mode');
  quietToggle.setAttribute('aria-pressed', String(quiet));
  quietLabel.textContent = quiet ? 'quiet mode' : 'soft glow';
  showToast(quiet ? 'The page is taking a softer breath.' : 'The soft glow is back.');
});

memoryCards.forEach((card) => {
  card.addEventListener('click', () => {
    const wasOpen = card.classList.contains('is-open');
    memoryCards.forEach((otherCard) => otherCard.classList.remove('is-open'));
    if (!wasOpen) {
      card.classList.add('is-open');
      card.querySelector('.memory-message').textContent = card.dataset.whisper;
      const rect = card.getBoundingClientRect();
      createHeartBurst(rect.left + rect.width / 2, rect.top + 50, 7);
      playChime();
    }
  });
});

document.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && !event.target.closest('button, a')) {
    createHeartBurst(event.clientX, event.clientY, 4);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && document.activeElement === nextPage) nextPage.click();
});

updatePage(0);
