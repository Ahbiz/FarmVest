// ============================================================
// FarmVest Wishlist State Engine
// Manages customer saved produce items, reactive badges,
// and 1-click cart transfer in the user dashboard.
// ============================================================

import { showToast } from '../components/toast.js';

const STORAGE_KEY = 'farmvest_user_wishlist';

// Default initial wishlist items
const INITIAL_WISHLIST = [
  {
    id: 'prod_beef_1',
    title: 'Premium Grass-Fed Beef Boneless',
    category: 'meats',
    price: 28.50,
    unit: 'kg',
    origin: 'Angus Cattle Estate, Texas',
    stockStatus: 'in-stock',
    stockQty: 85,
    rating: 4.9,
    reviewsCount: 48,
    badge: '100% Grass-Fed',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    description: 'Pasture-raised, hormone-free premium Angus beef cut, aged 21 days for maximum tenderness.'
  },
  {
    id: 'prod_tom_2',
    title: 'Hydroponic Vine Tomatoes',
    category: 'vegetables',
    price: 4.20,
    unit: 'kg',
    origin: 'Greenhouse Cycle #4, California',
    stockStatus: 'in-stock',
    stockQty: 320,
    rating: 5.0,
    reviewsCount: 62,
    badge: 'Organic Certified',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Pesticide-free vine-ripened tomatoes grown under optimized IoT hydroponic misting.'
  }
];

/**
 * Retrieve wishlist items from localStorage
 */
export function getWishlistItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_WISHLIST));
    return INITIAL_WISHLIST;
  } catch (e) {
    console.warn('Failed to parse wishlist items:', e);
    return INITIAL_WISHLIST;
  }
}

/**
 * Save wishlist items to localStorage and update DOM badges
 */
export function saveWishlistItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save wishlist items:', e);
  }
  updateWishlistBadges();
  window.dispatchEvent(new CustomEvent('farmvest:wishlist-updated', { detail: items }));
}

/**
 * Check if a product is in the wishlist
 */
export function isInWishlist(productId) {
  const items = getWishlistItems();
  return items.some(i => i.id === productId);
}

/**
 * Add a farm produce item to wishlist
 */
export function addToWishlist(product) {
  const items = getWishlistItems();
  if (items.some(i => i.id === product.id)) {
    return false;
  }

  items.push({
    id: product.id || `prod_${Date.now()}`,
    title: product.title || 'Farm Produce Item',
    category: product.category || 'vegetables',
    price: parseFloat(product.price) || 5.00,
    unit: product.unit || 'kg',
    origin: product.origin || 'Certified Partner Farm',
    stockStatus: product.stockStatus || 'in-stock',
    stockQty: product.stockQty || 50,
    rating: product.rating || 5.0,
    reviewsCount: product.reviewsCount || 12,
    badge: product.badge || 'Farm Fresh',
    image: product.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: product.description || 'Certified fresh agricultural harvest directly from verified farm partner.'
  });

  saveWishlistItems(items);
  showToast('success', 'Saved to Wishlist', `${product.title} was added to your saved items.`);
  return true;
}

/**
 * Remove an item from wishlist
 */
export function removeFromWishlist(productId) {
  let items = getWishlistItems();
  const removed = items.find(i => i.id === productId);
  items = items.filter(i => i.id !== productId);
  saveWishlistItems(items);
  if (removed) {
    showToast('info', 'Item Removed', `${removed.title} removed from your wishlist.`);
  }
}

/**
 * Toggle an item in the wishlist
 */
export function toggleWishlist(product) {
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id);
    return false;
  } else {
    addToWishlist(product);
    return true;
  }
}

/**
 * Clear the entire wishlist
 */
export function clearWishlist() {
  saveWishlistItems([]);
  showToast('info', 'Wishlist Cleared', 'All saved items have been cleared.');
}

/**
 * Update wishlist counter badges across all pages
 */
export function updateWishlistBadges() {
  const items = getWishlistItems();
  const count = items.length;
  document.querySelectorAll('[data-wishlist-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? '' : 'none';
  });
}
