// ============================================================
// FarmVest FAQ Live Search & Autocomplete Controller (faq-search.js)
// ============================================================

export function initFaqSearch() {
  const searchInput = document.getElementById('faqSearchInput');
  const suggestionsBox = document.getElementById('faqSearchSuggestions');
  const faqCards = document.querySelectorAll('#faqAccordionV2 .faq-card-v2');
  const catButtons = document.querySelectorAll('[data-faq-cat]');
  const noResultsBox = document.getElementById('faqNoResults');
  const resetBtn = document.getElementById('faqResetSearchBtn');

  if (!searchInput) return;

  // Pre-defined quick suggestions with matched target indices & icons
  const suggestionDatabase = [
    { label: 'What is FarmVest and how does co-funding work?', cat: 'getting-started', targetId: 'faqCollapse1', icon: 'fa-rocket' },
    { label: 'What returns can I expect and when are payouts made?', cat: 'investments', targetId: 'faqCollapse2', icon: 'fa-chart-line' },
    { label: 'How is my principal protected against bad weather or crop loss?', cat: 'security', targetId: 'faqCollapse3', icon: 'fa-shield-halved' },
    { label: 'Multi-Peril Crop Insurance Policies', cat: 'security', targetId: 'faqCollapse3', icon: 'fa-umbrella' },
    { label: 'What is the minimum amount required to start co-funding?', cat: 'getting-started', targetId: 'faqCollapse4', icon: 'fa-coins' },
    { label: 'Minimum share price ($90 per share)', cat: 'getting-started', targetId: 'faqCollapse4', icon: 'fa-tag' },
    { label: 'Who buys harvested crops and how are prices locked in?', cat: 'investments', targetId: 'faqCollapse5', icon: 'fa-file-contract' },
    { label: 'Wholesale Off-Take Contracts & Guaranteed Prices', cat: 'investments', targetId: 'faqCollapse5', icon: 'fa-handshake' },
    { label: 'Can I track farm operations in real-time?', cat: 'telemetry', targetId: 'faqCollapse6', icon: 'fa-tower-cell' },
    { label: 'IoT Telemetry, Soil Sensors & Satellite NDVI', cat: 'telemetry', targetId: 'faqCollapse6', icon: 'fa-satellite-dish' },
    { label: 'How are capital funds managed and escrowed?', cat: 'security', targetId: 'faqCollapse7', icon: 'fa-vault' }
  ];

  let currentCategory = 'all';

  // Function to filter accordion items
  function filterFaq() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    faqCards.forEach(card => {
      const cardCat = card.getAttribute('data-cat') || 'all';
      const textContent = card.textContent.toLowerCase();

      const matchesCat = (currentCategory === 'all' || cardCat === currentCategory);
      const matchesQuery = !query || textContent.includes(query);

      if (matchesCat && matchesQuery) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsBox) {
      if (visibleCount === 0) {
        noResultsBox.classList.remove('d-none');
      } else {
        noResultsBox.classList.add('d-none');
      }
    }
  }

  // Render suggestions dropdown
  function updateSuggestions() {
    if (!suggestionsBox) return;
    const query = searchInput.value.trim().toLowerCase();

    if (query.length < 1) {
      suggestionsBox.classList.add('d-none');
      suggestionsBox.innerHTML = '';
      return;
    }

    const matches = suggestionDatabase.filter(item => 
      item.label.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      suggestionsBox.innerHTML = `
        <div class="p-3 text-muted text-xs text-center">
          No quick keyword suggestions found for "${query}"
        </div>
      `;
      suggestionsBox.classList.remove('d-none');
      return;
    }

    suggestionsBox.innerHTML = matches.map(item => `
      <button type="button" class="faq-suggestion-item text-start border-0 bg-transparent w-100 p-3 d-flex align-items-center gap-3 border-bottom border-light" data-target="${item.targetId}">
        <span class="faq-sug-icon text-success"><i class="fas ${item.icon}"></i></span>
        <span class="faq-sug-text text-dark font-weight-medium text-sm">${item.label}</span>
      </button>
    `).join('');

    suggestionsBox.classList.remove('d-none');

    // Attach click events to suggestion items
    suggestionsBox.querySelectorAll('.faq-suggestion-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const matchedItem = suggestionDatabase.find(i => i.targetId === targetId);

        if (matchedItem) {
          searchInput.value = matchedItem.label;
        }
        suggestionsBox.classList.add('d-none');

        // Reset category filter if necessary
        currentCategory = 'all';
        catButtons.forEach(b => {
          if (b.getAttribute('data-faq-cat') === 'all') {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        filterFaq();

        // Expand and scroll to target accordion card
        if (targetId) {
          const targetCollapse = document.getElementById(targetId);
          if (targetCollapse) {
            // Expand Bootstrap collapse
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(targetCollapse);
            bsCollapse.show();

            // Smooth scroll
            const cardEl = targetCollapse.closest('.faq-card-v2');
            if (cardEl) {
              const yOffset = -120;
              const y = cardEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }
        }
      });
    });
  }

  // Event Listeners
  searchInput.addEventListener('input', () => {
    filterFaq();
    updateSuggestions();
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 1) {
      updateSuggestions();
    }
  });

  // Close suggestions on outside click
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && suggestionsBox && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.add('d-none');
    }
  });

  // Category Buttons Filter
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-faq-cat') || 'all';
      filterFaq();
    });
  });

  // Reset Search Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentCategory = 'all';
      catButtons.forEach(b => {
        if (b.getAttribute('data-faq-cat') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      if (suggestionsBox) suggestionsBox.classList.add('d-none');
      filterFaq();
    });
  }
}
