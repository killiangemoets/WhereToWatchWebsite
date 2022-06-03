import * as model from "./model.js";
import showView from "./views/showView.js";
import headerView from "./views/headerView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import myListView from "./views/myListView.js";

const controlShow = async function () {
  try {
    // 0) Render my list
    myListView.renderShowsList(model.state.myList);

    // 1) Get the id
    // const id = window.location.hash.slice(1);
    const id = document.querySelector(".show-section").dataset.showId;

    // 2) Render the show
    if (!id) return;
    showView.renderSpinner();
    await model.loadShow(id);
    showView.renderShow(
      model.state.showInfos,
      model.state.showProviders,
      model.state.location
    );

    // 3) Mark the active show
    if (!model.state.query) return;
    resultsView.renderShowsList(await model.getResultsPage());
  } catch (err) {
    console.error(err);
    showView.renderError();
  }
};

const controlResults = async function () {
  try {
    // 1) Get the input value
    const input = headerView.getInput();

    // 2) Load results
    resultsView.renderSpinner();
    await model.loadResults(input);

    // 3) Get first page of results and render it
    resultsView.renderShowsList(await model.getResultsPage());

    // 4) Add pagination
    paginationView.renderPagination(
      model.state.currentPage,
      model.state.totalResults
    );
  } catch (err) {
    console.error(err);
  }
};

const controlPage = async function (newPage) {
  try {
    // 1) Render new page and update current page number
    resultsView.renderShowsList(await model.getResultsPage(newPage));

    // 2) Update pagination
    paginationView.renderPagination(
      model.state.currentPage,
      model.state.totalResults
    );
  } catch (err) {
    throw err;
  }
};

const controlWhereToWatch = function (newCountry) {
  // Render the show with the updated country

  //   model.state.currentCountry = newCountry;
  model.state.selectedCountry = newCountry;
  showView.renderShow(
    model.state.showInfos,
    model.state.showProviders,
    model.state.location,
    newCountry
  );
};

const controlAddToMyList = function () {
  // 1) Render the show with the heart button updated
  model.addToMyList();
  showView.renderShow(
    model.state.showInfos,
    model.state.showProviders,
    model.state.location,
    model.state.selectedCountry
  );

  // 2) Update my list
  myListView.renderShowsList(model.state.myList);
};

const init = function () {
  showView.addHandlerRenderShow(controlShow);
  //   headerView.addHandlerSearch(controlResults);
  //   paginationView.addHandlerChangePage(controlPage);
  showView.addHandlerChangeCountry(controlWhereToWatch);
  showView.addHandlerAddToMyList(controlAddToMyList);
};
init();

const logoutBtn = document.querySelector(".btn--logout");
const logoutIcon = logoutBtn.querySelector(".fa-solid");
const icon = logoutBtn.dataset.icon;

logoutBtn.addEventListener("mouseover", function () {
  // logoutBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i>';
  logoutIcon.setAttribute("class", "fa-solid");
  logoutIcon.classList.add("fa-arrow-right-from-bracket");
});
logoutBtn.addEventListener("mouseleave", function () {
  // logoutBtn.innerHTML = `<i class="fa-solid fa-${logoutBtn.dataset.icon}"></i>`;
  logoutIcon.setAttribute("class", "fa-solid");
  logoutIcon.classList.add(`fa-${icon}`);
});

document.body.addEventListener("click", function (e) {
  console.log(e.target);
  console.log(e.target.closest(".btn--logout"));
  if (e.target.closest(".btn--logout")) window.location.href = "/";
});
