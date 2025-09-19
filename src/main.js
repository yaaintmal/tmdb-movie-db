import "./static/style.css";
import "./static/app.css";

import { getTrendingMovies } from "./js/trending.js";
import { getSearchMovies } from "./js/search.js";

if (
  window.location.pathname === "/" ||
  window.location.pathname === "/index.html"
) {
  getTrendingMovies();
}
if (window.location.pathname === "/target-movie.html") {
}
if (window.location.pathname === "/journal.html") {
  watchlist();
}
