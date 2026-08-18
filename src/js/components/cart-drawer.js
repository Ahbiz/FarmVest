// ============================================================
// FarmVest Shopping Cart Drawer & State Manager
// Manages adding fresh farm produce to cart, quantity updates,
// slide-over drawer transitions, and subtotal calculations.
// ============================================================

import { showToast } from './toast.js';

const STORAGE_KEY = 'farmvest_cart_items';

/**
 * Retrieve cart items from localStorage
 */
export function getCartItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to parse cart items:', e);
    return [];
  }
}

/**
 * Save cart items to localStorage and update DOM badges
 */
export function saveCartItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save cart items:', e);
  }
  updateCartBadge();
  renderCartDrawer();
}

/**
 * Add a farm produce item to cart
 */
export function addToCart(product) {
  const items = getCartItems();
  const existingIndex = items.findIndex(i => i.id === product.id);

  if (existingIndex > -1) {
    items[existingIndex].quantity = (items[existingIndex].quantity || 1) + (product.quantity || 1);
  } else {
    items.push({
      id: product.id || `prod_${Date.now()}`,
      title: product.title || 'Farm Produce Item',
      price: parseFloat(product.price) || 5.00,
      unit: product.unit || 'kg',
      image: product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80',
      quantity: product.quantity || 1
    });
  }

  saveCartItems(items);
  showToast('success', 'Added to Cart', `${product.title} has been added to your cart.`);
  openCartDrawer();
}

/**
 * Remove an item from cart
 */
export function removeFromCart(productId) {
  let items = getCartItems();
  items = items.filter(i => i.id !== productId);
  saveCartItems(items);
  showToast('info', 'Item Removed', 'Product removed from your cart.');
}

/**
 * Clear the entire cart
 */
export function clearCart() {
  saveCartItems([]);
  showToast('info', 'Cart Cleared', 'Your cart is now empty.');
}

/**
 * Open the Slide-Over Cart Drawer
 */
export function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close the Slide-Over Cart Drawer
 */
export function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

/**
 * Update the navbar cart counter badge and subtotal text
 */
export function updateCartBadge() {
  const items = getCartItems();
  const totalCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalAmount = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const badgeEls = document.querySelectorAll('#cartCountBadge, .cart-count-badge');
  badgeEls.forEach(badge => {
    badge.textContent = totalCount;
  });

  const totalPills = document.querySelectorAll('#cartTotalPill, .cart-total-text');
  totalPills.forEach(pill => {
    pill.textContent = `$${totalAmount.toFixed(2)}`;
  });
}

/**
 * Render items in the slide-over cart drawer
 */
export function renderCartDrawer() {
  const items = getCartItems();
  const emptyState = document.getElementById('cartEmptyState');
  const itemsList = document.getElementById('cartItemsList');
  const footer = document.getElementById('cartDrawerFooter');
  const subtotalEl = document.getElementById('cartDrawerSubtotal');

  if (!itemsList) return;

  if (items.length === 0) {
    emptyState?.classList.remove('d-none');
    itemsList?.classList.add('d-none');
    footer?.classList.add('d-none');
    return;
  }

  emptyState?.classList.add('d-none');
  itemsList?.classList.remove('d-none');
  footer?.classList.remove('d-none');

  const totalAmount = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  if (subtotalEl) {
    subtotalEl.textContent = `$${totalAmount.toFixed(2)}`;
  }

  itemsList.innerHTML = items.map(item => `
    <li class="cart-item">
      <img src="${item.image}" alt="${item.title}" />
      <div class="item-info">
        <h6>${item.title}</h6>
        <div class="item-meta">${item.quantity} × $${item.price.toFixed(2)} / ${item.unit}</div>
        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
      <button type="button" class="item-remove" data-remove-item="${item.id}" title="Remove item">
        <i class="fas fa-trash-can"></i>
      </button>
    </li>
  `).join('');

  // Bind remove handlers
  itemsList.querySelectorAll('[data-remove-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove-item');
      removeFromCart(id);
    });
  });
}

/**
 * Initialize Cart Drawer Triggers & Event Listeners
 */
export function initCartDrawer() {
  const triggerBtns = document.querySelectorAll('#cartDrawerBtn, [data-cart-drawer-trigger]');
  const closeBtn = document.getElementById('closeCartDrawerBtn');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  const clearBtn = document.getElementById('clearCartBtn');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  closeBtn?.addEventListener('click', closeCartDrawer);
  backdrop?.addEventListener('click', closeCartDrawer);
  clearBtn?.addEventListener('click', clearCart);

  // Quick Search Modal Trigger & Submission
  const searchBtn = document.getElementById('searchTriggerBtn');
  const searchSubmitBtn = document.getElementById('quickSearchSubmitBtn');
  const searchInput = document.getElementById('quickSearchInput');

  if (searchBtn && window.bootstrap) {
    const modalEl = document.getElementById('quickSearchModal');
    if (modalEl) {
      const searchModal = new window.bootstrap.Modal(modalEl);
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.show();
        setTimeout(() => searchInput?.focus(), 300);
      });

      const handleSearch = () => {
        const query = searchInput?.value.trim();
        if (query) {
          searchModal.hide();
          window.location.href = `/projects.html?search=${encodeURIComponent(query)}`;
        }
      };

      searchSubmitBtn?.addEventListener('click', handleSearch);
      searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      });
    }
  }

  // Bind any "Add to Cart" or "Shop Now" buttons with product data
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = {
        id: btn.dataset.productId || `prod_${Date.now()}`,
        title: btn.dataset.productTitle || 'Farm Produce',
        price: parseFloat(btn.dataset.productPrice) || 4.50,
        unit: btn.dataset.productUnit || 'kg',
        image: btn.dataset.productImage || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80',
        quantity: 1
      };
      addToCart(product);
    });
  });

  // Initial render & badge hydration
  updateCartBadge();
  renderCartDrawer();
}
