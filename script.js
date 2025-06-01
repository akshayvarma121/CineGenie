const API_KEY = "cb44cad79668168a5f6479d8ffd8ca78";

const keywordMap = {
  
  sports: "sports",
  anime: "anime",
  "true story": "based on true story"
};


const surpriseBtn = document.getElementById("surpriseBtn");
const genreSelect = document.getElementById("genre");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieCard = document.getElementById("movie-card");
const poster = document.getElementById("poster");
const title = document.getElementById("title");
const overview = document.getElementById("overview");
const rating = document.getElementById("rating");


function showLoading() {
  title.textContent = "Loading...";
  overview.textContent = "";
  rating.textContent = "";
  poster.src = "";
  movieCard.classList.remove("hidden");
}


function clearLoading() {
  
}


surpriseBtn.addEventListener("click", () => {
  const selectedGenre = genreSelect.value;
  showLoading();
  getMovieByGenreOrKeyword(selectedGenre);
});

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a search term!");
    return;
  }
  showLoading();
  getMovieBySearch(query);
});


async function getMovieByGenreOrKeyword(value) {
  let url = "";
  const baseOptions = `api_key=${API_KEY}&sort_by=popularity.desc&include_adult=false&certification_country=US&certification.lte=PG-13`;

  if (keywordMap[value]) {
    url = `https://api.themoviedb.org/3/search/movie?${baseOptions}&query=${encodeURIComponent(keywordMap[value])}`;
  } else {
    url = `https://api.themoviedb.org/3/discover/movie?${baseOptions}&with_genres=${value}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      alert("No safe content found in this genre. Try another!");
      movieCard.classList.add("hidden");
      return;
    }
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
    displayMovie(randomMovie);
  } catch (err) {
    alert("Error fetching movies. Please try again later.");
    console.error(err);
    movieCard.classList.add("hidden");
  }
}

async function getMovieBySearch(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&sort_by=popularity.desc`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      alert("No results found for your search!");
      movieCard.classList.add("hidden");
      return;
    }
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
    displayMovie(randomMovie);
  } catch (err) {
    alert("Error fetching search results. Please try again later.");
    console.error(err);
    movieCard.classList.add("hidden");
  }
}


function displayMovie(movie) {
  movieCard.classList.remove("hidden");

  poster.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  title.textContent = movie.title || "Title unavailable";
  overview.textContent = movie.overview || "No description available.";
  rating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";


  movieCard.scrollIntoView({ behavior: "smooth" });
}
