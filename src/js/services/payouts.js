// ============================================================
// FarmVest Payouts & Yield Ledger Service
// Manages payout requests, settlement methods, status lifecycles,
// and historical transaction records.
// ============================================================

import { showToast } from '../components/toast.js';
import { getWalletBalance, setWalletBalance } from './ecommerce-store.js';

const STORAGE_KEY_PAYOUTS = 'farmvest_user_payouts';

const INITIAL_PAYOUTS = [
  {
    id: 'PO-92041',
    date: '2026-08-18',
    poolName: 'Hydroponic Tomato Greenhouse #04',
    amount: 1250.00,
    fee: 0.00,
    netAmount: 1250.00,
    method: 'Bank Wire Transfer',
    accountDetails: 'JPMorgan Chase (•••• 8912)',
    status: 'Completed', // 'Completed' | 'Processing' | 'Pending' | 'Cancelled'
    transactionHash: 'TXN-US-891024982',
    estimatedSettlement: 'Settled in 45 mins'
  },
  {
    id: 'PO-88190',
    date: '2026-08-04',
    poolName: 'Pasture Angus Beef Herd Cycle #02',
    amount: 840.00,
    fee: 0.00,
    netAmount: 840.00,
    method: 'Instant ACH Settlement',
    accountDetails: 'Wells Fargo Checking (•••• 3301)',
    status: 'Completed',
    transactionHash: 'TXN-US-771829014',
    estimatedSettlement: 'Settled in 1.2 hours'
  },
  {
    id: 'PO-76214',
    date: '2026-07-22',
    poolName: 'Organic Hass Avocado Orchard Pool',
    amount: 626.05,
    fee: 0.00,
    netAmount: 626.05,
    method: 'USDC Digital Dollar (Solana)',
    accountDetails: 'Solana (7xKv...91pQ)',
    status: 'Completed',
    transactionHash: 'TXN-SOL-441092819',
    estimatedSettlement: 'Instant'
  },
  {
    id: 'PO-65102',
    date: '2026-08-20',
    poolName: 'Smart Tilapia Aquaculture Tank #01',
    amount: 450.00,
    fee: 0.00,
    netAmount: 450.00,
    method: 'Instant ACH Settlement',
    accountDetails: 'JPMorgan Chase (•••• 8912)',
    status: 'Processing',
    transactionHash: 'TXN-US-991048123',
    estimatedSettlement: 'Est. Today, 5:00 PM'
  }
];

export function getPayoutHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYOUTS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(INITIAL_PAYOUTS));
    return INITIAL_PAYOUTS;
  } catch (e) {
    console.warn('Failed to parse payouts:', e);
    return INITIAL_PAYOUTS;
  }
}

export function savePayoutHistory(payouts) {
  try {
    localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(payouts));
  } catch (e) {
    console.warn('Failed to save payouts:', e);
  }
  window.dispatchEvent(new CustomEvent('farmvest:payouts-updated', { detail: payouts }));
}

/**
 * Submit a new payout request
 */
export function requestPayout({ amount, method, destination, poolName = 'Yield Balance Payout' }) {
  const currentBalance = getWalletBalance();
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    showToast('error', 'Invalid Amount', 'Please enter a valid payout amount.');
    return { success: false, message: 'Invalid amount' };
  }

  if (numAmount > currentBalance) {
    showToast('error', 'Insufficient Yield Balance', `You only have $${currentBalance.toFixed(2)} available for payout.`);
    return { success: false, message: 'Insufficient balance' };
  }

  // Deduct from wallet
  const newBalance = currentBalance - numAmount;
  setWalletBalance(newBalance);

  // Record payout
  const payouts = getPayoutHistory();
  const newPayout = {
    id: `PO-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toISOString().split('T')[0],
    poolName,
    amount: numAmount,
    fee: 0.00,
    netAmount: numAmount,
    method: method || 'Instant ACH Settlement',
    accountDetails: destination || 'Verified Primary Account',
    status: 'Processing',
    transactionHash: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    estimatedSettlement: 'Est. 1–2 hours'
  };

  payouts.unshift(newPayout);
  savePayoutHistory(payouts);

  showToast('success', 'Payout Dispatched', `Payout request for $${numAmount.toFixed(2)} initiated successfully.`);
  return { success: true, payout: newPayout };
}
