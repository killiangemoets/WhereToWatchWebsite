import PreviewView from "./previewView.js";

class MyListView extends PreviewView {
  _parentElement = document.querySelector(".myList");
  _errorMessage = "Your list is empty.";

  constructor() {
    super(); //Recap: only after calling super we wan use the this keyword
    this._hiddenListAfterClickingOnAShow();
  }

  _hiddenListAfterClickingOnAShow() {
    this._parentElement.addEventListener("click", function (e) {
      const show = e.target.closest(".show-card");
      if (show) {
        document.querySelector(".mylist-section").classList.toggle("hidden");
      }
    });
  }
}

export default new MyListView();
