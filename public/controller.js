

const BC_geocode = {lat:53.7266683,lng:-127.6476205}
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
let mapProp = {
    center:BC_geocode,
    zoom:5,
    styles : myStyle
};

var globMap = new google.maps.Map(document.getElementById("googleMap"), mapProp);
// new google.maps.Marker({
//     position : BC_geocode,
//     map : globMap,
//     label : { text: "BC" },
//     icon : { url : '',
//         scaledSize : new google.maps.Size(0,0),
//         labelOrigin : new google.maps.Point(0, 10)
//     }
// })
var weatherMarkers = {}

const evntSource = new EventSource('/sse');
evntSource.onmessage = (event) => {
    // alert(event.data);
    let weatherData = JSON.parse(event.data);
    if(!weatherMarkers.hasOwnProperty(weatherData.cityName))
    {
        // alert("Add Marker for " + weatherData.cityName);
            geocoder.geocode({'address': weatherData.cityName + ",BC"}, (results, status) => {
            // alert(status);
            let marker = new google.maps.Marker({
                    position : results[0].geometry.location,
                    map : globMap,
                    icon : { 
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
            // alert(JSON.stringify(weatherMarkers));
        });
    }
    else
    {
        // alert("Updating Data!")
        if(weatherData.weather.temp !== weatherMarkers[weatherData.cityName].temp)
        {
            weatherMarkers[weatherData.cityName].temp = weatherData.weather.temp;
            weatherMarkers[weatherData.cityName].marker.setLabel(weatherData.weather.temp.toString() + "°C");
        }
        if(weatherData.weather.icon !== weatherMarkers[weatherData.cityName].condition)
        {
            alert("Changing Condition!");
            weatherMarkers[weatherData.cityName].condition = weatherData.weather.icon;
            let icon = weatherMarkers[weatherData.cityName].marker.getIcon();
            icon.url = "http://openweathermap.org/img/w/" + weatherData.weather.icon + ".png";
            weatherMarkers[weatherData.cityName].marker.setIcon(icon);
        }
    }
};

function myMap() 
{
    
    // geocoder.geocode({'address':"British Columbia"}, (result, status) => {
    //         if(status === google.maps.GeocoderStatus.OK)
    //         {
    //             alert("HERE!");
    //             alert(JSON.stringify(result[0].geometry.location));
                
    //         }
    //         else
    //         {
    //             alert("ERROR!");
    //         }
    // });
    
    // let geocoder = new google.maps.Geocoder();
    // const locations = ["Dease Lake", "Fort Nelson", "Terrace", "Prince George", "Whistler", "Revelstoke", "Creston"];
   
    // geocoder.geocode({'address':"British Columbia"}, (result, status) => {
    //     if(status === google.maps.GeocoderStatus.OK)
    //     {
    //         let mapProp = {
    //             center:result[0].geometry.location,
    //             zoom:5,
    //         };
    //         let map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    //         locations.forEach( (location) => {
    //             geocoder.geocode({'address':location + ",BC"}, (results, status) => {
    //                 let marker = new google.maps.Marker({position:results[0].geometry.location});
    //                 marker.setMap(map);
    //             });
    //         });
    //     }
    //     else{
    //         alert("Fail!");
    //     }
    // });   
    // let citiesMap = {
    //     "bc-74" : "Vancouver",
    //     "bc-70" : "Agassiz",
    // };
    // $.ajax({
    //     url: "/test",
    //     type: "GET",
    //     data: {locations:["bc-74", "bc-70"]}
    // }).done((data) => {

    //     alert(data);
        // data.forEach( (element) => {
        //     let cityName = citiesMap[element.city];
        //     for( const entry of element.entries)
        //     {
        //         if( entry == "Current Conditions")
        //         {
        //             alert(entry);
        //             break;
        //         }
        //     }      
        // });
    // });
}
