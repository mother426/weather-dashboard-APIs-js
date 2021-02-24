const apiKey = "c39c525c5d9e071320ceb9a9d74f8d38";

// working urls to fetch from that are modular
// var cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units='+ units;

// fetch(cityURL)
// .then(function(response){
//     return response.json();
// })
// .then(function(data){
//     console.log(data)
// })


function getWeather(){
    let userInput = $('#city-input').val().trim();
    let cityURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&appid=' + apiKey + '&units=imperial';
    
    
    fetch(cityURL)
    .then(function(response){
        return response.json();      
    })
    .then(function(response){

        let currentWeatherIcon = 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png';


        let currentTime = response.dt;
        var convertedTime = new Date(currentTime*1000);


        let currentWeatherCard = `
        <h2><img src="${currentWeatherIcon}">${response.name} ${convertedTime}</h2>
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

        })
        getFutureForecast();
        saveToList();
       
    })
};

$('#search-button').on('click', function(event){
    event.preventDefault();
    getWeather(event);
});

function getFutureForecast(){
    let userInput = $('#city-input').val().trim();
    let futureForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + userInput + '&units=imperial' + '&appid='+ apiKey;
    $('#future-forecast').empty();
    fetch(futureForecastUrl)
    .then(function(response){
        return response.json();
    })
    .then (function(response){

        // index positions 3, 11, 19, 27, 35
        for (var i = 3; i < response.list.length; i += 8){
            let forecastWeatherIcon = 'http://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png';
            let forecastDate = response.list[i].dt;
            let unixToDate = new Date(forecastDate*1000);
            let forecastTemp = response.list[i].main.temp;
            let forecastHumidity = response.list[i].main.humidity;
            let forecastCards = `
            <div class = col-2>
            <h6><img src="${forecastWeatherIcon}">${unixToDate}</h2>
            <ul class="list-unstyled">
                <li>Temperature: ${forecastTemp}&#8457;</li>
                <li>Humidity: ${forecastHumidity}%</li>
            </ul>
            </div>`;
            $('#future-forecast').append(forecastCards);
            $('#city-input').val('');
        }
    })
}


var searchedCityList = JSON.parse(localStorage.getItem('searchHistory')) || [];
function saveToList(){
    let listInput = $('#city-input').val().trim();
    let listInputString = listInput;
    searchedCityList.push(listInputString);
    localStorage.setItem('searchHistory', JSON.stringify(searchedCityList));
    console.log(searchedCityList);
    renderSearchList();
}

function renderSearchList(){
    
    searchedCities = JSON.parse(localStorage.getItem('searchHistory'));
    let listInput = $('#city-input').val().trim();
    console.log(searchedCities)
    // cityList = localStorage.getItem('searchHistory');
    
    
    $('#city-history').text('');
    
    
    for (var i = 0; i < searchedCities.length; i++){
            var newCity = `<button class = btn-secondary cityBtn>${searchedCities[i]}</button>`
        
            console.log(searchedCities[i])
            $('#city-history').append(newCity);
            console.log('rendersearchlist');
    }
};


function init(){
    var savedCities = (localStorage.getItem('searchHistory'));
    if (savedCities !== null){
        renderSearchList();
    }
};

init();

$('#clear-search-history').on('click', function(){
    localStorage.clear();
    $('#city-history').html('');
})

$('.cityBtn').on('click', function(){
    
});

