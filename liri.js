require("dotenv").config();

var keys = require('./keys')
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var request = require('request'); 
var fs = require('fs');
const chalk = require('chalk');

var spotify = new Spotify(keys.spotify);

var getArtistsNames = function(artist) {
    return artist.name;
}

var getMeSpotify = function(songName) {
    console.log(songName);

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log(data.tracks.items[0]);
        var songs = data.tracks.items; 
        for(var i=0; i<songs.length; i++) {
            console.log(i);
            console.log('artists(s):' + songs[i].artists.map(getArtistsNames));
            console.log('song name:' + songs[i].name); 
            console.log('preview song:' + songs[i].preview_url);
            console.log('album:' + songs[i].album.name);
            console.log('----------------------------------------');
        }
    });
}

var getMeMovie = function(movieName) {
    request('http://www.omdbapi.com/?t=' + movieName + '&apikey=a062f79c', function (error, response, body) {
		if (!error && response.statusCode === 200) {
          
        var jsonData = JSON.parse(body)

        console.log('Title: ' + jsonData.Title);
        console.log('Year: ' + jsonData.Year);
        console.log('Rated: ' + jsonData.Rated);
        console.log('IMDB Rating: ' + jsonData.imdbRating);
        console.log('Country: ' + jsonData.Country);
        console.log('Plot: ' + jsonData.Plot);
        console.log('Language: ' + jsonData.Language);
        console.log('Actors:' + jsonData.Actors);
        }
    
    });
}

var getMeConcert = function(concertName) {
    if (concertName == "") {
        concertName = "Brockhampton"
    }
    request("https://rest.bandsintown.com/artists/" + concertName + "/events?app_id=codingbootcamp", function (error, response, data) {
        try {
            var response = JSON.parse(data)
            if (response.length != 0) {
                console.log(chalk.green(`Upcoming concerts for ${concertName} include: `))
                response.forEach(function (element) {
                    console.log(chalk.cyan("Venue name: " + element.venue.name));
                    if (element.venue.country == "United States") {
                        console.log("City: " + element.venue.city + ", " + element.venue.region);
                    } else {
                        console.log("City: " + element.venue.city + ", " + element.venue.country);
                    }
                    console.log("Date: " + moment(element.datetime).format('MM/DD/YYYY'));
                    console.log();
                })
            } else {
                console.log(chalk.red("No concerts found."));
            }
        }
        catch (error) {
            console.log(chalk.red("No concerts found."));
        }
    
    });
}

function doWhat() {
fs.readFile('random.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});
}


var pick = function(caseData, functionData) {
    switch(caseData) {
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
            break;
        case 'concert-this':
            getMeConcert(functionData);
            break;
        case 'do-what-it-says':
            doWhat(functionData);
            break;
        default:
        console.log('LIRI does not know that');
    }
}

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

var userOption = process.argv[2];
var userSubject = process.argv.slice(3).join(" ");

pick(userOption, userSubject)

