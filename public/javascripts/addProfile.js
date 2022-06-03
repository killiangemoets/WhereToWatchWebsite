const usernameInput = document.querySelector("#new-username");
const iconInput = document.querySelector("#new-icon");
const colorInput = document.querySelector("#new-color");
const backgroundColorInput = document.querySelector("#new-background");

const userPicture = document.querySelector(".user-picture");
const userPictureSub = document.querySelector(".user-picture-sub");
const userIcon = document.querySelector(".fa-solid");
const userName = document.querySelector(".user-name");

const confirmBtn = document.querySelector("#btn--confirm-add");

const errorUsername = document.querySelector("#new-username-error");
const errorIcon = document.querySelector("#new-icon-error");
const errorColor = document.querySelector("#new-color-error");
const errorBackground = document.querySelector("#new-background-error");

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
  else userName.innerHTML = "Username";
});

confirmBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  //   console.log("click");
  errorUsername.innerHTML = "";
  errorIcon.innerHTML = "";
  errorColor.innerHTML = "";
  errorBackground.innerHTML = "";

  if (
    usernameInput.value.length > 0 &&
    iconInput.value.length > 0 &&
    colorInput.value.length > 0 &&
    backgroundColorInput.value.length > 0
  ) {
    const newUser = {
      username: usernameInput.value,
      icon: iconInput.value,
      color: colorInput.value,
      backgroundColor: backgroundColorInput.value,
    };

    const databaseResponse = await fetch("/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const response = await databaseResponse.json();

    console.log(response);

    if (response.status === "success") {
      // REDIRECT
      window.location.href = "/";
    } else if (response.message.indexOf("duplicate key") !== -1) {
      // RENDER ERROR
      errorUsername.innerHTML = "This username is already used";
    }
  } else {
    if (usernameInput.value.length === 0)
      errorUsername.innerHTML = "Please provide a username";
    if (iconInput.value.length === 0)
      errorIcon.innerHTML = "Please choose an icon";
    if (colorInput.value.length === 0)
      errorColor.innerHTML = "Please choose a color";
    if (backgroundColorInput.value.length === 0)
      errorBackground.innerHTML = "Please choose a background color";
  }
});
