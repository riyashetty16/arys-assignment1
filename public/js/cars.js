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
    
    carsGrid.innerHTML = cars.map(car => `
      <div class="car-card">
        <div class="car-image">${car.name}</div>
        <div class="car-info">
          <h2>${car.name}</h2>
          <p>${car.description || 'Premium electric vehicle'}</p>
          <div class="car-price">${formatPrice(car.base_price)}</div>
          <a href="/customize" class="btn btn-primary">Customize</a>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading cars:', error);
    document.getElementById('carsGrid').innerHTML = 
      '<p>Error loading cars. Please try again later.</p>';
  }
}

