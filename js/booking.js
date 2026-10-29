/**
 * LOCALCONNECT — BOOKING WIZARD CONTROLLER
 * Multi-step booking flow with validation, dynamic summary calculation,
 * confirmation generation, and localStorage synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

function initBookingWizard() {
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('provider') || 'p1';
  const requestedServiceName = urlParams.get('service') || '';

  const provider = LocalConnectStore.getProviderById(providerId);
  const currentUser = LocalConnectStore.getCurrentUser();

  // Wizard State
  let currentStep = 1;
  let bookingData = {
    providerId: provider.id,
    providerName: provider.name,
    providerCategory: provider.category,
    providerAvatar: provider.avatar,
    serviceName: '',
    servicePrice: provider.startingPrice,
    date: getTomorrowDateString(),
    timeSlot: '10:00 AM - 12:00 PM',
    customerName: currentUser.name || '',
    customerEmail: currentUser.email || '',
    customerPhone: currentUser.phone || '',
    customerAddress: currentUser.address || '',
    notes: '',
    paymentMethod: 'Pay after completion'
  };

  // Populate Provider Header Summary in sidebar
  const summaryProviderName = document.getElementById('summary-provider-name');
  const summaryProviderAvatar = document.getElementById('summary-provider-avatar');
  const summaryProviderCategory = document.getElementById('summary-provider-category');
  const summaryProviderRating = document.getElementById('summary-provider-rating');

  if (summaryProviderName) summaryProviderName.textContent = provider.name;
  if (summaryProviderAvatar) summaryProviderAvatar.src = provider.avatar;
  if (summaryProviderCategory) summaryProviderCategory.textContent = provider.category;
  if (summaryProviderRating) summaryProviderRating.textContent = `★ ${provider.rating.toFixed(1)} (${provider.reviewCount})`;

  // Render Service Options (Step 1)
  const servicesContainer = document.getElementById('step-services-options');
  if (servicesContainer && provider.servicesOffered) {
    // Default to requested service or first service
    const initialService = provider.servicesOffered.find(s => s.name === requestedServiceName) || provider.servicesOffered[0];
    bookingData.serviceName = initialService.name;
    bookingData.servicePrice = initialService.price;

    servicesContainer.innerHTML = provider.servicesOffered.map(service => {
      const isSelected = service.name === bookingData.serviceName;
      return `
        <div class="radio-card ${isSelected ? 'selected' : ''}" data-service-name="${service.name}" data-service-price="${service.price}">
          <div class="flex justify-between items-center" style="margin-bottom: 0.25rem;">
            <div class="radio-card-title">${service.name}</div>
            <div style="font-weight: 700; color: var(--color-primary);">₹${service.price}</div>
          </div>
          <div class="radio-card-desc">Duration: ${service.duration || '1 hr'} • All basic tools included</div>
        </div>
      `;
    }).join('');

    // Click handler for service radio cards
    servicesContainer.querySelectorAll('.radio-card').forEach(card => {
      card.addEventListener('click', () => {
        servicesContainer.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        bookingData.serviceName = card.getAttribute('data-service-name');
        bookingData.servicePrice = parseFloat(card.getAttribute('data-service-price'));
        updateSummaryReview();
      });
    });
  }

  // Pre-fill Step 2 (Date & Time)
  const dateInput = document.getElementById('booking-date-input');
  if (dateInput) {
    dateInput.value = bookingData.date;
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.addEventListener('change', (e) => {
      bookingData.date = e.target.value;
      updateSummaryReview();
    });
  }

  // Quick Day selection buttons
  const quickDaysContainer = document.getElementById('quick-date-buttons');
  if (quickDaysContainer) {
    const today = new Date();
    const quickDays = [
      { label: 'Today', date: today.toISOString().split('T')[0] },
      { label: 'Tomorrow', date: new Date(today.getTime() + 86400000).toISOString().split('T')[0] },
      { label: 'In 2 Days', date: new Date(today.getTime() + 172800000).toISOString().split('T')[0] }
    ];

    quickDaysContainer.innerHTML = quickDays.map((d, idx) => `
      <button type="button" class="btn btn-outline btn-sm ${idx === 1 ? 'btn-primary' : ''}" data-date="${d.date}">
        ${d.label}
      </button>
    `).join('');

    quickDaysContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        quickDaysContainer.querySelectorAll('button').forEach(b => b.className = 'btn btn-outline btn-sm');
        btn.className = 'btn btn-primary btn-sm';
        bookingData.date = btn.getAttribute('data-date');
        if (dateInput) dateInput.value = bookingData.date;
        updateSummaryReview();
      });
    });
  }

  // Time slot chips
  const timeSlots = document.querySelectorAll('.time-slot-btn');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      bookingData.timeSlot = slot.getAttribute('data-time');
      updateSummaryReview();
    });
  });

  // Pre-fill Step 3 (Customer contact)
  const nameInput = document.getElementById('cust-name-input');
  const emailInput = document.getElementById('cust-email-input');
  const phoneInput = document.getElementById('cust-phone-input');
  const addressInput = document.getElementById('cust-address-input');
  const notesInput = document.getElementById('cust-notes-input');

  if (nameInput) nameInput.value = bookingData.customerName;
  if (emailInput) emailInput.value = bookingData.customerEmail;
  if (phoneInput) phoneInput.value = bookingData.customerPhone;
  if (addressInput) addressInput.value = bookingData.customerAddress;

  // Step Navigation buttons
  const nextBtn = document.getElementById('wizard-next-btn');
  const prevBtn = document.getElementById('wizard-prev-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep === 3) {
          // Move to review Step 4
          currentStep = 4;
          updateSummaryReview();
        } else if (currentStep === 4) {
          // Submit Booking
          submitBooking();
          return;
        } else {
          currentStep++;
        }
        showStep(currentStep);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  function validateStep(step) {
    if (step === 1) {
      if (!bookingData.serviceName) {
        showToast('Please choose a specific service', 'warning');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!bookingData.date) {
        showToast('Please select a preferred service date', 'warning');
        return false;
      }
      return true;
    }
    if (step === 3) {
      bookingData.customerName = nameInput ? nameInput.value.trim() : '';
      bookingData.customerEmail = emailInput ? emailInput.value.trim() : '';
      bookingData.customerPhone = phoneInput ? phoneInput.value.trim() : '';
      bookingData.customerAddress = addressInput ? addressInput.value.trim() : '';
      bookingData.notes = notesInput ? notesInput.value.trim() : '';

      if (!bookingData.customerName || !bookingData.customerPhone || !bookingData.customerAddress) {
        showToast('Please fill in your name, phone number, and service address', 'warning');
        return false;
      }
      return true;
    }
    return true;
  }

  function showStep(step) {
    // Hide all step panes
    document.querySelectorAll('.wizard-step-pane').forEach(p => p.style.display = 'none');
    
    // Show current pane
    const currentPane = document.getElementById(`step-pane-${step}`);
    if (currentPane) currentPane.style.display = 'block';

    // Update stepper nodes
    document.querySelectorAll('.step-node').forEach((node, idx) => {
      const stepNumber = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepNumber === step) {
        node.classList.add('active');
      } else if (stepNumber < step) {
        node.classList.add('completed');
      }
    });

    // Update Next/Back button labels
    if (prevBtn) {
      prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
    }
    if (nextBtn) {
      if (step === 4) {
        nextBtn.textContent = 'Confirm & Place Booking';
        nextBtn.className = 'btn btn-accent btn-lg';
      } else {
        nextBtn.textContent = 'Continue';
        nextBtn.className = 'btn btn-primary btn-md';
      }
    }
  }

  function updateSummaryReview() {
    const revService = document.getElementById('review-service-name');
    const revDateTime = document.getElementById('review-date-time');
    const revAddress = document.getElementById('review-address');
    const revPrice = document.getElementById('review-service-price');
    const revTotal = document.getElementById('review-total-price');

    if (revService) revService.textContent = bookingData.serviceName;
    if (revDateTime) revDateTime.textContent = `${formatDate(bookingData.date)} • ${bookingData.timeSlot}`;
    if (revAddress) revAddress.textContent = bookingData.customerAddress || 'Address will be provided';
    if (revPrice) revPrice.textContent = `₹${bookingData.servicePrice.toFixed(2)}`;
    if (revTotal) revTotal.textContent = `₹${bookingData.servicePrice.toFixed(2)}`;
  }

  function submitBooking() {
    // Create new booking record in LocalConnectStore
    const newBooking = LocalConnectStore.addBooking({
      providerId: bookingData.providerId,
      providerName: bookingData.providerName,
      providerCategory: bookingData.providerCategory,
      providerAvatar: bookingData.providerAvatar,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      customerAddress: bookingData.customerAddress,
      serviceName: bookingData.serviceName,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      notes: bookingData.notes,
      totalPrice: bookingData.servicePrice
    });

    // Hide wizard and show confirmation pane
    document.getElementById('wizard-flow-wrapper').style.display = 'none';
    const confPane = document.getElementById('booking-confirmation-pane');
    if (confPane) {
      confPane.style.display = 'block';

      document.getElementById('conf-booking-id').textContent = newBooking.id;
      document.getElementById('conf-provider-name').textContent = newBooking.providerName;
      document.getElementById('conf-service-name').textContent = newBooking.serviceName;
      document.getElementById('conf-date-time').textContent = `${formatDate(newBooking.date)} at ${newBooking.timeSlot}`;
      document.getElementById('conf-address').textContent = newBooking.customerAddress;
      document.getElementById('conf-total-price').textContent = `₹${newBooking.totalPrice.toFixed(2)}`;
    }

    showToast('Booking successfully placed!', 'success');
  }

  // Initial step setup
  showStep(1);
  updateSummaryReview();
}

function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
