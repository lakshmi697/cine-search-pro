function searchMovie() {
  let name = document.getElementById("movieInput").value.trim();

  if(name === ""){
    alert("Enter movie name");
    return;
  }

  // 👉 next page ki pampadam
  window.location.href = "movies.html?query=" + name;
}

// Enter key support
document.getElementById("movieInput").addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    searchMovie();
  }
});