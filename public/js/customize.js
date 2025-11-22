// Customize page functionality
let basePrice = 40240;
let selectedOptions = {
  battery: { name: 'Standard Range', price: 0 },
  color: { name: 'Pearl White Multi-Coat', price: 0 },
  wheels: { name: '18" Aero Wheels', price: 0 },
  interior: { name: 'Black', price: 0 }
};

let customizeOptions = {};

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const response = await fetch('/api/user');
  if (!response.ok) {
    window.location.href = '/login';
    return;
  }
  
  await loadCustomizeOptions();
  renderOptions();
  updatePreview();
});

async function loadCustomizeOptions() {
  try {
    const response = await fetch('/api/customize/options');
    if (!response.ok) {
      throw new Error('Failed to load options');
    }
    customizeOptions = await response.json();
    
    // Initialize selected options from first option in each group
    if (customizeOptions.battery && customizeOptions.battery.length > 0) {
      selectedOptions.battery = {
        name: customizeOptions.battery[0].name,
        price: customizeOptions.battery[0].price
      };
    }
    if (customizeOptions.color && customizeOptions.color.length > 0) {
      selectedOptions.color = {
        name: customizeOptions.color[0].name,
        price: customizeOptions.color[0].price
      };
    }
    if (customizeOptions.wheels && customizeOptions.wheels.length > 0) {
      selectedOptions.wheels = {
        name: customizeOptions.wheels[0].name,
        price: customizeOptions.wheels[0].price
      };
    }
    if (customizeOptions.interior && customizeOptions.interior.length > 0) {
      selectedOptions.interior = {
        name: customizeOptions.interior[0].name,
        price: customizeOptions.interior[0].price
      };
    }
  } catch (error) {
    console.error('Error loading options:', error);
  }
}

function renderOptions() {
  renderOptionGroup('battery', 'batteryOptions');
  renderOptionGroup('color', 'colorOptions');
  renderOptionGroup('wheels', 'wheelsOptions');
  renderOptionGroup('interior', 'interiorOptions');
}

function renderOptionGroup(optionType, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const options = customizeOptions[optionType] || [];
  
  container.innerHTML = options.map((option, index) => {
    const isSelected = selectedOptions[optionType].name === option.name;
    return `
      <div class="option-item ${isSelected ? 'selected' : ''}" 
           data-option-type="${optionType}" 
           data-option-name="${option.name}" 
           data-option-price="${option.price}">
        <input type="radio" 
               name="${optionType}" 
               value="${option.name}" 
               ${isSelected ? 'checked' : ''}>
        <span class="option-name">${option.name}</span>
        <span class="option-price">${formatPrice(option.price)}</span>
      </div>
    `;
  }).join('');
  
  // Add event listeners
  container.querySelectorAll('.option-item').forEach(item => {
    item.addEventListener('click', function() {
      // Update radio button
      this.querySelector('input[type="radio"]').checked = true;
      
      // Update selected state
      container.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      
      // Update selected option
      selectedOptions[optionType] = {
        name: this.dataset.optionName,
        price: parseInt(this.dataset.optionPrice)
      };
      
      // Update preview immediately
      updatePreview();
    });
    
    // Also listen to radio button changes
    const radio = item.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', function() {
        if (this.checked) {
          item.click();
        }
      });
    }
  });
}

function updatePreview() {
  // Update preview image color based on selected color
  const previewImage = document.getElementById('previewImage');
  if (!previewImage) return;
  
  const colorMap = {
    'Pearl White Multi-Coat': '#ffffff',
    'Solid Black': '#171a20',
    'Midnight Silver Metallic': '#5f6368',
    'Deep Blue Metallic': '#1e3a8a',
    'Red Multi-Coat': '#dc2626'
  };
  
  const selectedColor = selectedOptions.color.name;
  const colorHex = colorMap[selectedColor] || '#ffffff';
  
  // Update background color with smooth transition
  previewImage.style.transition = 'background 0.3s ease';
  previewImage.style.background = `linear-gradient(135deg, ${colorHex} 0%, ${colorHex}dd 100%)`;
  
  // Update text color for better contrast
  const textElement = previewImage.querySelector('div') || previewImage;
  if (colorHex === '#ffffff' || colorHex === '#1e3a8a') {
    textElement.style.color = '#171a20';
  } else {
    textElement.style.color = '#ffffff';
  }
  
  // Update prices dynamically
  const basePriceEl = document.getElementById('basePrice');
  const batteryPriceEl = document.getElementById('batteryPrice');
  const colorPriceEl = document.getElementById('colorPrice');
  const wheelsPriceEl = document.getElementById('wheelsPrice');
  const interiorPriceEl = document.getElementById('interiorPrice');
  const totalPriceEl = document.getElementById('totalPrice');
  
  if (basePriceEl) basePriceEl.textContent = formatPrice(basePrice);
  if (batteryPriceEl) batteryPriceEl.textContent = formatPrice(selectedOptions.battery.price);
  if (colorPriceEl) colorPriceEl.textContent = formatPrice(selectedOptions.color.price);
  if (wheelsPriceEl) wheelsPriceEl.textContent = formatPrice(selectedOptions.wheels.price);
  if (interiorPriceEl) interiorPriceEl.textContent = formatPrice(selectedOptions.interior.price);
  
  // Calculate and update total
  const total = basePrice + 
    selectedOptions.battery.price + 
    selectedOptions.color.price + 
    selectedOptions.wheels.price + 
    selectedOptions.interior.price;
  
  if (totalPriceEl) {
    totalPriceEl.textContent = formatPrice(total);
    // Add animation to total price when it changes
    totalPriceEl.style.transition = 'transform 0.2s ease';
    totalPriceEl.style.transform = 'scale(1.05)';
    setTimeout(() => {
      totalPriceEl.style.transform = 'scale(1)';
    }, 200);
  }
}
