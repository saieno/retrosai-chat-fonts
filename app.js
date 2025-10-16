let fonts = [];
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const sortSel = document.getElementById('sort');
const countEl = document.getElementById('count');

async function load() {
  try {
    const res = await fetch('fonts.json', { cache: 'no-store' });
    fonts = await res.json();
  } catch (e) {
    fonts = [];
  }
  render();
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
    const card = document.createElement('section');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'banner';
    img.loading = 'lazy';
    img.alt = `${f.family} preview`;
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

    card.appendChild(img);
    card.appendChild(meta);
    grid.appendChild(card);
  }
  countEl.textContent = `${list.length} ${list.length === 1 ? 'family' : 'families'}`;
  grid.removeAttribute('aria-busy');
}

search.addEventListener('input', render);
sortSel.addEventListener('change', render);
load();
