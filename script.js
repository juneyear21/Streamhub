const apiKey = "557c35bbbe97da53f3bdfa06f11ff7de";
const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NTdjMzViYmJlOTdkYTUzZjNiZGZhMDZmMTFmZjdkZSIsInN1YiI6IjY1ZDVmYzYyZmZkNDRkMDE4NzJiMzA4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TjyOjpsyuqPvvw97Gk7QyCkmf3x_G8esHJ7IU26ge9M";

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


function createMovieCard(movie) {
  return `
    <div class="movie-card">
      <img class="movie-image" src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}" alt="${movie.original_title}">
      <div class="movie-details">
        <div class="movie-title">${movie.original_title}</div>
        <div class="movie-rating">Rating: ${movie.vote_average}</div>
      </div>
      <button class="watch-now-btn" onclick="watchMovie('${movie.id}')">Watch Now</button>
    </div>
  `;
}

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

