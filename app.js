// Using OpenWeatherMap API instead of Env. Canada RSS Feed
// because:
// a) Parsing the RSS Feed was becoming too messy
// b) Matching condition descriptions to an icon was becoming cumbersome.
//    The OpenWeatherMap API provides these icons out of the box
const weather = require('openweather-apis');
const weather_API_KEY = require('./config.js');
weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID(weather_API_KEY);

const express = require('express');
const app = express();
app.use(express.static(__dirname + "/public"));

// This should be defined in a model module instead
// of hardcoding it here
const locations = [ 
                  'Dease Lake', 'Fort Nelson', 'Terrace', 'Prince George', 
                  'Whistler', 'Revelstoke', 'Creston'
                ];
// Should use a more meaningful request url that specifies
// the intended behaviour.
app.get('/sse', (req, res) => {
    console.log("Sending Event!");
    // Should set an 'event' field to specify the event type
    // e.g., currentCondition.
    res.status(200).set({
        "connection" : "keep-alive",
        "cache-control" : "no-cache",
        "content-Type" : "text/event-stream"
    });

    // Sending new data on current conditions
    locations.map((location) => {
        weather.setCity(location + ", CA");
        // Should define an interface for the data being sent in a 'models'
        // module
        weather.getAllWeather((err, result) => {
            let data = { cityName : result.name, weather : result.weather[0], temp : result.main.temp }
            res.write('data: ' + JSON.stringify(data) + '\n\n');
        });
    });
});



var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Listening at http://%s:%s", host, port)
});