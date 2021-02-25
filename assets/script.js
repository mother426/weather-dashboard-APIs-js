const apiKey = "c39c525c5d9e071320ceb9a9d74f8d38";
let searchedCities = [];
// initial function fired when user clicks search button, event listener on search button
function getWeather(cityName){

    let cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey + '&units=imperial';        
    fetch(cityURL)
    .then(function(response){
        return response.json();      
    })
    .then(function(response){
        let currentWeatherIcon = 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png';
        let currentTime = response.dt;
        let convertedTime = new Date(currentTime*1000);
        let formattedTime = moment(convertedTime).format('MM/DD/YYYY, h:mm');
        let currentWeatherCard = `
        <h2><img src="${currentWeatherIcon}">${response.name} ${formattedTime}</h2>
        <ul class="list-unstyled">
            <li>Temperature: ${response.main.temp}&#8457;</li>
            <li>Humidity: ${response.main.humidity}%</li>
            <li>Wind Speed: ${response.wind.speed} MPH</li>
            <li id="uvIndex"></li>
        </ul>`;
        $('#current-weather').html(currentWeatherCard);

        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        let uvIndexUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey
        fetch(uvIndexUrl)
        .then (function(response){
            return response.json();
        })
        .then(function(response){
            $('#uvIndex').html('UV Index: ' + response.value);
            getFutureForecast(cityName);
            // searchedCities = JSON.parse(localStorage.getItem('searchHistory'));
            if(!searchedCities.includes(cityName)){

            saveToList(cityName);       
            }
        })
    })
};

$('#search-button').on('click', function(){   
    let userInput = $('#city-input').val().trim();
    getWeather(userInput);
});
// Gets future forecast from weather api after searched weather data is loaded 
function getFutureForecast(cityName){

    let futureForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial' + '&appid='+ apiKey;
    $('#future-forecast').empty();
    fetch(futureForecastUrl)
    .then(function(response){
        return response.json();
    })
    .then (function(response){
        for (var i = 3; i < response.list.length; i += 8){
            let forecastWeatherIcon = 'http://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png';
            let forecastDate = response.list[i].dt;
            let unixToDate = new Date(forecastDate*1000);
            let formattedUnix = moment(unixToDate).format('MM/DD/YYYY');
            let forecastTemp = response.list[i].main.temp;
            let forecastHumidity = response.list[i].main.humidity;
            let forecastCards = `
            <div class = col-2>
            <h6><img src="${forecastWeatherIcon}">${formattedUnix}</h2>
            <ul class="list-unstyled">
                <li>Temperature: ${forecastTemp}&#8457;</li>
                <li>Humidity: ${forecastHumidity}%</li>
            </ul>
            </div>`;
            $('#future-forecast').append(forecastCards);
            $('#city-input').val('');
        }
    })
};

// Saves searched cities to user localstorage
var searchedCityList = JSON.parse(localStorage.getItem('searchHistory')) || [];
function saveToList(cityName){

    searchedCityList.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchedCityList));
    console.log(searchedCityList);
    renderSearchList();
};
// renders searched cities as clickable buttons uder search bar
function renderSearchList(){
    searchedCities = JSON.parse(localStorage.getItem('searchHistory'));

    console.log(searchedCities)
    $('#city-history').text('');   
    for (var i = 0; i < searchedCities.length; i++){
            var newCity = `<button class = "btn-secondary cityBtn">${searchedCities[i]}</button>`;       
            $('#city-history').append(newCity);
            console.log('rendersearchlist');
    }  
};
// clear history button event listener
$('#clear-search-history').on('click', function(){
    localStorage.clear();
    $('#city-history').html('');
});
// init renders searched cities list if previous data exists in localstorage 
function init(){
    var savedCities = (localStorage.getItem('searchHistory'));
    if (savedCities !== null){
        renderSearchList();
    }
};

init();
// City buttons displays according city weather when clicked

$('.cityBtn').on('click', function(){
    console.log('buttonclicked')
    getWeather($(this).html());
});