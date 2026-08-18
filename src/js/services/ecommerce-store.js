// ============================================================
// FarmVest E-Commerce State Engine
// Manages products catalog, member orders, cold-chain tracking,
// seller harvest listings, and wallet balance transactions.
// ============================================================

const STORAGE_KEYS = {
  PRODUCTS: 'farmvest_products_catalog',
  ORDERS: 'farmvest_member_orders',
  SELLER_LISTINGS: 'farmvest_seller_harvests',
  WALLET_BALANCE: 'farmvest_user_wallet_balance',
};

// Default initial products catalog
const INITIAL_PRODUCTS = [
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
  },
  {
    id: 'prod_sal_3',
    title: 'Fresh Atlantic Salmon Fillet',
    category: 'seafood',
    price: 22.90,
    unit: '500gm',
    origin: 'Coastal Aquaculture, Maine',
    stockStatus: 'in-stock',
    stockQty: 60,
    rating: 4.8,
    reviewsCount: 31,
    badge: 'Wild Caught',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    description: 'Sustainably farmed ocean-fresh salmon fillets flash-chilled immediately after harvest.'
  },
  {
    id: 'prod_lamb_4',
    title: 'Pasture Lamb Chops & Cut',
    category: 'meats',
    price: 26.00,
    unit: 'kg',
    origin: 'Green Valley Ranch, Oregon',
    stockStatus: 'in-stock',
    stockQty: 45,
    rating: 4.9,
    reviewsCount: 29,
    badge: 'Organic Feed',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Tender pasture-grazed lamb chops naturally reared in Oregon alpine meadow reserves.'
  },
  {
    id: 'prod_pep_5',
    title: 'Crisp Greenhouse Bell Peppers',
    category: 'vegetables',
    price: 3.80,
    unit: 'kg',
    origin: 'Hydroponic Estate #2, Florida',
    stockStatus: 'in-stock',
    stockQty: 210,
    rating: 4.7,
    reviewsCount: 19,
    badge: 'Farm Fresh',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp, sweet tricolor bell peppers cultivated with zero synthetic chemicals.'
  },
  {
    id: 'prod_hon_6',
    title: 'Raw Wildflower Apiary Honey',
    category: 'dairy',
    price: 12.00,
    unit: 'jar',
    origin: 'Mountain Apiary, Colorado',
    stockStatus: 'in-stock',
    stockQty: 115,
    rating: 5.0,
    reviewsCount: 84,
    badge: '100% Raw Unfiltered',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: 'Pure wildflower honeycomb extract rich in natural enzymes and antioxidants.'
  },
  {
    id: 'prod_avo_7',
    title: 'Organic Hass Avocados Box',
    category: 'vegetables',
    price: 14.00,
    unit: 'box',
    origin: 'Highland Orchard, Michoacán',
    stockStatus: 'in-stock',
    stockQty: 95,
    rating: 4.9,
    reviewsCount: 53,
    badge: 'Export Grade',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    description: 'Creamy high-oil Hass avocados harvested at peak maturity. Box of 8 premium fruits.'
  },
  {
    id: 'prod_chk_8',
    title: 'Free-Range Organic Whole Chicken',
    category: 'meats',
    price: 16.50,
    unit: 'bird',
    origin: 'Sunny Meadows Ranch, Georgia',
    stockStatus: 'in-stock',
    stockQty: 70,
    rating: 4.8,
    reviewsCount: 37,
    badge: 'Pasture-Raised',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    description: 'Whole chicken raised on sunshine, certified non-GMO organic feed and open pastures.'
  }
];

