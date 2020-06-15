
$(document).ready(function () {

    // Should use the Gecode API to get this instead of
    // hardcoding it
    const BC_geocode = {lat:53.7266683,lng:-127.6476205};
    const geocoder = new google.maps.Geocoder();
    let myStyle = [
        {
            "featureType" : "administrative.locality",
            "stylers" : [{"visibility" : "off"}]
        },
        {
            "featureType" : "administrative.neighborhood",
            "stylers" : [{"visibility" : "off"}]
        },
        {
            "featureType" : "road",
            "stylers" : [{"visibility" : "off"}]
        }
    ]
    const mapProp = {
        center:BC_geocode,
        zoom:5,
        styles : myStyle
    };
    const globMap = new google.maps.Map($("#googleMap")[0], mapProp);
    // Maps city names to their markers on the map
    // Ideally, the key should consist of the city name, country and state (if applicable)
    // Also, an interface for the values being stored should be explicitly defined
    const weatherMarkers = {}

    const evntSource = new EventSource('/sse');
    // Should define event handlers for different event types,
    // instead of this global handler
    evntSource.onmessage = (event) => {

        let weatherData = JSON.parse(event.data);
        if(!weatherMarkers.hasOwnProperty(weatherData.cityName))
        {
                geocoder.geocode({'address': weatherData.cityName + ",BC"}, (results, status) => {
                let marker = new google.maps.Marker({
                        position : results[0].geometry.location,
                        map : globMap,
                        icon : {
                                // Should define a function that returns the URL below instead of hardcoding it
                                url : "http://openweathermap.org/img/w/" + weatherData.weather.icon + ".png",
                                labelOrigin : new google.maps.Point(40,5),
                            },
                        label : {text : weatherData.temp.toString() + "°C"} 
                });
                let locationLabel = new google.maps.Marker({
                    icon : { 
                                url : '', 
                                scaledSize : new google.maps.Size(0,0),
                                labelOrigin : new google.maps.Point(0, 0)
                        },
                    position : marker.getPosition(),
                    map : globMap,
                    label : {text : weatherData.cityName }
                })
                weatherMarkers[weatherData.cityName] = 
                    {   temp : weatherData.temp, 
                        condition : weatherData.weather.icon, 
                        marker : marker
                    };
            });
        }
        else
        {
            if(weatherData.weather.temp !== weatherMarkers[weatherData.cityName].temp)
            {
                weatherMarkers[weatherData.cityName].temp = weatherData.temp;
                weatherMarkers[weatherData.cityName].marker.setLabel(weatherData.temp.toString() + "°C");
            }
            if(weatherData.weather.icon !== weatherMarkers[weatherData.cityName].condition)
            {
                weatherMarkers[weatherData.cityName].condition = weatherData.weather.icon;
                let icon = weatherMarkers[weatherData.cityName].marker.getIcon();
                // Should define a function that returns the URL below instead of hardcoding it
                icon.url = "http://openweathermap.org/img/w/" + weatherData.weather.icon + ".png";
                weatherMarkers[weatherData.cityName].marker.setIcon(icon);
            }
        }
    };

});