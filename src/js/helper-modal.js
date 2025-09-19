function showOverviewDialog(msg, mid) {
  const dialog = document.createElement("dialog");
  dialog.classList.add("show-dialog");
  dialog.textContent = msg;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("button-container"); // tbd

  // i dont care btn
  const closeButton = document.createElement("button");
  closeButton.textContent = "uninteressant";
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
  buttonDiv.appendChild(closeButton);

  // goto movie btn
  const detailsButton = document.createElement("button");
  detailsButton.textContent = "zum Film";
  detailsButton.addEventListener("click", () => {
    dialog.close();
    window.location.href = `target-movie.html?id=${mid}`;
    dialog.close();
  });
  buttonDiv.appendChild(detailsButton);
  dialog.appendChild(buttonDiv);
  document.body.appendChild(dialog);

  dialog.showModal();
}

function showFoundedMoviesDialog(codetemplate) {
  const dialog = document.createElement("dialog");
  dialog.classList.add("show-founded-movies-dialog");
  dialog.innerHTML = codetemplate;

  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("button-container"); // tbd

  const closeButton = document.createElement("button");
  closeButton.textContent = "Schließen";
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
  buttonDiv.appendChild(closeButton);
  dialog.appendChild(buttonDiv);
  document.body.appendChild(dialog);

  dialog.showModal();
}

export { showOverviewDialog, showFoundedMoviesDialog };
