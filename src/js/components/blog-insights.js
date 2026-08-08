// ============================================================
// FarmVest Blog Insights — live filtering, search & pagination
// ============================================================

export function initBlogInsights() {
  const page = document.querySelector('.blog-page');
  if (!page) return;

  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  const cards = Array.from(grid.children).filter((el) => el.hasAttribute('data-article-cat'));
  const searchInput = document.getElementById('blogSearch');
  const chips = Array.from(page.querySelectorAll('.blog-cat'));
  const pager = document.getElementById('blogPagination');
  const empty = document.getElementById('blogEmpty');

  const PAGE_SIZE = 6;
  let activeCat = 'all';
  let curPage = 1;
  let visible = [];

  function haystack(card) {
    return (card.getAttribute('data-article-cat') + ' ' + card.textContent).toLowerCase();
  }

  function applyFilters() {
    const term = (searchInput && searchInput.value.trim().toLowerCase()) || '';

    visible = cards.filter((c) => {
      const catOk = activeCat === 'all' || c.getAttribute('data-article-cat') === activeCat;
      const termOk = !term || haystack(c).includes(term);
      return catOk && termOk;
    });

    curPage = 1;
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

    if (empty) {
      empty.hidden = visible.length > 0;
    }

    renderPager(pageCount);
  }

  function renderPager(pageCount) {
    if (!pager) return;
    pager.innerHTML = '';

    if (pageCount <= 1) return;

    const goToPage = (newPage) => {
      curPage = newPage;
      render();
      const target = document.querySelector('.blog-listing-sec') || grid;
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

  // Category chip listeners
  chips.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      chips.forEach((c) => c.classList.remove('active', 'btn-success', 'text-white'));
      chips.forEach((c) => c.classList.add('btn-outline-success'));

      btn.classList.remove('btn-outline-success');
      btn.classList.add('active', 'btn-success', 'text-white');
      activeCat = btn.getAttribute('data-cat') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyFilters();
    });
  }

  // Initial filter run
  applyFilters();
}
