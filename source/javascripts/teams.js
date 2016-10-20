/* Wrap everything in an IIFE to avoid leaking functions and variables into
 * the global namespace
 */
(function() {
  var KEYCODE_ESCAPE = 27;
  var PLAYER_MODAL = new PlayerModal(document.querySelector(".player-modal-wrapper"));

  /* Converts string from underscore to camel case
   * ie: my_string => myString */
  function underscoreToCamelCase(string) {
    return string.replace(/_([a-z])/g, function (match) {
      return match[1].toUpperCase();
    });
  }

  /* Contructor function for the Player object.
   * The constructor only takes the player's name as a parameter, but provides
   * a buildStatsFromJSON function that populates the player's stats using
   * the JSON response from Steam's API */
  function PlayerStats(name) {
    this.name = name;

    /* Calculates the hit percentage from shots hit vs. shots fired */
    this.accuracy = function() {
      return (this.totalShotsHit / this.totalShotsFired).toFixed(4);
    }

    /* Returns the total number of hours played
     * Since timePlayed is an integers, this will truncate to the nearest hour */
    this.hoursPlayed = function() {
      return this.totalTimePlayed / 3600;
    }

    /* Populate the player's stats using the API's JSON response.
     * The stats are returned in an array of objects, so we can iterate over
     * the array and transform the stat names into attributes */
    this.buildStatsFromJSON = function(responseJSON) {
      this.steamId = responseJSON.playerstats.steamID;
      for (let stat of responseJSON.playerstats.stats) {
        var attributeName = underscoreToCamelCase(stat.name);
        this[attributeName] = stat.value;
      }
    }
  }

  /* Utility class to wrap modifications to the player modal. This avoids
   * having to find the required fields each time. */
  function PlayerModal(modalElement) {
    this.element = modalElement;

    /* Setter functions:
     * The following set of functions are used to populate the modal fields */
    this.setName = function(nameText) {
      this.element.querySelector("#player-name").innerHTML = nameText;
    }

    this.setHours = function(hoursText) {
      this.element.querySelector("#hours-played").innerHTML = hoursText;
    }

    this.setMatchesWon = function(matchesWonText) {
      this.element.querySelector("#matches-won").innerHTML = matchesWonText;
    }

    this.setMatchesPlayed = function(matchesPlayedText) {
      this.element.querySelector("#matches-played").innerHTML = matchesPlayedText;
    }

    this.setTotalKills = function(totalKillsText) {
      this.element.querySelector("#total-kills").innerHTML = totalKillsText;
    }

    this.setTotalDeaths = function(totalDeathsText) {
      this.element.querySelector("#total-deaths").innerHTML = totalDeathsText;
    }

    this.setAccuracy = function(accuracyText) {
      this.element.querySelector("#accuracy").innerHTML = accuracyText;
    }
    /* End of setter functions */

    /* Opens up the modal window */
    this.show = function() {
      this.element.classList.add("is-open");
    }

    /* Closes the modal window */
    this.hide = function() {
      this.element.classList.remove("is-open");
    }

    /* Causes loading spinner to be displayed */
    this.startLoading = function() {
      this.element.classList.add("loading");
    }

    /* Removes the loading spinner */
    this.stopLoading = function() {
      this.element.classList.remove("loading");
    }

    /* Clears all modal fields, otherwise we would see the previous player's
     * stats after the first time we select a player. */
    this.clear = function() {
      this.setName("");
      this.setHours("");
      this.setMatchesWon("");
      this.setMatchesPlayed("");
      this.setTotalKills("");
      this.setTotalDeaths("");
      this.setAccuracy("");
    }
  }

  /* Generates the markup we want to insert into the placeholder elements in
   * the player modal, using the value obtained from the API */
  function constructStatHTML(name, value) {
    result = [];
    result.push("<div class='stat-wrapper'>");
    result.push("<span class='stat-name'>" + name + "</span>");
    result.push("<span class='stat-value'>" + value + "</span>");
    result.push("</div>");
    return result.join("\n");
  }

  /* Locates the player modal and all its placeholder elemements and then
   * populates them using the PlayerStats object previously constructed. */
  function displayStats(playerStats) {
    var hours = Math.round(playerStats.hoursPlayed());

    PLAYER_MODAL.setName("<h1>" + playerStats.name + "</h1>");
    PLAYER_MODAL.setHours(constructStatHTML("Hours Played", hours));
    PLAYER_MODAL.setMatchesWon(constructStatHTML("Matches Won", playerStats.totalMatchesWon));
    PLAYER_MODAL.setMatchesPlayed(constructStatHTML("Matches Played", playerStats.totalMatchesPlayed));
    PLAYER_MODAL.setTotalKills(constructStatHTML("Total Kills", playerStats.totalKills));
    PLAYER_MODAL.setTotalDeaths(constructStatHTML("Total Deaths", playerStats.totalDeaths));
    PLAYER_MODAL.setAccuracy(constructStatHTML("Accuracy", playerStats.accuracy()));
    PLAYER_MODAL.stopLoading();
  }

  /* Parse the API response and populate the player modal fields */
  function processStats(playerName, response) {
    responseJSON = JSON.parse(response);
    playerStats = new PlayerStats(playerName);
    playerStats.buildStatsFromJSON(responseJSON);

    /* Wait a second to display the stats. This is to demonstrate how worst-case
     * response time is handled by displaying a loading icon. Normally the API
     * responds so fast you wouldn't even see the spinner. */
    setTimeout(function() {
      displayStats(playerStats);
    }, 1000);
  }

  /* Displays an error message in the modal */
  function displayErrorMessage(playerName) {
    errorText = "<h3>";
    errorText += "Failed to retrieve stats for player '" + playerName + "'";
    errorText += "</h3>"
    PLAYER_MODAL.setName(errorText);
  }

  /* Returns the stats API URL for the given app and player */
  function playerStatsUrl(appId, playerId) {
    return "//luuk.freerunningtech.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=" +
      appId + "&key=AA87E4A6A5329DBA3DDD9FB0E563EF32&steamid=" + playerId;
  }

  /* Makes the AJAX request to Steam's Web API for the player matching the
   * id parameter. Returns the raw JSON as returned from the API.  */
  function loadPlayerStats(playerId, playerName) {
    var endpoint = playerStatsUrl(730, playerId); // 730 = CS:GO
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      // readyState 4 means the request has completed
      if (this.readyState == 4) {
        // 200 means the request succeeded
        if (this.status == 200) {
          processStats(playerName, this.responseText);
        } else {
          PLAYER_MODAL.stopLoading();
          displayErrorMessage(playerName);
        }
      }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
  }

  /* Handler function for when a player name is clicked.
   * Displays the modal with a loading icon and initiates the AJAX call */
  function handlePlayerSelect(event) {
    var playerId = event.currentTarget.dataset.playerId;
    var playerName = event.currentTarget.dataset.playerName;

    PLAYER_MODAL.clear();
    PLAYER_MODAL.startLoading();
    PLAYER_MODAL.show();
    loadPlayerStats(playerId, playerName);
  }

  /* Determines if the modal should be closed depending on where the user clicked.
   * If the user clicked on the X or outside the modal, we should close it. */
  function shouldCloseModal(clickEvent) {
    var classes = clickEvent.target.classList;
    return classes.contains("player-modal-wrapper") || classes.contains("player-modal-close");
  }

  /* Add event listeners to the click event on all players elements. When a
   * player name/thumbnail is clicked, we open a modal with their stats which
   * gets populated by calling Steam's Web API.
   */
  var playerElements = document.querySelectorAll(".team-list-player")
  for (let pe of playerElements) {
    pe.addEventListener("click", handlePlayerSelect);
  }

  /* Close the player modal if the user presses the escape key */
  document.body.addEventListener("keyup", function(event) {
    if (event.keyCode == KEYCODE_ESCAPE) {
      PLAYER_MODAL.hide();
    }
  });

  /* Add an event listener for any click on the modal, closing the modal if the
   * user clicked on the X or anywhere outside of it. */
  PLAYER_MODAL.element.addEventListener("click", function(event) {
    if (shouldCloseModal(event)) {
      PLAYER_MODAL.hide();
    }
  });

  $(".teams-carousel").slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 750
  });
})();
