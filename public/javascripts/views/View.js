export default class View {
  renderSpinner() {
    const markup = `
            <div class="spinner-div">
                <i class="ph-spinner-fill spinner"></i>
            </div>
        `;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <i class="ph-warning-fill"></i>
        <p>${message}</p>
      </div>`;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
