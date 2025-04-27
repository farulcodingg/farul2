// script.js untuk AnimeTroll Midori Style

const animeGrid = document.getElementById('anime-grid');
const searchBar = document.getElementById('search-bar');
const genreFilter = document.getElementById('genre-filter');
const seasonFilter = document.getElementById('season-filter');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let animeData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 6;

// Fetch data dari anime.json
async function fetchAnime() {
  try {
    const res = await fetch('anime.json');
    animeData = await res.json();
    filteredData = animeData;
    populateFilters();
    renderAnime();
  } catch (error) {
    console.error('Gagal memuat data anime:', error);
  }
}

// Mengisi opsi Genre dan Season dari data
function populateFilters() {
  const genres = new Set();
  const seasons = new Set();

  animeData.forEach(anime => {
    anime.genre.split(',').forEach(g => genres.add(g.trim()));
    seasons.add(anime.season);
  });

  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });

  seasons.forEach(season => {
    const option = document.createElement('option');
    option.value = season;
    option.textContent = season;
    seasonFilter.appendChild(option);
  });
}

// Menampilkan anime ke grid
function renderAnime() {
  animeGrid.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredData.slice(start, end);

  pageItems.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${anime.img}" alt="${anime.title}">
      <p>${anime.title}</p>
    `;
    animeGrid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), 100);
  });

  pageInfo.textContent = `Page ${currentPage}`;

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = end >= filteredData.length;
}

// Menerapkan search dan filter
function applyFilters() {
  const searchKeyword = searchBar.value.toLowerCase();
  const selectedGenre = genreFilter.value;
  const selectedSeason = seasonFilter.value;

  filteredData = animeData.filter(anime => {
    const matchesTitle = anime.title.toLowerCase().includes(searchKeyword);
    const matchesGenre = selectedGenre ? anime.genre.includes(selectedGenre) : true;
    const matchesSeason = selectedSeason ? anime.season === selectedSeason : true;
    return matchesTitle && matchesGenre && matchesSeason;
  });

  currentPage = 1;
  renderAnime();
  scrollToTop();
}

// Scroll halus ke atas
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Event listeners
searchBar.addEventListener('input', applyFilters);
genreFilter.addEventListener('change', applyFilters);
seasonFilter.addEventListener('change', applyFilters);

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderAnime();
    scrollToTop();
  }
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage * itemsPerPage < filteredData.length) {
    currentPage++;
    renderAnime();
    scrollToTop();
  }
});



// Mulai Fetch Data
fetchAnime();