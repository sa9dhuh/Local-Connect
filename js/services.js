/**
 * LOCALCONNECT — SERVICES DISCOVERY PAGE CONTROLLER
 * Handles category filtering, query search, sorting, price filter, and card rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  initServicesPage();
});

function initServicesPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'All';
  const initialQuery = urlParams.get('q') || '';

  // DOM Elements
  const searchInput = document.getElementById('services-search-input');
  const sortSelect = document.getElementById('services-sort-select');
  const minRatingSelect = document.getElementById('services-rating-select');
  const maxPriceInput = document.getElementById('services-price-input');
  const priceValueLabel = document.getElementById('services-price-value');
  const categoryChips = document.querySelectorAll('.category-chip-btn');
  const providersGrid = document.getElementById('services-providers-grid');
  const resultsCount = document.getElementById('services-results-count');
  const clearFiltersBtn = document.getElementById('services-clear-filters');

  let currentFilters = {
    category: initialCategory,
    query: initialQuery,
    sort: 'rating_desc',
    minRating: 0,
    maxPrice: 2500
  };

  // Set initial input values
  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  // Set initial category chip active
  categoryChips.forEach(chip => {
    const chipCat = chip.getAttribute('data-category');
    if (chipCat.toLowerCase() === initialCategory.toLowerCase()) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }

    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilters.category = chip.getAttribute('data-category');
      applyFilters();
    });
  });

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.query = e.target.value.trim();
      applyFilters();
    });
  }

  // Sort change event
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      applyFilters();
    });
  }

  // Min rating event
  if (minRatingSelect) {
    minRatingSelect.addEventListener('change', (e) => {
      currentFilters.minRating = parseFloat(e.target.value) || 0;
      applyFilters();
    });
  }

  // Max price slider event
  if (maxPriceInput && priceValueLabel) {
    maxPriceInput.addEventListener('input', (e) => {
      currentFilters.maxPrice = parseInt(e.target.value, 10);
      priceValueLabel.textContent = `₹${currentFilters.maxPrice}`;
      applyFilters();
    });
  }

  // Clear filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      currentFilters = {
        category: 'All',
        query: '',
        sort: 'rating_desc',
        minRating: 0,
        maxPrice: 2500
      };

      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'rating_desc';
      if (minRatingSelect) minRatingSelect.value = '0';
      if (maxPriceInput) maxPriceInput.value = '2500';
      if (priceValueLabel) priceValueLabel.textContent = '₹2,500';

      categoryChips.forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-category') === 'All');
      });

      applyFilters();
      showToast('Filters reset', 'info');
    });
  }

  // Filtering & Rendering Function
  function applyFilters() {
    const allProviders = LocalConnectStore.getProviders();

    let filtered = allProviders.filter(provider => {
      // Category check
      if (currentFilters.category !== 'All') {
        if (provider.category.toLowerCase() !== currentFilters.category.toLowerCase()) {
          return false;
        }
      }

      // Query check (name, tagline, category, services offered)
      if (currentFilters.query) {
        const q = currentFilters.query.toLowerCase();
        const inName = provider.name.toLowerCase().includes(q);
        const inTagline = provider.tagline.toLowerCase().includes(q);
        const inCat = provider.category.toLowerCase().includes(q);
        const inServices = provider.servicesOffered && provider.servicesOffered.some(s => s.name.toLowerCase().includes(q));

        if (!inName && !inTagline && !inCat && !inServices) {
          return false;
        }
      }

      // Min Rating check
      if (currentFilters.minRating > 0 && provider.rating < currentFilters.minRating) {
        return false;
      }

      // Max Price check
      if (provider.startingPrice > currentFilters.maxPrice) {
        return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (currentFilters.sort) {
        case 'rating_desc':
          return b.rating - a.rating;
        case 'price_asc':
          return a.startingPrice - b.startingPrice;
        case 'price_desc':
          return b.startingPrice - a.startingPrice;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Update results counter
    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} verified ${filtered.length === 1 ? 'professional' : 'professionals'}`;
    }

    // Render cards
    if (providersGrid) {
      if (filtered.length === 0) {
        providersGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background-color: var(--color-surface); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
            <h3 style="margin-bottom: 0.5rem;">No service providers match your criteria</h3>
            <p style="color: var(--color-text-secondary); max-width: 420px; margin: 0 auto 1.5rem auto;">
              Try widening your price range, selecting "All" categories, or clearing search keywords.
            </p>
            <button type="button" class="btn btn-accent btn-sm" onclick="document.getElementById('services-clear-filters').click();">
              Reset All Filters
            </button>
          </div>
        `;
      } else {
        providersGrid.innerHTML = filtered.map(p => createProviderCardHtml(p)).join('');
      }
    }
  }

  // Initial render
  applyFilters();
}
