/**
 * LOCALCONNECT — PROVIDER BUSINESS DASHBOARD CONTROLLER
 * Manages booking requests queue (Accept/Decline), live status updates,
 * profile availability toggling, revenue metrics, and Pro subscription modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProviderDashboard();
});

function initProviderDashboard() {
  initProviderTabs();
  renderProviderStats();
  renderRequestsQueue();
  renderJobsHistory();
  initAvailabilityToggle();
  initRateEditor();
  initProPlanModal();
}

/* Tabs */
function initProviderTabs() {
  const tabBtns = document.querySelectorAll('.prov-tab-btn');
  const tabPanes = document.querySelectorAll('.prov-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
    });
  });
}

/* Render KPI Stats */
function renderProviderStats() {
  const stats = LocalConnectStore.getProviderStats();
  const bookings = LocalConnectStore.getBookings();

  const pendingRequests = bookings.filter(b => b.status === 'Pending').length;
  const completedJobs = bookings.filter(b => b.status === 'Completed').length;

  const reqEl = document.getElementById('stat-prov-requests');
  const completedEl = document.getElementById('stat-prov-completed');
  const ratingEl = document.getElementById('stat-prov-rating');
  const viewsEl = document.getElementById('stat-prov-views');
  const earningsEl = document.getElementById('stat-prov-earnings');

  if (reqEl) reqEl.textContent = pendingRequests;
  if (completedEl) completedEl.textContent = stats.completedJobsCount + completedJobs;
  if (ratingEl) ratingEl.textContent = '★ 4.9';
  if (viewsEl) viewsEl.textContent = stats.profileViewsMonth.toLocaleString('en-IN');
  if (earningsEl) earningsEl.textContent = `₹${stats.monthlyEarnings.toLocaleString('en-IN')}`;

  // Request tab badge
  const reqBadge = document.getElementById('prov-requests-badge');
  if (reqBadge) {
    reqBadge.textContent = pendingRequests;
    reqBadge.style.display = pendingRequests > 0 ? 'inline-block' : 'none';
  }
}

