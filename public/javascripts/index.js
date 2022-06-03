const addBtn = document.querySelector(".btn--add");
const maxAccountsMessage = document.querySelector(".max-accounts");

addBtn.addEventListener("click", function () {
  if (+addBtn.dataset.num === 6)
    maxAccountsMessage.innerHTML =
      "You have reached the maximum number of profiles. Please delete one to create another.";
  else window.location.href = "/add-profile";
});