// Default initial member orders
const INITIAL_ORDERS = [
  {
    id: 'ORD-7842',
    date: '2026-08-16',
    customerName: 'James Wilson',
    customerEmail: 'james.wilson@example.com',
    shippingAddress: '742 Evergreen Terrace, Austin, TX 78701',
    paymentMethod: 'FarmVest Wallet Balance',
    items: [
      { id: 'prod_beef_1', title: 'Premium Grass-Fed Beef Boneless', price: 28.50, qty: 2, unit: 'kg' },
      { id: 'prod_tom_2', title: 'Hydroponic Vine Tomatoes', price: 4.20, qty: 3, unit: 'kg' }
    ],
    subtotal: 69.60,
    shippingFee: 0.00, // Free member shipping
    total: 69.60,
    status: 'In Transit', // 'Pending' | 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'
    trackingNumber: 'FV-COLD-894102',
    temperatureLog: '3.8°C (Optimal Cold-Chain)',
    carrier: 'FarmVest AgriExpress Refrigerated Fleet',
    estimatedDelivery: '2026-08-19',
    timeline: [
      { stage: 'Order Placed', time: 'Aug 16, 2026 · 09:15 AM', completed: true },
      { stage: 'Harvest Cold-Pack Inspected', time: 'Aug 16, 2026 · 02:40 PM', completed: true },
      { stage: 'Refrigerated Transit Dispatch', time: 'Aug 17, 2026 · 06:20 AM', completed: true },
      { stage: 'Delivered to Doorstep', time: 'Estimated Aug 19, 2026', completed: false }
    ]
  },
  {
    id: 'ORD-6910',
    date: '2026-08-10',
    customerName: 'James Wilson',
    customerEmail: 'james.wilson@example.com',
    shippingAddress: '742 Evergreen Terrace, Austin, TX 78701',
    paymentMethod: 'FarmVest Wallet Balance',
    items: [
      { id: 'prod_hon_6', title: 'Raw Wildflower Apiary Honey', price: 12.00, qty: 2, unit: 'jar' },
      { id: 'prod_sal_3', title: 'Fresh Atlantic Salmon Fillet', price: 22.90, qty: 2, unit: '500gm' }
    ],
    subtotal: 69.80,
    shippingFee: 0.00,
    total: 69.80,
    status: 'Delivered',
    trackingNumber: 'FV-COLD-882914',
    temperatureLog: '2.4°C (Safe Delivery)',
    carrier: 'FarmVest AgriExpress Fleet',
    estimatedDelivery: '2026-08-12',
    timeline: [
      { stage: 'Order Placed', time: 'Aug 10, 2026 · 11:00 AM', completed: true },
      { stage: 'Harvest Cold-Pack Inspected', time: 'Aug 10, 2026 · 03:15 PM', completed: true },
      { stage: 'Refrigerated Transit Dispatch', time: 'Aug 11, 2026 · 07:00 AM', completed: true },
      { stage: 'Delivered to Doorstep', time: 'Aug 12, 2026 · 01:45 PM', completed: true }
    ]
  }
];

// Default initial seller listings
const INITIAL_SELLER_LISTINGS = [
  {
    id: 'lst_avo_01',
    produceName: 'Organic Hass Avocados (Export Grade)',
    category: 'vegetables',
    harvestBatch: 'Batch #AVO-2026-08',
    totalVolume: '2,500 kg',
    unitsSold: '1,850 kg',
    unitPrice: 14.00,
    priceUnit: 'box (8 pcs)',
    originFarm: 'Michoacán Highland Orchard #3',
    harvestDate: '2026-08-14',
    certification: 'USDA Organic Certified',
    status: 'Active',
    totalRevenue: 3237.50
  },
  {
    id: 'lst_tom_02',
    produceName: 'Hydroponic Vine Tomatoes (Cycle 4)',
    category: 'vegetables',
    harvestBatch: 'Batch #TOM-2026-07',
    totalVolume: '4,000 kg',
    unitsSold: '4,000 kg',
    unitPrice: 4.20,
    priceUnit: 'kg',
    originFarm: 'California Solar Greenhouse Complex',
    harvestDate: '2026-07-28',
    certification: 'GlobalGAP Certified',
    status: 'Sold Out',
    totalRevenue: 16800.00
  }
];

/**
 * Get all store products
 */
export function getStoreProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

/**
 * Save products catalog
 */
export function saveStoreProducts(products) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

/**
 * Add or update a product
 */
export function upsertStoreProduct(product) {
  const products = getStoreProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index > -1) {
    products[index] = { ...products[index], ...product };
  } else {
    products.unshift({
      id: product.id || `prod_${Date.now()}`,
      ...product
    });
  }
  saveStoreProducts(products);
}

/**
 * Delete a product
 */
export function deleteStoreProduct(productId) {
  const products = getStoreProducts().filter(p => p.id !== productId);
  saveStoreProducts(products);
}

/**
 * Get user wallet balance
 */
export function getWalletBalance() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
    return raw !== null ? parseFloat(raw) : 4850.00;
  } catch (e) {
    return 4850.00;
  }
}

/**
 * Set user wallet balance
 */
export function setWalletBalance(amount) {
  localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, amount.toFixed(2));
}

/**
 * Deduct wallet balance
 */
export function deductWalletBalance(amount) {
  const current = getWalletBalance();
  if (current >= amount) {
    const updated = current - amount;
    setWalletBalance(updated);
    return true;
  }
  return false;
}

/**
 * Get all member orders
 */
export function getMemberOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : INITIAL_ORDERS;
  } catch (e) {
    return INITIAL_ORDERS;
  }
}

/**
 * Save member orders
 */
export function saveMemberOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

/**
 * Place a new member order
 */
