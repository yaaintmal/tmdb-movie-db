const API_KEY = import.meta.env.VITE_API_KEY;
const URL_SEARCH = import.meta.env.VITE_URL_SEARCH;
const URL_POST = "&page=1";

import { showFoundedMoviesDialog } from "./helper-modal.js";

const searchValue = document.getElementById("searchForm") || "notneeded";

//bugfix / not neded on watchlist, but error or warning!? fakin RENDER dot ya ass! << it ALWAYS works on ma machine
if (searchValue === "notneeded") {
  console.log("searchValue not found");
} else {
  searchValue.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById("searchTerm").value;
    getSearchMovies(searchTerm);
  });
}

const dialog = document.createElement("dialog");

// fetch function to catch via searchterm
const getSearchMovies = (searchTerm) => {
  const url = `${URL_SEARCH}${searchTerm}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      const movieList = json.results;
      console.log("Search Movies:");
      let foundedMoviesCode = `<ul>`;

      movieList.forEach((element) => {
        console.log("found: ", element.name);
        // foundedMovies.push(element.name);
        foundedMoviesCode += `<li><a href="target-movie.html?id=${element.id}">${element.title}</a></li>`;
      });
      foundedMoviesCode += `</ul>`;
      if (movieList.length === 0) {
        foundedMoviesCode = `<p>Keine Filme gefunden</p>`;
      }
      showFoundedMoviesDialog(foundedMoviesCode);
    })
    .catch((err) => console.error(err));
};

export { getSearchMovies };
