var apiKey = 'c39c525c5d9e071320ceb9a9d74f8d38'; 
var city = 'Charlotte';
var units = 'imperial';
var cityUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city+ '&appid=' + apiKey + '&units=' + units;


fetch(cityUrl)
.then(function(response){
    return response.json();
})
.then(function(data){
    console.log(data);
})