export function createMemberOrder(orderData) {
  const orders = getMemberOrders();
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const newOrder = {
    id: orderId,
    date: dateStr,
    customerName: orderData.customerName || 'James Wilson',
    customerEmail: orderData.customerEmail || 'james.wilson@example.com',
    shippingAddress: orderData.shippingAddress || '742 Evergreen Terrace, Austin, TX 78701',
    paymentMethod: orderData.paymentMethod || 'FarmVest Wallet Balance',
    items: orderData.items || [],
    subtotal: orderData.subtotal || 0,
    shippingFee: 0.00,
    total: orderData.total || 0,
    status: 'In Transit',
    trackingNumber: `FV-COLD-${Math.floor(100000 + Math.random() * 900000)}`,
    temperatureLog: '3.5°C (Optimal Cold-Chain)',
    carrier: 'FarmVest AgriExpress Refrigerated Fleet',
    estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    timeline: [
      { stage: 'Order Placed', time: `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.getFullYear()} · Just now`, completed: true },
      { stage: 'Harvest Cold-Pack Inspected', time: 'In Progress (Certified Hub)', completed: true },
      { stage: 'Refrigerated Transit Dispatch', time: 'Scheduled for Tomorrow', completed: false },
      { stage: 'Delivered to Doorstep', time: 'Estimated in 2-3 Days', completed: false }
    ]
  };

  orders.unshift(newOrder);
  saveMemberOrders(orders);
  return newOrder;
}

/**
 * Update an order's status (Admin or Simulator)
 */
export function updateOrderStatus(orderId, newStatus) {
  const orders = getMemberOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    if (newStatus === 'Delivered') {
      order.timeline.forEach(t => t.completed = true);
    } else if (newStatus === 'In Transit') {
      order.timeline[0].completed = true;
      order.timeline[1].completed = true;
      order.timeline[2].completed = true;
      order.timeline[3].completed = false;
    } else if (newStatus === 'Processing') {
      order.timeline[0].completed = true;
      order.timeline[1].completed = true;
      order.timeline[2].completed = false;
      order.timeline[3].completed = false;
    }
    saveMemberOrders(orders);
    return true;
  }
  return false;
}

/**
 * Get seller harvest listings
 */
export function getSellerListings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SELLER_LISTINGS);
    return raw ? JSON.parse(raw) : INITIAL_SELLER_LISTINGS;
  } catch (e) {
    return INITIAL_SELLER_LISTINGS;
  }
}

/**
 * Save seller harvest listings
 */
export function saveSellerListings(listings) {
  localStorage.setItem(STORAGE_KEYS.SELLER_LISTINGS, JSON.stringify(listings));
}

/**
 * Add a new harvest listing for sale
 */
export function createSellerListing(listingData) {
  const listings = getSellerListings();
  const newListing = {
    id: `lst_${Date.now()}`,
    produceName: listingData.produceName,
    category: listingData.category || 'vegetables',
    harvestBatch: `Batch #${listingData.category?.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
    totalVolume: `${listingData.volume} ${listingData.volumeUnit || 'kg'}`,
    unitsSold: '0 kg',
    unitPrice: parseFloat(listingData.unitPrice) || 5.00,
    priceUnit: listingData.priceUnit || 'kg',
    originFarm: listingData.originFarm || 'Certified Partner Farm',
    harvestDate: listingData.harvestDate || new Date().toISOString().split('T')[0],
    certification: listingData.certification || 'USDA Organic Certified',
    status: 'Active',
    totalRevenue: 0.00
  };

  listings.unshift(newListing);
  saveSellerListings(listings);

  // Also add to public store catalog so buyers can immediately purchase it!
  upsertStoreProduct({
    id: `prod_sell_${Date.now()}`,
    title: listingData.produceName,
    category: listingData.category || 'vegetables',
    price: parseFloat(listingData.unitPrice) || 5.00,
    unit: listingData.priceUnit || 'kg',
    origin: listingData.originFarm || 'Partner Farm',
    stockStatus: 'in-stock',
    stockQty: parseInt(listingData.volume, 10) || 100,
    rating: 5.0,
    reviewsCount: 1,
    badge: 'Farmer Direct',
    image: listingData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: `Fresh harvest direct from ${listingData.originFarm || 'certified sustainable farmer'}.`
  });

  return newListing;
}

// Initial bootstrap
if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
  saveStoreProducts(INITIAL_PRODUCTS);
}
if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
  saveMemberOrders(INITIAL_ORDERS);
}
if (!localStorage.getItem(STORAGE_KEYS.SELLER_LISTINGS)) {
  saveSellerListings(INITIAL_SELLER_LISTINGS);
}
if (!localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE)) {
  setWalletBalance(4850.00);
}
