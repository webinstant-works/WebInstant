// WebInstant — site script
(function () {
  document.documentElement.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Mobile nav
  var burger = $('#hamburger'), nav = $('#mainNav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      var i = $('i', burger);
      if (i) { i.className = open ? 'fas fa-xmark' : 'fas fa-bars'; }
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  }

  $$('#year').forEach(function (y) { y.textContent = new Date().getFullYear(); });

  var els = $$('.reveal');
  if ('IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('visible'); }); }

  // Reading progress (blog + legal)
  var bar = $('#reading-progress');
  if (bar) {
    var upd = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
    };
    window.addEventListener('scroll', upd, { passive: true }); upd();
  }

  // Legal pages: reveal sections
  $$('.legal-section').forEach(function (s) { s.classList.add('visible'); });

  // Copy link buttons (blog)
  $$('[data-copy-link]').forEach(function (b) {
    b.addEventListener('click', function () {
      var url = b.getAttribute('data-copy-link');
      var done = function () {
        var s = $('span', b), old = s ? s.textContent : '';
        if (s) { s.textContent = 'Copied!'; setTimeout(function () { s.textContent = old; }, 1800); }
      };
      if (navigator.clipboard) { navigator.clipboard.writeText(url).then(done); } else { done(); }
    });
  });
})();
