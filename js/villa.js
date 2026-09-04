import '../css/overrides.css';
import { VILLA_COUNT, PLOT_AREAS, SOLD_VILLAS } from './villa-data.js';

document.addEventListener('DOMContentLoaded', () => {

  const DIS_COUNT = 38;
  const IC_COUNT = 20;

  const pad = i => String(i).padStart(2, '0');
  const src = (set, i) => `/assets/img/${set}/${set}-${pad(i)}.webp`;
  const thumbSrc = (set, i) => `/assets/img/${set}/thumb/${set}-${pad(i)}.webp`;
  const SETS = {
    dis: { label: 'Dış Cephe', count: DIS_COUNT },
    ic:  { label: 'İç Dizayn', count: IC_COUNT }
  };

  const chips = document.getElementById('villaChips');
  const villaTitle = document.getElementById('villaTitle');
  const specNo = document.getElementById('specNo');
  const specPlot = document.getElementById('specPlot');
  const soldBanner = document.getElementById('soldBanner');

  function currentVilla(){
    const raw = parseInt(location.hash.replace(/^#v?/, ''), 10);
    return (Number.isInteger(raw) && raw >= 1 && raw <= VILLA_COUNT) ? raw : 1;
  }

  function renderVilla(){
    const no = currentVilla();
    const label = String(no).padStart(2, '0');
    const sold = SOLD_VILLAS.has(no);
    villaTitle.textContent = `VİLLA ${label}`;
    specNo.textContent = label;
    specPlot.textContent = `${PLOT_AREAS[no]} m²`;
    document.title = sold ? `Villa ${label} · Satıldı | Casa Vera Oasis` : `Villa ${label} | Casa Vera Oasis`;
    if (soldBanner) soldBanner.hidden = !sold;
    chips.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', Number(a.dataset.no) === no);
    });
  }

  chips.innerHTML = Array.from({ length: VILLA_COUNT }, (_, i) => {
    const no = i + 1;
    const n = String(no).padStart(2, '0');
    const sold = SOLD_VILLAS.has(no);
    return `<a href="#v${n}" data-no="${no}" class="${sold ? 'sold' : ''}"${sold ? ' title="Satıldı"' : ''}>${no}</a>`;
  }).join('');

  renderVilla();
  window.addEventListener('hashchange', renderVilla);

  const viewerImg = document.getElementById('viewerImg');
  const viewerCounter = document.getElementById('viewerCounter');
  const viewerThumbs = document.getElementById('viewerThumbs');
  const viewerTabs = document.getElementById('viewerTabs');

  let currentSet = 'dis';
  let currentIndex = 1;

  function renderThumbs(){
    const { count } = SETS[currentSet];
    viewerThumbs.innerHTML = Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return `<img src="${thumbSrc(currentSet, n)}" data-i="${n}" alt="${SETS[currentSet].label} ${n}" loading="lazy"${n === currentIndex ? ' class="active"' : ''}>`;
    }).join('');
  }

  function showImage(i){
    const { count, label } = SETS[currentSet];
    currentIndex = ((i - 1 + count) % count) + 1;
    viewerImg.src = src(currentSet, currentIndex);
    viewerImg.alt = `${label} ${currentIndex}`;
    viewerCounter.textContent = `${label} · ${currentIndex} / ${count}`;
    viewerThumbs.querySelectorAll('img').forEach(t => {
      t.classList.toggle('active', Number(t.dataset.i) === currentIndex);
    });
    const active = viewerThumbs.querySelector('img.active');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function switchSet(set){
    currentSet = set;
    renderThumbs();
    showImage(1);
    viewerTabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.set === set));
  }

  document.getElementById('countDis').textContent = `(${DIS_COUNT})`;
  document.getElementById('countIc').textContent = `(${IC_COUNT})`;

  renderThumbs();
  showImage(1);

  viewerTabs.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => switchSet(btn.dataset.set));
  });
  viewerThumbs.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') showImage(Number(e.target.dataset.i));
  });
  document.getElementById('viewerPrev').addEventListener('click', () => showImage(currentIndex - 1));
  document.getElementById('viewerNext').addEventListener('click', () => showImage(currentIndex + 1));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCap');

  function openLightbox(imgSrc, caption){
    lightboxImg.src = imgSrc;
    lightboxCap.textContent = caption || '';
    lightbox.classList.add('is-open');
  }
  function closeLightbox(){ lightbox.classList.remove('is-open'); }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.getElementById('viewerFull').addEventListener('click', () => {
    openLightbox(viewerImg.src, `${SETS[currentSet].label} ${currentIndex}`);
  });
  viewerImg.addEventListener('click', () => {
    openLightbox(viewerImg.src, `${SETS[currentSet].label} ${currentIndex}`);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (lightbox.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="tel:"], a[href*="wa.me"], .quote-btn, a.btn.full, .villa-cta a.btn');
    if (!link) return;
    if (link.matches('a[href^="tel:"]')) window.gtag?.('event', 'generate_lead', { method: 'phone_click' });
    else if (link.matches('a[href*="wa.me"]')) window.gtag?.('event', 'generate_lead', { method: 'whatsapp_click' });
    else window.gtag?.('event', 'generate_lead', { method: 'villa_cta_click' });
  });

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});
