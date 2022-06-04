import * as model from "./model.js";
import headerView from "./views/headerView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import myListView from "./views/myListView.js";

const controlResults = async function () {
  try {
    // 1) Get the input value
    const input = headerView.getInput();

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
};
init();
