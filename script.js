const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');

items.forEach((item, index) => {
  if (item.closest('.hero')) return;
  const direction = index % 3 === 1 ? 'left' : index % 3 === 2 ? 'right' : 'up';
  item.dataset.reveal = direction;
});

document.body.classList.add('invitation-locked');

const opening = document.getElementById('opening');
const openButton = document.getElementById('openInvitation');
const musicButton = document.getElementById('musicControl');
const backgroundMusic = document.getElementById('backgroundMusic');
let musicStarted = false;
let musicMuted = false;
backgroundMusic.volume = .58;

function startMusic() {
  musicStarted = true;
  musicMuted = false;
  backgroundMusic.muted = false;
  backgroundMusic.play().catch(() => {
    musicStarted = false;
    document.getElementById('musicLabel').textContent = 'Play BGM';
  });
  musicButton.setAttribute('aria-pressed', 'false');
  musicButton.setAttribute('aria-label', 'Mute Saiyaara Peaceful BGM');
  document.getElementById('musicIcon').textContent = '♫';
  document.getElementById('musicLabel').textContent = 'Mute BGM';
}

function toggleMute() {
  if (!musicStarted) {
    startMusic();
    return;
  }
  musicMuted = !musicMuted;
  backgroundMusic.muted = musicMuted;
  musicButton.setAttribute('aria-pressed', String(musicMuted));
  musicButton.setAttribute('aria-label', musicMuted ? 'Unmute Saiyaara Peaceful BGM' : 'Mute Saiyaara Peaceful BGM');
  document.getElementById('musicIcon').textContent = musicMuted ? '♪' : '♫';
  document.getElementById('musicLabel').textContent = musicMuted ? 'Unmute' : 'Mute BGM';
}

openButton.addEventListener('click', () => {
  opening.classList.add('opened');
  document.body.classList.remove('invitation-locked');
  startMusic();
});

musicButton.addEventListener('click', toggleMute);

const targetDate = new Date('2026-10-10T11:00:00+05:30').getTime();
const countdownParts = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

function updateCountdown() {
  const distance = Math.max(0, targetDate - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);
  countdownParts.days.textContent = String(days).padStart(2, '0');
  countdownParts.hours.textContent = String(hours).padStart(2, '0');
  countdownParts.minutes.textContent = String(minutes).padStart(2, '0');
  countdownParts.seconds.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

if (reducedMotion || !('IntersectionObserver' in window)) {
  items.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  items.forEach((item) => observer.observe(item));
}
