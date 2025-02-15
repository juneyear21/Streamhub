const apiKey = "557c35bbbe97da53f3bdfa06f11ff7de";
const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTdjMzViYmJlOTdkYTUzZjNiZGZhMDZmMTFmZjdkZSIsInN1YiI6IjY1ZDVmYzYyZmZkNDRkMDE4NzJiMzA4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TjyOjpsyuqPvvw97Gk7QyCkmf3x_G8esHJ7IU26ge9M";

// Add these functions at the beginning of your script.js

async function initializeHeroSection() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();
    const heroSlider = document.getElementById('heroSlider');
    const heroDots = document.getElementById('heroDots');
    
    // Clear existing content
    heroSlider.innerHTML = '';
    heroDots.innerHTML = '';
    
    data.results.slice(0, 5).forEach((movie, index) => {
      const slide = document.createElement('div');
      slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
      slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
      
      slide.innerHTML = `
        <div class="hero-info">
          <h1>${movie.title}</h1>
          <p>${movie.overview}</p>
        </div>
      `;
      
      heroSlider.appendChild(slide);
      
      const dot = document.createElement('div');
      dot.className = `hero-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => showSlide(index));
      heroDots.appendChild(dot);
    });
    
    // Start auto-sliding
    let currentSlide = 0;
    setInterval(() => {
      currentSlide = (currentSlide + 1) % 5;
      showSlide(currentSlide);
    }, 5000);
  } catch (error) {
    console.error('Error fetching hero content:', error);
  }
}

function showSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

async function loadTrailers(type = 'popular') {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();
    const container = document.getElementById('trailersContainer');
    
    container.innerHTML = '';
    
    for (const movie of data.results.slice(0, 6)) {
      // Fetch trailer for each movie
      const videoResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`
      );
      const videoData = await videoResponse.json();
      const trailer = videoData.results.find(video => video.type === 'Trailer');
      
      if (trailer) {
        container.innerHTML += `
          <div class="trailer-card" data-trailer-id="${trailer.key}">
            <img class="trailer-thumbnail" 
                 src="https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg" 
                 alt="${movie.title}">
            <div class="play-button">
              <i class="fas fa-play"></i>
            </div>
          </div>
        `;
      }
    }
    
    // Add click handlers for trailers
    document.querySelectorAll('.trailer-card').forEach(card => {
      card.addEventListener('click', () => {
        const trailerId = card.dataset.trailerId;
        // Open YouTube video in a modal or new window
        window.open(`https://www.youtube.com/watch?v=${trailerId}`, '_blank');
      });
    });
  } catch (error) {
    console.error('Error loading trailers:', error);
  }
}

// Add this function to load Now Playing Movies
async function loadNowPlayingMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
    );
    const data = await response.json();
    const container = document.getElementById('nowPlayingContainer');
    
    if (!container) {
      console.error('Container not found');
      return;
    }

    container.innerHTML = data.results.slice(0, 10).map(movie => `
      <div class="movie-card" onclick="showMovieDetails(${movie.id})">
        <img class="movie-image" 
             src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
             alt="${movie.title}">
        <div class="movie-details">
          <h3 class="movie-title">${movie.title}</h3>
          <span class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
    `).join('');

    // Initialize slider for Now Playing section
    initializeSlider('nowPlayingContainer');
  } catch (error) {
    console.error('Error loading now playing movies:', error);
  }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeHeroSection();
  loadNowPlayingMovies(); // Add this line
  
  // Add tab button handlers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadTrailers(btn.dataset.type);
    });
  });

  // Handle category clicks
  document.querySelectorAll('.dropdown-item, .subcategory-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.getAttribute('href').replace('#', '');
      loadCategoryContent(category);
    });
  });
});

