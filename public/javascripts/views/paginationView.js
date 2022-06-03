import { RESULTS_PER_PAGE } from "../config.js";
import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".change-page");
  _errorMessage = "";

  addHandlerChangePage(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn");
      if (btn) {
        handler(+btn.dataset.goto);
      }
    });
  }

  _generateMarkupPrev(page) {
    return `
          <button class="btn btn--prev" data-goto="${page - 1}">
              <i class="fa-solid fa-arrow-left"></i>
          </button>
        `;
  }

  _generateMarkupNext(page) {
    return `
          <button class="btn btn--next" data-goto="${page + 1}">
              <i class="fa-solid fa-arrow-right"></i>
          </button>
        `;
  }

  _generateMarkupActivePage(page, numPages) {
    return `
          <p class="num-pages">Page ${page} of ${numPages}</p>
        `;
  }

  renderPagination(page, totalResults) {
    const numPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
    let markup = "";
    if (page > 1) markup += this._generateMarkupPrev(page);
    if (page < numPages) markup += this._generateMarkupNext(page);
    markup += this._generateMarkupActivePage(page, numPages);

    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new PaginationView();
