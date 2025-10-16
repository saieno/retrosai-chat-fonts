let fonts = [];
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const sortSel = document.getElementById('sort');
const countEl = document.getElementById('count');

const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const lbMeta = document.getElementById('lb-meta');
const lbClose = document.getElementById('lb-close');

async function load() {
  try {
    const res = await fetch('fonts.json', { cache: 'no-store' });
    fonts = await res.json();
  } catch (e) {
    fonts = [];
  }
  render();
}

function openLightbox(family, file, slug) {
  lbImg.src = `previews/${encodeURIComponent(slug)}.png`;
  lbImg.alt = `${family} preview`;
  lbTitle.textContent = family;
  lbMeta.textContent = file || '';
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lb.classList.add('hidden');
  lbImg.removeAttribute('src');
  document.body.style.overflow = '';
}

function render() {
  grid.setAttribute('aria-busy', 'true');
  let query = (search.value || '').toLowerCase();
  let list = fonts.filter(f => f.family.toLowerCase().includes(query));

  const sortVal = sortSel.value;
  list.sort((a,b) => {
    if (sortVal === 'name-asc') return a.family.localeCompare(b.family);
    if (sortVal === 'name-desc') return b.family.localeCompare(a.family);
    return 0;
  });

  grid.innerHTML = '';
  for (const f of list) {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open preview for ${f.family}`);

    const img = document.createElement('img');
    img.className = 'thumb';
    img.loading = 'lazy';
    img.alt = `${f.family} preview thumbnail`;
    img.src = `previews/${encodeURIComponent(f.slug)}.png`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = f.family;
    const file = document.createElement('div');
    file.className = 'file';
    file.textContent = f.file || '';
    meta.appendChild(name);
    meta.appendChild(file);

    const open = () => openLightbox(f.family, f.file, f.slug);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    card.appendChild(img);
    card.appendChild(meta);
    grid.appendChild(card);
  }
  countEl.textContent = `${list.length} ${list.length === 1 ? 'family' : 'families'}`;
  grid.removeAttribute('aria-busy');
}

lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.classList.contains('hidden')) closeLightbox(); });

search.addEventListener('input', render);
sortSel.addEventListener('change', render);
load();
