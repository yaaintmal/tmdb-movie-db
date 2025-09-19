// trending.js / used to load 3 actual trending movies / now 9
// import "./flipcard.css";
import { showOverviewDialog } from "./helper-modal.js";
import {
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  isMovieInWatchlist,
} from "./watchlist.js";

const API_KEY = import.meta.env.VITE_API_KEY;
const URL_TRENDING = import.meta.env.VITE_URL_TRENDING;
const URL_DETAILS = import.meta.env.VITE_URL_DETAILS;
const IMG_PREFIX = import.meta.env.VITE_IMG_PREFIX;
const LANG_POST = "&language=de-DE";

const trendingContainer = document.getElementById("trending-movies");

function getClassByRate(vote) {
  vote = Math.max(0, Math.min(10, vote));
  const palette = [
    { max: 0.5, color: "bg-red-900" },
    { max: 1.5, color: "bg-red-700" },
    { max: 2.5, color: "bg-red-600" },
    { max: 3.5, color: "bg-orange-600" },
    { max: 4.5, color: "bg-orange-500" },
    { max: 5.5, color: "bg-yellow-500" },
    { max: 6.5, color: "bg-yellow-400" },
    { max: 7.5, color: "bg-lime-500" },
    { max: 8.5, color: "bg-green-500" },
    { max: 9.5, color: "bg-green-600" },
    { max: 10, color: "bg-green-700" },
  ];
  for (let step of palette) {
    if (vote <= step.max) return step.color;
  }
  return "bg-gray-400";
}

