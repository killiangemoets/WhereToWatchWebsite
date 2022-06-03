import View from "./View.js";

export default class PreviewView extends View {
  constructor() {
    //Recap: only after calling super we wan use the this keyword
    super();
    this._focusMouse();
  }

  _focusMouse() {
    const body = document.body;
    body.addEventListener("mouseover", function (e) {
      if (e.target.closest(".show-card")) {
        e.target.closest(".show-card").classList.add("show-mouse");
      }

      if (e.target.closest(".country")) {
        e.target.closest(".country").classList.add("flag-mouse");
      }
    });
    body.addEventListener("mouseout", function (e) {
      if (e.target.closest(".show-card")) {
        e.target.closest(".show-card").classList.remove("show-mouse");
      }

      if (e.target.closest(".country")) {
        e.target.closest(".country").classList.remove("flag-mouse");
      }
    });

    body.addEventListener("mousedown", function (e) {
      if (e.target.closest(".show-card")) {
        e.target.closest(".show-card").classList.add("show-click");
      }
    });

    body.addEventListener("mouseup", function (e) {
      if (e.target.closest(".show-card")) {
        e.target.closest(".show-card").classList.remove("show-click");
      }
    });
  }

  _generateMarkupShow(show, page, search) {
    const activeID = +window.location.hash.slice(1);
    return `
    <li class="show-card ${show.id === activeID ? "show-active" : ""}"}>
        <a href="/show/${search?.length > 0 ? search : "no_search"}/${
      page ? page : 1
    }/${show.id}">
            <div class="results-img-box">
                <img
                    class="results-img"
                    src="${
                      show.poster.indexOf("not_available") === -1
                        ? show.poster
                        : "../../../" + show.poster
                    }"
                    alt="Show poster"
                />
            </div>
            <div class="results-info">
                <div class="results-info-box">
                    <h3 class="results-title">${show.title}</h3>
                    <p class="results-categories">${show.genres.join(", ")}</p>
                    <p class="results-year">${show.year}</p>
                </div>
            </div>
        </a>
    </li>
      `;
  }

  renderShowsList(showsList, page, search) {
    const markup = showsList
      .map((show) => this._generateMarkupShow(show, page, search))
      .join(" ");
    if (!markup) this.renderError(this._errorMessage);
    else {
      this._parentElement.innerHTML = "";
      this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
  }
}
