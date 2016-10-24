/* Author: Luuk Veenis
 * Date: October 23, 2016
 *
 * This module is used to retrieve news for Counter Strike from Valve's web
 * API. It handles the AJAX requests to the server, as well as parsing it and
 * displaying the response on the page
 */
$(function() {
  const CS_APP_ID = 730;

  /* Object constructor function for NewsItems.
   * This is a fairly simple object to wrap the response from the server and
   * provide some utility functions for generating HTML we can display to
   * the user */
  function NewsItem(response) {
    // build the news item using the API response
    this.title = response.title;
    this.author = response.author;
    this.date = response.date;
    this.url = response.url;
    this.feedName = response.feedname;
    this.feedLabel = response.feedlabel;
    this.content = response.contents;

    /* Returns a human-readable date string */
    this.dateString = function () {
      date = new Date(this.date * 1000);
      return date.toUTCString();
    }

    /* Returns an HTML string for the header of a news item */
    this.generateHeader = function() {
      var result = [];
      result.push("<h1 class='news-item-header'>" + this.title + "</h1>");
      result.push("<p class='news-item-description'>");
      result.push("Posted by: " + this.feedLabel + "<br>");
      result.push("Author: " + this.author + "<br>");
      result.push("Date: " + this.dateString());
      result.push("</p>");

      return result.join("\n");
    }

    /* Returns an HTML string for the body of a news item */
    this.generateBody = function () {
      var result = [];
      result.push("<p>");
      result.push(this.content);
      result.push("</p>");
      result.push("<p>");
      result.push("<a class='read-more' href='" + this.url + "'>Read the original story...</a>");
      result.push("</p>");

      return result.join("\n");
    }

    /* Returns the HTML representation of this news item */
    this.generateHTML = function() {
      return [
        "<div class='news-item'>",
        this.generateHeader(),
        this.generateBody(),
        "</div>"
      ].join("\n");
    }
  }

  /* Returns the endpoint URL to retrieve news items from */
  function newsItemsUrl() {
    return "//luuk.freerunningtech.com/ISteamNews/GetNewsForApp/v0002/";
  }

  /* Handler function to process the data returned by the server on
   * successful completion of the request. */
  function handleSuccess(data) {
    var newsItems = $.map(data.appnews.newsitems, function(val, i) {
      return new NewsItem(val).generateHTML();
    });

    $(".news-container").html(newsItems);
  }

  /* Displays an error message if the request to retrieve the latest news
   * from the server failed */
  function handleFailure(data) {
    $(".news-container").html("<h1>Failed to retrieve news articles</h1>");
  }

  /* Retrieves the latest *count* news entries for the app specified by *appId*
   * This will call appropriate handling functions for successful and failed
   * responses from the server. */
  function getNewsForApp(appId, count) {
    $.getJSON(newsItemsUrl(), {
      appid: appId,
      count: count,
      maxlength: 1000
    }).
    done(handleSuccess).
    fail(handleFailure);
  }

  // Retrieve the latest news for Counter Strike
  getNewsForApp(CS_APP_ID, 20);
});
