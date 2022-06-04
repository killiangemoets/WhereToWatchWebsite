import View from "./View.js";

class HeaderView extends View {
  _parentElement = document.querySelector(".header-section");
  _errorMessage = "";

  constructor() {
    super(); //Recap: only after calling super we wan use the this keyword
    this._renderMyList();
    this._handleLogout();
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

  _handleLogout() {
    const logoutBtn = document.querySelector(".btn--logout");
    const logoutIcon = logoutBtn.querySelector(".fa-solid");
    const icon = logoutBtn.dataset.icon;

    logoutBtn.addEventListener("mouseover", function () {
      logoutIcon.setAttribute("class", "fa-solid");
      logoutIcon.classList.add("fa-arrow-right-from-bracket");
    });
    logoutBtn.addEventListener("mouseleave", function () {
      logoutIcon.setAttribute("class", "fa-solid");
      logoutIcon.classList.add(`fa-${icon}`);
    });

    document.body.addEventListener("click", function (e) {
      if (e.target.closest(".btn--logout")) window.location.href = "/";
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
