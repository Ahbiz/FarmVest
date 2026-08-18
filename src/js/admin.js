// ============================================================
// FarmVest Admin Dashboard Suite
// Manages platform analytics, agricultural pool CRUD operations,
// transaction approvals, user management, and homepage section builder.
// ============================================================

import * as bootstrap from 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/style.css';

import Chart from 'chart.js/auto';
import { animateCounters, initStaggerEntrance } from './components/animations.js';
import { initThemeToggle } from './services/theme.js';
import { initSidebarToggle } from './components/sidebar.js';
import { injectAdminModals } from './components/admin-modals.js';
import { initAdminSectionManager } from './components/admin-sections.js';
import { getCurrentUser, logout } from './auth.js';
import { showToast } from './components/toast.js';

// Expose bootstrap globally for dynamic modal handlers
window.bootstrap = bootstrap;

/**
 * Retrieves the current primary brand color token from the document root.
 */
function getThemeColor(variableName, fallbackHex) {
  if (typeof window === 'undefined') return fallbackHex;
  const color = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return color || fallbackHex;
}

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  const primaryColor = getThemeColor('--primary-color', '#16A34A');

  initThemeToggle();
  initSidebarToggle();
  initAdminSectionManager();

  // Logout Handlers
  document.querySelectorAll('[data-logout-btn]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });
  injectAdminModals();

  // Open Create Pool modal on button click
  document.querySelectorAll('a[href*="projects.html"], button').forEach(btn => {
    if (btn.textContent.includes('Create New Pool') || btn.textContent.includes('New Pool')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bsModal = new bootstrap.Modal(document.getElementById('createPoolModal'));
        bsModal.show();
      });
    }
  });

  // Handle Pool Creation Form Submit
  let poolIdCounter = 107;
  const createPoolForm = document.getElementById('createPoolForm');
  createPoolForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('poolTitle').value;
    const category = document.getElementById('poolCategory').value;
    const roi = document.getElementById('poolRoi').value;
    const target = parseFloat(document.getElementById('poolTarget').value) || 500000;

    const formattedTarget = target >= 1000000 ? `$${(target / 1000000).toFixed(1)}M` : `$${Math.round(target / 1000)}K`;
    const poolId = `#POL-${poolIdCounter++}`;

    let iconClass = 'fa-seedling';
    let iconBg = 'rgba(var(--primary-color-rgb, 22, 163, 74), 0.12)';
    let iconColor = primaryColor;

    if (category === 'Row Crops') {
      iconClass = 'fa-wheat-awn';
      iconBg = 'rgba(15, 81, 50, 0.12)';
      iconColor = '#0F5132';
    } else if (category === 'Livestock') {
      iconClass = 'fa-cow';
      iconBg = 'rgba(217, 119, 6, 0.12)';
      iconColor = '#D97706';
    } else if (category === 'Permanent Crops') {
      iconClass = 'fa-tree';
      iconBg = 'rgba(2, 132, 199, 0.12)';
      iconColor = '#0284C7';
    }

    // Append to Pools Table if on projects.html
    const poolsTableBody = document.querySelector('.data-table tbody');
    if (poolsTableBody) {
      const newRowHTML = `
        <tr class="fv-fade-in-up">
          <td><input type="checkbox" class="form-check-input pool-row-checkbox"></td>
          <td class="font-mono text-xs text-muted">${poolId}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="rounded-3 p-2 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background: ${iconBg}; color: ${iconColor};">
                <i class="fas ${iconClass}"></i>
              </div>
              <div>
                <strong class="d-block text-dark pool-title-text">${title}</strong>
                <span class="text-xs text-muted">Newly Added Pool</span>
              </div>
            </div>
          </td>
          <td><span class="badge bg-light text-dark border">${category}</span></td>
          <td class="text-success fw-bold">${roi}%</td>
          <td>
            <div class="funding-progress">
              <div class="funding-progress__bar">
                <div class="funding-progress__fill" style="width: 0%;"></div>
              </div>
              <span class="funding-progress__label">0%</span>
            </div>
          </td>
          <td class="font-mono text-xs"><strong class="text-dark">$0</strong> / ${formattedTarget}</td>
          <td>0</td>
          <td><span class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill"><i class="fas fa-circle text-xs me-1"></i>Funding</span></td>
          <td class="text-end">
            <a href="/project-details.html" class="btn btn-sm btn-outline-secondary rounded-pill me-1" aria-label="View" title="View Public Page"><i class="fas fa-eye"></i></a>
            <button class="btn btn-sm btn-outline-primary rounded-pill me-1" data-admin-edit-pool aria-label="Edit" title="Edit Pool"><i class="fas fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger rounded-pill" data-admin-delete-pool aria-label="Delete" title="Delete Pool"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
      poolsTableBody.insertAdjacentHTML('afterbegin', newRowHTML);
    }

    // Update counter
    const totalPoolsEl = document.querySelector('[data-counter-target="38"]');
    if (totalPoolsEl) {
      const currentVal = parseInt(totalPoolsEl.getAttribute('data-counter-target') || '38', 10);
      totalPoolsEl.setAttribute('data-counter-target', (currentVal + 1).toString());
      totalPoolsEl.textContent = (currentVal + 1).toString();
    }

    // Hide Modal & Show Toast
    const modalEl = document.getElementById('createPoolModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance?.hide();

    createPoolForm.reset();
    showToast(`Pool "${title}" created successfully and opened for funding!`, 'success');
  });

  // Track active row for Edit Modal
  let activeEditingRow = null;

  // Global click delegation for Edit & Delete pool buttons
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-admin-edit-pool]');
    const deleteBtn = e.target.closest('[data-admin-delete-pool]');

    if (editBtn) {
      e.preventDefault();
      activeEditingRow = editBtn.closest('tr');
      if (!activeEditingRow) return;

      const titleEl = activeEditingRow.querySelector('.pool-title-text');
      const categoryTd = activeEditingRow.children[3];
      const roiTd = activeEditingRow.children[4];
      const raisedTargetTd = activeEditingRow.children[6];
      const investorsTd = activeEditingRow.children[7];
      const statusBadge = activeEditingRow.children[8]?.querySelector('.badge');

      const title = titleEl ? titleEl.textContent.trim() : '';
      const category = categoryTd ? categoryTd.textContent.trim() : 'Horticulture';
      const roi = roiTd ? roiTd.textContent.replace('%', '').trim() : '15.0';
      const raisedTarget = raisedTargetTd ? raisedTargetTd.textContent.trim() : '$0 / $500K';
      const investors = investorsTd ? investorsTd.textContent.trim() : '0';
      let status = 'Funding';
      if (statusBadge) {
        const text = statusBadge.textContent.trim().toLowerCase();
        if (text.includes('active')) status = 'Active';
        else if (text.includes('matured')) status = 'Matured';
        else if (text.includes('paused')) status = 'Paused';
        else status = 'Funding';
      }

      document.getElementById('editPoolTitle').value = title;
      document.getElementById('editPoolCategory').value = category;
      document.getElementById('editPoolRoi').value = roi;
      document.getElementById('editPoolRaisedTarget').value = raisedTarget;
      document.getElementById('editPoolInvestors').value = investors;
      document.getElementById('editPoolStatus').value = status;

      const editModalEl = document.getElementById('editPoolModal');
      if (editModalEl) {
        const bsModal = bootstrap.Modal.getOrCreateInstance(editModalEl);
        bsModal.show();
      }
    }

    if (deleteBtn) {
      e.preventDefault();
      const tr = deleteBtn.closest('tr');
      if (!tr) return;

      const poolTitle = tr.querySelector('.pool-title-text')?.textContent.trim() || 'this farm pool';
      if (confirm(`Are you sure you want to delete "${poolTitle}"? This operation cannot be undone.`)) {
        tr.style.transition = 'all 0.3s ease';
        tr.style.opacity = '0';
        tr.style.transform = 'translateX(20px)';
        setTimeout(() => {
          tr.remove();
          showToast(`Pool "${poolTitle}" has been removed.`, 'info');
        }, 300);
      }
    }
  });

  // Handle Edit Pool Form Submit
  const editPoolForm = document.getElementById('editPoolForm');
  editPoolForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeEditingRow) return;

    const newTitle = document.getElementById('editPoolTitle').value;
    const newCategory = document.getElementById('editPoolCategory').value;
    const newRoi = document.getElementById('editPoolRoi').value;
    const newRaisedTarget = document.getElementById('editPoolRaisedTarget').value;
    const newInvestors = document.getElementById('editPoolInvestors').value;
    const newStatus = document.getElementById('editPoolStatus').value;

    const titleEl = activeEditingRow.querySelector('.pool-title-text');
    if (titleEl) titleEl.textContent = newTitle;

    const categoryTd = activeEditingRow.children[3];
    if (categoryTd) categoryTd.innerHTML = `<span class="badge bg-light text-dark border">${newCategory}</span>`;

    const roiTd = activeEditingRow.children[4];
    if (roiTd) roiTd.textContent = `${newRoi}%`;

    const raisedTargetTd = activeEditingRow.children[6];
    if (raisedTargetTd) raisedTargetTd.innerHTML = newRaisedTarget.includes('/') ? newRaisedTarget : `<strong class="text-dark">${newRaisedTarget}</strong>`;

    const investorsTd = activeEditingRow.children[7];
    if (investorsTd) investorsTd.textContent = newInvestors;

    const statusTd = activeEditingRow.children[8];
    if (statusTd) {
      let badgeClass = 'bg-warning-subtle text-warning border-warning-subtle';
      let icon = 'fa-circle';
      if (newStatus === 'Active') {
        badgeClass = 'bg-success-subtle text-success border-success-subtle';
      } else if (newStatus === 'Matured') {
        badgeClass = 'bg-info-subtle text-info border-info-subtle';
      } else if (newStatus === 'Paused') {
        badgeClass = 'bg-secondary-subtle text-secondary border-secondary-subtle';
        icon = 'fa-pause-circle';
      }
      statusTd.innerHTML = `<span class="badge ${badgeClass} border rounded-pill"><i class="fas ${icon} text-xs me-1"></i>${newStatus}</span>`;
    }

    const editModalEl = document.getElementById('editPoolModal');
    if (editModalEl) {
      const modalInstance = bootstrap.Modal.getOrCreateInstance(editModalEl);
      modalInstance.hide();
    }

    showToast(`Pool "${newTitle}" details updated successfully!`, 'success');
  });

  // Select All Checkbox logic
  const selectAllCheck = document.getElementById('selectAllPools');
  selectAllCheck?.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    document.querySelectorAll('.pool-row-checkbox').forEach(cb => cb.checked = isChecked);
  });

  // Pagination Handler
  let currentPage = 1;
  const prevBtn = document.getElementById('prevPoolsBtn');
  const nextBtn = document.getElementById('nextPoolsBtn');
  const tableCountEl = document.getElementById('poolsTableCount');

  const updatePaginationUI = () => {
    if (!tableCountEl) return;
    if (currentPage === 1) {
      tableCountEl.textContent = 'Showing 1 - 6 of 38 pools';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = false;
    } else if (currentPage === 2) {
      tableCountEl.textContent = 'Showing 7 - 12 of 38 pools';
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;
    } else {
      tableCountEl.textContent = 'Showing 13 - 18 of 38 pools';
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = true;
    }
  };

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePaginationUI();
      showToast(`Navigated to page ${currentPage}`, 'info');
    }
  });

  nextBtn?.addEventListener('click', () => {
    if (currentPage < 3) {
      currentPage++;
      updatePaginationUI();
      showToast(`Navigated to page ${currentPage}`, 'info');
    }
  });

  // ============================================================
  // 3. INTERACTIVE TRANSACTION APPROVAL & REJECTION ACTIONS
  // ============================================================
  document.querySelectorAll('[data-admin-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.getAttribute('data-admin-action');
      const tr = btn.closest('tr');

      if (action === 'approve') {
        if (tr) {
          const statusTd = tr.querySelector('td:nth-last-child(2)');
          const actionTd = tr.querySelector('td:last-child');
          if (statusTd) {
            statusTd.innerHTML = `<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill"><i class="fas fa-circle-check me-1"></i>Approved / Completed</span>`;
          }
          if (actionTd) {
            actionTd.innerHTML = `<button class="btn btn-sm btn-outline-secondary rounded-pill" aria-label="View Details"><i class="fas fa-eye"></i></button>`;
          }
        }
        showToast('Transaction approved successfully! Payout executed.', 'success');
      } else if (action === 'reject') {
        if (tr) {
          const statusTd = tr.querySelector('td:nth-last-child(2)');
          const actionTd = tr.querySelector('td:last-child');
          if (statusTd) {
            statusTd.innerHTML = `<span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill"><i class="fas fa-times-circle me-1"></i>Rejected</span>`;
          }
          if (actionTd) {
            actionTd.innerHTML = `<button class="btn btn-sm btn-outline-secondary rounded-pill" aria-label="View Details"><i class="fas fa-eye"></i></button>`;
          }
        }
        showToast('Transaction rejected and returned to investor queue.', 'info');
      } else if (action === 'toggle-user') {
        showToast('User account status updated.', 'success');
      } else if (action === 'save-settings') {
        showToast('System configuration settings saved.', 'success');
      }
    });
  });

  // ============================================================
  // 4. LIVE TABLE SEARCH & FILTER FUNCTIONALITY
  // ============================================================
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="Search"]');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('.data-table tbody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
    });
  });

  // Dropdown Status Filters
  document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const filterText = item.textContent.trim().toLowerCase();
      const dropdownToggle = item.closest('.dropdown')?.querySelector('.dropdown-toggle');
      if (dropdownToggle && !filterText.includes('last')) {
        dropdownToggle.innerHTML = `<i class="fas fa-filter me-1"></i> ${item.textContent.trim()}`;
      }

      if (filterText === 'all' || filterText.includes('all')) {
        document.querySelectorAll('.data-table tbody tr').forEach(r => r.style.display = '');
        return;
      }

      const rows = document.querySelectorAll('.data-table tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filterText) ? '' : 'none';
      });
    });
  });

  // ============================================================
  // 5. WORKING CSV EXPORT HELPER
  // ============================================================
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('Export CSV') || btn.textContent.includes('Export Report') || btn.textContent.includes('Export')) {
      btn.addEventListener('click', (e) => {
        if (btn.closest('form')) return;
        e.preventDefault();
        
        const table = document.querySelector('.data-table table');
        if (!table) {
          showToast('CSV export generated successfully.', 'success');
          return;
        }

        let csv = [];
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cols = row.querySelectorAll('th, td');
          let rowData = [];
          cols.forEach(col => rowData.push(`"${col.textContent.replace(/"/g, '""').trim()}"`));
          csv.push(rowData.join(','));
        });

        const csvString = csv.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'farmvest_admin_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Downloaded farmvest_admin_export.csv', 'success');
      });
    }
  });

  // ============================================================
  // 6. ANIMATED STAT COUNTERS & STAGGERED ENTRANCE ANIMATIONS
  // ============================================================
  animateCounters();
  initStaggerEntrance();

  // ============================================================
  // 7. CHART.JS INITIALIZATION (Admin Dashboard Analytics)
  // ============================================================

  const chartLabels = ['23-Jul', '25-Jul', '27-Jul', '29-Jul', '31-Jul', '02-Aug', '04-Aug', '06-Aug'];

  // 1. Deposit & Withdraw Bar Chart (Index Page)
  const ctxDepositWithdraw = document.getElementById('chartDepositWithdraw');
  if (ctxDepositWithdraw) {
    new Chart(ctxDepositWithdraw, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Deposited ($)',
            data: [4200, 6800, 12500, 9400, 15800, 11200, 18400, 24500],
            backgroundColor: primaryColor,
            borderRadius: 6
          },
          {
            label: 'Withdrawn ($)',
            data: [300, 1200, 800, 2400, 1500, 900, 1100, 350],
            backgroundColor: '#E11D48',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Transactions Smooth Line Chart (Index Page)
  const ctxTransactions = document.getElementById('chartTransactions');
  if (ctxTransactions) {
    new Chart(ctxTransactions, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Plus Transactions',
            data: [5, 12, 18, 14, 25, 20, 28, 35],
            borderColor: primaryColor,
            backgroundColor: 'rgba(var(--primary-color-rgb, 22, 163, 74), 0.15)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Minus Transactions',
            data: [1, 2, 4, 3, 5, 2, 4, 1],
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Doughnut Charts (Index Page)
  const ctxBrowser = document.getElementById('chartBrowser');
  if (ctxBrowser) {
    new Chart(ctxBrowser, {
      type: 'doughnut',
      data: {
        labels: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Others'],
        datasets: [{
          data: [520, 110, 45, 30, 11],
          backgroundColor: ['#6366F1', '#EC4899', '#F59E0B', primaryColor, '#64748B']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  const ctxOS = document.getElementById('chartOS');
  if (ctxOS) {
    new Chart(ctxOS, {
      type: 'doughnut',
      data: {
        labels: ['Windows', 'macOS', 'iOS', 'Android', 'Linux'],
        datasets: [{
          data: [380, 190, 85, 45, 16],
          backgroundColor: ['#3B82F6', '#F43F5E', primaryColor, '#F59E0B', '#8B5CF6']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  const ctxCountry = document.getElementById('chartCountry');
  if (ctxCountry) {
    new Chart(ctxCountry, {
      type: 'doughnut',
      data: {
        labels: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Nigeria', 'Others'],
        datasets: [{
          data: [290, 140, 110, 80, 65, 31],
          backgroundColor: ['#8B5CF6', '#F59E0B', '#3B82F6', primaryColor, '#EC4899', '#94A3B8']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  // 4. Reports Page Charts (Funding Volume & Capital by Category)
  const ctxFundingVolume = document.getElementById('chartFundingVolume');
  if (ctxFundingVolume) {
    new Chart(ctxFundingVolume, {
      type: 'bar',
      data: {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
          label: 'Funding Volume ($M)',
          data: [12.0, 15.0, 13.5, 18.0, 16.5, 20.0],
          backgroundColor: [primaryColor, primaryColor, primaryColor, primaryColor, primaryColor, '#D97706'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const ctxCapitalCategory = document.getElementById('chartCapitalCategory');
  if (ctxCapitalCategory) {
    new Chart(ctxCapitalCategory, {
      type: 'doughnut',
      data: {
        labels: ['Row Crops (34%)', 'Livestock (28%)', 'Horticulture (21%)', 'Permanent Crops (12%)', 'Aquaculture (5%)'],
        datasets: [{
          data: [34, 28, 21, 12, 5],
          backgroundColor: [primaryColor, '#0F5132', '#D97706', '#0284C7', '#64748B']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // ============================================================
  // ADMIN E-COMMERCE: Produce Inventory (admin/products.html)
  // ============================================================
  const adminProductsTableBody = document.getElementById('adminProductsTableBody');
  if (adminProductsTableBody) {
    import('./services/ecommerce-store.js').then(({ getStoreProducts, upsertStoreProduct, deleteStoreProduct }) => {
      function renderAdminProducts() {
        const products = getStoreProducts();
        const totalUnits = products.reduce((acc, p) => acc + (p.stockQty || 0), 0);

        const totalItemsEl = document.getElementById('adminKpiTotalItems');
        const stockUnitsEl = document.getElementById('adminKpiStockUnits');
        const countTextEl = document.getElementById('adminProductsCount');

        if (totalItemsEl) totalItemsEl.textContent = `${products.length} Products`;
        if (stockUnitsEl) stockUnitsEl.textContent = `${totalUnits} units`;
        if (countTextEl) countTextEl.textContent = `Showing ${products.length} produce items`;

        adminProductsTableBody.innerHTML = products.map(p => `
          <tr>
            <td class="ps-4">
              <div class="d-flex align-items-center gap-3">
                <img src="${p.image}" class="rounded-3 shadow-sm" width="38" height="38" style="object-fit: cover;" alt="${p.title}" />
                <div>
                  <strong class="text-dark d-block text-sm">${p.title}</strong>
                  <span class="text-xs text-muted font-mono">${p.id} · <span class="badge bg-light text-dark border">${p.badge || 'Organic'}</span></span>
                </div>
              </div>
            </td>
            <td>
              <span class="badge bg-light text-dark border text-capitalize text-xs">${p.category}</span>
            </td>
            <td>
              <strong class="font-mono text-success fs-6">$${p.price.toFixed(2)}</strong>
              <span class="text-xs text-muted">/ ${p.unit}</span>
            </td>
            <td>
              <span class="text-sm text-dark">${p.origin}</span>
            </td>
            <td>
              <span class="font-mono fw-bold text-sm ${p.stockQty > 20 ? 'text-dark' : 'text-danger'}">${p.stockQty || 50} units</span>
            </td>
            <td>
              <span class="badge rounded-pill px-3 py-1 text-xs bg-success-subtle text-success border border-success-subtle">
                In Stock
              </span>
            </td>
            <td class="text-end pe-4">
              <button type="button" class="btn btn-outline-danger btn-sm rounded-circle p-2" data-delete-prod="${p.id}" title="Remove Product">
                <i class="fas fa-trash-can"></i>
              </button>
            </td>
          </tr>
        `).join('');

        // Bind delete buttons
        adminProductsTableBody.querySelectorAll('[data-delete-prod]').forEach(btn => {
          btn.addEventListener('click', () => {
            const prodId = btn.dataset.deleteProd;
            if (confirm('Are you sure you want to remove this product from the marketplace?')) {
              deleteStoreProduct(prodId);
              showToast('Product removed from catalog.', 'info');
              renderAdminProducts();
            }
          });
        });
      }

      // Add Product Form
      const addForm = document.getElementById('adminAddProductForm');
      if (addForm) {
        addForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('admNewTitle')?.value;
          const category = document.getElementById('admNewCat')?.value;
          const price = parseFloat(document.getElementById('admNewPrice')?.value) || 10.00;
          const unit = document.getElementById('admNewUnit')?.value;
          const stock = parseInt(document.getElementById('admNewStock')?.value, 10) || 50;
          const origin = document.getElementById('admNewOrigin')?.value;
          const badge = document.getElementById('admNewBadge')?.value;
          const image = document.getElementById('admNewImage')?.value;

          upsertStoreProduct({
            title: title,
            category: category,
            price: price,
            unit: unit,
            stockQty: stock,
            origin: origin,
            badge: badge,
            image: image,
            rating: 5.0,
            reviewsCount: 1,
            stockStatus: 'in-stock'
          });

          addForm.reset();
          const modalEl = document.getElementById('adminAddProductModal');
          if (modalEl && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
          }

          showToast(`Produce item "${title}" added to store catalog!`, 'success');
          renderAdminProducts();
        });
      }

      renderAdminProducts();
    });
  }

  // ============================================================
  // ADMIN E-COMMERCE: Store Orders & Dispatch (admin/orders.html)
  // ============================================================
  const adminOrdersTableBody = document.getElementById('adminOrdersTableBody');
  if (adminOrdersTableBody) {
    import('./services/ecommerce-store.js').then(({ getMemberOrders, updateOrderStatus }) => {
      let currentAdminFilter = 'all';

      function renderAdminOrders() {
        const orders = getMemberOrders();
        const inTransit = orders.filter(o => o.status === 'In Transit').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const totalGmv = orders.reduce((acc, o) => acc + (o.total || 0), 0);

        const inTransitEl = document.getElementById('adminOrdersInTransit');
        const deliveredEl = document.getElementById('adminOrdersDelivered');
        const gmvEl = document.getElementById('adminOrdersGmv');
        const countEl = document.getElementById('adminOrdersCount');
        const pendingBadge = document.getElementById('adminSidebarPendingBadge');

        if (inTransitEl) inTransitEl.textContent = inTransit;
        if (deliveredEl) deliveredEl.textContent = delivered;
        if (gmvEl) gmvEl.textContent = `$${totalGmv.toFixed(2)}`;
        if (pendingBadge) pendingBadge.textContent = inTransit;

        const filtered = orders.filter(o => currentAdminFilter === 'all' || o.status === currentAdminFilter);
        if (countEl) countEl.textContent = `${filtered.length} customer orders`;

        if (filtered.length === 0) {
          adminOrdersTableBody.innerHTML = `
            <tr>
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="fas fa-box-open fs-2 mb-2 d-block"></i>
                No store orders match this filter.
              </td>
            </tr>
          `;
          return;
        }

        adminOrdersTableBody.innerHTML = filtered.map(o => `
          <tr>
            <td class="ps-4">
              <strong class="font-mono text-dark d-block">#${o.id}</strong>
              <span class="text-xs text-muted font-mono">${o.date} · ${o.trackingNumber}</span>
            </td>
            <td>
              <strong class="text-dark d-block text-sm">${o.customerName}</strong>
              <span class="text-xs text-muted">${o.customerEmail}</span>
            </td>
            <td>
              <div class="text-xs text-dark fw-bold">${o.items.map(i => `${i.qty}× ${i.title}`).join(', ')}</div>
            </td>
            <td>
              <strong class="font-mono text-success fs-6">$${o.total.toFixed(2)}</strong>
            </td>
            <td>
              <span class="badge bg-light text-dark border text-xs">${o.paymentMethod}</span>
            </td>
            <td>
              <span class="badge rounded-pill px-3 py-1 ${o.status === 'Delivered' ? 'bg-success-subtle text-success border border-success-subtle' : o.status === 'In Transit' ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}">
                <i class="fas ${o.status === 'Delivered' ? 'fa-circle-check' : 'fa-truck-fast'} me-1"></i> ${o.status}
              </span>
            </td>
            <td class="text-end pe-4">
              <button type="button" class="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold" data-change-status="${o.id}">
                <i class="fas fa-pen-to-square me-1"></i> Update
              </button>
            </td>
          </tr>
        `).join('');

        // Bind update status modal
        adminOrdersTableBody.querySelectorAll('[data-change-status]').forEach(btn => {
          btn.addEventListener('click', () => {
            const orderId = btn.dataset.changeStatus;
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const modalEl = document.getElementById('adminUpdateStatusModal');
            if (modalEl && window.bootstrap) {
              document.getElementById('statusOrderId').value = order.id;
              document.getElementById('statusModalOrderRef').textContent = `#${order.id} (${order.customerName})`;
              document.getElementById('statusSelectOption').value = order.status;

              const statusModal = new window.bootstrap.Modal(modalEl);
              statusModal.show();
            }
          });
        });
      }

      // Status update form submit
      const statusForm = document.getElementById('adminStatusForm');
      if (statusForm) {
        statusForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const orderId = document.getElementById('statusOrderId')?.value;
          const newStatus = document.getElementById('statusSelectOption')?.value;

          updateOrderStatus(orderId, newStatus);

          const modalEl = document.getElementById('adminUpdateStatusModal');
          if (modalEl && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
          }

          showToast(`Order #${orderId} status updated to ${newStatus}!`, 'success');
          renderAdminOrders();
        });
      }

      // Filter tabs
      document.querySelectorAll('#adminOrderStatusFilter button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#adminOrderStatusFilter button').forEach(b => {
            b.classList.remove('active', 'btn-success');
            b.classList.add('btn-outline-secondary');
          });
          btn.classList.add('active', 'btn-success');
          btn.classList.remove('btn-outline-secondary');
          currentAdminFilter = btn.dataset.filter || 'all';
          renderAdminOrders();
        });
      });

      renderAdminOrders();
    });
  }
});

