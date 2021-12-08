export const keys: Record<string, boolean> = {};

window.addEventListener("keydown", function (e) {
  keys[e.code] = true;
});
window.addEventListener("keyup", function (e) {
  keys[e.code] = false;
});

document.querySelector("#left")?.addEventListener("touchstart", function () {
  keys["left"] = true;
});
document.querySelector("#left")?.addEventListener("touchend", function () {
  keys["left"] = false;
});

document.querySelector("#right")?.addEventListener("touchstart", function () {
  keys["right"] = true;
});
document.querySelector("#right")?.addEventListener("touchend", function () {
  keys["right"] = false;
});

document
  .querySelector("#accellerate")
  ?.addEventListener("touchstart", function () {
    keys["accellerate"] = true;
  });
document
  .querySelector("#accellerate")
  ?.addEventListener("touchend", function () {
    keys["accellerate"] = false;
  });

document.querySelector("#break")?.addEventListener("touchstart", function () {
  keys["break"] = true;
});
document.querySelector("#break")?.addEventListener("touchend", function () {
  keys["break"] = false;
});
