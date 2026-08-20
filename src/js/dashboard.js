// ============================================================
// FarmVest Investor Dashboard Controller
// Manages financial analytics charts, wallet balance hydration,
// live deposit/withdrawal simulation, and theme toggling.
// ============================================================

import * as bootstrap from 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import { createIcons, icons } from 'lucide';
import '../css/style.css';

// Expose bootstrap globally for dynamic modal handlers
window.bootstrap = bootstrap;

import { getCurrentUser, setCurrentUser, logout } from './auth.js';
import { showToast } from './components/toast.js';
import { initYieldChart, initAllocationChart, initSparkline } from './components/charts.js';
import { animateCounters, initStaggerEntrance } from './components/animations.js';
import { initThemeToggle } from './services/theme.js';
import { initSidebarToggle } from './components/sidebar.js';
import { getWalletBalance } from './services/ecommerce-store.js';
import { getWishlistItems, removeFromWishlist, clearWishlist, toggleWishlist, isInWishlist, updateWishlistBadges } from './services/wishlist.js';
import { getPayoutHistory, requestPayout } from './services/payouts.js';
import { getReferralData } from './services/referrals.js';
import { addToCart } from './components/cart-drawer.js';

document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });

  initThemeToggle();
  initSidebarToggle();

  // Authentication Route Guard for all dashboard pages
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = '/auth/login.html';
    return;
  }

  // Hydrate user session and wallet displays across topbar, sidebar, and body
  const userFirstNames = document.querySelectorAll('.dashboard__user-name, .dashboard__page-title-name');
  userFirstNames.forEach(el => {
    el.textContent = currentUser.fullName.split(' ')[0];
  });

  const userFullNames = document.querySelectorAll('[data-user-fullname]');
  userFullNames.forEach(el => {
    el.textContent = currentUser.fullName;
  });

  const userEmails = document.querySelectorAll('[data-user-email]');
  userEmails.forEach(el => {
    el.textContent = currentUser.email;
  });

  const activeBal = currentUser.walletBalance !== undefined ? currentUser.walletBalance : getWalletBalance();
  const walletDisplayElements = document.querySelectorAll('[data-wallet-balance]');
  walletDisplayElements.forEach(el => {
    el.textContent = `$${activeBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  });

  // 4. Initialize Charts & Animations
  initYieldChart('yieldChart');
  initAllocationChart('allocationChart');
  initSparkline('sparkline1', [12, 15, 18, 14, 22, 25, 28]);
  initSparkline('sparkline2', [98, 98.5, 99, 99.2, 99.1, 99.4]);
  initSparkline('sparkline3', [4000, 4500, 5200, 6800, 8250]);

  animateCounters();
  initStaggerEntrance();

  // 5. Radio Cards Interactive Selection (e.g. Deposit/Withdraw methods)
  const radioCards = document.querySelectorAll('.radio-card');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      const groupName = card.dataset.radioGroup;
      if (groupName) {
        document.querySelectorAll(`.radio-card[data-radio-group="${groupName}"]`).forEach(c => c.classList.remove('is-selected'));
      } else {
        radioCards.forEach(c => c.classList.remove('is-selected'));
      }
      card.classList.add('is-selected');
      const radioInput = card.querySelector('input[type="radio"]');
      if (radioInput) radioInput.checked = true;
    });
  });

  // 6. Quick Amount Buttons for Deposit / Withdraw
  const quickBtns = document.querySelectorAll('[data-quick-amount]');
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = btn.getAttribute('data-quick-amount');
      const targetInput = document.getElementById('depositAmount') || document.getElementById('withdrawAmount');
      if (targetInput) targetInput.value = amount;
    });
  });

  // 7. Deposit Form Handler
  const depositForm = document.getElementById('depositForm');
  if (depositForm) {
    depositForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amountInput = document.getElementById('depositAmount');
      const gatewaySelect = document.querySelector('input[name="payment"]:checked')?.value || 'Bank Transfer';
      const amount = parseFloat(amountInput?.value || 0);

      if (!amount || amount <= 0) {
        showToast('Please enter a valid deposit amount.', 'error');
        return;
      }

      currentUser.walletBalance += amount;
      setCurrentUser(currentUser);

      showToast(`Successfully deposited $${amount.toFixed(2)} via ${gatewaySelect}!`, 'success');
      
      if (amountInput) amountInput.value = '';

      walletDisplayElements.forEach(el => {
        el.textContent = `$${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      });
    });
  }

  // 8. Withdraw Form Handler
  const withdrawForm = document.getElementById('withdrawForm');
  if (withdrawForm) {
    withdrawForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amountInput = document.getElementById('withdrawAmount');
      const amount = parseFloat(amountInput?.value || 0);

      if (!amount || amount <= 0) {
        showToast('Please enter a valid withdrawal amount.', 'error');
        return;
      }

      if (amount > currentUser.walletBalance) {
        showToast('Insufficient wallet balance for this withdrawal.', 'error');
        return;
      }

      currentUser.walletBalance -= amount;
      setCurrentUser(currentUser);

      showToast(`Withdrawal request of $${amount.toFixed(2)} submitted for processing!`, 'success');
      
      if (amountInput) amountInput.value = '';

      walletDisplayElements.forEach(el => {
        el.textContent = `$${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      });
    });
  }

  // 9. Profile Edit Form Handler
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('profileFullName')?.value;
      const email = document.getElementById('profileEmail')?.value;

      if (fullName) currentUser.fullName = fullName;
      if (email) currentUser.email = email;

      setCurrentUser(currentUser);
      showToast('Profile information updated successfully!', 'success');
    });
  }

  // 10. Support Ticket Form Handler
  const supportForm = document.getElementById('supportForm');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Support ticket #FV-8942 created! Our agronomist team will reply within 2 hours.', 'success');
      supportForm.reset();
    });
  }

  // 11. Logout Buttons
  document.querySelectorAll('[data-logout-btn]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });

  // ============================================================
  // 12. E-COMMERCE: Member Produce Store (dashboard/shop.html)
  // ============================================================
  const memberStoreGrid = document.getElementById('memberStoreGrid');
  if (memberStoreGrid) {
    import('./services/ecommerce-store.js').then(({ getStoreProducts, getWalletBalance, deductWalletBalance, createMemberOrder }) => {
      let currentActiveCat = 'all';
      let currentSort = 'popular';
      const searchInput = document.getElementById('memberStoreSearch');
      const sortSelect = document.getElementById('memberStoreSort');
      const catButtons = document.querySelectorAll('#memberStoreCatFilter button');
      const topbarBalanceEl = document.getElementById('topbarWalletBalance');
      const bannerBalanceEl = document.getElementById('bannerWalletBalance');
      const modalBalanceEl = document.getElementById('modalWalletBalance');

      function updateBalances() {
        const bal = getWalletBalance();
        const formatted = `$${bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        if (topbarBalanceEl) topbarBalanceEl.textContent = formatted;
        if (bannerBalanceEl) bannerBalanceEl.textContent = formatted;
        if (modalBalanceEl) modalBalanceEl.textContent = formatted;
      }
      updateBalances();

      function renderMemberProducts() {
        const products = getStoreProducts();
        const term = (searchInput?.value || '').trim().toLowerCase();

        let filtered = products.filter(p => {
          const catOk = currentActiveCat === 'all' || p.category === currentActiveCat;
          const textOk = !term || (p.title + ' ' + p.origin + ' ' + p.category).toLowerCase().includes(term);
          return catOk && textOk;
        });

        filtered.sort((a, b) => {
          if (currentSort === 'price-asc') return a.price - b.price;
          if (currentSort === 'price-desc') return b.price - a.price;
          if (currentSort === 'rating') return (b.rating || 0) - (a.rating || 0);
          return 0;
        });

        if (filtered.length === 0) {
          memberStoreGrid.innerHTML = `
            <div class="col-12 text-center py-5">
              <i class="fa-solid fa-basket-shopping text-muted fs-1 mb-3"></i>
              <h5 class="fw-bold text-dark">No produce found</h5>
              <p class="text-muted text-sm">Try searching for other fruits, vegetables, meats or honey.</p>
            </div>
          `;
          return;
        }

        memberStoreGrid.innerHTML = filtered.map(p => `
          <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow-md transition-base">
              <div class="position-relative overflow-hidden" style="height: 130px; background: #f8fafc;">
                <img src="${p.image}" class="w-100 h-100" alt="${p.title}" style="object-fit: cover;" />
                <span class="badge bg-success position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill font-mono shadow-sm" style="font-size: 10px;">
                  ${p.badge || 'Direct Harvest'}
                </span>
                <button type="button" class="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-2 shadow-sm d-flex align-items-center justify-content-center" data-wishlist-toggle data-product-id="${p.id}" style="width: 30px; height: 30px; padding: 0; z-index: 2;" title="Toggle Wishlist">
                  <i class="${isInWishlist(p.id) ? 'fa-solid text-danger' : 'fa-regular text-muted'} fa-heart"></i>
                </button>
              </div>
              <div class="card-body p-3 d-flex flex-column">
                <div class="d-flex align-items-center gap-1 text-warning text-xs mb-1" style="font-size: 11px;">
                  <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                  <span class="text-muted ms-1">(${p.rating || 4.9})</span>
                </div>
                <h6 class="card-title font-heading fw-bold text-dark mb-1 text-truncate" title="${p.title}" style="font-size: 0.95rem;">${p.title}</h6>
                <p class="text-xs text-muted mb-2 text-truncate" style="font-size: 11px;"><i class="fa-solid fa-location-dot text-success me-1"></i>${p.origin}</p>
                <div class="mt-auto pt-2 border-top d-flex align-items-center justify-content-between">
                  <div>
                    <span class="text-muted d-block" style="font-size: 10px;">Price / ${p.unit}</span>
                    <span class="font-mono fw-bold text-success" style="font-size: 1.05rem;">$${p.price.toFixed(2)}</span>
                  </div>
                  <button type="button" class="btn btn-success btn-sm rounded-pill px-3 py-1 fw-bold text-xs shadow-sm" data-buy-wallet data-product-id="${p.id}">
                    <i class="fa-solid fa-bolt me-1"></i> Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('');

        // Bind wishlist toggle buttons
        memberStoreGrid.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prodId = btn.dataset.productId;
            const product = products.find(p => p.id === prodId);
            if (!product) return;
            toggleWishlist(product);
            const icon = btn.querySelector('i');
            if (icon) {
              if (isInWishlist(prodId)) {
                icon.className = 'fa-solid fa-heart text-danger';
              } else {
                icon.className = 'fa-regular fa-heart text-muted';
              }
            }
          });
        });

        // Bind quick buy buttons
        memberStoreGrid.querySelectorAll('[data-buy-wallet]').forEach(btn => {
          btn.addEventListener('click', () => {
            const prodId = btn.dataset.productId;
            const product = products.find(p => p.id === prodId);
            if (!product) return;
            openCheckoutModal(product);
          });
        });
      }

      // 1-Click Wallet Checkout Modal Logic
      let currentCheckoutProduct = null;
      let checkoutQty = 1;
      const modalEl = document.getElementById('walletCheckoutModal');
      const checkoutModal = modalEl && window.bootstrap ? new window.bootstrap.Modal(modalEl) : null;

      function openCheckoutModal(product) {
        currentCheckoutProduct = product;
        checkoutQty = 1;

        const imgEl = document.getElementById('checkoutModalImg');
        const titleEl = document.getElementById('checkoutModalTitle');
        const originEl = document.getElementById('checkoutModalOrigin');
        const priceEl = document.getElementById('checkoutModalPrice');
        const qtyEl = document.getElementById('checkoutQty');

        if (imgEl) imgEl.src = product.image;
        if (titleEl) titleEl.textContent = product.title;
        if (originEl) originEl.textContent = product.origin;
        if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)} / ${product.unit}`;
        if (qtyEl) qtyEl.textContent = '1';

        updateCheckoutTotals();
        checkoutModal?.show();
      }

      function updateCheckoutTotals() {
        if (!currentCheckoutProduct) return;
        const subtotal = currentCheckoutProduct.price * checkoutQty;
        const subtotalEl = document.getElementById('checkoutSubtotal');
        const grandTotalEl = document.getElementById('checkoutGrandTotal');
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (grandTotalEl) grandTotalEl.textContent = `$${subtotal.toFixed(2)}`;
      }

      document.getElementById('qtyMinusBtn')?.addEventListener('click', () => {
        if (checkoutQty > 1) {
          checkoutQty--;
          const qtyEl = document.getElementById('checkoutQty');
          if (qtyEl) qtyEl.textContent = checkoutQty;
          updateCheckoutTotals();
        }
      });

      document.getElementById('qtyPlusBtn')?.addEventListener('click', () => {
        checkoutQty++;
        const qtyEl = document.getElementById('checkoutQty');
        if (qtyEl) qtyEl.textContent = checkoutQty;
        updateCheckoutTotals();
      });

      document.getElementById('confirmOrderBtn')?.addEventListener('click', () => {
        if (!currentCheckoutProduct) return;
        const total = currentCheckoutProduct.price * checkoutQty;
        const isWallet = document.getElementById('payWalletRadio')?.checked;
        const address = document.getElementById('checkoutShippingAddress')?.value || '742 Evergreen Terrace, Austin, TX 78701';

        if (isWallet) {
          const success = deductWalletBalance(total);
          if (!success) {
            showToast('Insufficient wallet balance to complete this purchase.', 'error');
            return;
          }
        }

        const newOrder = createMemberOrder({
          customerName: currentUser.fullName,
          customerEmail: currentUser.email,
          shippingAddress: address,
          paymentMethod: isWallet ? 'FarmVest Wallet Balance' : 'Instant Card (•••• 4242)',
          items: [{
            id: currentCheckoutProduct.id,
            title: currentCheckoutProduct.title,
            price: currentCheckoutProduct.price,
            qty: checkoutQty,
            unit: currentCheckoutProduct.unit
          }],
          subtotal: total,
          total: total
        });

        updateBalances();
        checkoutModal?.hide();
        showToast(`Order #${newOrder.id} placed! Free refrigerated shipping initiated.`, 'success');
      });

      // Filter events
      searchInput?.addEventListener('input', renderMemberProducts);
      sortSelect?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderMemberProducts();
      });

      catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          catButtons.forEach(b => {
            b.classList.remove('active', 'btn-success');
            b.classList.add('btn-outline-secondary');
          });
          btn.classList.add('active', 'btn-success');
          btn.classList.remove('btn-outline-secondary');
          currentActiveCat = btn.dataset.cat || 'all';
          renderMemberProducts();
        });
      });

      renderMemberProducts();
    });
  }

  // ============================================================
  // 13. E-COMMERCE: Member Orders & Tracking (dashboard/orders.html)
  // ============================================================
  const ordersTableBody = document.getElementById('ordersTableBody');
  if (ordersTableBody) {
    import('./services/ecommerce-store.js').then(({ getMemberOrders }) => {
      let currentOrderFilter = 'all';

      function renderOrders() {
        const orders = getMemberOrders();
        const inTransit = orders.filter(o => o.status === 'In Transit').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const totalSpent = orders.reduce((acc, o) => acc + (o.total || 0), 0);

        const kpiInTransit = document.getElementById('kpiInTransit');
        const kpiDelivered = document.getElementById('kpiDelivered');
        const kpiTotalSpent = document.getElementById('kpiTotalSpent');
        const topbarCount = document.getElementById('topbarActiveOrdersCount');
        const orderCountText = document.getElementById('orderCountText');

        if (kpiInTransit) kpiInTransit.textContent = inTransit;
        if (kpiDelivered) kpiDelivered.textContent = delivered;
        if (kpiTotalSpent) kpiTotalSpent.textContent = `$${totalSpent.toFixed(2)}`;
        if (topbarCount) topbarCount.textContent = `${inTransit} In Transit`;

        const filtered = orders.filter(o => currentOrderFilter === 'all' || o.status === currentOrderFilter);
        if (orderCountText) orderCountText.textContent = `Showing ${filtered.length} orders`;

        if (filtered.length === 0) {
          ordersTableBody.innerHTML = `
            <tr>
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="fa-solid fa-box-open fs-2 mb-2 d-block"></i>
                No orders match this status filter.
              </td>
            </tr>
          `;
          return;
        }

        ordersTableBody.innerHTML = filtered.map(o => `
          <tr>
            <td class="ps-4">
              <strong class="font-mono text-dark d-block">#${o.id}</strong>
              <span class="text-xs text-muted font-mono">${o.date}</span>
            </td>
            <td>
              <div class="text-sm fw-bold text-dark">${o.items.map(i => `${i.qty}× ${i.title}`).join(', ')}</div>
              <span class="text-xs text-muted"><i class="fa-solid fa-location-dot text-success me-1"></i>${o.shippingAddress}</span>
            </td>
            <td>
              <strong class="font-mono text-success fs-6">$${o.total.toFixed(2)}</strong>
            </td>
            <td>
              <span class="badge bg-light text-dark border text-xs">${o.paymentMethod}</span>
            </td>
            <td>
              <span class="badge rounded-pill px-3 py-1 ${o.status === 'Delivered' ? 'bg-success-subtle text-success border border-success-subtle' : o.status === 'In Transit' ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}">
                <i class="fa-solid ${o.status === 'Delivered' ? 'fa-circle-check' : 'fa-truck-fast'} me-1"></i> ${o.status}
              </span>
            </td>
            <td class="text-end pe-4">
              <button type="button" class="btn btn-outline-success btn-sm rounded-pill px-3 py-1 me-1 text-xs fw-bold" data-track-order="${o.id}">
                <i class="fa-solid fa-location-crosshairs me-1"></i> Track
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 text-xs fw-bold" data-view-invoice="${o.id}">
                <i class="fa-solid fa-file-invoice me-1"></i> Slip
              </button>
            </td>
          </tr>
        `).join('');

        // Bind Track Modal
        ordersTableBody.querySelectorAll('[data-track-order]').forEach(btn => {
          btn.addEventListener('click', () => {
            const orderId = btn.dataset.trackOrder;
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const modalEl = document.getElementById('trackingModal');
            if (modalEl && window.bootstrap) {
              document.getElementById('trackOrderId').textContent = `#${order.id}`;
              document.getElementById('trackNumber').textContent = order.trackingNumber || 'FV-COLD-981204';
              document.getElementById('trackTemp').textContent = order.temperatureLog || '3.5°C (Optimal)';

              const timelineEl = document.getElementById('trackingTimeline');
              if (timelineEl) {
                timelineEl.innerHTML = order.timeline.map((step, idx) => `
                  <div class="tracking-step ${step.completed ? 'is-completed' : 'is-pending'}">
                    <div class="tracking-step__icon ${step.completed ? 'tracking-step__icon--completed' : 'tracking-step__icon--pending'}">
                      <i class="fa-solid ${step.completed ? 'fa-check' : 'fa-circle'}"></i>
                    </div>
                    <div class="tracking-step__content">
                      <h6 class="tracking-step__title fw-bold ${step.completed ? 'text-dark' : 'text-muted'} mb-0 text-sm">${step.stage}</h6>
                      <span class="tracking-step__time text-xs text-muted">${step.time}</span>
                    </div>
                  </div>
                `).join('');
              }

              const trackModal = new window.bootstrap.Modal(modalEl);
              trackModal.show();
            }
          });
        });

        // Bind Invoice Modal
        ordersTableBody.querySelectorAll('[data-view-invoice]').forEach(btn => {
          btn.addEventListener('click', () => {
            const orderId = btn.dataset.viewInvoice;
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const modalEl = document.getElementById('invoiceModal');
            const contentEl = document.getElementById('invoiceModalContent');
            if (modalEl && contentEl && window.bootstrap) {
              contentEl.innerHTML = `
                <div class="p-3 border rounded-4 bg-white">
                  <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                      <h4 class="font-serif fw-bold text-success mb-0">FarmVest</h4>
                      <span class="text-xs text-muted">Direct Agricultural Marketplace</span>
                    </div>
                    <div class="text-end">
                      <h6 class="font-mono fw-bold mb-0">INVOICE #${order.id}</h6>
                      <span class="text-xs text-muted">Date: ${order.date}</span>
                    </div>
                  </div>
                  <div class="row g-3 mb-4">
                    <div class="col-sm-6">
                      <span class="text-xs text-muted text-uppercase fw-bold d-block">Billed To:</span>
                      <strong class="text-dark">${order.customerName}</strong>
                      <div class="text-xs text-muted">${order.shippingAddress}</div>
                      <div class="text-xs text-muted">${order.customerEmail}</div>
                    </div>
                    <div class="col-sm-6 text-sm-end">
                      <span class="text-xs text-muted text-uppercase fw-bold d-block">Payment Method:</span>
                      <strong class="text-success">${order.paymentMethod}</strong>
                      <div class="text-xs text-muted">Fulfillment: Cold-Chain Refrigerated</div>
                    </div>
                  </div>
                  <table class="table table-sm border mb-3">
                    <thead class="bg-light text-xs">
                      <tr>
                        <th>Item Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th class="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${order.items.map(item => `
                        <tr>
                          <td>${item.title}</td>
                          <td>${item.qty} ${item.unit}</td>
                          <td>$${item.price.toFixed(2)}</td>
                          <td class="text-end font-mono">$${(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  <div class="d-flex justify-content-between border-top pt-2 fs-6 fw-bold">
                    <span>Grand Total:</span>
                    <span class="font-mono text-success">$${order.total.toFixed(2)}</span>
                  </div>
                  <div class="mt-4 p-3 bg-light rounded-3 text-center text-xs text-muted border">
                    <i class="fa-solid fa-certificate text-success me-1"></i>
                    100% Quality & Temperature Traceability Insured by Munich Re.
                  </div>
                </div>
              `;
              const invoiceModal = new window.bootstrap.Modal(modalEl);
              invoiceModal.show();
            }
          });
        });
      }

      // Filter tabs
      document.querySelectorAll('#orderStatusFilter button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#orderStatusFilter button').forEach(b => {
            b.classList.remove('active', 'btn-success');
            b.classList.add('btn-outline-secondary');
          });
          btn.classList.add('active', 'btn-success');
          btn.classList.remove('btn-outline-secondary');
          currentOrderFilter = btn.dataset.filter || 'all';
          renderOrders();
        });
      });

      renderOrders();
    });
  }

  // ============================================================
  // 14. E-COMMERCE: Seller & Farmer Hub (dashboard/seller.html) — PROTECTED ROUTE
  // ============================================================
  const sellerListingsBody = document.getElementById('sellerListingsBody');
  if (sellerListingsBody) {
    const loggedUser = getCurrentUser();
    if (!loggedUser || loggedUser.role !== 'farmer') {
      window.location.href = '/auth/seller-login.html';
      return;
    }

    // Farmer Sign Out
    document.querySelectorAll('[data-seller-logout], [data-logout-btn]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        window.location.href = '/auth/seller-login.html';
      });
    });

    import('./services/ecommerce-store.js').then(({ getSellerListings, createSellerListing }) => {
      function renderSellerHub() {
        const listings = getSellerListings();
        const totalRevenue = listings.reduce((acc, l) => acc + (l.totalRevenue || 0), 0);
        const countText = document.getElementById('sellerListingsCount');
        const revEl = document.getElementById('sellerKpiRevenue');
        const actEl = document.getElementById('sellerKpiActiveListings');
        const topbarEarn = document.getElementById('topbarSellerEarnings');

        if (countText) countText.textContent = `${listings.length} active batches listed`;
        if (revEl) revEl.textContent = `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        if (actEl) actEl.textContent = `${listings.length} Batches`;
        if (topbarEarn) topbarEarn.textContent = `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

        sellerListingsBody.innerHTML = listings.map(l => `
          <tr>
            <td class="ps-4">
              <div class="d-flex align-items-center gap-3">
                <img src="${l.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=100&q=80'}" class="rounded-3 shadow-sm" width="38" height="38" style="object-fit: cover;" alt="${l.produceName}" />
                <div>
                  <strong class="text-dark d-block text-sm">${l.produceName}</strong>
                  <span class="text-xs text-muted font-mono">${l.harvestBatch} · ${l.originFarm}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="badge bg-light text-dark border text-capitalize text-xs">${l.category}</span>
            </td>
            <td class="font-mono fw-bold text-sm">${l.totalVolume}</td>
            <td class="font-mono text-muted text-sm">${l.unitsSold}</td>
            <td class="font-mono text-success fw-bold text-sm">$${l.unitPrice.toFixed(2)} / ${l.priceUnit}</td>
            <td class="font-mono text-dark fw-bold text-sm">$${l.totalRevenue.toFixed(2)}</td>
            <td>
              <span class="badge rounded-pill px-3 py-1 text-xs ${l.status === 'Active' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border'}">
                ${l.status}
              </span>
            </td>
          </tr>
        `).join('');
      }

      // Add Harvest Listing Form
      const listForm = document.getElementById('listHarvestForm');
      if (listForm) {
        listForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('newHarvestTitle')?.value;
          const category = document.getElementById('newHarvestCategory')?.value;
          const volume = document.getElementById('newHarvestVolume')?.value;
          const unit = document.getElementById('newHarvestUnit')?.value;
          const price = document.getElementById('newHarvestPrice')?.value;
          const origin = document.getElementById('newHarvestOrigin')?.value;
          const cert = document.getElementById('newHarvestCert')?.value;
          const image = document.getElementById('newHarvestImage')?.value;

          const newListing = createSellerListing({
            produceName: title,
            category: category,
            volume: volume,
            volumeUnit: unit,
            unitPrice: price,
            priceUnit: unit,
            originFarm: origin,
            certification: cert,
            image: image
          });

          listForm.reset();
          const modalEl = document.getElementById('listHarvestModal');
          if (modalEl && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
          }

          showToast(`Harvest batch "${newListing.produceName}" is now live on the store!`, 'success');
          renderSellerHub();
        });
      }

      renderSellerHub();
    });
  }

  // ============================================================
  // 10. Wishlist Page Controller (/dashboard/wishlist.html)
  // ============================================================
  const wishlistGrid = document.getElementById('wishlistGrid');
  const wishlistEmptyState = document.getElementById('wishlistEmptyState');
  const wishlistSearchInput = document.getElementById('wishlistSearchInput');
  const clearWishlistBtn = document.getElementById('clearWishlistBtn');
  const addAllToCartBtn = document.getElementById('addAllToCartBtn');
  const wishlistTotalCountEl = document.getElementById('wishlistTotalCount');

  function renderWishlistPage() {
    if (!wishlistGrid) return;

    const items = getWishlistItems();
    const query = (wishlistSearchInput?.value || '').toLowerCase().trim();
    const filtered = query
      ? items.filter(it => (it.title || '').toLowerCase().includes(query) || (it.category || '').toLowerCase().includes(query))
      : items;

    if (wishlistTotalCountEl) {
      wishlistTotalCountEl.textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      wishlistGrid.innerHTML = '';
      wishlistEmptyState?.classList.remove('d-none');
      if (clearWishlistBtn) clearWishlistBtn.disabled = true;
      if (addAllToCartBtn) addAllToCartBtn.disabled = true;
      return;
    }

    wishlistEmptyState?.classList.add('d-none');
    if (clearWishlistBtn) clearWishlistBtn.disabled = false;
    if (addAllToCartBtn) addAllToCartBtn.disabled = false;

    wishlistGrid.innerHTML = filtered.map(it => `
      <div class="col-sm-6 col-lg-4 col-xl-3" data-wishlist-card-id="${it.id}">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-shadow-md transition-base">
          <div class="position-relative overflow-hidden" style="height: 150px; background: #f8fafc;">
            <img src="${it.image || 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=300&q=80'}" class="w-100 h-100" alt="${it.title}" style="object-fit: cover;" />
            <button type="button" class="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-2 shadow-sm d-flex align-items-center justify-content-center text-danger" data-wishlist-remove data-product-id="${it.id}" style="width: 32px; height: 32px;" title="Remove from wishlist">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
            <span class="badge bg-success position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill font-mono text-xs shadow-sm">
              ${it.category || 'Direct Harvest'}
            </span>
          </div>
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="card-title font-heading fw-bold text-dark mb-1 text-truncate" title="${it.title}">${it.title}</h6>
            <p class="text-xs text-muted mb-3 text-truncate"><i class="fa-solid fa-location-dot text-success me-1"></i>${it.origin || 'Verified Partner Farm'}</p>
            
            <div class="mt-auto pt-3 border-top">
              <div class="d-flex align-items-baseline justify-content-between mb-2">
                <span class="text-xs text-muted">Unit Price</span>
                <div class="font-mono">
                  <span class="fw-bold text-success fs-6">$${(it.price || 0).toFixed(2)}</span>
                  <span class="text-xs text-muted"> / ${it.unit || 'kg'}</span>
                </div>
              </div>
              <button type="button" class="btn btn-success btn-sm rounded-pill w-100 py-2 fw-semibold text-xs shadow-sm d-flex align-items-center justify-content-center gap-2 transition-base" data-wishlist-add-cart data-product-id="${it.id}">
                <i class="fa-solid fa-cart-plus"></i> Move to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Remove single item listener
    wishlistGrid.querySelectorAll('[data-wishlist-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.dataset.productId;
        removeFromWishlist(prodId);
        renderWishlistPage();
      });
    });

    // Move to cart single item listener
    wishlistGrid.querySelectorAll('[data-wishlist-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.dataset.productId;
        const item = items.find(i => i.id === prodId);
        if (!item) return;
        addToCart({
          id: item.id,
          title: item.title,
          price: item.price,
          unit: item.unit || 'kg',
          image: item.image,
          quantity: 1
        });
        removeFromWishlist(prodId);
        renderWishlistPage();
      });
    });
  }

  if (wishlistGrid) {
    renderWishlistPage();
    wishlistSearchInput?.addEventListener('input', renderWishlistPage);

    clearWishlistBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your entire produce wishlist?')) {
        clearWishlist();
        renderWishlistPage();
      }
    });

    addAllToCartBtn?.addEventListener('click', () => {
      const items = getWishlistItems();
      if (items.length === 0) return;
      items.forEach(it => {
        addToCart({
          id: it.id,
          title: it.title,
          price: it.price,
          unit: it.unit || 'kg',
          image: it.image,
          quantity: 1
        });
      });
      clearWishlist();
      renderWishlistPage();
      showToast('All wishlist produce items added to your shopping cart!', 'success');
    });

    window.addEventListener('farmvest:wishlist-updated', renderWishlistPage);
  }

  // Initial update of wishlist badges in sidebar
  updateWishlistBadges();
  window.addEventListener('farmvest:wishlist-updated', updateWishlistBadges);


  // ============================================================
  // 11. Payout Portal Controller (/dashboard/payout.html)
  // ============================================================
  const payoutForm = document.getElementById('payoutForm');
  if (payoutForm) {
    const amountInput = document.getElementById('payoutAmountInput');
    const feeText = document.getElementById('payoutFeeText');
    const netReceive = document.getElementById('payoutNetReceive');
    const availBalEl = document.getElementById('payoutAvailableBalance');
    const availBal = currentUser.walletBalance !== undefined ? currentUser.walletBalance : getWalletBalance();

    if (availBalEl) {
      availBalEl.textContent = `$${availBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    let selectedMethod = 'Bank Wire (ACH / SWIFT)';
    let selectedFee = 0.00;

    function recalcPayout() {
      const amount = parseFloat(amountInput?.value) || 0;
      const net = Math.max(0, amount - selectedFee);
      if (netReceive) netReceive.textContent = `$${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      if (feeText) feeText.textContent = selectedFee === 0 ? '$0.00 (Zero-Fee)' : `$${selectedFee.toFixed(2)}`;
    }

    // Method selection cards
    document.querySelectorAll('.payout-method-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.payout-method-card').forEach(c => {
          c.classList.remove('border-success', 'bg-success-subtle');
          c.classList.add('border', 'bg-light');
          const radio = c.querySelector('input[type="radio"]');
          if (radio) radio.checked = false;
        });
        card.classList.remove('bg-light');
        card.classList.add('border-success', 'bg-success-subtle');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        selectedMethod = card.dataset.method || 'Bank Wire';
        selectedFee = parseFloat(card.dataset.fee) || 0.00;
        recalcPayout();
      });
    });

    // Quick percentage buttons
    document.querySelectorAll('.payout-quick-pct').forEach(btn => {
      btn.addEventListener('click', () => {
        const pct = parseFloat(btn.dataset.pct) || 0;
        const calcVal = (availBal * pct) / 100;
        if (amountInput) amountInput.value = calcVal.toFixed(2);
        recalcPayout();
      });
    });

    amountInput?.addEventListener('input', recalcPayout);

    payoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(amountInput?.value) || 0;
      const dest = document.getElementById('payoutDestinationInput')?.value || 'Primary Account';
      const notes = document.getElementById('payoutNotesInput')?.value || '';

      const res = requestPayout({
        amount: amount,
        method: selectedMethod,
        destination: dest,
        notes: notes
      });

      if (res.success) {
        showToast(res.message, 'success');
        setTimeout(() => {
          window.location.href = '/dashboard/payout-history.html';
        }, 1200);
      } else {
        showToast(res.message, 'error');
      }
    });
  }


  // ============================================================
  // 12. Payout History Controller (/dashboard/payout-history.html)
  // ============================================================
  const payoutsTableBody = document.getElementById('payoutsTableBody');
  if (payoutsTableBody) {
    const filterButtons = document.querySelectorAll('#payoutStatusFilter button');
    const searchInput = document.getElementById('payoutSearchInput');
    const countText = document.getElementById('payoutCountText');
    const receiptModalEl = document.getElementById('payoutReceiptModal');
    const receiptModal = receiptModalEl && window.bootstrap ? new window.bootstrap.Modal(receiptModalEl) : null;
    const receiptContent = document.getElementById('payoutReceiptContent');

    let currentFilter = 'all';

    function renderPayoutsTable() {
      const payouts = getPayoutHistory();
      const query = (searchInput?.value || '').toLowerCase().trim();

      const filtered = payouts.filter(p => {
        const matchFilter = currentFilter === 'all' || p.status.toLowerCase() === currentFilter.toLowerCase();
        const matchQuery = !query ||
          p.id.toLowerCase().includes(query) ||
          p.originPool.toLowerCase().includes(query) ||
          p.method.toLowerCase().includes(query) ||
          p.destination.toLowerCase().includes(query);
        return matchFilter && matchQuery;
      });

      if (countText) {
        countText.textContent = `Showing ${filtered.length} payout${filtered.length === 1 ? '' : 's'}`;
      }

      if (filtered.length === 0) {
        payoutsTableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-5 text-muted">
              <i class="fa-solid fa-clock-rotate-left fs-2 mb-2 d-block opacity-50"></i>
              No payout disbursement records found.
            </td>
          </tr>
        `;
        return;
      }

      payoutsTableBody.innerHTML = filtered.map(p => `
        <tr>
          <td class="ps-4">
            <strong class="font-mono text-dark text-xs d-block">${p.id}</strong>
            <span class="text-xs text-muted">${p.date} &bull; ${p.time || '14:00 UTC'}</span>
          </td>
          <td>
            <span class="fw-bold text-dark text-xs d-block">${p.originPool}</span>
            <span class="text-xs text-muted">Ref: ${p.reference || 'DISB-2026'}</span>
          </td>
          <td>
            <span class="font-mono fw-bold text-success text-sm">$${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span class="text-xs text-muted d-block">Fee: $${(p.fee || 0).toFixed(2)}</span>
          </td>
          <td>
            <span class="text-xs text-dark fw-bold d-block"><i class="fa-solid fa-building-columns text-muted me-1"></i>${p.method}</span>
            <span class="text-xs font-mono text-muted">${p.destination}</span>
          </td>
          <td>
            <span class="badge rounded-pill px-3 py-1 text-xs ${p.status === 'Completed' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}">
              <i class="fa-solid ${p.status === 'Completed' ? 'fa-circle-check' : 'fa-spinner fa-spin'} me-1"></i> ${p.status}
            </span>
          </td>
          <td class="text-end pe-4">
            <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3 text-xs fw-bold" data-view-receipt data-payout-id="${p.id}">
              <i class="fa-solid fa-receipt me-1"></i> Receipt
            </button>
          </td>
        </tr>
      `).join('');

      // Receipt modal handlers
      payoutsTableBody.querySelectorAll('[data-view-receipt]').forEach(btn => {
        btn.addEventListener('click', () => {
          const payoutId = btn.dataset.payoutId;
          const payout = payouts.find(p => p.id === payoutId);
          if (!payout || !receiptContent) return;

          receiptContent.innerHTML = `
            <div class="p-3 bg-light rounded-4 border mb-4 text-center">
              <span class="text-xs text-muted text-uppercase fw-bold d-block mb-1">Disbursement Amount</span>
              <h2 class="font-mono fw-bold text-success mb-0 fs-2">$${payout.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              <span class="badge bg-success rounded-pill px-3 py-1 text-xs mt-2">
                <i class="fa-solid fa-circle-check me-1"></i> ${payout.status}
              </span>
            </div>
            <div class="d-flex flex-column gap-2 text-xs">
              <div class="d-flex justify-content-between py-2 border-bottom">
                <span class="text-muted">Transaction ID:</span>
                <span class="font-mono fw-bold text-dark">${payout.id}</span>
              </div>
              <div class="d-flex justify-content-between py-2 border-bottom">
                <span class="text-muted">Origin Pool:</span>
                <span class="fw-bold text-dark">${payout.originPool}</span>
              </div>
              <div class="d-flex justify-content-between py-2 border-bottom">
                <span class="text-muted">Settlement Method:</span>
                <span class="text-dark">${payout.method}</span>
              </div>
              <div class="d-flex justify-content-between py-2 border-bottom">
                <span class="text-muted">Beneficiary Destination:</span>
                <span class="font-mono text-dark">${payout.destination}</span>
              </div>
              <div class="d-flex justify-content-between py-2 border-bottom">
                <span class="text-muted">Processing Fee:</span>
                <span class="font-mono text-dark">$${(payout.fee || 0).toFixed(2)} (Waived)</span>
              </div>
              <div class="d-flex justify-content-between py-2">
                <span class="text-muted">Settled Date & Time:</span>
                <span class="text-dark">${payout.date} at ${payout.time || '14:00 UTC'}</span>
              </div>
            </div>
          `;
          receiptModal?.show();
        });
      });
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('btn-success', 'active');
          b.classList.add('btn-outline-secondary');
        });
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-success', 'active');
        currentFilter = btn.dataset.filter || 'all';
        renderPayoutsTable();
      });
    });

    searchInput?.addEventListener('input', renderPayoutsTable);
    renderPayoutsTable();
  }


  // ============================================================
  // 13. Referrals Controller (/dashboard/referrals.html)
  // ============================================================
  const copyRefBtn = document.getElementById('copyReferralLinkBtn');
  const copyInputBtn = document.getElementById('copyInputBtn');
  const refInput = document.getElementById('referralLinkInput');

  function copyReferral() {
    if (!refInput) return;
    navigator.clipboard.writeText(refInput.value).then(() => {
      showToast('Partner referral link copied to clipboard!', 'success');
    }).catch(() => {
      refInput.select();
      document.execCommand('copy');
      showToast('Partner referral link copied!', 'success');
    });
  }

  copyRefBtn?.addEventListener('click', copyReferral);
  copyInputBtn?.addEventListener('click', copyReferral);

  const referralLedgerBody = document.getElementById('referralLedgerBody');
  if (referralLedgerBody) {
    const refData = getReferralData();
    referralLedgerBody.innerHTML = refData.recentLedger.map(item => `
      <tr>
        <td class="ps-4">
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-circle bg-success-subtle text-success p-2 text-xs font-mono fw-bold" style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
              ${item.investor.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <strong class="text-dark text-xs d-block">${item.investor}</strong>
              <span class="text-xs text-muted font-mono">${item.status}</span>
            </div>
          </div>
        </td>
        <td class="text-xs text-muted">${item.joinedDate}</td>
        <td>
          <span class="text-xs text-dark fw-bold">${item.poolInvested}</span>
        </td>
        <td class="font-mono text-dark fw-bold text-xs">$${item.capitalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="font-mono text-success fw-bold text-xs">+$${item.commissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="text-end pe-4">
          <span class="badge rounded-pill px-3 py-1 text-xs ${item.commissionStatus === 'Credited' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'}">
            ${item.commissionStatus}
          </span>
        </td>
      </tr>
    `).join('');
  }


  // ============================================================
  // 14. 2FA Security Controller (/dashboard/2fa.html)
  // ============================================================
  const copySecretKeyBtn = document.getElementById('copySecretKeyBtn');
  const secretKeyInput = document.getElementById('totpSecretKey');
  copySecretKeyBtn?.addEventListener('click', () => {
    if (secretKeyInput) {
      navigator.clipboard.writeText(secretKeyInput.value).then(() => {
        showToast('2FA Secret Key copied to clipboard!', 'success');
      });
    }
  });

  const verify2faBtn = document.getElementById('verify2faBtn');
  const totpTestCode = document.getElementById('totpTestCode');
  verify2faBtn?.addEventListener('click', () => {
    const code = (totpTestCode?.value || '').trim();
    if (code.length === 6) {
      showToast('Two-Factor Authentication (TOTP) successfully configured and active!', 'success');
      if (totpTestCode) totpTestCode.value = '';
    } else {
      showToast('Please enter a valid 6-digit TOTP security code.', 'error');
    }
  });

  const genCodesBtn = document.getElementById('genCodesBtn');
  const recoveryCodesGrid = document.getElementById('recoveryCodesGrid');
  genCodesBtn?.addEventListener('click', () => {
    if (!recoveryCodesGrid) return;
    const generateCode = () => `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    recoveryCodesGrid.innerHTML = `
      <div class="col-6 col-sm-3"><span class="p-2 bg-white rounded border d-block">${generateCode()}</span></div>
      <div class="col-6 col-sm-3"><span class="p-2 bg-white rounded border d-block">${generateCode()}</span></div>
      <div class="col-6 col-sm-3"><span class="p-2 bg-white rounded border d-block">${generateCode()}</span></div>
      <div class="col-6 col-sm-3"><span class="p-2 bg-white rounded border d-block">${generateCode()}</span></div>
    `;
    showToast('New offline backup recovery codes generated!', 'success');
  });


  // ============================================================
  // 15. KYC Verification Center Controller (/dashboard/kyc.html)
  // ============================================================
  const kycFileInput = document.getElementById('kycFileInput');
  kycFileInput?.addEventListener('change', () => {
    if (kycFileInput.files && kycFileInput.files.length > 0) {
      const file = kycFileInput.files[0];
      showToast(`Document "${file.name}" uploaded successfully for Jumio verification!`, 'success');
    }
  });

});

