/**
 * LOCALCONNECT — PROVIDER PROFILE CONTROLLER
 * Loads provider dynamically by ID from localStorage, handles sticky booking widget,
 * and enables customers to write and persist new reviews.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProviderProfile();
});

function initProviderProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('id') || 'p1';
  const provider = LocalConnectStore.getProviderById(providerId);

  if (!provider) {
    window.location.href = 'services.html';
    return;
  }

  // Populate Hero Information
  const heroAvatar = document.getElementById('provider-hero-avatar');
  const heroName = document.getElementById('provider-hero-name');
  const heroCategory = document.getElementById('provider-hero-category');
  const heroRating = document.getElementById('provider-hero-rating');
  const heroLocation = document.getElementById('provider-hero-location');
  const heroAvailability = document.getElementById('provider-hero-availability');
  const heroTagline = document.getElementById('provider-hero-tagline');
  const favBtn = document.getElementById('provider-profile-fav-btn');

  if (heroAvatar) heroAvatar.src = provider.avatar;
  if (heroName) {
    heroName.innerHTML = `
      ${provider.name}
      ${provider.verified ? `
        <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor" title="Verified Professional">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ` : ''}
    `;
  }
  if (heroCategory) heroCategory.textContent = provider.category;
  if (heroRating) heroRating.textContent = `★ ${provider.rating.toFixed(1)} (${provider.reviewCount} reviews)`;
  if (heroLocation) heroLocation.textContent = provider.location;
  if (heroAvailability) heroAvailability.textContent = provider.availability;
  if (heroTagline) heroTagline.textContent = provider.tagline;

  // Favorite button
  if (favBtn) {
    favBtn.setAttribute('data-fav-id', provider.id);
    const isFav = LocalConnectStore.isFavorite(provider.id);
    favBtn.classList.toggle('active', isFav);
    const favText = favBtn.querySelector('.fav-text');
    if (favText) favText.textContent = isFav ? 'Saved' : 'Save';
  }

  // Populate About Section
  const aboutBio = document.getElementById('provider-about-text');
  const experienceBadge = document.getElementById('provider-experience-text');
  if (aboutBio) aboutBio.textContent = provider.about;
  if (experienceBadge) experienceBadge.textContent = provider.experience || 'Verified Trade Specialist';

  // Populate Services & Pricing List
  const servicesList = document.getElementById('provider-services-list');
  if (servicesList && provider.servicesOffered) {
    servicesList.innerHTML = provider.servicesOffered.map(service => `
      <div class="service-item-row">
        <div>
          <div class="service-item-name">${service.name}</div>
          <div style="font-size: 0.8rem; color: var(--color-text-muted);">Estimated time: ${service.duration || '1 hr'}</div>
        </div>
        <div style="text-align: right;">
          <div class="service-item-price">₹${service.price}</div>
          <a href="booking.html?provider=${provider.id}&service=${encodeURIComponent(service.name)}" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.8rem; margin-top: 0.35rem;">
            Book This
          </a>
        </div>
      </div>
    `).join('');
  }

  // Populate Gallery
  const galleryContainer = document.getElementById('provider-gallery');
  if (galleryContainer && provider.gallery) {
    galleryContainer.innerHTML = provider.gallery.map(imgUrl => `
      <div class="gallery-thumb">
        <img src="${imgUrl}" alt="Work sample" />
      </div>
    `).join('');
  }

  // Populate Sticky Booking Widget
  const widgetPrice = document.getElementById('widget-price-rate');
  const widgetBookBtn = document.getElementById('widget-book-now-btn');
  if (widgetPrice) {
    widgetPrice.innerHTML = `₹${provider.startingPrice} <span>/${provider.priceUnit}</span>`;
  }
  if (widgetBookBtn) {
    widgetBookBtn.href = `booking.html?provider=${provider.id}`;
  }

  // Render Reviews
  renderReviews(provider);

  // Review Modal Form Handling
  initReviewModal(provider);

  // Share Button
  const shareBtn = document.getElementById('provider-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied to clipboard!', 'success');
    });
  }
}

function renderReviews(provider) {
  const reviewsContainer = document.getElementById('provider-reviews-list');
  const reviewScoreHeader = document.getElementById('reviews-score-header');

  if (reviewScoreHeader) {
    reviewScoreHeader.textContent = `★ ${provider.rating.toFixed(1)} out of 5 (${provider.reviewCount} customer reviews)`;
  }

  if (reviewsContainer && provider.reviews) {
    reviewsContainer.innerHTML = provider.reviews.map(review => {
      const stars = '★'.repeat(Math.round(review.rating)) + '☆'.repeat(5 - Math.round(review.rating));
      return `
        <div class="review-item">
          <div class="review-header">
            <div>
              <span class="reviewer-name">${review.author}</span>
              <span class="badge badge-verified" style="margin-left: 0.5rem; font-size: 0.65rem;">Verified Booking</span>
            </div>
            <span class="review-date">${review.date}</span>
          </div>
          <div style="color: #F59E0B; font-size: 0.95rem; margin-bottom: 0.4rem;">${stars}</div>
          <p style="font-size: 0.95rem; color: var(--color-text-secondary); margin-bottom: 0;">${review.text}</p>
        </div>
      `;
    }).join('');
  }
}

function initReviewModal(provider) {
  const openBtn = document.getElementById('open-review-modal-btn');
  const modal = document.getElementById('review-modal');
  const closeBtn = document.getElementById('close-review-modal-btn');
  const form = document.getElementById('submit-review-form');

  if (!modal || !openBtn) return;

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close on outside backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = document.getElementById('review-rating-select').value;
      const author = document.getElementById('review-author-input').value.trim() || 'Verified Customer';
      const text = document.getElementById('review-text-input').value.trim();

      if (!text) {
        showToast('Please write a short review note', 'info');
        return;
      }

      const success = LocalConnectStore.addReview(provider.id, {
        rating: parseFloat(rating),
        author,
        text
      });

      if (success) {
        modal.classList.remove('active');
        form.reset();
        showToast('Thank you! Your review has been published.', 'success');
        
        // Re-fetch updated provider and re-render
        const updatedProvider = LocalConnectStore.getProviderById(provider.id);
        renderReviews(updatedProvider);
        const heroRating = document.getElementById('provider-hero-rating');
        if (heroRating) {
          heroRating.textContent = `★ ${updatedProvider.rating.toFixed(1)} (${updatedProvider.reviewCount} reviews)`;
        }
      }
    });
  }
}
