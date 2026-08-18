// ============================================================
// FarmVest Admin — Homepage Sections Management Engine
// Handles loading, ordering, enable/disable toggle, and editing
// ============================================================

import { showToast } from './toast.js';

const STORAGE_KEY = 'farmvest_sections_config';

/**
 * Fetch default sections from JSON schema or local storage
 */
export async function getSectionsConfig() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved sections config:', e);
    }
  }

  try {
    const res = await fetch('/data/sections.json');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch /data/sections.json:', err);
  }

  // Fallback default sections structure
  return {
    page: 'home',
    sections: [
      { id: 'hero', name: 'Hero Banner Section', type: 'hero', order: 1, enabled: true, content: { heading: 'Grow Wealth with Smart Agricultural Investments' } },
      { id: 'about', name: 'About FarmVest Section', type: 'about', order: 2, enabled: true, content: { heading: 'Revolutionizing Farmland Capital for Everyday Investors' } },
      { id: 'yield_pools', name: 'Active Yield Pools Section', type: 'yield_pools', order: 3, enabled: true, content: { heading: 'High-Yield Farmland Cycles Open for Capital' } },
      { id: 'vision', name: 'Why Choose Us / Vision', type: 'features', order: 4, enabled: true, content: { heading: 'Institutional-Grade Agronomy Backed by Technology' } },
      { id: 'stats', name: 'Platform Performance & Proof', type: 'stats', order: 5, enabled: true, content: { heading: 'Verified Farm Yield Metrics & Growth' } },
      { id: 'how_it_works', name: 'How It Works Process', type: 'how_it_works', order: 6, enabled: true, content: { heading: 'How Farm Investing Works on FarmVest' } },
      { id: 'testimonials', name: 'Investor Testimonials Section', type: 'testimonials', order: 7, enabled: true, content: { heading: 'Trusted by Over 18,400+ Smart Investors' } },
      { id: 'faq', name: 'Frequently Asked Questions Section', type: 'faq', order: 8, enabled: true, content: { heading: 'Frequently Asked Questions' } },
      { id: 'partners', name: 'Institutional Partners & Marquee', type: 'partners', order: 9, enabled: true, content: { heading: 'Backed by Global Agricultural Leaders' } },
      { id: 'blog', name: 'Agronomy Insights & News', type: 'blog', order: 10, enabled: true, content: { heading: 'Latest Agricultural Intelligence & Market Reports' } },
      { id: 'cta', name: 'Call to Action Banner Section', type: 'cta', order: 11, enabled: true, content: { heading: 'Start Cultivating High-Yield Passive Wealth Today' } }
    ]
  };
}

/**
 * Initialize Admin Homepage Sections Manager UI
 */
