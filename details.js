const API_KEY = "e34dcba7d792500ee77d82c7435ff0e9"; 
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
const container = document.getElementById("details");
function getStars(rating) {
  let stars = "";
  let count = Math.round(rating / 2); 
  for (let i = 0; i < count; i++) {
    stars += "⭐";
  }
  return stars;
}
async function getMovieDetails() {
  container.innerHTML = "⏳ Loading...";
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    const movie = await res.json();
    let poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";
    let actors = movie.credits.cast
      .slice(0, 5)
      .map(a => a.name)
      .join(", ");
    let stars = getStars(movie.vote_average);
    let trailer = movie.videos.results.find(v => v.type === "Trailer");
    let trailerUrl;
    if (trailer) {
      trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
    } else {
      trailerUrl = `https://www.youtube.com/results?search_query=${movie.title}+trailer`;
    }

    container.innerHTML = `
      <div class="details-card">
        <img src="${poster}" />
        <div class="info">
          <h1>${movie.title}</h1>
          <p>📅 <b>Release:</b> ${movie.release_date || "N/A"}</p>
          <p>⭐ <b>Rating:</b> ${stars} (${movie.vote_average})</p>
          <p>🎭 <b>Actors:</b> ${actors}</p>
          <p class="overview">${movie.overview}</p>
          <button onclick="openTrailer('${trailerUrl}')">🎥 Watch Trailer</button>
          <button onclick="watchSongs('${movie.title}')">🎵 Songs</button>
          <br><br>

          <button onclick="goBack()">⬅ Back</button>
        </div>

      </div>
    `;

  } catch (err) {
    console.log(err);
    container.innerHTML = "❌ Error loading movie";
  }
}


function openTrailer(url) {
  window.open(url, "_blank");
}


function goBack() {
  window.history.back();
}


getMovieDetails();
function watchSongs(title) {
  window.open(`https://www.youtube.com/results?search_query=${title}+telugu+songs`, "_blank");
}
