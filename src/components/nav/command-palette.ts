interface Entry { section: string; title: string; url: string; }

declare global {
  interface Window { __VELOX_INDEX: Entry[]; }
}

const entries: Entry[] = window.__VELOX_INDEX ?? [];

const cmdk     = document.getElementById('cmdk');
const input    = document.getElementById('cmdk-input')   as HTMLInputElement | null;
const results  = document.getElementById('cmdk-results') as HTMLUListElement | null;
const hint     = document.getElementById('cmdk-hint');
const backdrop = document.querySelector('[data-cmdk-close]');

if (cmdk && input && results) {
  let activeIndex = 0;
  let filtered: Entry[] = [];

  const isOpen = () => cmdk.classList.contains('cmdk--open');

  function open() {
    cmdk!.classList.add('cmdk--open');
    cmdk!.setAttribute('aria-hidden', 'false');
    input!.value = '';
    render(entries);
    input!.focus();
  }
  function close() {
    cmdk!.classList.remove('cmdk--open');
    cmdk!.setAttribute('aria-hidden', 'true');
    input!.value = '';
    results!.innerHTML = '';
  }
  function toggle() { isOpen() ? close() : open(); }

  function filter(query: string): Entry[] {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return entries;
    return entries.filter(e => {
      const hay = `${e.title} ${e.section}`.toLowerCase();
      return tokens.every(t => hay.includes(t));
    });
  }

  function render(list: Entry[]) {
    filtered = list;
    activeIndex = 0;
    results!.innerHTML = '';
    if (!list.length) {
      const li = document.createElement('li');
      li.className = 'cmdk-empty';
      li.textContent = `No results for "${input!.value}"`;
      results!.appendChild(li);
      return;
    }
    list.forEach((e, i) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item' + (i === 0 ? ' cmdk-item--active' : '');
      li.dataset.url = e.url;

      const sec = document.createElement('span');
      sec.className = 'cmdk-item-tag';
      sec.textContent = e.section;

      const title = document.createElement('span');
      title.className = 'cmdk-item-title';
      title.textContent = e.title;

      const arrow = document.createElement('span');
      arrow.className = 'cmdk-item-arrow';
      arrow.textContent = '↵';

      li.append(sec, title, arrow);
      li.addEventListener('mouseenter', () => setActive(i));
      li.addEventListener('click', () => navigate(e.url));
      results!.appendChild(li);
    });
  }

  function setActive(index: number) {
    const items = results!.querySelectorAll<HTMLElement>('.cmdk-item');
    items[activeIndex]?.classList.remove('cmdk-item--active');
    activeIndex = Math.max(0, Math.min(index, filtered.length - 1));
    const next = items[activeIndex];
    next?.classList.add('cmdk-item--active');
    next?.scrollIntoView({ block: 'nearest' });
  }

  function navigate(url: string) { window.location.href = url; }

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target as Element;
    const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); toggle(); return; }
    if (e.key === '/' && !inInput && !isOpen()) { e.preventDefault(); open(); return; }
    if (!isOpen()) return;
    if (e.key === 'Escape')    { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(activeIndex - 1); return; }
    if (e.key === 'Enter')     { e.preventDefault(); const u = filtered[activeIndex]?.url; if (u) navigate(u); return; }
  });

  input.addEventListener('input', () => render(filter(input.value)));
  backdrop?.addEventListener('click', close);
  hint?.addEventListener('click', toggle);
}

export {};
