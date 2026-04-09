const API_KEY = "e34dcba7d792500ee77d82c7435ff0e9";

const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("movieInput");
const trendingDiv = document.getElementById("trending");

searchBtn.onclick = async () => {
  const query = input.value.trim();
  if (!query) return alert("Enter name");

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return alert("No results found");
    }

    // 🎯 Find best match
    const exactMovie = data.results.find(
      r => r.media_type === "movie" &&
      r.title.toLowerCase() === query.toLowerCase()
    );

    const exactActor = data.results.find(
      r => r.media_type === "person" &&
      r.name.toLowerCase() === query.toLowerCase()
    );

    if (exactMovie) {
      window.location.href = `movies.html?query=${query}`;
    } else if (exactActor) {
      window.location.href = `movies.html?person=${exactActor.id}`;
    } else {
      window.location.href = `movies.html?query=${query}`;
    }

  } catch (err) {
    console.log(err);
  }
};
// ⌨️ enter key search
input.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBtn.click();
});

// 🎬 load trending
async function loadTrending() {

  try {
    const today = new Date().toISOString().split("T")[0];

    let allMovies = [];

    // 🔥 fetch 3 pages
    for (let page = 1; page <= 3; page++) {

      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=te&sort_by=release_date.desc&primary_release_date.gte=2024-01-01&primary_release_date.lte=2026-12-31&page=${page}`
      );

      const data = await res.json();

      allMovies = [...allMovies, ...data.results];
    }

    // ✅ IMPORTANT (watchlist toggle kosam)
    window.currentMovies = allMovies;

    let output = "";

    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    allMovies.forEach(movie => {

      if (!movie.poster_path) return;

      let poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

      // 📊 release / upcoming
      let tag = "📅 Released";
      let tagClass = "released";

      if (movie.release_date && movie.release_date > today) {
        tag = "🚀 Upcoming";
        tagClass = "upcoming";
      }

      // ❤️ check watchlist
      let isAdded = watchlist.some(item => item.id === movie.id);

      output += `
        <div class="movie-card">
          <img src="${poster}" onclick="goDetails(${movie.id})">
          <h3>${movie.title}</h3>
          <p class="${tagClass}">${tag}</p>

          <button onclick="toggleWatchlist(${movie.id})">
            ${isAdded ? "💖" : "🤍"}
          </button>
        </div>
      `;
    });

    trendingDiv.innerHTML = output;

  } catch (err) {
    console.log(err);
    trendingDiv.innerHTML = "❌ Failed to load movies";
  }
}

// 👉 go to details
function goDetails(id) {
  window.location.href = "details.html?id=" + id;
}

// ❤️ toggle watchlist
function toggleWatchlist(id) {
  let list = JSON.parse(localStorage.getItem("watchlist")) || [];

  let exists = list.some(item => item.id === id);

  if (exists) {
    // remove
    list = list.filter(item => item.id !== id);
  } else {
    // add
    let movie = window.currentMovies.find(m => m.id === id);
    if (movie) {
      list.push(movie);
    }
  }

  localStorage.setItem("watchlist", JSON.stringify(list));

  loadTrending(); // 🔄 refresh UI
}

// 🚀 call function
loadTrending();
