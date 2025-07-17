// Services Page Specific JavaScript
let servicesProperties = [];
let servicesFilteredProperties = [];
let servicesCurrentView = 'grid';
let servicesSelectedCity = 'all';

// Initialize Services Page
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('services.html')) {
        initializeServicesPage();
    }
});

function initializeServicesPage() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
    });

    checkAuthStatus();
    loadServicesProperties();
    setupServicesEventListeners();
    setMinDate();
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('servicesCheckin');
    const checkoutInput = document.getElementById('servicesCheckout');

    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;

    if (checkinInput) {
        checkinInput.addEventListener('change', function () {
            if (checkoutInput) {
                checkoutInput.min = this.value;
                if (checkoutInput.value && checkoutInput.value <= this.value) {
                    checkoutInput.value = '';
                }
            }
        });
    }
}

function loadServicesProperties() {
    // Use the same sample data as the main page
    servicesProperties = sampleProperties;
    servicesFilteredProperties = [...servicesProperties];
    displayServicesProperties();
}

function selectCity(city) {
    servicesSelectedCity = city;

    // Update button states
    const buttons = document.querySelectorAll('[onclick^="selectCity"]');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter properties by city
    if (city === 'all') {
        servicesFilteredProperties = [...servicesProperties];
    } else {
        servicesFilteredProperties = servicesProperties.filter(
            p => p.city === city
        );
    }

    // Update city filter dropdown
    const citySelect = document.getElementById('servicesCityFilter');
    if (citySelect) {
        citySelect.value = city === 'all' ? '' : city;
    }

    displayServicesProperties();
}

function searchServicesProperties() {
    const city = document.getElementById('servicesCityFilter').value;
    const type = document.getElementById('servicesTypeFilter').value;
    const checkin = document.getElementById('servicesCheckin').value;
    const checkout = document.getElementById('servicesCheckout').value;
    const guests = document.getElementById('servicesGuests').value;
    const priceRange = document.getElementById('servicesPriceRange').value;

    let filtered = servicesProperties;

    // Filter by city
    if (city) {
        filtered = filtered.filter(p => p.city === city);
        servicesSelectedCity = city;
        updateCityButtons(city);
    }

    // Filter by type
    if (type) {
        filtered = filtered.filter(p => p.type === type);
    }

    // Filter by guests
    if (guests) {
        filtered = filtered.filter(p => p.max_guests >= parseInt(guests));
    }

    // Filter by price range
    if (priceRange) {
        const [min, max] = priceRange.includes('+')
            ? [parseInt(priceRange.replace('+', '')), Infinity]
            : priceRange.split('-').map(p => parseInt(p));
        filtered = filtered.filter(
            p => p.price >= min && (max === Infinity || p.price <= max)
        );
    }

    // Validate dates
    if (checkin && checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);

        if (checkoutDate <= checkinDate) {
            alert('Check-out date must be after check-in date');
            return;
        }
    }

    servicesFilteredProperties = filtered;
    displayServicesProperties();

    // Scroll to results
    document.getElementById('servicesPropertiesContainer').scrollIntoView({
        behavior: 'smooth',
    });
}

function updateCityButtons(selectedCity) {
    const buttons = document.querySelectorAll('[onclick^="selectCity"]');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const cityValue = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (cityValue === selectedCity) {
            btn.classList.add('active');
        }
    });
}

