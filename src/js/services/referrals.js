// ============================================================
// FarmVest Referral & Partner Network Service
// Manages unique referral links, commission tiers, rewards calculation,
// and investor network bonuses.
// ============================================================

const STORAGE_KEY_REFERRALS = 'farmvest_user_referrals';

const INITIAL_REFERRALS_DATA = {
  referralCode: 'FARM-JAMES-2026',
  referralLink: 'https://farmvest.com/auth/register.html?ref=FARM-JAMES-2026',
  tier: 'Silver Agronomist',
  commissionRate: 5.0, // 5% on direct pool investments
  totalReferrals: 14,
  activeInvestors: 11,
  totalCommissionEarned: 2480.00,
  pendingCommission: 340.00,
  ledger: [
    {
      id: 'REF-104',
      investorName: 'Sarah Jenkins',
      email: 's.jenkins@example.com',
      dateJoined: '2026-08-14',
      poolInvested: 'Hydroponic Tomato Greenhouse #04',
      investmentAmount: 10000.00,
      commissionAmount: 500.00,
      status: 'Paid', // 'Paid' | 'Pending'
      payoutDate: '2026-08-16'
    },
    {
      id: 'REF-103',
      investorName: 'David Chen',
      email: 'd.chen@example.com',
      dateJoined: '2026-08-10',
      poolInvested: 'Pasture Angus Beef Herd Cycle #02',
      investmentAmount: 15000.00,
      commissionAmount: 750.00,
      status: 'Paid',
      payoutDate: '2026-08-12'
    },
    {
      id: 'REF-102',
      investorName: 'Elena Rostova',
      email: 'e.rostova@example.com',
      dateJoined: '2026-08-01',
      poolInvested: 'Organic Hass Avocado Orchard Pool',
      investmentAmount: 8000.00,
      commissionAmount: 400.00,
      status: 'Paid',
      payoutDate: '2026-08-03'
    },
    {
      id: 'REF-101',
      investorName: 'Marcus Vance',
      email: 'm.vance@example.com',
      dateJoined: '2026-07-28',
      poolInvested: 'Smart Tilapia Aquaculture Tank #01',
      investmentAmount: 16600.00,
      commissionAmount: 830.00,
      status: 'Paid',
      payoutDate: '2026-07-30'
    },
    {
      id: 'REF-105',
      investorName: 'Chloe Bennett',
      email: 'c.bennett@example.com',
      dateJoined: '2026-08-19',
      poolInvested: 'Spring 2026 Hydroponic Berry Pool',
      investmentAmount: 6800.00,
      commissionAmount: 340.00,
      status: 'Pending',
      payoutDate: 'Pending Pool Closure'
    }
  ]
};

export function getReferralData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REFERRALS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(INITIAL_REFERRALS_DATA));
    return INITIAL_REFERRALS_DATA;
  } catch (e) {
    console.warn('Failed to parse referrals:', e);
    return INITIAL_REFERRALS_DATA;
  }
}

export function saveReferralData(data) {
  try {
    localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save referrals:', e);
  }
}
