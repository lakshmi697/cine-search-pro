const API_KEY = "e34dcba7d792500ee77d82c7435ff0e9";

let params = new URLSearchParams(window.location.search);
let movieName = params.get("query");

let moviesDiv = document.getElementById("movies");

async function loadMovies() {

  let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieName}`);
  let data = await res.json();

  let output = "";

  data.results.forEach(movie => {

  // 🔥 skip movies without poster
  if(!movie.poster_path) return;
    let poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "";

    output += `
      <div class="movie-card" onclick="goToDetails(${movie.id})">
        <img src="${poster}">
        <h3>${movie.title}</h3>
      </div>
    `;
  });

  moviesDiv.innerHTML = output;
}

function goToDetails(id){
  window.location.href = "details.html?id=" + id;
}

loadMovies();
