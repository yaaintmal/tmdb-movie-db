const IMG_PREFIX = import.meta.env.VITE_IMG_PREFIX;

// new stateFunc // watchlist >> seen state
const getMovieState = (movieId) => {
  return (
    JSON.parse(localStorage.getItem(`movieState_${movieId}`)) || {
      viewed: false,
      note: "",
    }
  );
};

const saveMovieState = (movieId, state) => {
  localStorage.setItem(`movieState_${movieId}`, JSON.stringify(state));
};

window.toggleViewed = (buttonElement) => {
  const movieRow = buttonElement.closest(".wlMovie-row");
  const movieId = movieRow.dataset.id;
  const state = getMovieState(movieId);

  state.viewed = !state.viewed;
  saveMovieState(movieId, state);

  createWatchlist();
};

window.openNoteModal = (movieId) => {
  const dialog = document.getElementById("meinDialog");
  const noteInput = document.getElementById("noteInput");
  const noteForm = document.getElementById("notizForm");

  // getting current note
  const state = getMovieState(movieId);
  noteInput.value = state.note;

  // form submit
  noteForm.onsubmit = (e) => {
    e.preventDefault();
    state.note = noteInput.value;
    saveMovieState(movieId, state);
    dialog.close();
    createWatchlist(); // Re-render to update the note button text.
  };

  dialog.showModal();
};

// html temp per movie
const createMovieTemplate = (movie) => {
  const state = getMovieState(movie.id);
  console.log(movie);

  return `
    <div data-id="${movie.id}"
      class="wlMovie-row flex items-center gap-4 rounded-xl px-4 py-2 h-[100px] mb-4
             bg-gradient-to-r from-gray-100 to-gray-200 
             hover:from-gray-200 hover:to-gray-300
             transition-all duration-300 shadow-sm hover:shadow-lg 
             transform hover:-translate-y-1 overflow-visible ${
               state.viewed ? "bg-red-200" : ""
             }"
    >
      <div class="flex items-center gap-2 relative">
        <img src="${IMG_PREFIX}${movie.backdrop_path}" alt="Poster"
             class="thumb w-[70px] h-[90px] object-cover rounded-md shadow transition-all duration-300 ${
               state.viewed ? "grayscale" : ""
             }" />
        <span class="viewed-label ${
          state.viewed ? "" : "hidden"
        } text-xs font-bold text-red-700 bg-white/80 px-2 py-0.5 rounded">VIEWED</span>
      </div>

      <div class="flex items-center gap-4 flex-1 text-sm flex-wrap">
        <span class="font-bold text-gray-900 truncate max-w-[280px]">${
          movie.title
        }</span>
        <span class="text-gray-600">Voting:</span> ${movie.vote_average}
        <span class="text-gray-600">Org. Sprache:</span>${
          movie.original_language
        }
 

        <button class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"><a href="target-movie.html?id=${
          movie.id
        }">mehr Details</a></button>

        <div class="flex gap-1">
          <button class="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-xs">DE</button>
          <button class="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-xs">EN</button>
        </div>

        ${movie.adult ? "🔞" : "FSK 12+"}

        <button onclick="toggleViewed(this)" class="seen-btn px-3 py-1 ${
          state.viewed ? "bg-red-700" : "bg-black"
        } text-white rounded-md hover:bg-gray-800">
          ${state.viewed ? "Als ungesehen markieren" : "Bereits gesehen"}
        </button>

      </div>
    </div>
  `;
};

const createWatchlist = () => {
  const watchlistContainer = document.getElementById("journalFilme");
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  watchlistContainer.innerHTML = "";

  // if watchlist is empty
  if (watchlist.length === 0) {
    watchlistContainer.innerHTML =
      '<p class="text-center mt-42 text-zinc-500 text-lg">Deine Watchlist ist leer 😧<br> Füge Filme hinzu um nichts mehr zu verpassen 🍿🎬</p>';
    return;
  }

  watchlist.forEach((movie) => {
    const movieHtml = createMovieTemplate(movie);
    watchlistContainer.insertAdjacentHTML("beforeend", movieHtml);
  });
};

// closing dialog functionality // << needs to be added on index
const btnCloseDialog = document.getElementById("btnCloseDialog");
if (btnCloseDialog) {
  btnCloseDialog.addEventListener("click", () => {
    const dialog = document.getElementById("meinDialog");
    if (dialog) {
      dialog.close();
    }
  });
}

createWatchlist();