const addTrendingMovies = (movie) => {
  // Get saved state from local storage for each movie
  const storedSeen = localStorage.getItem(`movieSeen-${movie.id}`) === "true";
  const storedNote = localStorage.getItem(`movieNote-${movie.id}`) || "";

  // Create the main flip-card container
  const movieElement = document.createElement("div");
  movieElement.classList.add("flip-card", "w-[385px]", "h-[580px]", "relative");

  const flipCardInner = document.createElement("div");
  flipCardInner.classList.add("flip-card-inner");

  // Create the Front of the card
  const flipCardFront = document.createElement("div");
  flipCardFront.classList.add(
    "flip-card-front",
    "p-2",
    "rounded-xl",
    "relative"
  );

  const imageContainer = document.createElement("div");
  imageContainer.classList.add(
    "h-[480px]",
    "w-full",
    "relative",
    "overflow-hidden",
    "rounded-xl"
  );

  const posterImg = document.createElement("img");
  posterImg.src = `${IMG_PREFIX}${movie.poster_path}`;
  posterImg.alt = "Film Poster";
  posterImg.classList.add(
    "w-full",
    "h-full",
    "object-cover",
    "transform",
    "transition-transform",
    "duration-500",
    "hover:scale-105",
    "rounded-xl",
    "border-4",
    "border-gray-200"
  );

  const voteBadge = document.createElement("div");
  voteBadge.classList.add(
    "absolute",
    "top-3",
    "right-3",
    "px-3",
    "py-1.5",
    "rounded-full",
    "text-white",
    "text-base",
    "font-bold",
    "shadow-lg",
    "ring-2",
    "ring-white/70",
    `${getClassByRate(movie.vote_average)}`,
    "transform",
    "transition-transform",
    "duration-300",
    "hover:scale-110"
  );
  voteBadge.textContent = movie.vote_average.toFixed(1);

  const seenOverlay = document.createElement("div");
  seenOverlay.id = "seen-overlay";
  seenOverlay.classList.add("hidden");
  seenOverlay.style.display = "none";
  if (!storedSeen) {
    seenOverlay.classList.remove("hidden");
  } else {
    seenOverlay.textContent = "Bereits gesehen";
    seenOverlay.style.display = "";
  }

  imageContainer.append(posterImg, voteBadge, seenOverlay);

  const frontTextContainer = document.createElement("div");
  frontTextContainer.classList.add(
    "p-4",
    "flex",
    "flex-col",
    "h-[80px]",
    "relative"
  );

  const movieTitle = document.createElement("h2");
  movieTitle.classList.add("text-sm", "font-bold", "mb-2", "text-black");
  movieTitle.textContent = movie.title;

  const dateGenreContainer = document.createElement("div");
  dateGenreContainer.classList.add(
    "text-gray-700",
    "flex",
    "justify-start",
    "text-sm",
    "mt-auto"
  );

  const releaseDateSpan = document.createElement("span");
  releaseDateSpan.classList.add("m-2");
  releaseDateSpan.textContent = movie.release_date;

  const genreSpan = document.createElement("span");
  genreSpan.classList.add("m-2");
  genreSpan.textContent = "";
  dateGenreContainer.append(releaseDateSpan, genreSpan);

  const cornerDiv = document.createElement("div");
  cornerDiv.classList.add("corner");

  frontTextContainer.append(movieTitle, dateGenreContainer, cornerDiv);
  flipCardFront.append(imageContainer, frontTextContainer);

  // Create the Back of the card
  const flipCardBack = document.createElement("div");
  flipCardBack.classList.add(
    "flip-card-back",
    "flex",
    "flex-col",
    "p-2",
    "rounded-xl",
    "border-2",
    "border-white/20",
    "text-gray-900"
  );

  // Top Section
  const topSection = document.createElement("div");
  topSection.classList.add(
    "bg-white",
    "rounded-lg",
    "p-3",
    "mx-1",
    "flex",
    "flex-col",
    "gap-1",
    "shadow-sm"
  );

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid", "grid-cols-3", "gap-3");

  const leftColumn = document.createElement("div");
  leftColumn.classList.add("col-span-2", "flex", "flex-col", "gap-0.5");

  const backTitle = document.createElement("h2");
  backTitle.classList.add("text-base", "font-bold");
  backTitle.textContent = movie.title;

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("text-xs", "text-gray-700", "leading-snug");

  detailsContainer.innerHTML = `
    <p id="genres-${movie.id}"id="genres-${movie.id}"></p>
    <p><span class="font-semibold">Erscheinung:</span> ${movie.release_date}</p>
    <p><span class="font-semibold">Originalsprache:</span> ${movie.original_language}</p>
    <p><span class="font-semibold">Sprache:</span> de</p>
    <p><span class="font-semibold">Originaltitel:</span> ${movie.original_title}</p>
    <p><span class="font-semibold">Anzahl Stimmen:</span> ${movie.vote_count}</p>
  `;

  const fskDiv = document.createElement("div");
  const p = document.createElement("p");
  const FSKMsg = isFSK(movie.id) ? "FSK 18+" : "FSK 12+";
  p.textContent = FSKMsg;
  if (isFSK(movie.id)) {
    p.classList.add("text-red-600");
  }
  p.classList.add(
    "font-semibold",
    "text-gray-700",
    "leading-snug",
    "mt-2",
    "text-xs"
  );
  fskDiv.appendChild(p);
  fskDiv.classList.add("mt-2");

  const fskImg = document.createElement("img");
  fskImg.id = "fsk-logo";
  if (isFSK(movie.id)) {
    fskImg.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/FSK_18.svg/900px-FSK_18.svg.png";
  } else {
    fskImg.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/FSK_12.svg/900px-FSK_12.svg.png";
  }
  fskImg.alt = "FSK";
  fskImg.classList.add("w-[45px]", "h-[45px]", "object-contain");
  fskDiv.appendChild(fskImg);
  leftColumn.append(backTitle, detailsContainer, fskDiv);

  const rightColumn = document.createElement("div");
  rightColumn.classList.add(
    "col-span-1",
    "flex",
    "items-center",
    "justify-center"
  );
  const posterThumbnail = document.createElement("img");
  posterThumbnail.src = `${IMG_PREFIX}${movie.poster_path}`;
  posterThumbnail.alt = "Poster Thumbnail";
  posterThumbnail.classList.add(
    "w-full",
    "h-auto",
    "rounded-md",
    "shadow",
    "object-cover"
  );
  rightColumn.appendChild(posterThumbnail);

  const moreButtonTop = document.createElement("button");
  moreButtonTop.classList.add(
    "mt-1",
    "px-3",
    "py-1",
    "bg-blue-600",
    "text-white",
    "text-xs",
    "rounded-md",
    "hover:bg-blue-700",
    "transition",
    "self-start"
  );
  moreButtonTop.textContent = "Details";
  moreButtonTop.addEventListener("click", () => {
    window.location.href = `target-movie.html?id=${movie.id}`;
  });

  gridContainer.append(leftColumn, rightColumn);
  topSection.append(gridContainer, moreButtonTop);

  // Middle Section
  const middleSection = document.createElement("div");
  middleSection.classList.add(
    "bg-white",
    "rounded-lg",
    "p-3",
    "mx-1",
    "flex",
    "flex-col",
    "gap-1",
    "shadow-sm",
    "mt-1",
    "flex-1"
  );

  const plotTitle = document.createElement("h3");
  plotTitle.classList.add("text-sm", "font-semibold");
  plotTitle.textContent = "Handlungsauszug:";

  const plotText = document.createElement("p");
  plotText.classList.add("text-xs", "text-gray-700", "leading-snug", "flex-1");
  plotText.textContent = movie.overview.slice(0, 250) + " [...]";

  const moreButtonMiddle = document.createElement("button");
  moreButtonMiddle.classList.add(
    "mt-1",
    "px-3",
    "py-1",
    "bg-blue-600",
    "text-white",
    "text-xs",
    "rounded-md",
    "hover:bg-blue-700",
    "transition",
    "self-start"
  );
  moreButtonMiddle.textContent = "mehr";
  moreButtonMiddle.addEventListener("click", () => {
    // opening dialog-box to show movie.overview and moreLink-Button for further details refering to details.html with movie.id
    showOverviewDialog(movie.overview, movie.id);
    // window.location.href = `details.html?id=${movie.id}`; // refactored, passing mid
  });

  middleSection.append(plotTitle, plotText, moreButtonMiddle);

  // Bottom Section
  const bottomSection = document.createElement("div");
  bottomSection.classList.add(
    "bg-white",
    "rounded-lg",
    "p-3",
    "mx-1",
    "flex",
    "flex-col",
    "gap-2",
    "shadow-sm",
    "mt-1"
  );

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "gap-2"
  );

  const noteButton = document.createElement("button");
  noteButton.id = "noteButton";
  noteButton.classList.add(
    "flex-1",
    "h-[50px]",
    "px-3",
    "py-1",
    "bg-gray-200",
    "text-gray-800",
    "text-xs",
    "rounded-md",
    "hover:bg-gray-300",
    "transition"
  );
  noteButton.textContent = storedNote ? "Notiz bearbeiten" : "Notiz";

  const watchlistButton = document.createElement("button");
  watchlistButton.classList.add(
    "flex-1",
    "h-[50px]",
    "px-3",
    "py-1",
    "bg-blue-600",
    "text-white",
    "text-xs",
    "rounded-md",
    "hover:bg-blue-700",
    "transition"
  );
  const isWatched = isMovieInWatchlist(movie);
  watchlistButton.textContent = isWatched
    ? "aus Watchlist entfernen"
    : "Zur Watchlist";

  const seenButton = document.createElement("button");
  seenButton.id = `seenButton${movie.id}`;
  seenButton.classList.add(
    "flex-1",
    "h-[50px]",
    "px-3",
    "py-1",
    "bg-black",
    "text-white",
    "text-xs",
    "rounded-md",
    "hover:bg-gray-800",
    "transition"
  );
  seenButton.textContent = storedSeen
    ? "Als ungesehen markieren"
    : "Bereits gesehen";

  buttonContainer.append(noteButton, watchlistButton, seenButton);
  bottomSection.appendChild(buttonContainer);
  flipCardBack.append(topSection, middleSection, bottomSection);

  // Assemble the final card
  flipCardInner.append(flipCardFront, flipCardBack);
  movieElement.appendChild(flipCardInner);
  trendingContainer.appendChild(movieElement);

  // Add event listeners
  seenButton.addEventListener("click", () => {
    let seen = localStorage.getItem(`movieSeen-${movie.id}`) === "true";
    seen = !seen;
    if (seen) {
      seenOverlay.classList.remove("hidden");
      seenButton.textContent = "Als ungesehen markieren";
      localStorage.setItem(`movieSeen-${movie.id}`, "true");
    } else {
      seenOverlay.classList.add("hidden");
      seenButton.textContent = "Bereits gesehen";
      localStorage.setItem(`movieSeen-${movie.id}`, "false");
    }
  });

  noteButton.addEventListener("click", () => {
    const dialog = document.getElementById("meinDialog");
    const noteInput = document.getElementById("noteInput");
    noteInput.value = localStorage.getItem(`movieNote-${movie.id}`) || "";
    dialog.showModal();

    const form = dialog.querySelector("form");
    const saveNoteHandler = (e) => {
      e.preventDefault();
      const newNote = noteInput.value;
      localStorage.setItem(`movieNote-${movie.id}`, newNote);
      noteButton.textContent = newNote.trim() ? "Notiz bearbeiten" : "Notiz";
      dialog.close();
      form.removeEventListener("submit", saveNoteHandler);
    };
    form.addEventListener("submit", saveNoteHandler);
  });

  watchlistButton.addEventListener("click", () => {
    if (isMovieInWatchlist(movie)) {
      removeMovieFromWatchlist(movie);
      watchlistButton.textContent = "Zur Watchlist";
    } else {
      addMovieToWatchlist(movie);
      watchlistButton.textContent = "aus Watchlist entfernen";
    }
  });

  getGenres(movie.id);
};

function getTrendingMovies() {
  const url = URL_TRENDING;
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
      console.log("Top 3 Trending Movies:");
      movieList.splice(9);
      movieList.forEach((element) => {
        addTrendingMovies(element);
      });
    })
    .catch((err) => console.error(err));
}

function isFSK(movieId) {
  const url = `${URL_DETAILS}/${movieId}?${LANG_POST}`;
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
      const movie = json;
      console.log("Movie Details:");
      return movie.adult;
    })
    .catch((err) => console.error(err));
}

const getGenres = async (movieId) => {
  const url = `${URL_DETAILS}/${movieId}${LANG_POST}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    const movie = json;
    console.log("Genre:");
    console.log(movie.genres);
    const allgenres = movie.genres.map((genre) => genre.name).join(", ");
    const genreMsg = `<span class="font-semibold">Genre:</span> ${allgenres}`;
    document.getElementById(`genres-${movie.id}`).innerHTML = genreMsg;
    return null;
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
};

export { getTrendingMovies };