function searchMovie() {
  const searchQuery = document.querySelector("#searchInput").value;
  
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTdjMzViYmJlOTdkYTUzZjNiZGZhMDZmMTFmZjdkZSIsInN1YiI6IjY1ZDVmYzYyZmZkNDRkMDE4NzJiMzA4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TjyOjpsyuqPvvw97Gk7QyCkmf3x_G8esHJ7IU26ge9M'
  }
};

  fetch(
    `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(searchQuery)}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((error) => console.error("Error:", error));
}


const searchButton = document.querySelector("#searchbutton");

searchButton.addEventListener('click',(event) => {
  event.preventDefault(); // Prevent default form submission behavior
  searchMovie();
  console.log("movie search");
});


// Update the showMovieDetails function
function showMovieDetails(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
    .then(response => response.json())
    .then(movie => {
      // Try to get video sources
      return Promise.all([
        movie,
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`).then(r => r.json())
      ]);
    })
    .then(([movie, videos]) => {
      const overlay = document.getElementById('movieDetailOverlay');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';

      // Simplified player implementation
      overlay.innerHTML = `
        <div class="detail-container">
          <button class="close-detail">&times;</button>
          <div class="detail-content">
            <div class="detail-left">
              <div id="moviePlayer">
                <iframe 
                  id="detailMovieFrame"
                  src="https://vidsrc.xyz/embed/movie/${movieId}"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <div class="detail-right">
              <h2>${movie.title}</h2>
              <div class="movie-meta">
                <span>${movie.release_date.split('-')[0]}</span>
                <span>${movie.vote_average.toFixed(1)}/10</span>
                <span>${movie.runtime} min</span>
              </div>
              <div class="genre-tags">
                ${movie.genres.map(genre => `
                  <span class="genre-tag">${genre.name}</span>
                `).join('')}
              </div>
              <p>${movie.overview}</p>
            </div>
          </div>
          <div class="recommended-section">
            <h3>Recommended Movies</h3>
            <div id="recommendedMovies" class="recommended-container"></div>
          </div>
        </div>
      `;

      // Add close functionality
      document.querySelector('.close-detail').addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
      });

      // Load recommended movies
      loadRecommendedMovies(movieId);
    });
}

// Add these new helper functions
function handlePlayerError(movieId) {
  const errorDiv = document.getElementById('player-error');
  if (errorDiv) {
    errorDiv.style.display = 'block';
  }
}

function tryAlternativeSource(movieId) {
  const iframe = document.getElementById('detailMovieFrame');
  const currentSrc = iframe.src;
  
  if (currentSrc.includes('youtube')) {
    iframe.src = `https://vidsrc.to/embed/movie/${movieId}`;
  } else if (currentSrc.includes('vidsrc.to')) {
    // Try another source or show error
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`)
      .then(r => r.json())
      .then(videos => {
        const trailer = videos.results.find(v => v.type === "Trailer");
        if (trailer) {
          iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
        } else {
          handlePlayerError(movieId);
        }
      });
  }
}

function closeMovieDetail() {
  const overlay = document.getElementById('movieDetailOverlay');
  const iframe = document.getElementById('detailMovieFrame');
  if (iframe) iframe.src = '';
  overlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function loadRecommendedMovies(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('recommendedMovies');
      container.innerHTML = data.results
        .slice(0, 6)
        .map(movie => createMovieCard(movie, true))
        .join('');
    });
}

// Modify your existing createMovieCard function to handle clicks
function createMovieCard(movie, isRecommended = false) {
  const cardClass = isRecommended ? 'movie-card recommended' : 'movie-card';
  return `
    <div class="${cardClass}" onclick="showMovieDetails(${movie.id})">
      <img class="movie-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <div class="movie-details">
        <h3 class="movie-title">${movie.title}</h3>
        <span class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}</span>
      </div>
    </div>
  `;
}

// Add close functionality
document.querySelector('.close-detail').addEventListener('click', () => {
  document.getElementById('movieDetailOverlay').style.display = 'none';
  document.getElementById('detailMovieFrame').src = '';
  document.body.style.overflow = 'auto';
});

function displayMovies(movies) {
  const seriesFrame = document.getElementById("movieFrame");
  seriesFrame.src = "";
  const moviesContainer = document.getElementById("moviesContainer");
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesContainer.innerHTML += card;
  });
}

function watchMovie(movieId) {
  const moviesContainer = document.getElementById("moviesContainer1");
  moviesContainer.innerHTML = "";
  const movieViewer = document.getElementById("movieViewer");
  movieViewer.style.display = "block";
  const movieFrame = document.getElementById("movieFrame");
  movieFrame.src = `https://vidsrc.to/embed/movie/${movieId}`;
}

