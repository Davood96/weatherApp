

// const ecweather = require('ec-weather');
const weather = require('openweather-apis');
const weather_API_KEY = require('./config.js');
weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID(weather_API_KEY);
const express = require('express');

const app = express();
app.use(express.static(__dirname = "public"));

const locations = [ 
                  'Dease Lake', 'Fort Nelson', 'Terrace', 'Prince George', 
                  'Whistler', 'Revelstoke', 'Creston'
                ];

app.get('/sse', (req, res) => {
    console.log("Sending Event!");
    res.status(200).set({
        "connection" : "keep-alive",
        "cache-control" : "no-cache",
        "content-Type" : "text/event-stream"
    });

    // Sending new data
    locations.map((location) => {
        weather.setCity(location + ", CA");
        weather.getAllWeather((err, result) => {
            let data = { cityName : result.name, weather : result.weather[0], temp : result.main.temp }
            res.write('data: ' + JSON.stringify(data) + '\n\n');
        });
    });
});



var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
});