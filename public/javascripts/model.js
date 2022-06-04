import {
  TMDB_KEY,
  TIMEOUT_SECONDS,
  POSTER_PATH_START,
  IPINFO_TOKEN,
  RESULTS_PER_PAGE,
} from "./config.js";

export const state = {
  genres: [],
  location: "",
  showInfos: {},
  showProviders: {},
  results: [],
  currentPage: 1,
  currentAPIPAge: 1,
  totalAPIPages: 1,
  totalResults: 0,
  query: "",
  myList: [],
  username: "",
  selectedCountry: "",
};

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long!`));
    }, s * 1000);
  });
};

const AJAX = async function (url) {
  try {
    // We return an error if the browser is too slow
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

const getLocation = async function () {
  try {
    const locationData = await AJAX(
      `https://ipinfo.io/json?token=${IPINFO_TOKEN}`
    );
    if (locationData.country) state.location = locationData.country;
  } catch (err) {
    throw err;
  }
};

export const getGenres = async function () {
  try {
    const genres = await AJAX(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_KEY}`
    );
    if (genres.genres) state.genres = genres.genres;
  } catch (err) {
    throw err;
  }
};

const getMyListFromLocalStorage = function () {
  const storage = localStorage.getItem("myList");
  if (storage) state.myList = JSON.parse(storage);
  const myListElement = document.querySelector(".myList");

  state.myList = myListElement.dataset?.list
    ? JSON.parse(myListElement.dataset.list)
    : [];
  state.username = myListElement.dataset.username;
};

const createShowInfos = function (data) {
  return {
    id: data.id,
    title: data.name,
    poster: data.poster_path
      ? POSTER_PATH_START + data.poster_path
      : "../../../img/no-image.PNG",
    numSeasons: data.number_of_seasons,
    genres: data.genres ? data.genres.map((obj) => obj.name) : "",
    year: data.first_air_date ? data.first_air_date.split("-")[0] : "",
    overview: data.overview ? data.overview : "",
    inMyList: state.myList.find((show) => show.id == data.id) ? true : false,
  };
};

export const loadShow = async function (id) {
  try {
    //We can run the promises in parallel
    const [dataShow, dataProviders] = await Promise.all([
      AJAX(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}`),
      AJAX(
        `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${TMDB_KEY}`
      ),
    ]);

    state.showInfos = createShowInfos(dataShow);
    state.showProviders = dataProviders;
  } catch (err) {
    throw err;
  }
};

export const loadResults = async function (query, pageAPI = 1) {
  try {
    if (pageAPI === 1) {
      // Reinitialization of the state when a new search is done (i.e. when the first page of the API is loaded)
      state.results = [];
      state.currentPage = 1;
      state.query = query;
    }
    state.currentAPIPAge = pageAPI;
    const results = await AJAX(
      `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${query}&page=${pageAPI}`
    );
    results.results.forEach((show) =>
      state.results.push({
        id: show.id,
        title: show.original_name,
        poster: show.poster_path
          ? POSTER_PATH_START + show.poster_path
          : "img/no-image.PNG",
        year: show.first_air_date ? show.first_air_date.split("-")[0] : "",
        genres: show.genre_ids
          ? show.genre_ids.map(
              (id) => state.genres.filter((genre) => genre.id === id)[0]?.name
            )
          : [],
      })
    );
    state.totalAPIPages = results.total_pages;
    state.totalResults = results.total_results;
  } catch (err) {
    throw err;
  }
};

export const getResultsPage = async function (page = state.currentPage) {
  try {
    const first_result = RESULTS_PER_PAGE * page - RESULTS_PER_PAGE;
    const last_result = RESULTS_PER_PAGE * page - 1;
    state.currentPage = page;
    let currentResults = state.results.slice(first_result, last_result + 1);
    // if (currentResults.length === 0) {
    if (currentResults.length < RESULTS_PER_PAGE) {
      //Load next API Page
      await loadResults(state.query, state.currentAPIPAge + 1);
      currentResults = state.results.slice(first_result, last_result + 1);
    }
    while (
      currentResults.length < RESULTS_PER_PAGE &&
      state.currentPage != 1 &&
      state.currentPage < Math.ceil(state.totalResults / RESULTS_PER_PAGE)
    ) {
      //Load next API Page
      await loadResults(state.query, state.currentAPIPAge + 1);
      currentResults = state.results.slice(first_result, last_result + 1);
    }
    return currentResults;
  } catch (err) {
    throw err;
  }
};

export const addToMyList = async function () {
  if (state.myList.find((show) => show.id == state.showInfos.id)) {
    // Remove the show from the list if it was already there
    state.myList = state.myList.filter((show) => show.id != state.showInfos.id);
    state.showInfos.inMyList = false;
  } else {
    // Add the show to the list if it wasn't there
    state.myList.push({
      id: state.showInfos.id,
      title: state.showInfos.title,
      poster: state.showInfos.poster,
      year: state.showInfos.year,
      genres: state.showInfos.genres,
    });
    state.showInfos.inMyList = true;
  }
  // Update Local Storage
  // const databaseResponse = await fetch("/users/shows", {
  await fetch("/users/shows", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ list: state.myList, username: state.username }),
  });

  // const response = await databaseResponse.json();
};

const init = function () {
  getLocation();
  getMyListFromLocalStorage();
};
init();
