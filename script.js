// TRACE — landing page interactions

// Pulse thread: the signal line draws with scroll, the blip rides your position
const rail = document.querySelector(".pulse-rail");
if (rail) {
  const progress = rail.querySelector(".pulse-rail__progress");
  const blip = rail.querySelector(".pulse-rail__blip");
  function updateRail() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.height = p * 100 + "%";
    blip.style.top = p * 100 + "%";
  }
  window.addEventListener("scroll", updateRail, { passive: true });
  window.addEventListener("resize", updateRail);
  updateRail();
}

// Reveal-on-scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Animated stat counters in the dashboard mock
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
