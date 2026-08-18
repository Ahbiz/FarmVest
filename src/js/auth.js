// ============================================================
// FarmVest Authentication & User Session Management
// Handles registration, OTP validation, login, password recovery,
// and client-side session hydration via localStorage.
// ============================================================

import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import { createIcons, icons } from 'lucide';
import '../css/style.css';

import { showToast } from './components/toast.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './services/email-service.js';
import { initPreloader } from './components/preloader.js';

const STORAGE_KEYS = {
  USERS: 'farmvest_users',
  CURRENT_USER: 'farmvest_current_user',
  PENDING_USER: 'farmvest_pending_user'
};

// Seed default investor and admin accounts on first initialization
function seedDemoData() {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existingUsers) {
    const defaultUsers = [
      {
        id: 'usr_001',
        fullName: 'James Wilson',
        email: 'james@example.com',
        password: 'password123',
        role: 'investor',
        verified: true,
        walletBalance: 2180.00,
        totalInvested: 40000.00,
        createdAt: '2024-01-15'
      },
      {
        id: 'usr_002',
        fullName: 'Admin Supervisor',
        email: 'admin@farmvest.com',
        password: 'adminpassword',
        role: 'admin',
        verified: true,
        walletBalance: 15000.00,
        totalInvested: 0,
        createdAt: '2023-11-01'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
}

seedDemoData();

export function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
}

export function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  window.location.href = '/auth/login.html';
}

/**
 * Helper to show inline error message and highlight invalid field
 */
function setFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const msgEl = document.querySelector(`.field__message[data-for="${fieldId}"]`);
  
  if (input) {
    const control = input.closest('.field__control') || input.closest('.form-check') || input;
    if (message) {
      control.classList.add('is-invalid');
    } else {
      control.classList.remove('is-invalid');
    }
  }

  if (msgEl) {
    msgEl.textContent = message || '';
  }
}

/**
 * Clear all field errors in a form
 */
function clearFormErrors(form) {
  if (!form) return;
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  form.querySelectorAll('.field__message').forEach(el => el.textContent = '');
}

/**
 * Register New Account
 */
export async function handleRegister(formData) {
  const { fullName, email, password, confirmPassword, agreeTerms } = formData;
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('registerSubmit') || form?.querySelector('button[type="submit"]');
  clearFormErrors(form);

  let hasError = false;

  if (!fullName || !fullName.trim()) {
    setFieldError('fullName', 'Please enter your full legal name.');
    hasError = true;
  }

  if (!email || !email.trim()) {
    setFieldError('email', 'Please enter your email address.');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    setFieldError('email', 'Please enter a valid email address.');
    hasError = true;
  }

  if (!password) {
    setFieldError('password', 'Please create a password.');
    hasError = true;
  } else if (password.length < 8) {
    setFieldError('password', 'Password must be at least 8 characters long.');
    hasError = true;
  }

  if (!confirmPassword) {
    setFieldError('confirmPassword', 'Please re-enter your password to confirm.');
    hasError = true;
  } else if (password !== confirmPassword) {
    setFieldError('confirmPassword', 'Passwords do not match.');
    hasError = true;
  }

  if (!agreeTerms) {
    setFieldError('agreeTerms', 'You must agree to the Terms of Service and Privacy Policy.');
    hasError = true;
  }

  if (hasError) {
    showToast('Please fill in all required fields to proceed.', 'error');
    const firstInvalid = form?.querySelector('.is-invalid input, input:invalid');
    firstInvalid?.focus();
    return false;
  }

  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    setFieldError('email', 'An account with this email address already exists.');
    showToast('An account with this email address already exists.', 'error');
    return false;
  }

  // Activate loading button spinner
  if (submitBtn) {
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
  }

  // Create pending registration user
  const pendingUser = {
    id: `usr_${Date.now()}`,
    fullName: fullName.trim(),
    email: email.trim(),
    password,
    role: 'investor',
    verified: false,
    walletBalance: 500.00, // Welcome signup bonus
    totalInvested: 0,
    otpCode: '123456', // Demo OTP
    createdAt: new Date().toISOString().split('T')[0]
  };

  localStorage.setItem(STORAGE_KEYS.PENDING_USER, JSON.stringify(pendingUser));

  try {
    // Send Brevo OTP email
    await sendVerificationEmail(email.trim(), '123456');
  } catch (err) {
    console.warn('[Register] Simulated email send error ignored:', err);
  }

  showToast('Registration initiated! 6-digit verification code sent to your email.', 'success');
  
  setTimeout(() => {
    window.location.href = '/auth/verify-email.html';
  }, 1000);

  return true;
}

