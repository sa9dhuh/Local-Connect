/**
 * LOCALCONNECT — CUSTOMER DASHBOARD CONTROLLER
 * Handles tab navigation, booking history management, cancel/complete status toggles,
 * and saved favorites list.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomerDashboard();
});

function initCustomerDashboard() {
  initDashboardTabs();
  renderDashboardStats();
  renderBookingsList();
  renderFavoritesList();
  renderCustomerReviews();
}

/* Tab Navigation */
function initDashboardTabs() {
  const tabBtns = document.querySelectorAll('.dashboard-tab-btn');
  const tabPanes = document.querySelectorAll('.dashboard-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* Stats Summary */
function renderDashboardStats() {
  const bookings = LocalConnectStore.getBookings();
  const favorites = LocalConnectStore.getFavorites();

  const upcomingCount = bookings.filter(b => b.status === 'Pending' || b.status === 'Accepted' || b.status === 'In Progress').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const favCount = favorites.length;

  const statUpcoming = document.getElementById('stat-upcoming-count');
  const statCompleted = document.getElementById('stat-completed-count');
  const statFavorites = document.getElementById('stat-favorites-count');

  if (statUpcoming) statUpcoming.textContent = upcomingCount;
  if (statCompleted) statCompleted.textContent = completedCount;
  if (statFavorites) statFavorites.textContent = favCount;
}

/* My Bookings List */
function renderBookingsList() {
  const container = document.getElementById('customer-bookings-container');
  if (!container) return;

  const bookings = LocalConnectStore.getBookings();

  if (bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; background-color: var(--color-surface); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
        <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">You don't have any bookings yet.</p>
        <a href="services.html" class="btn btn-accent btn-sm">Find a Provider</a>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings.map(b => {
    const statusClass = `badge-status-${(b.status || 'pending').toLowerCase()}`;
    const canCancel = b.status === 'Pending' || b.status === 'Accepted';
    const canMarkDone = b.status === 'Accepted' || b.status === 'In Progress';

    return `
      <div class="booking-item-card" data-booking-id="${b.id}">
        <div class="flex items-center gap-3" style="flex: 1;">
          <img src="${b.providerAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}" alt="${b.providerName}" style="width: 52px; height: 52px; border-radius: var(--radius-full); object-fit: cover;" />
          <div>
            <div class="flex items-center gap-2" style="margin-bottom: 0.2rem;">
              <h4 style="font-size: 1.1rem; margin: 0;">${b.serviceName}</h4>
              <span class="badge ${statusClass}">${b.status}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 0.2rem;">
              Provider: <strong>${b.providerName}</strong> (${b.providerCategory}) • Ref: <code>${b.id}</code>
            </div>
            <div style="font-size: 0.8rem; color: var(--color-text-muted);">
              📅 ${b.date} • ⏰ ${b.timeSlot} • 📍 ${b.customerAddress}
            </div>
            ${b.notes ? `<div style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 0.25rem;"><em>"${b.notes}"</em></div>` : ''}
          </div>
        </div>

        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary);">
            ₹${b.totalPrice ? b.totalPrice.toFixed(2) : '349.00'}
          </div>

          <div class="flex gap-1 flex-wrap">
            ${canMarkDone ? `
              <button type="button" class="btn btn-primary btn-sm" onclick="handleMarkCompleted('${b.id}')">
                Mark Completed
              </button>
            ` : ''}

            ${canCancel ? `
              <button type="button" class="btn btn-outline btn-sm" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.4);" onclick="handleCancelBooking('${b.id}')">
                Cancel
              </button>
            ` : ''}

            ${b.status === 'Completed' ? `
              <a href="provider.html?id=${b.providerId}" class="btn btn-outline btn-sm">
                Rate & Review
              </a>
            ` : ''}

            <a href="booking.html?provider=${b.providerId}" class="btn btn-secondary btn-sm">
              Book Again
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* Action: Cancel Booking */
window.handleCancelBooking = function(bookingId) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    LocalConnectStore.updateBookingStatus(bookingId, 'Cancelled');
    showToast('Booking cancelled', 'info');
    renderBookingsList();
    renderDashboardStats();
    updateNavBadgeCounts();
  }
};

/* Action: Mark Completed */
window.handleMarkCompleted = function(bookingId) {
  LocalConnectStore.updateBookingStatus(bookingId, 'Completed');
  showToast('Booking marked as completed! You can now leave a review.', 'success');
  renderBookingsList();
  renderDashboardStats();
  updateNavBadgeCounts();
};

/* Saved Favorites List */
function renderFavoritesList() {
  const container = document.getElementById('customer-favorites-grid');
  if (!container) return;

  const favIds = LocalConnectStore.getFavorites();
  const allProviders = LocalConnectStore.getProviders();
  const favProviders = allProviders.filter(p => favIds.includes(p.id));

  if (favProviders.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background-color: var(--color-surface); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
        <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">No saved favorites yet.</p>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">Click the heart icon on any provider profile or search card to save them here for quick access.</p>
        <a href="services.html" class="btn btn-outline btn-sm">Explore Providers</a>
      </div>
    `;
    return;
  }

  container.innerHTML = favProviders.map(p => createProviderCardHtml(p)).join('');
}

/* Customer Reviews Given */
function renderCustomerReviews() {
  const container = document.getElementById('customer-reviews-container');
  if (!container) return;

  const allProviders = LocalConnectStore.getProviders();
  let userReviews = [];

  allProviders.forEach(provider => {
    if (provider.reviews) {
      provider.reviews.forEach(r => {
        if (r.author.toLowerCase().includes('alex') || r.date === 'Just now') {
          userReviews.push({
            ...r,
            providerName: provider.name,
            providerId: provider.id,
            category: provider.category
          });
        }
      });
    }
  });

  if (userReviews.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; background-color: var(--color-surface); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
        <p style="color: var(--color-text-secondary);">No reviews submitted yet.</p>
        <p style="font-size: 0.85rem; color: var(--color-text-muted);">After completing a service, share your feedback on the provider's profile.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userReviews.map(r => `
    <div class="card" style="margin-bottom: 1rem; padding: 1.25rem;">
      <div class="flex justify-between items-center" style="margin-bottom: 0.4rem;">
        <div>
          <strong style="color: var(--color-primary);">${r.providerName}</strong>
          <span class="badge badge-category" style="margin-left: 0.5rem;">${r.category}</span>
        </div>
        <span style="font-size: 0.8rem; color: var(--color-text-muted);">${r.date}</span>
      </div>
      <div style="color: #F59E0B; margin-bottom: 0.4rem;">★ ${r.rating} / 5.0</div>
      <p style="font-size: 0.95rem; color: var(--color-text-secondary); margin-bottom: 0;">"${r.text}"</p>
    </div>
  `).join('');
}
