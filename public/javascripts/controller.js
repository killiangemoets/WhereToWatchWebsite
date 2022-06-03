import * as model from "./model.js";
import showView from "./views/showView.js";
import headerView from "./views/headerView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import myListView from "./views/myListView.js";

const controlShow = async function () {
  try {
    // 0) Render my list
    myListView.renderShowsList(
      model.state.myList,
      model.state.currentPage,
      model.state.query
    );

    // 1) Get the id
    const id = window.location.hash.slice(1);

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
    resultsView.renderShowsList(
      await model.getResultsPage(),
      model.state.currentPage,
      model.state.query
    );
  } catch (err) {
    console.error(err);
    showView.renderError();
  }
};

const controlResults = async function () {
  try {
    // 1) Get the input value
    const input = headerView.getInput();

    console.log(input);

    if (input.length === 0) return;

    // 2) Load results
    resultsView.renderSpinner();
    await model.loadResults(input);

    // 3) Get first page of results and render it
    resultsView.renderShowsList(
      await model.getResultsPage(),
      model.state.currentPage,
      model.state.query
    );

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
    resultsView.renderShowsList(
      await model.getResultsPage(newPage),
      model.state.currentPage,
      model.state.query
    );

    // 2) Update pagination
    paginationView.renderPagination(
      model.state.currentPage,
      model.state.totalResults
    );
  } catch (err) {
    throw err;
  }
};

const initialResults = async function (query, page) {
  try {
    // 1) Get the input value

    await model.getGenres();

    if (query.length === 0) return;

    // 2) Load results
    resultsView.renderSpinner();
    await model.loadResults(query);

    // 3) Get first page of results and render it
    resultsView.renderShowsList(
      await model.getResultsPage(page),
      model.state.currentPage,
      model.state.query
    );

    // 4) Add pagination
    paginationView.renderPagination(
      model.state.currentPage,
      model.state.totalResults
    );
  } catch (err) {
    console.error(err);
  }
};

const controlWhereToWatch = function (newCountry) {
  // Render the show with the updated country
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
    model.state.location
  );

  // 2) Update my list
  myListView.renderShowsList(
    model.state.myList,
    model.state.currentPage,
    model.state.query
  );
};

const init = function () {
  // showView.addHandlerRenderShow(controlShow);
  myListView.renderShowsList(
    model.state.myList,
    model.state.currentPage,
    model.state.query
  );

  headerView.addHandlerSearch(controlResults);

  initialResults(
    document.querySelector(".results-section")
      ? document.querySelector(".results-section").dataset.search
      : "",
    document.querySelector(".results-section")
      ? +document.querySelector(".results-section").dataset.page
      : 1
  );

  paginationView.addHandlerChangePage(controlPage);
  // showView.addHandlerChangeCountry(controlWhereToWatch);
  // showView.addHandlerAddToMyList(controlAddToMyList);
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
