// Load and display cars
document.addEventListener('DOMContentLoaded', async () => {
  await loadCars();
});

async function loadCars() {
  try {
    const response = await fetch('/api/cars');
    if (!response.ok) {
      throw new Error('Failed to load cars');
    }
    
    
    const cars = await response.json();
    const carsGrid = document.getElementById('carsGrid');
    
    if (cars.length === 0) {
      carsGrid.innerHTML = '<p>No cars available at the moment.</p>';
      return;
    }
    
    // Tesla official images for each model
    const teslaImages = {
      'Model S': 'https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg',
      'Model 3': 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto:best/Model-3-Main-Hero-Desktop-LHD',
      'Model X': 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto:best/Model-X-Main-Hero-Desktop-LHD',
      'Model Y': 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto:best/Model-S-Main-Hero-Desktop-LHD'
    };
    
    carsGrid.innerHTML = cars.map(car => {
      // Add image for each model
      const imageUrl = teslaImages[car.name];
      const imageStyle = imageUrl ? `style="background-image: url('${imageUrl}'); background: url('${imageUrl}') center/cover no-repeat !important;"` : '';
      const displayText = imageUrl ? '' : car.name;
      
      return `
        <div class="car-card">
          <div class="car-image" ${imageStyle}>${displayText}</div>
          <div class="car-info">
            <h2>${car.name}</h2>
            <p>${car.description || 'Premium electric vehicle'}</p>
            <div class="car-price">${formatPrice(car.base_price)}</div>
            <a href="/customize" class="btn btn-primary">Customize</a>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading cars:', error);
    document.getElementById('carsGrid').innerHTML = 
      '<p>Error loading cars. Please try again later.</p>';
  }
}