/**
 * Verify OTP Code
 */
export function handleVerifyOtp(otpCode) {
  const pendingUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_USER) || 'null');

  if (!pendingUser) {
    showToast('No pending registration found. Please register first.', 'error');
    setTimeout(() => { window.location.href = '/auth/register.html'; }, 1500);
    return false;
  }

  if (otpCode !== pendingUser.otpCode && otpCode !== '123456') {
    showToast('Invalid verification code. Please enter 123456.', 'error');
    return false;
  }

  // Verification success — save user to active users
  pendingUser.verified = true;
  delete pendingUser.otpCode;

  const users = getUsers();
  users.push(pendingUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.removeItem(STORAGE_KEYS.PENDING_USER);

  // Set current user session
  setCurrentUser(pendingUser);

  showToast(`Account verified successfully! Welcome to FarmVest, ${pendingUser.fullName.split(' ')[0]}!`, 'success');

  setTimeout(() => {
    window.location.href = '/dashboard/index.html';
  }, 1200);

  return true;
}

/**
 * Handle Login
 */
export function handleLogin(email, password) {
  const form = document.getElementById('loginForm');
  const submitBtn = form?.querySelector('button[type="submit"]');
  clearFormErrors(form);

  let hasError = false;

  if (!email || !email.trim()) {
    setFieldError('email', 'Please enter your email address.');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    setFieldError('email', 'Please enter a valid email address.');
    hasError = true;
  }

  if (!password) {
    setFieldError('password', 'Please enter your password.');
    hasError = true;
  }

  if (hasError) {
    showToast('Please fill in all required login fields.', 'error');
    const firstInvalid = form?.querySelector('.is-invalid input');
    firstInvalid?.focus();
    return false;
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);

  if (!user) {
    setFieldError('password', 'Invalid email address or password.');
    showToast('Invalid email address or password.', 'error');
    return false;
  }

  if (submitBtn) {
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
  }

  setCurrentUser(user);
  showToast(`Welcome back, ${user.fullName.split(' ')[0]}! Loading dashboard...`, 'success');

  setTimeout(() => {
    if (user.role === 'admin') {
      window.location.href = '/admin/index.html';
    } else {
      window.location.href = '/dashboard/index.html';
    }
  }, 1000);

  return true;
}

/**
 * Password Visibility Toggle Initializer
 */
export function initPasswordToggles() {
  const toggles = document.querySelectorAll('.auth__password-toggle, .field__toggle, [data-password-toggle]');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const container = toggle.closest('.field__control') || toggle.closest('.auth__password') || toggle.parentElement;
      if (!container) return;
      const input = container.querySelector('input');
      const icon = toggle.querySelector('i');

      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        toggle.setAttribute('aria-label', 'Hide password');
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        input.type = 'password';
        toggle.setAttribute('aria-label', 'Show password');
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });
}

/**
 * Real-time Password Strength Meter (Supports Continuous Bar & Segmented Meters)
 */
export function initPasswordStrengthMeter() {
  const passwordInput = document.getElementById('password');
  if (!passwordInput) return;

  const strengthBar = document.querySelector('.password-strength__bar');
  const segs = document.querySelectorAll('.pw-meter__seg');
  const strengthLabel = document.getElementById('pwStrengthLabel');

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    if (!val) {
      if (strengthBar) strengthBar.style.width = '0%';
      segs.forEach(s => s.className = 'pw-meter__seg');
      if (strengthLabel) {
        strengthLabel.textContent = 'Enter a password';
        strengthLabel.className = 'pw-meter__label';
      }
      return;
    }

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (strengthBar) {
      const percent = score * 25;
      strengthBar.style.width = `${percent}%`;
      if (score <= 1) {
        strengthBar.className = 'password-strength__bar bg-danger';
      } else if (score === 2) {
        strengthBar.className = 'password-strength__bar bg-warning';
      } else if (score === 3) {
        strengthBar.className = 'password-strength__bar bg-info';
      } else {
        strengthBar.className = 'password-strength__bar bg-success';
      }
    }

    if (segs.length > 0) {
      const levelClasses = ['is-weak', 'is-fair', 'is-good', 'is-strong'];
      const levelLabels = ['Weak password', 'Fair password', 'Good password', 'Strong password'];
      const activeClass = levelClasses[Math.max(0, score - 1)] || 'is-weak';
      const activeText = levelLabels[Math.max(0, score - 1)] || 'Weak password';

      segs.forEach((seg, idx) => {
        if (idx < score) {
          seg.className = `pw-meter__seg is-active ${activeClass}`;
        } else {
          seg.className = 'pw-meter__seg';
        }
      });

      if (strengthLabel) {
        strengthLabel.textContent = activeText;
        strengthLabel.className = `pw-meter__label ${activeClass}`;
      }
    }
  });
}

