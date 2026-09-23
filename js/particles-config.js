/**
 * Mitsab Resources Global — particles.js network backgrounds
 * Initializes a lightweight amber particle network on every element
 * with a `.particles-bg` container and a unique id. Used on inner-page
 * banners and the "network panel" section — kept separate from the
 * Three.js hero so the two effects never compete for attention.
 */
(function () {
  function themeIsLight() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function initOn(el) {
    if (!window.particlesJS) return;
    var lineColor = themeIsLight() ? '#12161B' : '#EDEAE2';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.particlesJS(el.id, {
      particles: {
        number: { value: reduced ? 22 : 46, density: { enable: true, value_area: 900 } },
        color: { value: '#FF7A1A' },
        shape: { type: 'circle' },
        opacity: { value: 0.55, random: true },
        size: { value: 2.4, random: true },
        line_linked: { enable: true, distance: 130, color: lineColor, opacity: 0.18, width: 1 },
        move: { enable: !reduced, speed: 0.9, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: !reduced, mode: 'grab' },
          onclick: { enable: false },
          resize: true
        },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.4 } } }
      },
      retina_detect: true
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var targets = document.querySelectorAll('.particles-bg[id]');
    targets.forEach(initOn);
  });
})();
