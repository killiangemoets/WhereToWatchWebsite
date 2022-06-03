const profiles = document.querySelectorAll(".btn--edit-menu");

console.log(profiles);

// profiles.forEach((profile) => {
//   const icon = profile.dataset.icon;
//   const color = profile.dataset.color;
//   const background = profile.dataset.background;
//   const username = profile.dataset.username;
//   profile.addEventListener("mousedown", function () {
//     profile.innerHTML = `
//         <div class="user-picture ${color} ${background}">
//             <i class="fa-solid fa-${icon}"></i>
//         </div>
//         <p class="user-name">${username}</p>`;
//   });

//   profile.addEventListener("mouseover", function () {
//     profile.innerHTML = `
//         <div class="user-picture }">
//             <i class="fa-solid fa-user-pen"></i>
//         </div>
//         <p class="user-name">${username}</p>`;
//   });
// });
