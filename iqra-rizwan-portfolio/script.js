/* =========================================================
   IQRA RIZWAN — PORTFOLIO SCRIPTS
   1. Sticky header style on scroll
   2. Mobile menu
   3. Active link highlighting
   4. Scroll reveal animations
   5. Screenshot gallery
   6. Back-to-top button
   7. Subtle 3D tilt on the hero code card
   8. Current year in footer
   ========================================================= */

/* ---------- PROJECT SCREENSHOTS ----------
   Each project's gallery. To add a screenshot, put the image
   in the matching "images" folder and add a line here. */
var GALLERIES = {
  bbq: {
    title: 'The BBQ Place',
    images: [
      { src: 'images/bbq-place/homepage.jpg', caption: 'Homepage' },
      { src: 'images/bbq-place/menu.jpg',     caption: 'Menu page' },
      { src: 'images/bbq-place/chatbot.jpg',  caption: 'AI restaurant chatbot (Groq API)' },
      { src: 'images/bbq-place/contact.jpg',  caption: 'Contact page' }
    ]
  },
  fashion: {
    title: 'Fashion Store',
    images: [
      { src: 'images/fashion-store/homepage.jpg',    caption: 'Homepage' },
      { src: 'images/fashion-store/products.jpg',    caption: 'Product listings' },
      { src: 'images/fashion-store/checkout.jpg',    caption: 'Checkout page' },
      { src: 'images/fashion-store/mobile-view.jpg', caption: 'Mobile view' }
    ]
  },
  dental: {
    title: 'Dental Clinic',
    images: [
      { src: 'images/dental-clinic/homepage.jpg', caption: 'Homepage' },
      { src: 'images/dental-clinic/services.jpg', caption: 'Services page' },
      { src: 'images/dental-clinic/about.jpg',    caption: 'About page' },
      { src: 'images/dental-clinic/contact.jpg',  caption: 'Contact page' },
      { src: 'images/dental-clinic/footer.jpg',   caption: 'Footer' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('header');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var backToTop = document.getElementById('backToTop');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Header style + back-to-top visibility ---------- */
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    backToTop.classList.toggle('visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });

  // Close the menu when a link inside it is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  // Close with the Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Close if the window becomes wide enough for the desktop menu
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* ---------- 3. Highlight the nav link of the section in view ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- 4. Reveal elements as they scroll into view ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach(function (el) {
    if (el.dataset.delay) el.style.setProperty('--delay', el.dataset.delay + 'ms');
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 5. Screenshot gallery ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImage = document.getElementById('lbImage');
  var lbTitle = document.getElementById('lbTitle');
  var lbCaption = document.getElementById('lbCaption');
  var lbCounter = document.getElementById('lbCounter');
  var lbThumbs = document.getElementById('lbThumbs');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbStage = document.getElementById('lbStage');
  var gallery = null;
  var current = 0;
  var lastFocused = null;

  function isGalleryOpen() {
    return lightbox.classList.contains('open');
  }

  function showImage(i) {
    var total = gallery.images.length;
    current = (i + total) % total; // wraps around at both ends
    var item = gallery.images[current];

    lbImage.classList.add('loading');
    lbImage.onload = function () { lbImage.classList.remove('loading'); };
    lbImage.src = item.src;
    lbImage.alt = gallery.title + ' — ' + item.caption;

    lbTitle.textContent = gallery.title;
    lbCaption.textContent = item.caption;
    lbCounter.textContent = (current + 1) + ' / ' + total;

    lbThumbs.querySelectorAll('button').forEach(function (btn, n) {
      btn.classList.toggle('active', n === current);
      btn.setAttribute('aria-current', n === current ? 'true' : 'false');
    });
  }

  function openGallery(key) {
    gallery = GALLERIES[key];
    if (!gallery) return;
    lastFocused = document.activeElement;

    // Build the thumbnail strip
    lbThumbs.innerHTML = '';
    gallery.images.forEach(function (item, n) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Show ' + item.caption);
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = '';
      btn.appendChild(img);
      btn.addEventListener('click', function () { showImage(n); });
      lbThumbs.appendChild(btn);
    });

    showImage(0);
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeGallery() {
    lightbox.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-gallery]').forEach(function (el) {
    el.addEventListener('click', function () { openGallery(el.dataset.gallery); });
  });

  lightbox.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', closeGallery);
  });
  lbPrev.addEventListener('click', function () { showImage(current - 1); });
  lbNext.addEventListener('click', function () { showImage(current + 1); });

  // Keyboard: Esc closes, arrow keys move between screenshots
  document.addEventListener('keydown', function (e) {
    if (!isGalleryOpen()) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') showImage(current - 1);
    if (e.key === 'ArrowRight') showImage(current + 1);
  });

  // Swipe left / right on phones
  var touchStartX = null;
  lbStage.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lbStage.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) showImage(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
  });

  /* ---------- 6. Back to top ---------- */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 7. Gentle tilt on the hero code card (desktop only) ---------- */
  var codeCard = document.getElementById('codeCard');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (codeCard && canHover && !prefersReducedMotion) {
    var visual = codeCard.parentElement;

    visual.addEventListener('mousemove', function (e) {
      var rect = visual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      codeCard.style.transform =
        'rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-y * 8).toFixed(2) + 'deg)';
    });

    visual.addEventListener('mouseleave', function () {
      codeCard.style.transform = '';
    });
  }

  /* ---------- 8. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
