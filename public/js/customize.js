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
  const options = customizeOptions[optionType] || [];
  
  container.innerHTML = options.map((option, index) => `
    <div class="option-item ${index === 0 ? 'selected' : ''}" data-option-type="${optionType}" data-option-name="${option.name}" data-option-price="${option.price}">
      <input type="radio" name="${optionType}" value="${option.name}" ${index === 0 ? 'checked' : ''}>
      <span class="option-name">${option.name}</span>
      <span class="option-price">${formatPrice(option.price)}</span>
    </div>
  `).join('');
  
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
      
      updatePreview();
    });
  });
}

function updatePreview() {
  // Update preview image color based on selected color
  const previewImage = document.getElementById('previewImage');
  const colorMap = {
    'Pearl White Multi-Coat': '#ffffff',
    'Solid Black': '#000000',
    'Midnight Silver Metallic': '#5f6368',
    'Deep Blue Metallic': '#1e3a8a',
    'Red Multi-Coat': '#dc2626'
  };
  
  const selectedColor = selectedOptions.color.name;
  const colorHex = colorMap[selectedColor] || '#667eea';
  previewImage.style.background = `linear-gradient(135deg, ${colorHex} 0%, ${colorHex}dd 100%)`;
  
  // Update prices
  document.getElementById('basePrice').textContent = formatPrice(basePrice);
  document.getElementById('batteryPrice').textContent = formatPrice(selectedOptions.battery.price);
  document.getElementById('colorPrice').textContent = formatPrice(selectedOptions.color.price);
  document.getElementById('wheelsPrice').textContent = formatPrice(selectedOptions.wheels.price);
  document.getElementById('interiorPrice').textContent = formatPrice(selectedOptions.interior.price);
  
  // Calculate and update total
  const total = basePrice + 
    selectedOptions.battery.price + 
    selectedOptions.color.price + 
    selectedOptions.wheels.price + 
    selectedOptions.interior.price;
  
  document.getElementById('totalPrice').textContent = formatPrice(total);
}

