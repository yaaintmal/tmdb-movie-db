const addMovieToWatchlist = (movie) => {
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  const isMovieInWatchlist = watchlist.some(
    (existingMovie) => existingMovie.id === movie.id
  );

  if (!isMovieInWatchlist) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    console.log("Added to watchlist:", movie.title);
  } else {
    console.log("Movie already in watchlist:", movie.title);
  }
};

const removeMovieFromWatchlist = (movie) => {
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  const updatedWatchlist = watchlist.filter(
    (existingMovie) => existingMovie.id !== movie.id
  );

  localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  console.log("Removed from watchlist:", movie.title);
};

const isMovieInWatchlist = (movie) => {
  const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  return watchlist.some((existingMovie) => existingMovie.id === movie.id);
};

export { addMovieToWatchlist, removeMovieFromWatchlist, isMovieInWatchlist };
