import { VILLA_COUNT, PLOTS, HOTSPOTS, UNNUMBERED, villaUrl, isSold } from './villa-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const langBtn = document.getElementById('langBtn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  let lang = 'tr';

  /* ---------------------------------------------------------------- menü */
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-label', 'Menüyü aç');
  };

  menuBtn.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });

  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  window.addEventListener(
    'scroll',
    () => header.classList.toggle('scrolled', scrollY > 20),
    { passive: true }
  );

  /* ------------------------------------------------------------ dil TR/EN */
  langBtn.addEventListener('click', () => {
    lang = lang === 'tr' ? 'en' : 'tr';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-tr][data-en]').forEach((el) => {
      el.textContent = el.dataset[lang];
    });
    document.querySelectorAll('[data-tr-placeholder][data-en-placeholder]').forEach((el) => {
      el.placeholder = el.dataset[`${lang}Placeholder`];
    });

    langBtn.querySelectorAll('span').forEach((el, i) => {
      el.classList.toggle('active', (lang === 'tr' && i === 0) || (lang === 'en' && i === 1));
    });

    document.title =
      lang === 'tr'
        ? "Casa Vera Oasis | Assos'ta Ayrıcalıklı Villa Yaşamı"
        : 'Casa Vera Oasis | Exclusive Villa Living in Assos';
  });

  /* ------------------------------------------------------------- lightbox */
  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* -------------------------------------------- kuşbakışı görsel pinleri */
  const pins = [];

  for (let n = 1; n <= VILLA_COUNT; n++) {
    const [left, top] = HOTSPOTS[n];
    const sold = isSold(n);
    const badge = sold
      ? '<span class="pin-badge" data-tr="SATILDI" data-en="SOLD">SATILDI</span>'
      : `<span class="pin-badge">${PLOTS[n]} m²</span>`;

    pins.push(
      `<a class="hero-pin${sold ? ' sold' : ''}" href="${villaUrl(n)}"` +
        ` style="left:${left}%;top:${top}%"` +
        ` aria-label="Villa ${n} · ${PLOTS[n]} m²${sold ? ' · Satıldı' : ''}">` +
        `<b>${n}</b>${badge}</a>`
    );
  }

  // Numarasız, satışa çıkmayacak bina — tıklanabilir bir villa sayfası yok.
  const [uLeft, uTop] = UNNUMBERED.pos;
  pins.push(
    `<span class="hero-pin sold no-number" style="left:${uLeft}%;top:${uTop}%"` +
      ` aria-label="Numarasız villa · Satıldı">` +
      `<span class="pin-badge" data-tr="SATILDI" data-en="SOLD">SATILDI</span></span>`
  );

  document.getElementById('heroHotspots').innerHTML = pins.join('');

  /* --------------------------------------------------- hızlı villa listesi */
  document.getElementById('villaQuick').innerHTML = Array.from(
    { length: VILLA_COUNT },
    (_, i) => {
      const n = i + 1;
      const sold = isSold(n);
      return (
        `<a class="${sold ? 'sold' : ''}" href="${villaUrl(n)}"` +
        (sold ? ' title="Satıldı"' : '') +
        ` aria-label="Villa ${n}${sold ? ' · Satıldı' : ' detayları'}">${n}</a>`
      );
    }
  ).join('');

  /* --------------------------------------------------------------- galeri */
  document.querySelectorAll('#galleryGrid figure').forEach((fig) =>
    fig.addEventListener('click', () => openLightbox(fig.querySelector('img').src))
  );

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMenu();
    }
  });

  /* ------------------------------------------------- iletişim → WhatsApp */
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const msg = document.getElementById('message').value.trim();

    const text =
      lang === 'tr'
        ? `Casa Vera Oasis bilgi talebi\nAd Soyad: ${name}\nTelefon: ${phone}\nMesaj: ${msg}`
        : `Casa Vera Oasis information request\nName: ${name}\nPhone: ${phone}\nMessage: ${msg}`;

    window.open(
      `https://wa.me/905322181184?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener'
    );
  });

  /* ---------------------------------------------------- görünüme girince */
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
});
