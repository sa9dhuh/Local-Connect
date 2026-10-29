/**
 * LOCALCONNECT — GLOBAL APP SCRIPTS
 * Shared utilities, components rendering, toast alerts, mobile navigation,
 * and Smart Service Finder interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initToastContainer();
  initFavoriteHandlers();
  initGlobalSearchForms();
  initSmartServiceFinder();
  updateNavBadgeCounts();
});

/* Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }
}

/* Toast Notifications */
function initToastContainer() {
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `;
  if (type === 'success') {
    icon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* Global Favorite Button Click Handler */
function initFavoriteHandlers() {
  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('[data-fav-id]');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const providerId = favBtn.getAttribute('data-fav-id');
      const isFav = LocalConnectStore.toggleFavorite(providerId);
      
      // Update this button and any other buttons for the same provider
      document.querySelectorAll(`[data-fav-id="${providerId}"]`).forEach(btn => {
        btn.classList.toggle('active', isFav);
        if (btn.querySelector('span.fav-text')) {
          btn.querySelector('span.fav-text').textContent = isFav ? 'Saved' : 'Save';
        }
      });

      if (isFav) {
        showToast('Saved to your favorites!', 'success');
      } else {
        showToast('Removed from favorites', 'info');
      }

      // If on dashboard, reload favorites tab if visible
      if (typeof renderFavoritesList === 'function') {
        renderFavoritesList();
      }
    }
  });
}

/* Navigation Badge Counts */
function updateNavBadgeCounts() {
  const bookings = LocalConnectStore.getBookings();
  const upcoming = bookings.filter(b => b.status === 'Pending' || b.status === 'Accepted');
  const badgeEl = document.querySelector('.bookings-count-badge');
  if (badgeEl) {
    if (upcoming.length > 0) {
      badgeEl.textContent = upcoming.length;
      badgeEl.style.display = 'inline-flex';
    } else {
      badgeEl.style.display = 'none';
    }
  }
}

/* Shared Search Input Handling */
function initGlobalSearchForms() {
  const searchForms = document.querySelectorAll('.global-search-form');
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const queryInput = form.querySelector('input[name="q"]');
      const catSelect = form.querySelector('select[name="category"]');
      
      const q = queryInput ? encodeURIComponent(queryInput.value.trim()) : '';
      const cat = catSelect ? encodeURIComponent(catSelect.value) : '';

      window.location.href = `services.html?q=${q}&category=${cat}`;
    });
  });
}

/* Smart Service Finder Logic */
function initSmartServiceFinder() {
  const smartInput = document.getElementById('smart-problem-input');
  const analyzeBtn = document.getElementById('smart-analyze-btn');
  const resultBox = document.getElementById('smart-result-box');
  const smartChips = document.querySelectorAll('.smart-chip');

  if (!smartInput || !resultBox) return;

  function runSmartAnalysis() {
    const text = smartInput.value.trim();
    if (!text) {
      resultBox.classList.remove('active');
      return;
    }

    const detected = LocalConnectStore.smartDetectCategory(text);
    if (detected) {
      resultBox.innerHTML = `
        <div class="flex items-center gap-2">
          <span style="font-size: 1.3rem;">✨</span>
          <div>
            <div style="font-size: 0.8rem; color: #CBD5E1; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Recommended Category</div>
            <div style="font-size: 1.15rem; font-weight: 700; color: #FFFFFF;">${detected} Service</div>
          </div>
        </div>
        <a href="services.html?category=${encodeURIComponent(detected)}&q=${encodeURIComponent(text)}" class="btn btn-accent btn-sm">
          View ${detected} Pros
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      `;
      resultBox.classList.add('active');
    } else {
      resultBox.innerHTML = `
        <div class="flex items-center gap-2">
          <span style="font-size: 1.2rem;">🔍</span>
          <div>
            <div style="font-size: 0.95rem; font-weight: 600; color: #FFFFFF;">Explore all local specialists for "${text}"</div>
          </div>
        </div>
        <a href="services.html?q=${encodeURIComponent(text)}" class="btn btn-accent btn-sm">
          Search Directory
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      `;
      resultBox.classList.add('active');
    }
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', runSmartAnalysis);
  }

  smartInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSmartAnalysis();
    }
  });

  // Example chip click
  smartChips.forEach(chip => {
    chip.addEventListener('click', () => {
      smartInput.value = chip.getAttribute('data-problem');
      runSmartAnalysis();
    });
  });
}

/**
 * Reusable Provider Card HTML Generator
 */
function createProviderCardHtml(provider) {
  const isFav = LocalConnectStore.isFavorite(provider.id);
  const primaryBadge = provider.badges && provider.badges[0] ? provider.badges[0] : 'Verified Pro';

  return `
    <div class="provider-card">
      <div class="provider-card-top">
        <img src="${provider.cover || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}" alt="${provider.name}" class="provider-cover-img" />
        <button class="provider-fav-btn ${isFav ? 'active' : ''}" data-fav-id="${provider.id}" title="${isFav ? 'Remove Favorite' : 'Save to Favorites'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <div class="provider-avatar-wrapper">
          <img src="${provider.avatar}" alt="${provider.name}" class="provider-avatar-img" />
        </div>
      </div>

      <div class="provider-card-body">
        <div class="provider-badge-row">
          <span class="badge badge-category">${provider.category}</span>
          <span class="badge badge-rating">★ ${provider.rating.toFixed(1)} (${provider.reviewCount})</span>
        </div>

        <h3 class="provider-name">
          <a href="provider.html?id=${provider.id}">${provider.name}</a>
          ${provider.verified ? `
            <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          ` : ''}
        </h3>

        <p class="provider-tagline">${provider.tagline}</p>

        <div class="provider-meta-row">
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${provider.location.split('(')[0].trim()}</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${provider.availability}</span>
          </div>
        </div>

        <div class="provider-card-footer">
          <div class="provider-price">
            From <span class="price-amount">₹${provider.startingPrice}</span>/${provider.priceUnit}
          </div>
          <div class="provider-card-actions">
            <a href="provider.html?id=${provider.id}" class="btn btn-outline btn-sm">Profile</a>
            <a href="booking.html?provider=${provider.id}" class="btn btn-accent btn-sm">Book</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
