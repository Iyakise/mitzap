/**
 * Mitsab Resources Global — shared site behaviour
 * Preloader, header scroll state, mobile nav, scroll progress bar,
 * custom cursor, reveal-on-scroll, animated counters, card tilt,
 * magnetic buttons, marquee duplication and active-nav-link marking.
 */
document.addEventListener('DOMContentLoaded', function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('yr') && (document.getElementById('yr').textContent = new Date().getFullYear());

  /* ---------------- preloader ---------------- */
  (function () {
    var pre = document.getElementById('preloader');
    if (!pre) return;
    if (reduced) { pre.classList.add('hidden'); return; }
    var fill = pre.querySelector('.pre-bar-fill');
    var pct = 0;
    var timer = setInterval(function () {
      pct += Math.random() * 22;
      if (pct >= 100) { pct = 100; clearInterval(timer); }
      if (fill) fill.style.width = pct + '%';
    }, 90);
    window.addEventListener('load', function () {
      setTimeout(function () { pre.classList.add('hidden'); }, 380);
    });
    // safety net so the preloader never blocks the page indefinitely
    setTimeout(function () { pre.classList.add('hidden'); }, 2200);
  })();

  /* ---------------- header scroll state + mobile nav ---------------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }
  var toggle = document.getElementById('navToggle');
  var navList = document.getElementById('navList');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);
    });
    navList.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navList.classList.remove('open');
        toggle.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ---------------- active nav link ---------------- */
  (function () {
    var current = (window.location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('nav a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  })();

  /* ---------------- scroll progress bar ---------------- */
  var bar = document.getElementById('scroll-progress');
  if (bar) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = (scrolled || 0) + '%';
    }, { passive: true });
  }

  /* ---------------- custom cursor (fine pointers only) ---------------- */
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    var glow = document.createElement('div'); glow.className = 'cursor-glow';
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    document.body.appendChild(glow); document.body.appendChild(dot);
    document.body.classList.add('cursor-ready');
    var gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) {
      cx = e.clientX; cy = e.clientY;
      dot.style.left = cx + 'px'; dot.style.top = cy + 'px';
    }, { passive: true });
    (function loop() {
      gx += (cx - gx) * 0.16; gy += (cy - gy) * 0.16;
      glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .cap-card, .port-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { glow.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { glow.classList.remove('is-active'); });
    });
  }

  /* ---------------- WOW.js scroll animations ---------------- */
  if (!reduced && window.WOW) {
    new WOW({
      animateClass: 'animate__animated',
      offset: 60,
      mobile: true,
      live: true
    }).init();
  } else {
    // reduced motion, or WOW failed to load: just reveal everything
    document.querySelectorAll('.wow').forEach(function (el) { el.style.visibility = 'visible'; });
  }

  /* ---------------- animated counters ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduced || isNaN(target)) { el.textContent = target + suffix; return; }
        var startTime = null, duration = 1200;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------------- 3D tilt on capability / portfolio cards ---------------- */
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.cap-card, .port-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateX(' + (-py * 6) + 'deg) rotateY(' + (px * 6) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (mx * 0.18) + 'px,' + (my * 0.3) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------------- nav dropdowns (tap-to-open on mobile) ---------------- */
  document.querySelectorAll('.has-dropdown').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width:860px)').matches) {
        e.preventDefault();
        var li = trigger.closest('li');
        var wasOpen = li.classList.contains('dd-open');
        document.querySelectorAll('nav li.dd-open').forEach(function (el) { el.classList.remove('dd-open'); });
        if (!wasOpen) li.classList.add('dd-open');
      }
    });
  });

  /* ---------------- Swiper: testimonials ---------------- */
  if (window.Swiper && document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: reduced ? false : { delay: 5500, disableOnInteraction: false },
      pagination: { el: '.testimonial-pagination', clickable: true },
      breakpoints: { 760: { slidesPerView: 2 }, 1080: { slidesPerView: 3 } }
    });
  }

  /* ---------------- Swiper: projects (slide view) ---------------- */
  var projectSwiperEl = document.querySelector('.projects-swiper');
  var projectSwiper = null;
  if (window.Swiper && projectSwiperEl) {
    projectSwiper = new Swiper('.projects-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 20,
      loop: false,
      navigation: { nextEl: '.projects-next', prevEl: '.projects-prev' },
      pagination: { el: '.projects-pagination', clickable: true },
      breakpoints: { 700: { slidesPerView: 2.1 }, 1080: { slidesPerView: 2.6 } }
    });
  }

  /* ---------------- Slide View / Grid View toggle ---------------- */
  var slideBtn = document.getElementById('viewSlide');
  var gridBtn = document.getElementById('viewGrid');
  var slideWrap = document.querySelector('.slide-view-wrap');
  var gridWrap = document.querySelector('.grid-view-wrap');
  if (slideBtn && gridBtn && slideWrap && gridWrap) {
    slideBtn.addEventListener('click', function () {
      slideBtn.classList.add('active'); gridBtn.classList.remove('active');
      slideWrap.classList.remove('hidden'); gridWrap.classList.remove('active');
      if (projectSwiper) projectSwiper.update();
    });
    gridBtn.addEventListener('click', function () {
      gridBtn.classList.add('active'); slideBtn.classList.remove('active');
      gridWrap.classList.add('active'); slideWrap.classList.add('hidden');
    });
  }

  /* ---------------- marquee: duplicate content for seamless loop ---------------- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    if (track.dataset.doubled) return;
    track.innerHTML = track.innerHTML + track.innerHTML;
    track.dataset.doubled = 'true';
  });
});