/**
 * Demo Credential Quick-Fill Buttons
 * Any [data-demo-fill] button fills #email / #password from its
 * data-demo-email / data-demo-password attributes.
 */
export function initDemoFill() {
  document.querySelectorAll('[data-demo-fill]').forEach(btn => {
    btn.addEventListener('click', () => {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');

      if (emailInput) {
        emailInput.value = btn.dataset.demoEmail || '';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (passwordInput) {
        passwordInput.value = btn.dataset.demoPassword || '';
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });
}

/**
 * Wire Auth Page Form Handlers
 */
export function initAuthForms() {
  initPasswordToggles();
  initPasswordStrengthMeter();
  initDemoFill();

  // Clear errors on input for all auth forms
  const allInputs = document.querySelectorAll('#registerForm input, #loginForm input');
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      setFieldError(input.id, '');
    });
    input.addEventListener('change', () => {
      setFieldError(input.id, '');
    });
  });

  // Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        fullName: document.getElementById('fullName')?.value,
        email: document.getElementById('email')?.value,
        password: document.getElementById('password')?.value,
        confirmPassword: document.getElementById('confirmPassword')?.value,
        agreeTerms: document.getElementById('agreeTerms')?.checked
      };
      handleRegister(formData);
    });
  }

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email')?.value;
      const password = document.getElementById('password')?.value;
      handleLogin(email, password);
    });
  }

  // Forgot Password Form
  const forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormErrors(forgotForm);
      const email = document.getElementById('email')?.value;
      if (!email || !email.trim()) {
        setFieldError('email', 'Please enter your email address.');
        showToast('Please enter your email address.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setFieldError('email', 'Please enter a valid email address.');
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      localStorage.setItem('farmvest_reset_email', email.trim());
      await sendPasswordResetEmail(email.trim(), '482910');
      showToast('6-digit recovery code sent to your email!', 'success');
      setTimeout(() => {
        window.location.href = '/auth/reset-password.html';
      }, 900);
    });
  }

  // Reset Password Form (Recovery OTP + New Password)
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors(resetPasswordForm);
      const newPassword = document.getElementById('newPassword')?.value;
      const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

      let hasError = false;
      if (!newPassword) {
        setFieldError('newPassword', 'Please enter a new password.');
        hasError = true;
      } else if (newPassword.length < 8) {
        setFieldError('newPassword', 'Password must be at least 8 characters long.');
        hasError = true;
      }

      if (!confirmNewPassword) {
        setFieldError('confirmNewPassword', 'Please confirm your new password.');
        hasError = true;
      } else if (newPassword !== confirmNewPassword) {
        setFieldError('confirmNewPassword', 'Passwords do not match.');
        hasError = true;
      }

      if (hasError) {
        showToast('Please fill in all password fields.', 'error');
        return;
      }

      const resetEmail = localStorage.getItem('farmvest_reset_email') || 'james@example.com';
      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === resetEmail.toLowerCase()) || users[0];

      if (user) {
        user.password = newPassword;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        setCurrentUser(user);
      }

      showToast('Password successfully reset! Logging into your dashboard...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard/index.html';
      }, 1000);
    });
  }

  // OTP Verification Form
  const otpInputs = document.querySelectorAll('.auth__otp input');
  if (otpInputs.length > 0) {
    otpInputs.forEach((input, index) => {
      input.addEventListener('keyup', (e) => {
        if (e.key >= '0' && e.key <= '9') {
          if (index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          }
        } else if (e.key === 'Backspace') {
          if (index > 0) {
            otpInputs[index - 1].focus();
          }
        }
      });
    });

    const verifyBtn = document.getElementById('verifyOtpBtn');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        let code = '';
        otpInputs.forEach(i => code += i.value);
        handleVerifyOtp(code);
      });
    }
  }
}

// Auto-initialize Auth system on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  createIcons({ icons });
  initPreloader();
  initAuthForms();
});

