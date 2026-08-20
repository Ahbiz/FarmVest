// ============================================================
// FarmVest Store Marketplace — Live Filtering, Search, Sort & Pagination
// ============================================================

import { toggleWishlist, isInWishlist, updateWishlistBadges } from '../services/wishlist.js';

/**
 * Initialize Store Catalog Component
 */
export function initStoreCatalog() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const productCards = Array.from(grid.querySelectorAll('[data-product-item]'));
  const searchInput = document.getElementById('storeSearchInput');
  const sortSelect = document.getElementById('storeSortSelect');
  const catButtons = Array.from(document.querySelectorAll('.store-cat-btn'));
  const resetBtn = document.getElementById('resetFiltersBtn');
  const applyBtn = document.getElementById('applyFiltersBtn');
  const minPriceInput = document.getElementById('minPriceInput');
  const maxPriceInput = document.getElementById('maxPriceInput');
  const checkInStock = document.getElementById('checkInStock');
  const checkSeasonal = document.getElementById('checkSeasonal');
  const resultsCountEl = document.getElementById('productResultsCount');
  const paginationNav = document.getElementById('productsPagination');
  const emptyStateEl = document.getElementById('productsEmptyState');

  const PAGE_SIZE = 6;
  let activeCat = 'all';
  let currentPage = 1;
  let filteredItems = [...productCards];

  // Helper to extract searchable text from a product card
  function getSearchableText(card) {
    const title = card.getAttribute('data-title') || '';
    const cat = card.getAttribute('data-cat') || '';
    const text = card.textContent || '';
    return `${title} ${cat} ${text}`.toLowerCase();
  }

  // Read URL parameters on initial load (e.g. ?category=vegetables or ?search=beef)
  function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category') || params.get('cat');
    const searchParam = params.get('search') || params.get('q');

    if (catParam) {
      activeCat = catParam.toLowerCase();
      catButtons.forEach(btn => {
        const isMatch = btn.getAttribute('data-cat') === activeCat;
        btn.classList.toggle('active', isMatch);
        btn.classList.toggle('btn-outline-success', isMatch);
        btn.classList.toggle('btn-outline-secondary', !isMatch);
      });
    }

    if (searchParam && searchInput) {
      searchInput.value = searchParam;
    }
  }

  // Filter and sort items
  function updateCatalog() {
    const searchTerm = (searchInput?.value || '').trim().toLowerCase();
    const sortVal = sortSelect?.value || 'popular';
    const minPrice = parseFloat(minPriceInput?.value) || 0;
    const maxPrice = parseFloat(maxPriceInput?.value) || 99999;
    const allowInStock = checkInStock ? checkInStock.checked : true;
    const allowSeasonal = checkSeasonal ? checkSeasonal.checked : true;

    filteredItems = productCards.filter(card => {
      // Category filter
      const cardCat = card.getAttribute('data-cat') || '';
      const catMatch = activeCat === 'all' || cardCat === activeCat;

      // Search term filter
      const textMatch = !searchTerm || getSearchableText(card).includes(searchTerm);

      // Price filter
      const cardPrice = parseFloat(card.getAttribute('data-price')) || 0;
      const priceMatch = cardPrice >= minPrice && cardPrice <= maxPrice;

      // Stock status filter
      const cardStock = card.getAttribute('data-stock') || 'in-stock';
      let stockMatch = true;
      if (!allowInStock && cardStock === 'in-stock') stockMatch = false;
      if (!allowSeasonal && cardStock === 'seasonal') stockMatch = false;
      if (!allowInStock && !allowSeasonal) stockMatch = false;

      return catMatch && textMatch && priceMatch && stockMatch;
    });

    // Sorting
    filteredItems.sort((a, b) => {
      const priceA = parseFloat(a.getAttribute('data-price')) || 0;
      const priceB = parseFloat(b.getAttribute('data-price')) || 0;
      const ratingA = parseFloat(a.getAttribute('data-rating')) || 0;
      const ratingB = parseFloat(b.getAttribute('data-rating')) || 0;

      switch (sortVal) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'rating':
          return ratingB - ratingA;
        case 'popular':
        default:
          return 0; // Default curated layout order
      }
    });

    // Ensure currentPage is in range
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    if (currentPage > totalPages) {
      currentPage = 1;
    }

    renderGrid(totalPages);
  }

  // Render cards and pagination DOM
  function renderGrid(totalPages) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const visibleCards = filteredItems.slice(startIndex, endIndex);

    // Toggle card visibility
    productCards.forEach(card => {
      if (visibleCards.includes(card)) {
        card.classList.remove('d-none');
        // Re-append to preserve sort order in DOM
        grid.appendChild(card);
      } else {
        card.classList.add('d-none');
      }
    });

    // Update Results Counter text
    if (resultsCountEl) {
      if (filteredItems.length === 0) {
        resultsCountEl.textContent = 'No products found';
      } else {
        const from = startIndex + 1;
        const to = Math.min(endIndex, filteredItems.length);
        resultsCountEl.textContent = `Showing ${from}–${to} of ${filteredItems.length} Fresh Farm Products`;
      }
    }

    // Toggle Empty State
    if (emptyStateEl) {
      emptyStateEl.classList.toggle('d-none', filteredItems.length > 0);
    }

    // Render Pagination Controls
    renderPagination(totalPages);
  }

  // Render dynamic pagination items
  function renderPagination(totalPages) {
    if (!paginationNav) return;

    if (totalPages <= 1) {
      paginationNav.innerHTML = '';
      return;
    }

    let html = '<ul class="pagination pagination-sm mb-0 align-items-center gap-1">';

    // Previous button
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    html += `
      <li class="page-item ${prevDisabled}">
        <a class="page-link rounded-circle border shadow-sm" href="#" data-page="${currentPage - 1}" aria-label="Previous">
          <i class="fas fa-chevron-left"></i>
        </a>
      </li>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const activeClass = i === currentPage ? 'active bg-success text-white border-success' : 'text-dark bg-white border';
      html += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link rounded-circle shadow-sm fw-bold ${activeClass}" href="#" data-page="${i}">
            ${i}
          </a>
        </li>
      `;
    }

    // Next button
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    html += `
      <li class="page-item ${nextDisabled}">
        <a class="page-link rounded-circle border shadow-sm" href="#" data-page="${currentPage + 1}" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </a>
      </li>
    `;

    html += '</ul>';
    paginationNav.innerHTML = html;

    // Attach click listeners to pagination links
    paginationNav.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetPage = parseInt(link.getAttribute('data-page'), 10);
        if (targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage) {
          currentPage = targetPage;
          renderGrid(totalPages);

          // Smooth scroll up to top of store catalog
          const header = document.querySelector('.store-catalog-sec');
          if (header) {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  // Reset all filters to default
  function resetFilters() {
    if (searchInput) searchInput.value = '';
    if (minPriceInput) minPriceInput.value = '0';
    if (maxPriceInput) maxPriceInput.value = '100';
    if (checkInStock) checkInStock.checked = true;
    if (checkSeasonal) checkSeasonal.checked = false;
    if (sortSelect) sortSelect.value = 'popular';

    activeCat = 'all';
    catButtons.forEach(btn => {
      const isAll = btn.getAttribute('data-cat') === 'all';
      btn.classList.toggle('active', isAll);
      btn.classList.toggle('btn-outline-success', isAll);
      btn.classList.toggle('btn-outline-secondary', !isAll);
    });

    currentPage = 1;
    updateCatalog();
  }

  // Event Listeners
  // 1. Search Input (live debounced search)
  let searchTimeout = null;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage = 1;
      updateCatalog();
    }, 200);
  });

  // 2. Category Buttons
  catButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      activeCat = btn.getAttribute('data-cat') || 'all';

      catButtons.forEach(b => {
        b.classList.remove('active', 'btn-outline-success');
        b.classList.add('btn-outline-secondary');
      });

      btn.classList.add('active', 'btn-outline-success');
      btn.classList.remove('btn-outline-secondary');

      currentPage = 1;
      updateCatalog();
    });
  });

  // 3. Price & Stock Filter apply
  applyBtn?.addEventListener('click', e => {
    e.preventDefault();
    currentPage = 1;
    updateCatalog();
  });

  // 4. Checkbox toggles
  checkInStock?.addEventListener('change', () => {
    currentPage = 1;
    updateCatalog();
  });

  checkSeasonal?.addEventListener('change', () => {
    currentPage = 1;
    updateCatalog();
  });

  // 5. Sorting select
  sortSelect?.addEventListener('change', () => {
    currentPage = 1;
    updateCatalog();
  });

  // 6. Reset Filters button
  resetBtn?.addEventListener('click', e => {
    e.preventDefault();
    resetFilters();
  });

  // Empty state reset trigger
  document.getElementById('emptyStateResetBtn')?.addEventListener('click', e => {
    e.preventDefault();
    resetFilters();
  });

  // Wishlist toggle buttons
  function refreshWishlistButtons() {
    grid.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      const prodId = btn.dataset.productId;
      const icon = btn.querySelector('i');
      if (icon) {
        if (isInWishlist(prodId)) {
          icon.className = 'fa-solid fa-heart text-danger';
        } else {
          icon.className = 'fa-regular fa-heart text-muted';
        }
      }
    });
  }

  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-wishlist-toggle]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const product = {
      id: btn.dataset.productId,
      title: btn.dataset.productTitle || 'Farm Produce Item',
      price: parseFloat(btn.dataset.productPrice) || 5.00,
      unit: btn.dataset.productUnit || 'kg',
      category: btn.dataset.productCategory || 'vegetables',
      origin: btn.dataset.productOrigin || 'Partner Farm',
      image: btn.dataset.productImage || ''
    };

    toggleWishlist(product);
    refreshWishlistButtons();
  });

  window.addEventListener('farmvest:wishlist-updated', () => {
    refreshWishlistButtons();
  });

  // Initial setup
  applyUrlParams();
  updateCatalog();
  refreshWishlistButtons();
  updateWishlistBadges();
}
