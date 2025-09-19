const API_KEY = import.meta.env.VITE_API_KEY;
const URL_TRENDING = import.meta.env.VITE_URL_TRENDING;
const URL_DETAILS = import.meta.env.VITE_URL_DETAILS;
const IMG_PREFIX = import.meta.env.VITE_IMG_PREFIX;
const LANG_POST = "&language=de-DE";

const targetContainer = document.getElementById("target-container");

function getMovieId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// to refactor > helper-function
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

// to refactor > helper-function
async function getMovieDetails(movieId) {
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
      const data = json;
      // code here
      const title = data.title;
      const overview = data.overview;
      const poster_path = data.poster_path;
      const backdrop_path = data.backdrop_path; // check
      const release_date = data.release_date;
      const runtime = data.runtime;
      const genres = data.genres;
      const vote_average = data.vote_average;
      const vote_count = data.vote_count; // check
      const production_companies = data.production_companies;
      const production_countries = data.production_countries;
      const spoken_languages = data.spoken_languages;
      const rating = data.rating; // check
      const original_language = data.original_language; // check
      const original_title = data.original_title;
      const isAdult = data.adult;
      const reflink = data.homepage;
      const budget = data.budget;
      const movie = data; // defined movie object here

      const targetHTML = `
      <header id="header">
        <section
          id="heroSection"
          class="relative overflow-hidden min-h-[400px]"
        >
          <div class="absolute inset-0 w-full h-full overflow-hidden -z-10">
            <iframe
              class="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 scale-[2.5]"
              src="https://www.youtube.com/embed/z_mGY35pPP4?autoplay=1&mute=1&loop=1&playlist=z_mGY35pPP4&controls=0&showinfo=0&modestbranding=1"
              title="YouTube video player"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            ></iframe>
          </div>

          <div
            class="relative z-0 flex flex-col sm:flex-row items-start p-6 sm:p-[6em] bg-black/40 gap-6"
          >
            <div class="flex flex-col gap-2 max-w-xl">
              <h1 class="text-4xl sm:text-5xl text-white blockbuster-font">
                ${title}
              </h1>
              <p class="text-white text-lg sm:text-xl">
                Genre: ${genres.map((genre) => genre.name).join(", ")}, FSK: ${
        isAdult ? "18+" : "12+"
      }, Laufzeit: ${runtime} Min, Erscheinungsdatum:
                ${release_date}
              </p>
              <div class="flex flex-row gap-4 mt-4">
                <button
                  class="px-6 py-2 bg-blue-600 text-white font-blockbuster rounded-lg shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 transition duration-300 watchlistButton"
                >
                  Zur Watchlist
                </button>
                <button
                  class="px-6 py-2 bg-green-600 text-white font-blockbuster rounded-lg shadow-lg shadow-green-500/50 hover:shadow-green-400/70 transition duration-300 noteButton"
                >
                  Notiz
                </button>
                <button
                  class="px-6 py-2 bg-red-600 text-white font-blockbuster rounded-lg shadow-lg shadow-red-500/50 hover:shadow-red-400/70 transition duration-300 seenButton"
                >
                  Bereits gesehen
                </button>
              </div>
            </div>

            <div class="flex flex-col items-center gap-4">
              <div
                id="poster"
                class="w-[200px] h-[290px] rounded-2xl shadow-2xl cursor-pointer"
              >
                <img
                  src="${IMG_PREFIX}${poster_path}"
                  alt="Plakat"
                  class="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div
                class="${getClassByRate(
                  vote_average
                )} text-black font-bold px-4 py-2 rounded-lg text-lg shadow-md"
              >
                ⭐ ${vote_average.toFixed(2)}/10
              </div>
            </div>
          </div>
        </section>
      </header>
      <main class="px-8 lg:px-16 py-10 max-w-5xl mx-auto">
        <h2 class="blockbuster-font text-2xl font-bold mb-4">Filmdetails</h2>
        <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <li class="text-gray-800">Originaltitel: ${original_title}</li>
          <li class="text-gray-800">Lauflänge: ${runtime} Minuten</li>
          <li class="text-gray-800">Ersterscheinung: ${release_date}</li>
          <li class="text-gray-800">Sprachen: ${spoken_languages
            .map((language) => language.name)
            .join(", ")}</li>
            <li class="text-gray-800">Filmbudget: ${
              budget / 1000000
            } Mio. US-Dollar</li>
          <li class="text-gray-800">Herkunftsland: ${
            production_countries[0].name
          }</li>
          <li class="text-gray-800">Produktionsfirmen: ${production_companies
            .map((company) => company.name)
            .join(", ")}</li>
            <li class="text-gray-800">Webseite: <a href="${reflink}">offizielle Webseite</a></li>
          
        </ul>
        <h2 class="blockbuster-font text-2xl font-bold mb-4">Über den Film</h2>
        <p class="text-gray-700 leading-relaxed mb-8">
          ${overview}
        </p>



        <h2 class="blockbuster-font text-2xl font-bold mb-4">Trailer</h2>
        <div class="aspect-video bg-black rounded-lg overflow-hidden shadow">
          <iframe
            class="w-full h-full"
            src="https://www.youtube.com/results?search_query=${title}+trailer"
            title="YouTube trailer"
            allowfullscreen
          >
          </iframe>
        </div>
      </main>
`;
      targetContainer.innerHTML = targetHTML;

      // getting btn's AFTER been added to DOM
      const watchlistButton = document.querySelector(".watchlistButton");
      const noteButton = document.querySelector(".noteButton");
      const seenButton = document.querySelector(".seenButton");
      const seenOverlay = document.getElementById("seenOverlay");

      function handleWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        const movieIndex = watchlist.findIndex((m) => m.id === movie.id);

        if (movieIndex !== -1) {
          watchlist.splice(movieIndex, 1);
          watchlistButton.textContent = "Zur Watchlist";
        } else {
          watchlist.push(movie);
          watchlistButton.textContent = "aus Watchlist entfernen";
        }
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        console.log("Watchlist button toggled");
      }
      function checkWatchlist() {
        const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        const movieIndex = watchlist.findIndex((m) => m.id === movie.id);
        if (movieIndex !== -1) {
          watchlistButton.textContent = "aus Watchlist entfernen";
        } else {
          watchlistButton.textContent = "Zur Watchlist";
        }
      }
      checkWatchlist();

      function handleNote() {
        //
      }

      function handleSeen() {
        let seen = localStorage.getItem(`movieSeen-${movie.id}`) === "true";
        seen = !seen;
        if (seen) {
          seenButton.textContent = "Als ungesehen markieren";
          localStorage.setItem(`movieSeen-${movie.id}`, "true");
        } else {
          seenButton.textContent = "Bereits gesehen";
          localStorage.setItem(`movieSeen-${movie.id}`, "false");
        }
        console.log("Seen button clicked");
      }

      // adding event listeners
      watchlistButton.addEventListener("click", handleWatchlist);
      noteButton.addEventListener("click", handleNote);
      seenButton.addEventListener("click", handleSeen);
    })
    .catch((err) => console.error(err));
}

const mid = getMovieId();
console.log(mid);
getMovieDetails(mid);
