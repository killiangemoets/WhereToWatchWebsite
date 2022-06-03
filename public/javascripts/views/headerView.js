import View from "./View.js";

class HeaderView extends View {
  _parentElement = document.querySelector(".header-section");
  _errorMessage = "";

  constructor() {
    super(); //Recap: only after calling super we wan use the this keyword
    this._renderMyList();
  }

  _renderMyList() {
    const myListButton = document.querySelector(".btn--mylist");
    const myList = document.querySelector(".mylist-section");
    const body = document.body;
    myListButton.addEventListener("click", function (e) {
      e.preventDefault();
      myList.classList.toggle("hidden");
    });

    body.addEventListener("click", function (e) {
      if (
        !myList.classList.contains("hidden") &&
        !e.target.closest(".mylist-section") &&
        !e.target.closest(".btn--mylist")
      ) {
        myList.classList.add("hidden");
      }
    });
  }

  addHandlerSearch(handler) {
    document
      .querySelector(".search-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        handler();
      });
  }

  getInput() {
    const input = document.querySelector(".search-show").value;
    document.querySelector(".search-show").value = "";
    document.querySelector(".search-show").blur();
    return input;
  }
}

export default new HeaderView();
