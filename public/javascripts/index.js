const addBtn = document.querySelector(".btn--add");
const maxAccountsMessage = document.querySelector(".max-accounts");

addBtn.addEventListener("click", function () {
  if (+addBtn.dataset.num === 6)
    maxAccountsMessage.innerHTML =
      "You have reached the maximum number of profiles. Please delete one to create another.";
  else window.location.href = "/add-profile";
});

const hiddingIntro = document.querySelector(".container").dataset.intro;
const titleElem = document.querySelector(".intro-title");

console.log(hiddingIntro);
if (hiddingIntro === "true") {
  document.querySelector(".intro").classList.add("hidden");
} else {
  let state = "writing";
  let current = 0;
  let message = "WhereToWatch";

  function writingMessage() {
    if (state === "writing") {
      const messageArray = message.split("");
      titleElem.textContent = titleElem.textContent + messageArray[current];
      current++;
      if (current === messageArray.length) state = "waiting";
    }
  }

  let writing;
  writing = setInterval(function () {
    writingMessage();
  }, 140);

  setTimeout(function () {
    const intro = document.querySelector(".intro");
    intro.style.transition = "all 1s";
    intro.classList.add("hidden");
    // window.location.href = "/add-profile";
  }, 2600);
}