export async function initAdminSectionManager() {
  const container = document.getElementById('sectionBuilderContainer');
  if (!container) return;

  const config = await getSectionsConfig();
  let sections = config.sections || [];

  // Sort sections by order
  sections.sort((a, b) => (a.order || 0) - (b.order || 0));

  function renderSectionsList() {
    container.innerHTML = '';

    sections.forEach((sec, idx) => {
      sec.order = idx + 1;

      const card = document.createElement('div');
      card.className = `admin-section-item card border rounded-3 p-3 mb-3 fv-fade-in-up ${sec.enabled ? 'border-start-success' : 'opacity-75 bg-light'}`;
      card.style.borderLeftWidth = sec.enabled ? '4px' : '1px';
      card.setAttribute('data-section-id', sec.id);

      const heading = sec.content?.heading || sec.name;
      const subheading = sec.content?.subheading || sec.content?.tag || 'Configured via sections.json';

      card.innerHTML = `
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="cursor-grab text-muted px-1" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></div>
            <div class="badge ${sec.enabled ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary'} font-mono fw-bold rounded-pill">
              #${sec.order}
            </div>
            <div>
              <div class="d-flex align-items-center gap-2">
                <strong class="text-dark fs-6">${sec.name}</strong>
                <span class="badge bg-light text-muted border text-xs font-mono">${sec.type}</span>
                ${sec.enabled ? '<span class="badge bg-success text-white text-xs">Visible</span>' : '<span class="badge bg-secondary text-white text-xs">Hidden</span>'}
              </div>
              <p class="text-xs text-muted mb-0 mt-1 text-truncate" style="max-width: 420px;">${heading} — <span class="fst-italic">${subheading}</span></p>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <!-- Order controls -->
            <button type="button" class="btn btn-sm btn-outline-secondary rounded-circle" data-action="move-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} title="Move Up" style="width: 32px; height: 32px; padding: 0;">
              <i class="fas fa-arrow-up text-xs"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary rounded-circle" data-action="move-down" data-idx="${idx}" ${idx === sections.length - 1 ? 'disabled' : ''} title="Move Down" style="width: 32px; height: 32px; padding: 0;">
              <i class="fas fa-arrow-down text-xs"></i>
            </button>

            <!-- Edit content button -->
            <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3" data-action="edit-section" data-id="${sec.id}">
              <i class="fas fa-pen-to-square me-1"></i> Edit
            </button>

            <!-- Enable/disable toggle -->
            <div class="form-check form-switch mb-0 ms-2" title="${sec.enabled ? 'Disable Section' : 'Enable Section'}">
              <input class="form-check-input" type="checkbox" role="switch" data-action="toggle-enabled" data-id="${sec.id}" ${sec.enabled ? 'checked' : ''} />
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    attachItemEvents();
  }

  function attachItemEvents() {
    // Move up
    container.querySelectorAll('[data-action="move-up"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx > 0) {
          const temp = sections[idx];
          sections[idx] = sections[idx - 1];
          sections[idx - 1] = temp;
          renderSectionsList();
          showToast(`Moved "${temp.name}" up to position #${idx}`, 'info');
        }
      });
    });

    // Move down
    container.querySelectorAll('[data-action="move-down"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx < sections.length - 1) {
          const temp = sections[idx];
          sections[idx] = sections[idx + 1];
          sections[idx + 1] = temp;
          renderSectionsList();
          showToast(`Moved "${temp.name}" down to position #${idx + 2}`, 'info');
        }
      });
    });

    // Toggle enabled
    container.querySelectorAll('[data-action="toggle-enabled"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.getAttribute('data-id');
        const sec = sections.find(s => s.id === id);
        if (sec) {
          sec.enabled = chk.checked;
          renderSectionsList();
          showToast(`Section "${sec.name}" is now ${sec.enabled ? 'Visible' : 'Hidden'} on homepage.`, 'success');
        }
      });
    });

    // Edit Section Modal
    container.querySelectorAll('[data-action="edit-section"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const sec = sections.find(s => s.id === id);
        if (!sec) return;

        openEditSectionModal(sec);
      });
    });
  }

  function openEditSectionModal(sec) {
    let modal = document.getElementById('editSectionModal');
    if (!modal) {
      const modalHTML = `
        <div class="modal fade" id="editSectionModal" tabindex="-1" aria-labelledby="editSectionModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden" style="background: var(--fv-card-bg); color: var(--fv-text);">
              <div class="modal-header border-bottom px-4 py-3" style="background: linear-gradient(135deg, var(--primary-color) 0%, #0F5132 100%); color: #FFFFFF;">
                <h5 class="modal-title font-serif fw-bold" id="editSectionModalLabel">
                  <i class="fas fa-sliders me-2"></i>Configure Homepage Section
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form id="editSectionForm">
                <div class="modal-body p-4">
                  <input type="hidden" id="editSecId" />
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold text-xs text-uppercase text-muted">Section Name</label>
                      <input type="text" class="form-control rounded-3" id="editSecName" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold text-xs text-uppercase text-muted">Section Type</label>
                      <input type="text" class="form-control rounded-3 font-mono" id="editSecType" readonly disabled />
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-bold text-xs text-uppercase text-muted">Main Heading</label>
                      <input type="text" class="form-control rounded-3" id="editSecHeading" required />
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-bold text-xs text-uppercase text-muted">Subheading / Description</label>
                      <textarea class="form-control rounded-3" id="editSecSubheading" rows="3"></textarea>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold text-xs text-uppercase text-muted">Primary Button Text</label>
                      <input type="text" class="form-control rounded-3" id="editSecBtnText" placeholder="e.g. Explore Pools" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold text-xs text-uppercase text-muted">Primary Button URL</label>
                      <input type="text" class="form-control rounded-3 font-mono" id="editSecBtnUrl" placeholder="e.g. /projects.html" />
                    </div>
                  </div>
                </div>
                <div class="modal-footer border-top px-4 py-3">
                  <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-success rounded-pill px-4 font-weight-bold shadow-sm">
                    <i class="fas fa-check me-1"></i> Update Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      modal = document.getElementById('editSectionModal');
    }

    document.getElementById('editSecId').value = sec.id;
    document.getElementById('editSecName').value = sec.name || '';
    document.getElementById('editSecType').value = sec.type || '';
    document.getElementById('editSecHeading').value = sec.content?.heading || '';
    document.getElementById('editSecSubheading').value = sec.content?.subheading || '';
    document.getElementById('editSecBtnText').value = sec.content?.primary_button_text || sec.content?.button_text || '';
    document.getElementById('editSecBtnUrl').value = sec.content?.primary_button_url || sec.content?.button_url || '';

    const form = document.getElementById('editSectionForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      sec.name = document.getElementById('editSecName').value;
      if (!sec.content) sec.content = {};
      sec.content.heading = document.getElementById('editSecHeading').value;
      sec.content.subheading = document.getElementById('editSecSubheading').value;
      
      const btnText = document.getElementById('editSecBtnText').value;
      const btnUrl = document.getElementById('editSecBtnUrl').value;
      if (btnText) {
        if (sec.content.primary_button_text !== undefined) sec.content.primary_button_text = btnText;
        else sec.content.button_text = btnText;
      }
      if (btnUrl) {
        if (sec.content.primary_button_url !== undefined) sec.content.primary_button_url = btnUrl;
        else sec.content.button_url = btnUrl;
      }

      renderSectionsList();

      const bsModal = window.bootstrap?.Modal?.getInstance(modal) || new window.bootstrap.Modal(modal);
      bsModal.hide();
      showToast(`Section "${sec.name}" content updated! Click "Save Layout" to persist.`, 'success');
    };

    const bsModal = window.bootstrap?.Modal?.getOrCreateInstance(modal) || new window.bootstrap.Modal(modal);
    bsModal.show();
  }

  // Save changes button
  const saveBtn = document.getElementById('saveSectionsBtn');
  saveBtn?.addEventListener('click', () => {
    config.sections = sections;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    showToast('Homepage section layout and order saved successfully!', 'success');
  });

  // Reset to default button
  const resetBtn = document.getElementById('resetSectionsBtn');
  resetBtn?.addEventListener('click', async () => {
    if (confirm('Reset all homepage sections to original sections.json defaults?')) {
      localStorage.removeItem(STORAGE_KEY);
      const freshConfig = await getSectionsConfig();
      sections = freshConfig.sections || [];
      renderSectionsList();
      showToast('Restored default homepage sections configuration.', 'info');
    }
  });

  renderSectionsList();
}
