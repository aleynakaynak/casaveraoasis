import { VILLA_COUNT, PLOTS, isSold } from './villa-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const pad = (n) => String(n).padStart(2, '0');
  const full = (set, i) => `/assets/img/${set}/${set}-${pad(i)}.webp`;
  const thumb = (set, i) => `/assets/img/${set}/thumb/${set}-${pad(i)}.webp`;

  const SETS = {
    dis: { label: 'Dış Cephe', count: 38 },
    ic: { label: 'İç Dizayn', count: 20 },
  };

  const chips = document.getElementById('villaChips');
  const title = document.getElementById('villaTitle');
  const specNo = document.getElementById('specNo');
  const specPlot = document.getElementById('specPlot');
  const soldBanner = document.getElementById('soldBanner');

  /* ------------------------------------------------------ seçili villa */
  function currentVilla() {
    const n = parseInt(location.hash.replace(/^#v?/, ''), 10);
    return Number.isInteger(n) && n >= 1 && n <= VILLA_COUNT ? n : 1;
  }

  function syncVilla() {
    const n = currentVilla();
    const no = pad(n);
    const sold = isSold(n);

    title.textContent = `VİLLA ${no}`;
    specNo.textContent = no;
    specPlot.textContent = `${PLOTS[n]} m²`;
    document.title = `Villa ${no} | Casa Vera Oasis`;

    soldBanner.hidden = !sold;
    document.body.classList.toggle('villa-is-sold', sold);

    chips.querySelectorAll('a').forEach((a) => {
      a.classList.toggle('active', Number(a.dataset.no) === n);
    });
  }

  chips.innerHTML = Array.from({ length: VILLA_COUNT }, (_, i) => {
    const n = i + 1;
    const sold = isSold(n);
    return (
      `<a href="#v${pad(n)}" data-no="${n}" class="${sold ? 'sold' : ''}"` +
      (sold ? ' title="Satıldı"' : '') +
      `>${n}</a>`
    );
  }).join('');

  syncVilla();
  window.addEventListener('hashchange', syncVilla);

  /* ------------------------------------------------------ görsel viewer */
  const viewerImg = document.getElementById('viewerImg');
  const counter = document.getElementById('viewerCounter');
  const thumbs = document.getElementById('viewerThumbs');
  const tabs = document.getElementById('viewerTabs');

  let set = 'dis';
  let index = 1;

  function renderThumbs() {
    const { count } = SETS[set];
    thumbs.innerHTML = Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return (
        `<img src="${thumb(set, n)}" data-i="${n}" alt="${SETS[set].label} ${n}"` +
        ` loading="lazy"${n === index ? ' class="active"' : ''}>`
      );
    }).join('');
  }

  function show(n) {
    const { count, label } = SETS[set];
    index = ((n - 1 + count) % count) + 1;

    viewerImg.src = full(set, index);
    viewerImg.alt = `${label} ${index}`;
    counter.textContent = `${label} · ${index} / ${count}`;

    thumbs.querySelectorAll('img').forEach((img) => {
      img.classList.toggle('active', Number(img.dataset.i) === index);
    });
    thumbs.querySelector('img.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function selectSet(next) {
    set = next;
    renderThumbs();
    show(1);
    tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.set === next));
  }

  document.getElementById('countDis').textContent = `(${SETS.dis.count})`;
  document.getElementById('countIc').textContent = `(${SETS.ic.count})`;

  renderThumbs();
  show(1);

  tabs.querySelectorAll('button').forEach((b) =>
    b.addEventListener('click', () => selectSet(b.dataset.set))
  );
  thumbs.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') show(Number(e.target.dataset.i));
  });
  document.getElementById('viewerPrev').addEventListener('click', () => show(index - 1));
  document.getElementById('viewerNext').addEventListener('click', () => show(index + 1));

  /* -------------------------------------------------------- tüm galeri */
  function buildGrid(el, which) {
    const { count, label } = SETS[which];
    el.innerHTML = Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return (
        `<figure data-src="${full(which, n)}" data-cap="${label} ${n}">` +
        `<img data-src="${thumb(which, n)}" alt="${label} ${n}"></figure>`
      );
    }).join('');
  }

  buildGrid(document.getElementById('gridDis'), 'dis');
  buildGrid(document.getElementById('gridIc'), 'ic');

  const lazy = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        lazy.unobserve(img);
      }),
    { rootMargin: '200px' }
  );
  document.querySelectorAll('.villa-grid img[data-src]').forEach((img) => lazy.observe(img));

  document.querySelectorAll('#villaTabs button').forEach((btn) =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('#villaTabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.villa-grid-wrap').forEach((wrap) => {
        wrap.classList.toggle('active', wrap.dataset.tabPanel === btn.dataset.tab);
      });
    })
  );

  /* ---------------------------------------------------------- lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCap');

  const openLightbox = (src, cap) => {
    lightboxImg.src = src;
    lightboxCap.textContent = cap || '';
    lightbox.classList.add('is-open');
  };
  const closeLightbox = () => lightbox.classList.remove('is-open');

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.getElementById('viewerFull').addEventListener('click', () =>
    openLightbox(viewerImg.src, `${SETS[set].label} ${index}`)
  );
  document.addEventListener('click', (e) => {
    const fig = e.target.closest('.villa-grid figure');
    if (fig) openLightbox(fig.dataset.src, fig.dataset.cap);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (lightbox.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
});
