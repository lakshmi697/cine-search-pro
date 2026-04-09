const API_KEY = "e34dcba7d792500ee77d82c7435ff0e9"; 

let params = new URLSearchParams(window.location.search);

let movieName = params.get("query");   // 🔍 movie search
let personId = params.get("person");   // 👤 actor search

const actorDiv = document.getElementById("actorInfo");
let moviesDiv = document.getElementById("movies");


// 🔥 VERY IMPORTANT FIX
// query unte actor mode cancel
if (movieName) {
  personId = null;
}


// 🚀 MAIN LOAD
if (personId) {
  loadActorMovies(personId);
} else {
  loadMovies();
}


// 🔍 SEARCH FUNCTION
async function loadMovies() {

  if (!movieName) {
    moviesDiv.innerHTML = "❌ No search query";
    return;
  }

  moviesDiv.innerHTML = `<div class="loader"></div>`;
  actorDiv.innerHTML = "";

  try {

    let res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`
    );

    let data = await res.json();

    if (!data.results) {
      moviesDiv.innerHTML = "❌ API error";
      return;
    }

    let results = data.results;

    if (results.length === 0) {
      moviesDiv.innerHTML = "No results 😢";
      return;
    }

    // 🎬 movies
    let movies = results.filter(r => r.media_type === "movie");

    // 👤 actors
    let actors = results.filter(r => r.media_type === "person");

    // 🎯 STRICT ACTOR MATCH (NO BUG)
    let exactActor = actors.find(a =>
      a.name.toLowerCase() === movieName.toLowerCase()
    );

    // 🎯 FINAL LOGIC
    if (movies.length > 0) {
      displayMovies(movies);

    } else if (exactActor) {
      loadActorMovies(exactActor.id);

    } else {
      moviesDiv.innerHTML = "No results 😢";
    }

  } catch (err) {
    console.log("ERROR:", err);
    moviesDiv.innerHTML = "❌ Network error";
  }
}


// 👤 ACTOR MOVIES + INFO
async function loadActorMovies(id) {

  moviesDiv.innerHTML = `<div class="loader"></div>`;

  try {

    // 🎬 actor movies
    let res = await fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${API_KEY}`
    );

    let data = await res.json();
    let movies = data.cast || [];

    // 🔥 sort
    movies.sort((a, b) => b.popularity - a.popularity);

    // 👤 actor details
    let actorRes = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`
    );

    let actorData = await actorRes.json();

    let actorImg = actorData.profile_path
      ? `https://image.tmdb.org/t/p/w500${actorData.profile_path}`
      : "https://via.placeholder.com/150";

    // 🎯 UI
    actorDiv.innerHTML = `
      <div class="actor-box">
        <img src="${actorImg}">
        <h2>${actorData.name}</h2>
      </div>
    `;

    displayMovies(movies);

  } catch (err) {
    console.log(err);
    moviesDiv.innerHTML = "❌ Failed to load actor movies";
  }
}


// 🎨 DISPLAY MOVIES
function displayMovies(movies) {

  window.currentMovies = movies;

  let output = "";

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  movies.forEach(movie => {

    if (!movie.poster_path) return;

    let poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    let isAdded = watchlist.some(item => item.id === movie.id);

    output += `
      <div class="movie-card">
        <img src="${poster}" onclick="goToDetails(${movie.id})">
        <h3>${movie.title}</h3>

        <button onclick="toggleWatchlist(${movie.id})">
          ${isAdded ? "💖" : "🤍"}
        </button>
      </div>
    `;
  });

  if (movies.length === 0) {
    moviesDiv.innerHTML = "No movies found 😢";
  } else {
    moviesDiv.innerHTML = output;
  }
}


// 👉 DETAILS PAGE
function goToDetails(id){
  window.location.href = "details.html?id=" + id;
}


// ❤️ WATCHLIST
function toggleWatchlist(id) {
  let list = JSON.parse(localStorage.getItem("watchlist")) || [];

  let exists = list.some(item => item.id === id);

  if (exists) {
    list = list.filter(item => item.id !== id);
  } else {
    let movie = window.currentMovies.find(m => m.id === id);
    if (movie) {
      list.push(movie);
    }
  }

  localStorage.setItem("watchlist", JSON.stringify(list));

  // 🔄 reload
  if (personId) {
    loadActorMovies(personId);
  } else {
    loadMovies();
  }
}
