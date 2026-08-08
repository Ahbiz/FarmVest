// ============================================================
// FarmVest Complete Dashboard & Interactivity Handler
// (Frontend-Simulated like CodeCanyon script demos)
// ============================================================

import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import { createIcons, icons } from 'lucide';
import '../scss/main.scss';

import { getCurrentUser, setCurrentUser, logout } from './auth';
import { showToast } from './components/toast';
import { initYieldChart, initAllocationChart, initSparkline } from './components/charts';
import { animateCounters, initStaggerEntrance } from './components/animations';
import { initThemeToggle } from './services/theme';
import { initSidebarToggle } from './components/sidebar';

document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });

  initThemeToggle();
  initSidebarToggle();

  // 3. Auth Guard & Current User Hydration
  const currentUser = getCurrentUser() || {
    fullName: 'James Wilson',
    email: 'james@example.com',
    walletBalance: 2180.00,
    totalInvested: 40000.00,
    role: 'investor'
  };

  // Update Topbar User Name & Avatar
  const userNameElements = document.querySelectorAll('.dashboard__user-name, .dashboard__page-title-name');
  userNameElements.forEach(el => {
    el.textContent = currentUser.fullName.split(' ')[0];
  });

  const walletDisplayElements = document.querySelectorAll('[data-wallet-balance]');
  walletDisplayElements.forEach(el => {
    el.textContent = `$${currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
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
});
