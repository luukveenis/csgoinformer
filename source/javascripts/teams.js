(function() {
  function handlePlayerSelect(event) {
    modal = document.getElementById("player-modal");
    modal.className = "is-open";
  }

  playerElements = document.querySelectorAll(".team-list-player")

  for (let pe of playerElements) {
    pe.addEventListener("click", handlePlayerSelect);
  }
})();
