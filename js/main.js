(function () {
  var header = document.querySelector('.site-header');
  var body = document.body;

  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menu.hidden = !open;
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Zatvori' : 'Izbornik';
  }
  toggle.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  var slides = document.querySelectorAll('.hero__slide');
  var current = 0;
  if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(function () {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 6000);
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('.m-item'));
  var lb = document.querySelector('.lightbox');
  var lbImg = lb.querySelector('img');
  var idx = 0;
  function show(i) {
    idx = (i + links.length) % links.length;
    lbImg.src = links[idx].getAttribute('href');
    lbImg.alt = links[idx].querySelector('img').alt;
  }
  function close() { lb.hidden = true; body.style.overflow = ''; }
  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); show(i); lb.hidden = false; body.style.overflow = 'hidden';
    });
  });
  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lightbox__next').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); return; }
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  var form = document.getElementById('upit');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var text = 'Pozdrav, zanima me ' + d.get('usluga').toLowerCase() + '.' +
      '\nIme: ' + d.get('ime') + '\nKontakt: ' + d.get('kontakt') +
      '\nDatum: ' + (d.get('datum') || '-') + '\nMjesto: ' + (d.get('mjesto') || '-') +
      (d.get('poruka') ? '\n\n' + d.get('poruka') : '');
    window.open('https://wa.me/' + form.dataset.phone + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
