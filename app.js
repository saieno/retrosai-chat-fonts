let fonts = [];
const grid = document.getElementById('grid');
const toast = document.getElementById('toast');

async function load() {
  try {
    const res = await fetch('fonts.json', { cache: 'no-store' });
    fonts = await res.json();
  } catch (e) {
    fonts = [];
  }
  render();
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 1200);
}

function render() {
  grid.setAttribute('aria-busy', 'true');
  const list = [...fonts].sort((a,b) => a.family.localeCompare(b.family)); // keep A→Z silently

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

    const info = document.createElement('div');
    info.className = 'info';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = f.family;
    const file = document.createElement('div');
    file.className = 'file';
    file.textContent = f.file || '';

    info.appendChild(name);
    info.appendChild(file);

    const btn = document.createElement('button');
    btn.className = 'copybtn';
    btn.textContent = 'Copy Name to Clipboard';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(f.family);
        showToast(`Copied “${f.family}”`);
      } catch (e) {
        // Fallback: select & copy via execCommand
        const ta = document.createElement('textarea');
        ta.value = f.family;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(`Copied “${f.family}”`);
      }
    });

    meta.appendChild(info);
    meta.appendChild(btn);

    card.appendChild(img);
    card.appendChild(meta);
    grid.appendChild(card);
  }
  grid.removeAttribute('aria-busy');
}

load();
