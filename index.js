const API_KEY = "e34dcba7d792500ee77d82c7435ff0e9";

const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("movieInput");
const trendingDiv = document.getElementById("trending");

// 🔍 search
searchBtn.onclick = () => {
  const movie = input.value.trim();
  if (!movie) return alert("Enter movie name");

  window.location.href = `movies.html?query=${movie}`;
};

// enter key
input.addEventListener("keydown", e => {
  if (e.key === "Enter") searchBtn.click();
});
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

    let output = "";

    allMovies.forEach(movie => {

      if (!movie.poster_path) return;

      let poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

      // ✅ correct logic
      let tag = "📅 Released";
      let tagClass = "released";

      if (movie.release_date && movie.release_date > today) {
        tag = "🚀 Upcoming";
        tagClass = "upcoming";
      }

      output += `
        <div class="movie-card" onclick="goDetails(${movie.id})">
          <img src="${poster}">
          <h3>${movie.title}</h3>
          <p class="${tagClass}">${tag}</p>
        </div>
      `;
    });

    trendingDiv.innerHTML = output;

  } catch (err) {
    console.log(err);
    trendingDiv.innerHTML = "❌ Failed to load movies";
  }
}

// ✅ IMPORTANT
loadTrending();
function goDetails(id) {
  window.location.href = "details.html?id=" + id;
}