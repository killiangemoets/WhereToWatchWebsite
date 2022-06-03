import PreviewView from "./previewView.js";

class ResultsView extends PreviewView {
  _parentElement = document.querySelector(".results");
  _errorMessage =
    "We could not find any result for your query. Please try another query!";
}

export default new ResultsView();
