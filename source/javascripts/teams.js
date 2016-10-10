/* Wrap everything in an IIFE to avoid leaking functions and variables into
 * the global namespace
 */
(function() {
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
    var modal = document.querySelector(".player-modal-wrapper");
    var playerName = modal.querySelector("#player-name");
    var hoursPlayed = modal.querySelector("#hours-played");
    var matchesWon = modal.querySelector("#matches-won");
    var matchesPlayed = modal.querySelector("#matches-played");
    var totalKills = modal.querySelector("#total-kills");
    var totalDeaths = modal.querySelector("#total-deaths");
    var accuracy = modal.querySelector("#accuracy");
    var hours = Math.round(playerStats.hoursPlayed());

    playerName.innerHTML = "<h1>" + playerStats.name + "</h1>"
    hoursPlayed.innerHTML = constructStatHTML("Hours Played", hours);
    matchesWon.innerHTML = constructStatHTML("Matches Won", playerStats.totalMatchesWon);
    matchesPlayed.innerHTML = constructStatHTML("Matches Played", playerStats.totalMatchesPlayed);
    totalKills.innerHTML = constructStatHTML("Total Kills", playerStats.totalKills);
    totalDeaths.innerHTML = constructStatHTML("Total Deaths", playerStats.totalDeaths);
    accuracy.innerHTML = constructStatHTML("Accuracy", playerStats.accuracy());
    modal.classList.remove("loading");
  }

  /* Parse the API response and populate the player modal fields */
  function processStats(playerName, response) {
    responseJSON = JSON.parse(response);
    playerStats = new PlayerStats(playerName);
    playerStats.buildStatsFromJSON(responseJSON);

    setTimeout(function() {
      displayStats(playerStats);
    }, 1500);
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
          // handle failure
        }
      }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
  }

  function handlePlayerSelect(event) {
    var modal = document.querySelector(".player-modal-wrapper");
    var playerId = event.target.dataset.playerId;
    var playerName = event.target.dataset.playerName;

    modal.classList.add("is-open");
    modal.classList.add("loading");
    loadPlayerStats(playerId, playerName);
  }

  var playerElements = document.querySelectorAll(".team-list-player")

  /* Add event listeners to the click event on all players elements. When a
   * player name/thumbnail is clicked, we open a modal with their stats which
   * gets populated by calling Steam's Web API.
   */
  for (let pe of playerElements) {
    pe.addEventListener("click", handlePlayerSelect);
  }
})();