/* Booking Requests Queue */
function renderRequestsQueue() {
  const container = document.getElementById('prov-requests-container');
  if (!container) return;

  const bookings = LocalConnectStore.getBookings();
  const pending = bookings.filter(b => b.status === 'Pending');

  if (pending.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; background-color: var(--color-surface); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
        <h4 style="margin-bottom: 0.25rem;">You're all caught up!</h4>
        <p style="color: var(--color-text-secondary); font-size: 0.9rem;">No pending customer requests at this time.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pending.map(b => `
    <div class="booking-item-card" id="request-card-${b.id}">
      <div style="flex: 1;">
        <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
          <h4 style="font-size: 1.15rem; margin: 0;">${b.serviceName}</h4>
          <span class="badge badge-status-pending">New Request</span>
        </div>
        <div style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 0.35rem;">
          Customer: <strong>${b.customerName}</strong> • Phone: <a href="tel:${b.customerPhone}" style="color: var(--color-primary); font-weight: 600;">${b.customerPhone}</a>
        </div>
        <div style="font-size: 0.85rem; color: var(--color-text-muted);">
          📅 <strong>${b.date}</strong> at <strong>${b.timeSlot}</strong> • 📍 ${b.customerAddress}
        </div>
        ${b.notes ? `
          <div style="background-color: var(--color-bg); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.5rem;">
            Customer note: "${b.notes}"
          </div>
        ` : ''}
      </div>

      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem;">
        <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-primary);">
          ₹${b.totalPrice ? b.totalPrice.toFixed(2) : '349.00'}
        </div>
        <div class="flex gap-1">
          <button type="button" class="btn btn-primary btn-sm" onclick="handleProviderAccept('${b.id}')">
            ✓ Accept Request
          </button>
          <button type="button" class="btn btn-outline btn-sm" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.4);" onclick="handleProviderDecline('${b.id}')">
            Decline
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* Action: Accept Request */
window.handleProviderAccept = function(bookingId) {
  LocalConnectStore.updateBookingStatus(bookingId, 'Accepted');
  showToast(`Booking ${bookingId} accepted! Customer notified.`, 'success');
  renderRequestsQueue();
  renderJobsHistory();
  renderProviderStats();
};

/* Action: Decline Request */
window.handleProviderDecline = function(bookingId) {
  if (confirm('Decline this service request?')) {
    LocalConnectStore.updateBookingStatus(bookingId, 'Cancelled');
    showToast(`Request declined.`, 'info');
    renderRequestsQueue();
    renderJobsHistory();
    renderProviderStats();
  }
};

/* Completed / Active Jobs History */
function renderJobsHistory() {
  const container = document.getElementById('prov-jobs-container');
  if (!container) return;

  const bookings = LocalConnectStore.getBookings();
  const jobs = bookings.filter(b => b.status !== 'Pending');

  if (jobs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: var(--color-text-muted);">
        No active or completed jobs yet.
      </div>
    `;
    return;
  }

  container.innerHTML = jobs.map(b => {
    const statusClass = `badge-status-${(b.status || 'accepted').toLowerCase()}`;
    return `
      <div class="booking-item-card">
        <div style="flex: 1;">
          <div class="flex items-center gap-2" style="margin-bottom: 0.2rem;">
            <h4 style="font-size: 1.05rem; margin: 0;">${b.serviceName}</h4>
            <span class="badge ${statusClass}">${b.status}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--color-text-secondary);">
            Customer: ${b.customerName} • 📅 ${b.date} (${b.timeSlot})
          </div>
          <div style="font-size: 0.8rem; color: var(--color-text-muted);">
            📍 ${b.customerAddress}
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-weight: 700; color: var(--color-primary); font-size: 1.15rem;">
            ₹${b.totalPrice ? b.totalPrice.toFixed(2) : '349.00'}
          </div>
          ${b.status === 'Accepted' ? `
            <button type="button" class="btn btn-outline btn-sm" style="margin-top: 0.35rem;" onclick="handleMarkJobDone('${b.id}')">
              Mark Complete
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.handleMarkJobDone = function(bookingId) {
  LocalConnectStore.updateBookingStatus(bookingId, 'Completed');
  showToast('Job marked as completed!', 'success');
  renderJobsHistory();
  renderProviderStats();
};

/* Availability Switch */
function initAvailabilityToggle() {
  const toggle = document.getElementById('prov-availability-switch');
  const label = document.getElementById('prov-availability-label');
  const stats = LocalConnectStore.getProviderStats();

  if (toggle && label) {
    toggle.checked = stats.isAvailable;
    label.textContent = stats.isAvailable ? 'Available for New Jobs' : 'Unavailable (Offline)';
    label.style.color = stats.isAvailable ? 'var(--color-success)' : 'var(--color-text-muted)';

    toggle.addEventListener('change', (e) => {
      stats.isAvailable = e.target.checked;
      LocalConnectStore.saveProviderStats(stats);
      label.textContent = stats.isAvailable ? 'Available for New Jobs' : 'Unavailable (Offline)';
      label.style.color = stats.isAvailable ? 'var(--color-success)' : 'var(--color-text-muted)';
      showToast(stats.isAvailable ? 'Status set to Available' : 'Status set to Offline', 'info');
    });
  }
}

/* Rate Editor */
function initRateEditor() {
  const rateInput = document.getElementById('prov-hourly-rate-input');
  const saveBtn = document.getElementById('prov-save-rate-btn');
  const stats = LocalConnectStore.getProviderStats();

  if (rateInput && saveBtn) {
    rateInput.value = stats.baseHourlyRate || 299;

    saveBtn.addEventListener('click', () => {
      const newRate = parseInt(rateInput.value, 10);
      if (newRate > 0) {
        stats.baseHourlyRate = newRate;
        LocalConnectStore.saveProviderStats(stats);

        // Also update provider object
        const providers = LocalConnectStore.getProviders();
        const p1 = providers.find(p => p.id === 'p1');
        if (p1) {
          p1.startingPrice = newRate;
          LocalConnectStore.saveProviders(providers);
        }

        showToast(`Base rate updated to ₹${newRate}/visit`, 'success');
      }
    });
  }
}

/* Pro Plan Modal */
function initProPlanModal() {
  const openBtn = document.getElementById('open-pro-modal-btn');
  const modal = document.getElementById('pro-modal');
  const closeBtn = document.getElementById('close-pro-modal-btn');
  const startTrialBtn = document.getElementById('start-pro-trial-btn');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  if (startTrialBtn) {
    startTrialBtn.addEventListener('click', () => {
      const stats = LocalConnectStore.getProviderStats();
      stats.proMember = true;
      LocalConnectStore.saveProviderStats(stats);

      modal.classList.remove('active');
      showToast('Welcome to LocalConnect Pro! 14-day free trial activated.', 'success');

      const badge = document.getElementById('prov-pro-badge');
      if (badge) badge.style.display = 'inline-block';
    });
  }
}
