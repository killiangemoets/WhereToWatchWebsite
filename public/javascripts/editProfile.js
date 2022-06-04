const usernameInput = document.querySelector("#username");
const iconInput = document.querySelector("#select-icon");
const colorInput = document.querySelector("#select-color");
const backgroundColorInput = document.querySelector("#select-background");
const userPicture = document.querySelector(".user-picture");
const userPictureSub = document.querySelector(".user-picture-sub");
const userIcon = document.querySelector(".fa-solid");
const userName = document.querySelector(".user-name");

const confirmBtn = document.querySelector("#btn--confirm-edit");
const errorMessage = document.querySelector(".profile-error-message");

iconInput.value = iconInput.dataset.icon;
colorInput.value = colorInput.dataset.color;

backgroundColorInput.value = backgroundColorInput.dataset.background;

backgroundColorInput.addEventListener("change", function () {
  userPicture.setAttribute("class", "user-picture");
  userPicture.classList.add(`${backgroundColorInput.value}`);
});

colorInput.addEventListener("change", function () {
  userPictureSub.setAttribute("class", "user-picture-sub");
  userPictureSub.classList.add(`${colorInput.value}`);
});

iconInput.addEventListener("change", function () {
  userIcon.setAttribute("class", "fa-solid");
  userIcon.classList.add(`fa-${iconInput.value}`);
});

usernameInput.addEventListener("change", function () {
  if (usernameInput.value.length > 0) userName.innerHTML = usernameInput.value;
  else userName.innerHTML = usernameInput.dataset.username;
});

confirmBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const updateContent = {
    user: usernameInput.dataset.username,
    username:
      usernameInput.value.length > 0
        ? usernameInput.value
        : usernameInput.dataset.username,
    icon: iconInput.value.length > 0 ? iconInput.value : iconInput.dataset.icon,
    color:
      colorInput.value.length > 0 ? colorInput.value : colorInput.dataset.color,
    backgroundColor:
      backgroundColorInput.value.length > 0
        ? backgroundColorInput.value
        : backgroundColorInput.dataset.background,
  };

  const databaseResponse = await fetch("/users/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateContent),
  });

  const response = await databaseResponse.json();

  if (response.status === "success") {
    // REDIRECT
    errorMessage.innerHTML = "";
    window.location.href = "/";
  } else if (response.message.codeName == "DuplicateKey") {
    // RENDER ERROR
    errorMessage.innerHTML = "This username is already used";
  }
});
