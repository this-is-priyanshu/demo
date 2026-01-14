const sponsors = [
  { id: 1, name: 'Sponsor One' },
  { id: 2, name: 'Sponsor Two' },
  { id: 3, name: 'Sponsor Three' },
  { id: 4, name: 'Sponsor Four' },
  { id: 5, name: 'Sponsor Five' },
  { id: 6, name: 'Sponsor Six' },
  { id: 7, name: 'Sponsor Seven' },
  { id: 8, name: 'Sponsor Eight' }
];

let currentIndex = 0;

function initCarousel() {
  const carouselContent = document.getElementById('carouselContent');
  
  sponsors.forEach((sponsor, index) => {
    const item = document.createElement('div');
    item.className = 'sponsor-item';
    item.innerHTML = `
      <div class="sponsor-logo">🏢</div>
      <div class="sponsor-title">${sponsor.name}</div>
    `;
    item.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
    carouselContent.appendChild(item);
  });

  updateCarousel();

  document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + sponsors.length) % sponsors.length;
    updateCarousel();
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % sponsors.length;
    updateCarousel();
  });
}

function updateCarousel() {
  const items = document.querySelectorAll('.sponsor-item');
  items.forEach((item, index) => {
    item.classList.remove('center', 'side');
    
    if (index === currentIndex) {
      item.classList.add('center');
    } else if (index === (currentIndex - 1 + sponsors.length) % sponsors.length || 
               index === (currentIndex + 1) % sponsors.length) {
      item.classList.add('side');
    }
  });
}

window.addEventListener('load', initCarousel);
