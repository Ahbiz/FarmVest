// ============================================================
// FarmVest Yield Pools — live filtering, sorting & pagination
// ============================================================

export function initYieldPools() {
  const page = document.querySelector('.projects-page');
  if (!page) return;

  const grid = document.getElementById('poolGrid');
  if (!grid) return;

  const cards = Array.from(grid.children).filter((el) => el.hasAttribute('data-pool-cat'));
  const search = document.getElementById('poolSearch');
  const sort = document.getElementById('poolSort');
  const chips = Array.from(page.querySelectorAll('.pool-cat'));
  const applyBtn = document.getElementById('poolApply');
  const countEl = document.getElementById('poolCount');
  const pager = document.getElementById('poolPagination');
  const empty = document.getElementById('poolEmpty');
  const clearBtn = document.getElementById('poolClear');

  const PAGE_SIZE = 6;
  let activeCat = 'all';
  let curPage = 1;
  let visible = [];

  function haystack(card) {
    return (card.getAttribute('data-pool-name') + ' ' + card.textContent).toLowerCase();
  }

  function applyFilters() {
    const term = (search && search.value.trim().toLowerCase()) || '';
    const sortVal = (sort && sort.value) || 'roi-desc';

    visible = cards.filter((c) => {
      const catOk = activeCat === 'all' || c.getAttribute('data-pool-cat') === activeCat;
      const termOk = !term || haystack(c).includes(term);
      return catOk && termOk;
    });

    const order = {
      'roi-desc': (a, b) => parseFloat(b.dataset.poolRoi) - parseFloat(a.dataset.poolRoi),
      'term-asc': (a, b) => parseFloat(a.dataset.poolTerm) - parseFloat(b.dataset.poolTerm),
      'share-asc': (a, b) => parseFloat(a.dataset.poolShare) - parseFloat(b.dataset.poolShare),
    }[sortVal];
    if (order) visible.sort(order);

    render();
  }

  function render() {
    const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
    if (curPage > pageCount) curPage = pageCount;
    const start = (curPage - 1) * PAGE_SIZE;
    const slice = visible.slice(start, start + PAGE_SIZE);

    cards.forEach((c) => {
      c.style.display = slice.includes(c) ? '' : 'none';
    });

    if (countEl) {
      const from = visible.length ? start + 1 : 0;
      const to = start + slice.length;
      countEl.textContent = `${from}–${to} of ${visible.length} growing cycles`;
    }

    if (empty) empty.hidden = visible.length > 0;
    renderPager(pageCount);
  }

  function renderPager(pageCount) {
    if (!pager) return;
    pager.innerHTML = '';

    if (pageCount <= 1) return;

    const goToPage = (newPage) => {
      curPage = newPage;
      render();
      const target = document.querySelector('.pool-promo') || grid;
      if (target) {
        const yOffset = -100;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (curPage === 1 ? ' disabled' : '');
    prevLi.innerHTML = `<a class="page-link px-3" href="#" aria-label="Previous page"><i class="fas fa-chevron-left me-2"></i> Previous</a>`;
    if (curPage > 1) {
      prevLi.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(curPage - 1);
      });
    }
    pager.appendChild(prevLi);

    const infoLi = document.createElement('li');
    infoLi.className = 'page-item disabled d-flex align-items-center mx-2';
    infoLi.innerHTML = `<span class="page-link bg-transparent border-0 text-muted fw-bold">Page ${curPage} of ${pageCount}</span>`;
    pager.appendChild(infoLi);

    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (curPage === pageCount ? ' disabled' : '');
    nextLi.innerHTML = `<a class="page-link px-3" href="#" aria-label="Next page">Next <i class="fas fa-chevron-right ms-2"></i></a>`;
    if (curPage < pageCount) {
      nextLi.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(curPage + 1);
      });
    }
    pager.appendChild(nextLi);
  }

  // Category chips
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((b) => b.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeCat = chip.dataset.cat || 'all';
      curPage = 1;
      applyFilters();
    });
  });

  // Live search
  if (search) {
    search.addEventListener('input', () => { curPage = 1; applyFilters(); });
  }

  // Sort
  if (sort) {
    sort.addEventListener('change', () => { curPage = 1; applyFilters(); });
  }

  // Apply & clear
  if (applyBtn) applyBtn.addEventListener('click', () => { curPage = 1; applyFilters(); });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (search) search.value = '';
      activeCat = 'all';
      chips.forEach((b) => b.classList.toggle('is-active', b.dataset.cat === 'all'));
      if (sort) sort.value = 'roi-desc';
      curPage = 1;
      applyFilters();
    });
  }

  applyFilters();
}