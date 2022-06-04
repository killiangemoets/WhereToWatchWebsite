import * as model from "./model.js";
import showView from "./views/showView.js";
import headerView from "./views/headerView.js";
import resultsView from "./views/resultsView.js";
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
  showView.addHandlerChangeCountry(controlWhereToWatch);
  showView.addHandlerAddToMyList(controlAddToMyList);
};
init();
