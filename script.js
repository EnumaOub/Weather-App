
const APIKey = "720d3045495449d59f5221719242106";

const handleError = (err) => {
    console.log(`ERROR: ${err}`);
};

const getWeather = async (location) => {
    const weather = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${location}`, {mode: 'cors'});
    return weather.json().catch(handleError);
};

const formatTemperature = (event, weather, container) => {
    let btnTrue = event.target
    if (event.target.id === "select-celsius" || event.target.id === "select-farenheit" ) {
        btnTrue = document.getElementById(event.target.id).parentElement;
    }

    const celsius = document.querySelector(`#${btnTrue.id} #select-celsius`);
    const farenheit = document.querySelector(`#${btnTrue.id} #select-farenheit`);
    btnTrue.classList.toggle("celsius")
    celsius.classList.toggle("active");   
    farenheit.classList.toggle("active");
    if (event.target.classList.contains("celsius")){
        container.textContent = `${weather.current.temp_c}°C, ${weather.current.condition.text}`;
    }
    else {
        container.textContent = `${weather.current.temp_f}°F, ${weather.current.condition.text}`;
    } 
};


const getLocation = (weather, id) => {
    const location = document.createElement("div");
    const city = document.createElement("p");
    const country = document.createElement("p");


    location.id = id;

    city.textContent = `${weather.location.name},`;
    country.textContent = weather.location.country;
    location.appendChild(city);
    location.appendChild(country);

    return location;
};

const getUIWeather = (weather, id) => {
    const weatherV = document.createElement("div");
    const temperature = document.createElement("p");
    const icon = document.createElement("img");

    weatherV.id = id;

    temperature.textContent = `${weather.current.temp_c}°C, ${weather.current.condition.text}`;
    icon.src = weather.current.condition.icon;
    weatherV.appendChild(temperature);
    weatherV.appendChild(icon);
    
    return [weatherV, temperature];
};

const getBtnFormat = (weather, temperature, id) => {
    const btnFormatTemp = document.createElement("button");

    btnFormatTemp.className = "format-temperature celsius";
    btnFormatTemp.id = id;

    btnFormatTemp.innerHTML = `<span id="select-celsius" class="active">°C</span>/<span id="select-farenheit">°F</span>`;


    btnFormatTemp.addEventListener("click", (event) => {
        formatTemperature(event, weather, temperature);
    });

    return btnFormatTemp;
};

const buildForecast = () => {

};


const buildCurrent = (weather) => {
    const container = document.createElement("div");
    const location = getLocation(weather, "current-weather-location");
    const [weatherV, temperature] = getUIWeather(weather, "current-weather-weather");
    const btnFormatTemp = getBtnFormat(weather, temperature, "current-weather-container");

    container.className = "card";

    container.id = "current-weather-container";

    container.appendChild(btnFormatTemp);
    container.appendChild(location);
    container.appendChild(weatherV);
    
    return container;

};

const buildCards = (weather) => {
    const main = document.getElementsByTagName("main")[0];
    main.innerHTML = "";
    main.appendChild(buildCurrent(weather));
};

const setUI = () => {
    const input = document.getElementById("location-input");
    const form = document.getElementById("location-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        getWeather(input.value)
        .then(weather => {
            console.log(weather);
            buildCards(weather);
        })
        .catch(handleError);
    } )
};

setUI();
