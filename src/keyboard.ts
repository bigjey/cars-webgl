export const keys: Record<string, boolean> = {};

window.addEventListener("keydown", function (e) {
  keys[e.code] = true;
});
window.addEventListener("keyup", function (e) {
  keys[e.code] = false;
});
