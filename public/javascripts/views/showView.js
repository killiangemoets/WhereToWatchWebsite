import {
  COUNTRYFLAG_API,
  GET_COUNTRY_NAMES,
  POSTER_PATH_START,
} from "../config.js";
import View from "./View.js";

class ShowView extends View {
  _parentElement = document.querySelector(".show-section-box");
  _errorMessage =
    "Error: We could not load this show. Please try again or pick another one!";

  constructor() {
    super(); //Recap: only after calling super we wan use the this keyword
    // this._handleReturn();
  }

  addHandlerRenderShow(handler) {
    window.addEventListener("hashchange", handler);
    window.addEventListener("load", handler);
  }

  addHandlerChangeCountry(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const newCountry = e.target.closest(".country");
      if (newCountry) {
        handler(newCountry.dataset.country);
      }
    });
  }

  addHandlerAddToMyList(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const heart = e.target.closest(".btn--add-to-fav");
      if (heart) {
        handler();
      }
    });
  }

  _generateMarkupCountry(countryISO, country, currentCountry) {
    return `
    <li class="country ${
      country === currentCountry ? "flag-active" : ""
    }" data-country="${countryISO}">
        <img
            class="flag-img"
            src="${COUNTRYFLAG_API}${countryISO}"
            alt="country flag"
        />
        <p>${country}</p>
    </li>
    `;
  }

  _generateMarkupProvider(provider) {
    return `
      <div>
        <img
          class="stream-logo"
          src="${POSTER_PATH_START}${provider.logo_path}"
          alt="Stream logo"
        />
      </div>
      `;
  }

  _addHandlerCountriesList() {
    const countriesList = document.querySelector(".countries-section");
    const showSection = document.querySelector(".show-section");
    const body = document.body;
    showSection.addEventListener("click", function (e) {
      if (e.target.closest(".btn--country")) {
        e.preventDefault();
        countriesList.classList.toggle("hidden");
      }
    });

    body.addEventListener("click", function (e) {
      if (
        !countriesList.classList.contains("hidden") &&
        !e.target.closest(".btn--country") &&
        !e.target.closest(".countries-section")
      ) {
        countriesList.classList.add("hidden");
      }
    });
  }

  _handleReturn() {
    const body = document.body;
    body.addEventListener("click", async function (e) {
      if (e.target.closest(".btn--return")) {
        console.log("click click");
        const bodyToSend = {
          search: "friends",
          page: 1,
        };
        const response = await fetch("/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyToSend),
        });

        console.log(response);
        window.location.href = response.url;
      }
    });
  }

  renderShow(infos, providers, location, currentCountryISO) {
    // Get the first country to display
    if (!currentCountryISO) {
      if (
        Object.keys(providers.results).find((country) => country === location)
      ) {
        currentCountryISO = location;
      } else if (
        Object.keys(providers.results).find((country) => country === "US")
      ) {
        currentCountryISO = "US";
      } else {
        currentCountryISO = Object.keys(providers.results)[0];
      }
    }
    const currentProviders = providers.results[currentCountryISO];
    const currentCountry = currentCountryISO
      ? GET_COUNTRY_NAMES.of(currentCountryISO)
      : "";

    let markupParts = [];
    markupParts.push(`
    <form class="form--return" action="/search" method="POST">
      <input type="hidden" name="search" value="${
        document.querySelector(".show-section").dataset.search
      }" />
      <input type="hidden" name="page" value="${
        document.querySelector(".show-section").dataset.page
      }" />
      <button class="btn btn--return">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
    </form>
    <div class="show-presentation">
        <div class="show-img-box">
        <img class="show-img" src="${infos.poster}" alt="Show poster" />
        </div>
        <div class="show-content">
        <div class="show-content--flex">
            <h1 class="show-title">
            <span>${infos.title}</span><br />
            ${infos.numSeasons ? "(" : ""}${
      infos.numSeasons ? infos.numSeasons : ""
    } ${infos.numSeasons ? "seasons)" : ""}
            </h1>
            <button class="btn btn--add-to-fav ${
              infos.inMyList ? "heart-active" : ""
            }">
            <i class="fa-solid fa-heart"></i>
            </button>
        </div>
        <h2 class="show-infos">
            <span>${infos.genres.join(", ")}</span> ${
      infos.genres.length !== 0 && infos.year ? "&ndash;" : ""
    } ${infos.year}
        </h2>
        <h4 class="show-overview-title">Overview</h4>
        <p class="show-overview">
            ${infos.overview ? infos.overview : "No overview available"}
        </p>
        </div>
    </div>
            `);

    if (currentCountryISO) {
      markupParts.push(
        `
      <div class="show-wheretowatch">
      <div class="show-wheretowatch--flex">
      <h5 class="wheretowatch-title">Where to watch?</h5>
      <button class="btn btn--country">
          <img
          class="flag-img"
          src="${COUNTRYFLAG_API}${currentCountryISO}"
          alt="country flag"
          />
          <p>${currentCountry}</p>
          <i class="fa-solid fa-caret-down"></i>
      </button>
      <div class="countries-section hidden">
          <div class="countries-section-box">
          <ul class="countries">
      `
      );

      markupParts.push(
        Object.keys(providers.results)
          .map((countryISO) => {
            const country = GET_COUNTRY_NAMES.of(countryISO);
            return this._generateMarkupCountry(
              countryISO,
              country,
              currentCountry
            );
          })
          .join("")
      );

      markupParts.push(`
            </ul>
            </div>
        </div>
        </div>
        <div class="stream">
        <h6 class="wheretowatch-subtitle">Stream</h6>
        <div class="stream-logos">
        `);

      markupParts.push(
        currentProviders?.flatrate
          ? currentProviders.flatrate.map(this._generateMarkupProvider).join("")
          : ""
      );

      markupParts.push(`      
     </div>
        </div>
        <div class="buy">
        <h6 class="wheretowatch-subtitle">Buy</h6>
        <div class="buy-logos">
        `);

      markupParts.push(
        currentProviders?.buy
          ? currentProviders.buy.map(this._generateMarkupProvider).join("")
          : ""
      );

      markupParts.push(`</div>
        </div>
    </div>`);
    } else {
      markupParts.push(`
        <div class="show-wheretowatch">
        <div class="show-wheretowatch--flex">
          <h5 class="wheretowatch-title">Where to watch?</h5>
        </div>
        <div class="stream">
              <p class="wheretowatch-subtitle">NO DATA AVAILABLE</p>
        </div>
      </div>
      `);
    }

    const markup = markupParts.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);

    currentCountryISO ? this._addHandlerCountriesList() : "";
  }
}

export default new ShowView();
