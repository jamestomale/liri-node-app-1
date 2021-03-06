require("dotenv").config();
var Twitter = require("twitter")
var Spotify = require("node-spotify-api")
var Request = require("request")
var fs = require("fs")

//var spotify = new Spotify(keys.spotify);

var keys = require("./key")
var decision = process.argv[2]
var call = process.argv[3]

switch (decision) {
  case "my-tweets":
    tweets()
    break;
  case `spotify-this-song`:
    spot()
    break;
  case `movie-this`:
    moviesearch()

    break;
  case `do-what-it-says`:
    dowhatitsays()
    break;
  default:
    console.log("this is not a valid command")
}

function tweets() {
  var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret,

  });

  var params = { screen_name: 'realDonaldTrump' };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      //console.log(tweets);
    }
    //console.log(tweets)
    for (var i = 0; i < 10; i++) {
      console.log("Username: " + tweets[i].user.screen_name + ".")
      console.log("Tweet: " + tweets[i].text);
      console.log("-----------------------------------------------");
    }


  });
}
function spot() {


  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

  var song = process.argv.slice(3).join(" ")
  spotify.search({ type: 'track', query: song }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    var artistNames = [];
    var artistsArr = data.tracks.items[0].artists;

    console.log("Song Name: " + data.tracks.items[0].name);
    console.log("-----------------------------------------------");
    //console.log(data.tracks.items[0])
    for (i = 0; i < artistsArr.length; i++) {
      artistNames.push(" " + artistsArr[i].name)
    }
    console.log("Artists: " + artistNames);
    console.log("-----------------------------------------------");
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("-----------------------------------------------");
    console.log("Track Link: " + data.tracks.items[0].external_urls.spotify);
    console.log("-----------------------------------------------");
  });
}

function moviesearch() {
  var call = process.argv.slice(3).join(" ")

  Request("http://www.omdbapi.com/?t=" + call + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
      // If there were no errors and the response code was 200 (i.e. the request was successful)...
      if (!error && response.statusCode === 200) {

          //  Setting up the data in a variable so we can append it to te file later
          var data = JSON.parse(body, null, 2);
          var movieTitle = "Title: " + data.Title;
          var releaseYear = "Release Year: " + data.Year;
          var imbdRating = "imbdRating: " + data.imdbRating;
          var rTomato = "Rotten Tomatoes Rating: " + data.Ratings[1].Value;
          var movieCountry = "Country where the movie was produced: " + data.Country;
          var movieLanguage = "Language of the movie: " + data.Language;
          var moviePot = "Plot: " + data.Plot;
          var movieActors = "Actors: " + data.Actors;
          var dataDisplayed = movieTitle + "\n" + releaseYear + "\n" + imbdRating + "\n" + rTomato + "\n" + movieLanguage + "\n" + movieCountry + "\n" + moviePot + "\n" + movieActors + "\n";
          console.log("\n" + dataDisplayed);

          // Appending the entry to the log.txt file
          fs.appendFile("log.txt", dataDisplayed, function (err) {
              if (err) {
                  console.log(err);
              }
          });
      }
  });
}



function dowhatitsays() {
  fs.readFile("random.txt", "utf8", function (error, data) {


    if (error) {
      return console.log(error);
    }

    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr[0]);

    var command = dataArr[0]
    switch (command) {
      case "my-tweets":
        tweets()
        break;
      case `spotify-this-song`:
        whatspot()
        break;
      case `movie-this`:

        break;
      case `do-what-it-says`:
        dowhatitsays()
        break;
      default:
        console.log("this is not a valid command")




    }
    function whatspot() {


      var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
      });

      var song = dataArr[1]
      spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        var artistNames = [];
        var artistsArr = data.tracks.items[0].artists;

        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("-----------------------------------------------");
        //console.log(data.tracks.items[0])
        for (i = 0; i < artistsArr.length; i++) {
          artistNames.push(" " + artistsArr[i].name)
        }
        console.log("Artists: " + artistNames);
        console.log("-----------------------------------------------");
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("-----------------------------------------------");
        console.log("Track Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("-----------------------------------------------");
      });
    }

  });

}