let page = 1;

const next = document.getElementById('next');
next.addEventListener('click', () => {
  page++;
  fetchData();
});

const back = document.getElementById('back');
back.addEventListener('click', () => {
  if (page > 1) {
    page -= 1;
    fetchData();
  }
});


function fetchData() {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTdjMzViYmJlOTdkYTUzZjNiZGZhMDZmMTFmZjdkZSIsInN1YiI6IjY1ZDVmYzYyZmZkNDRkMDE4NzJiMzA4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TjyOjpsyuqPvvw97Gk7QyCkmf3x_G8esHJ7IU26ge9M'
        }
      };
      
      fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, options)
        .then(response => response.json())
        .then(data => {
            const results = data.results;
            nowPlaying(results);
            console.log(data.page)
          })
        .catch(err => console.error(err));
}

function nowPlaying(movies) {
  const seriesFrame = document.getElementById("movieFrame");
  seriesFrame.src = "";
  const moviesContainer = document.getElementById("moviesContainer");
  moviesContainer.innerHTML = "";
  
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesContainer.innerHTML += card;
    console.log(movie.original_title)
  });
}

fetchData();

async function loadContent(type, category, containerId) {
  try {
    const url = `https://api.themoviedb.org/3/${category}/${type}?api_key=${apiKey}&language=en-US&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.results) throw new Error('No results found');
    
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    data.results.slice(0, 10).forEach(item => {
      if (category === 'tv') {
        item.title = item.name;
        item.release_date = item.first_air_date;
      }
      
      container.innerHTML += `
        <div class="movie-card" onclick="showMovieDetails('${item.id}')">
          <img class="movie-image" 
               src="https://image.tmdb.org/t/p/w500${item.poster_path}" 
               alt="${item.title}">
          <div class="movie-details">
            <h3 class="movie-title">${item.title}</h3>
            <span class="movie-rating">⭐ ${item.vote_average.toFixed(1)}</span>
          </div>
        </div>
      `;
    });
    
    // Initialize slider navigation
    initializeSlider(containerId);
  } catch (error) {
    console.error(`Error loading content: ${error}`);
  }
}

function initializeSlider(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const section = container.closest('.movie-section');
  const prevBtn = section.querySelector('.nav-btn.prev');
  const nextBtn = section.querySelector('.nav-btn.next');
  
  const scrollAmount = 1200; // Width of 4 movie cards + gaps

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });
    
    nextBtn.addEventListener('click', () => {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    // Update button states on scroll
    container.addEventListener('scroll', () => {
      prevBtn.disabled = container.scrollLeft <= 0;
      nextBtn.disabled = 
        (container.scrollLeft + container.clientWidth) >= container.scrollWidth;
    });

    // Initial button states
    prevBtn.disabled = true;
  }
}

// Initialize all sections
document.addEventListener('DOMContentLoaded', () => {
  // Initialize hero section
  initializeHeroSection();
  
  // Initialize all tab buttons
  document.querySelectorAll('.tab-buttons').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const containerId = tabGroup.closest('.movie-section').querySelector('.movies-container, .trailers-container').id;
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        loadContent(button.dataset.type, button.dataset.category, containerId);
      });
    });
    
    // Load initial content for each section
    const activeButton = tabGroup.querySelector('.tab-btn.active');
    loadContent(activeButton.dataset.type, activeButton.dataset.category, containerId);
  });
});

async function loadCategoryContent(category) {
  try {
    let apiUrl;
    switch(category) {
      case 'anime':
        apiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=16`;
        break;
      case 'netflix':
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8&watch_region=US`;
        break;
      case 'prime':
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=9&watch_region=US`;
        break;
      case 'trending':
        apiUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
        break;
      default:
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error loading category content:', error);
  }
}

