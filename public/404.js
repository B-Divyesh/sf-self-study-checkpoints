document.querySelector(".skip-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  const main = document.querySelector("main");
  main?.focus();
  history.replaceState(null, "", `${location.pathname}#main`);
});