function displayServicesProperties() {
    const container = document.getElementById('servicesPropertiesContainer');
    if (!container) return;

    if (servicesFilteredProperties.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search text-muted display-1"></i>
                <h4 class="text-muted mt-3">No properties found</h4>
                <p class="text-muted">Try adjusting your search criteria</p>
                <button class="btn btn-primary" onclick="clearServicesFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    const isListView = servicesCurrentView === 'list';

    container.innerHTML = servicesFilteredProperties
        .map(
            property => `
        <div class="${
            servicesCurrentView === 'list' ? 'col-12' : 'col-lg-4 col-md-6'
        } mb-4" data-aos="fade-up">
            <div class="card property-card h-100 ${
                isListView ? 'list-view-card' : ''
            }">
                <div class="position-relative">
                    <img src="${
                        property.pictures[0]
                    }" class="card-img-top" alt="${
                property.title
            }" style="height: 250px; object-fit: cover;">
                    <div class="property-rating">
                        <i class="fas fa-star text-warning"></i>
                        ${property.rating}
                    </div>
                    <div class="property-type-badge">
                        <span class="badge bg-primary">${property.type}</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${property.title}</h5>
                    <p class="card-text text-muted">
                        <i class="fas fa-map-marker-alt me-2"></i>${
                            property.location
                        }
                    </p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="property-price">PKR ${property.price.toLocaleString()}/night</span>
                        <span class="text-muted small">${
                            property.city.charAt(0).toUpperCase() +
                            property.city.slice(1)
                        }</span>
                    </div>
                    <div class="property-amenities mb-3">
                        <small class="text-muted">
                            <i class="fas fa-users me-1"></i>${
                                property.max_guests
                            } guests
                            <i class="fas fa-bed ms-2 me-1"></i>${
                                property.bedrooms
                            } beds
                            <i class="fas fa-bath ms-2 me-1"></i>${
                                property.bathrooms
                            } baths
                        </small>
                    </div>
                    <div class="amenities-preview mb-3">
                        ${property.amenities
                            .slice(0, 3)
                            .map(
                                amenity => `
                            <span class="badge bg-light text-dark me-1">${amenity}</span>
                        `
                            )
                            .join('')}
                        ${
                            property.amenities.length > 3
                                ? `<span class="text-muted small">+${
                                      property.amenities.length - 3
                                  } more</span>`
                                : ''
                        }
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary flex-fill" onclick="viewServicesProperty(${
                            property.id
                        })">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-primary flex-fill" onclick="bookProperty(${
                            property.id
                        })">
                            <i class="fas fa-calendar-check me-1"></i>Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
        )
        .join('');

    // Apply list view styling if needed
    if (isListView) {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }
}

function viewServicesProperty(propertyId) {
    const property = servicesProperties.find(p => p.id === propertyId);
    if (!property) return;

    const modalContent = document.getElementById('servicesModalContent');
    modalContent.innerHTML = `
        <div class="property-gallery mb-4">
            <div class="row g-2">
                ${property.pictures
                    .map(
                        (pic, index) => `
                    <div class="col-md-4">
                        <img src="${pic}" alt="${property.title}" class="img-fluid rounded" style="height: 200px; width: 100%; object-fit: cover; cursor: pointer;" onclick="openImageModal('${pic}')">
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                <h3>${property.title}</h3>
                <p class="text-muted mb-3">
                    <i class="fas fa-map-marker-alt me-2"></i>${
                        property.location
                    }
                    <span class="badge bg-primary ms-2">${
                        property.city.charAt(0).toUpperCase() +
                        property.city.slice(1)
                    }</span>
                </p>
                
                <div class="property-info mb-4">
                    <div class="row g-3">
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-users text-primary fs-4"></i>
                                <h6 class="mt-2">Max Guests</h6>
                                <p class="mb-0">${property.max_guests}</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-bed text-primary fs-4"></i>
                                <h6 class="mt-2">Bedrooms</h6>
                                <p class="mb-0">${property.bedrooms}</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-bath text-primary fs-4"></i>
                                <h6 class="mt-2">Bathrooms</h6>
                                <p class="mb-0">${property.bathrooms}</p>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item text-center">
                                <i class="fas fa-star text-warning fs-4"></i>
                                <h6 class="mt-2">Rating</h6>
                                <p class="mb-0">${property.rating}/5</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h5>Description</h5>
                <p class="mb-4">${property.description}</p>

                <h5>Amenities</h5>
                <div class="amenities-grid mb-4">
                    <div class="row g-2">
                        ${property.amenities
                            .map(
                                amenity => `
                            <div class="col-auto">
                                <span class="badge bg-primary">${amenity}</span>
                            </div>
                        `
                            )
                            .join('')}
                    </div>
                </div>
            </div>
            
            <div class="col-md-12">
                <div class="card sticky-top">
                    <div class="card-body">
                        <h4 class="text-primary mb-3">PKR ${property.price.toLocaleString()}/night</h4>
                        
                        <div class="quick-booking-form">
                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <label class="form-label small">Check-in</label>
                                    <input type="date" class="form-control form-control-sm" id="modalCheckin">
                                </div>
                                <div class="col-6">
                                    <label class="form-label small">Check-out</label>
                                    <input type="date" class="form-control form-control-sm" id="modalCheckout">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small">Guests</label>
                                <select class="form-select form-select-sm" id="modalGuests">
                                    ${Array.from(
                                        { length: property.max_guests },
                                        (_, i) => `
                                        <option value="${i + 1}">${
                                            i + 1
                                        } Guest${i > 0 ? 's' : ''}</option>
                                    `
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <div class="broker-info mb-3">
                            <h6>Contact Broker</h6>
                            <p class="mb-1"><strong>${
                                property.broker_name
                            }</strong></p>
                            <p class="mb-1"><i class="fas fa-phone me-2"></i>${
                                property.broker_phone
                            }</p>
                            <p class="mb-0"><i class="fas fa-envelope me-2"></i>${
                                property.broker_email
                            }</p>
                        </div>
                        
                        <button class="btn btn-primary w-100 mb-2" onclick="bookPropertyFromModal(${
                            property.id
                        })">
                            <i class="fas fa-calendar-check me-2"></i>Book Now
                        </button>
                        <button class="btn btn-outline-primary w-100" onclick="contactBroker('${
                            property.broker_phone
                        }')">
                            <i class="fas fa-phone me-2"></i>Call Broker
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('modalCheckin');
    const checkoutInput = document.getElementById('modalCheckout');

    if (checkinInput) {
        checkinInput.min = today;
        checkinInput.addEventListener('change', function () {
            if (checkoutInput) {
                checkoutInput.min = this.value;
                if (checkoutInput.value && checkoutInput.value <= this.value) {
                    checkoutInput.value = '';
                }
            }
        });
    }

    const modal = new bootstrap.Modal(
        document.getElementById('servicesPropertyModal')
    );
    modal.show();
}

function bookPropertyFromModal(propertyId) {
    const checkin = document.getElementById('modalCheckin').value;
    const checkout = document.getElementById('modalCheckout').value;
    const guests = document.getElementById('modalGuests').value;

    if (checkin && checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);

        if (checkoutDate <= checkinDate) {
            alert('Check-out date must be after check-in date');
            return;
        }

        // Store additional booking data
        localStorage.setItem(
            'bookingDates',
            JSON.stringify({
                checkin: checkin,
                checkout: checkout,
                guests: guests,
            })
        );
    }

    // Close modal and proceed with booking
    const modal = bootstrap.Modal.getInstance(
        document.getElementById('servicesPropertyModal')
    );
    modal.hide();

    bookProperty(propertyId);
}

function contactBroker(phone) {
    window.open(`tel:${phone}`, '_self');
}

function toggleServicesView(view) {
    servicesCurrentView = view;
    const container = document.getElementById('servicesPropertiesContainer');
    const buttons = document.querySelectorAll(
        '[onclick^="toggleServicesView"]'
    );

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (view === 'list') {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }

    displayServicesProperties();
}

function sortServicesProperties() {
    const sortBy = document.getElementById('servicesSortBy').value;

    switch (sortBy) {
        case 'price_low':
            servicesFilteredProperties.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            servicesFilteredProperties.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            servicesFilteredProperties.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            servicesFilteredProperties.sort((a, b) => b.id - a.id);
            break;
    }

    displayServicesProperties();
}

function applyServicesFilters() {
    const city = document.getElementById('servicesFilterCity').value;
    const type = document.getElementById('servicesFilterType').value;
    const minPrice =
        parseFloat(document.getElementById('servicesMinPrice').value) || 0;
    const maxPrice =
        parseFloat(document.getElementById('servicesMaxPrice').value) ||
        Infinity;
    const rating =
        parseFloat(document.getElementById('servicesFilterRating').value) || 0;

    // Get selected amenities
    const selectedAmenities = [];
    const amenityCheckboxes = document.querySelectorAll(
        '#servicesFilterOffcanvas input[type="checkbox"]:checked'
    );
    amenityCheckboxes.forEach(checkbox => {
        selectedAmenities.push(checkbox.value);
    });

    servicesFilteredProperties = servicesProperties.filter(property => {
        const cityMatch = !city || property.city === city;
        const typeMatch = !type || property.type === type;
        const priceMatch =
            property.price >= minPrice && property.price <= maxPrice;
        const ratingMatch = property.rating >= rating;
        const amenitiesMatch =
            selectedAmenities.length === 0 ||
            selectedAmenities.every(amenity =>
                property.amenities.includes(amenity)
            );

        return (
            cityMatch &&
            typeMatch &&
            priceMatch &&
            ratingMatch &&
            amenitiesMatch
        );
    });

    displayServicesProperties();

    // Close offcanvas
    const offcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById('servicesFilterOffcanvas')
    );
    offcanvas?.hide();

    // Update city selection if filtered by city
    if (city) {
        servicesSelectedCity = city;
        updateCityButtons(city);
    }
}

function clearServicesFilters() {
    // Clear all filter inputs
    document.getElementById('servicesFilterCity').value = '';
    document.getElementById('servicesFilterType').value = '';
    document.getElementById('servicesMinPrice').value = '';
    document.getElementById('servicesMaxPrice').value = '';
    document.getElementById('servicesFilterRating').value = '';

    // Clear search form
    document.getElementById('servicesCityFilter').value = '';
    document.getElementById('servicesTypeFilter').value = '';
    document.getElementById('servicesCheckin').value = '';
    document.getElementById('servicesCheckout').value = '';
    document.getElementById('servicesGuests').value = '1';
    document.getElementById('servicesPriceRange').value = '';

    // Clear amenity checkboxes
    const amenityCheckboxes = document.querySelectorAll(
        '#servicesFilterOffcanvas input[type="checkbox"]'
    );
    amenityCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset to all properties
    servicesFilteredProperties = [...servicesProperties];
    servicesSelectedCity = 'all';

    // Update city buttons
    const buttons = document.querySelectorAll('[onclick^="selectCity"]');
    buttons.forEach(btn => btn.classList.remove('active'));
    buttons[0].classList.add('active'); // First button is "All Cities"

    displayServicesProperties();

    // Close offcanvas if open
    const offcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById('servicesFilterOffcanvas')
    );
    offcanvas?.hide();
}

function setupServicesEventListeners() {
    // Sort change event
    const sortBy = document.getElementById('servicesSortBy');
    if (sortBy) {
        sortBy.addEventListener('change', sortServicesProperties);
    }

    // City filter change event
    const cityFilter = document.getElementById('servicesCityFilter');
    if (cityFilter) {
        cityFilter.addEventListener('change', function () {
            const selectedCity = this.value || 'all';
            servicesSelectedCity = selectedCity;
            updateCityButtons(selectedCity);
        });
    }
}

// Image modal function
function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Property Image</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${imageSrc}" class="img-fluid" alt="Property Image">
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
    });
}
