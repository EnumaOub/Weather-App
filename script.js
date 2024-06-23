


const handleError = (err) => {
    console.log(`ERROR: ${err}`);
};

const getWeather = async (location) => {
    const APIKey = "720d3045495449d59f5221719242106";
    getLoading();
    const weather = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${location}&days=3`, {mode: 'cors'});
    return weather.json().catch(handleError);
};

const formatTemperature = (event, weather, container) => {
    const temperature = document.getElementsByClassName("temperature");
    let btnTrue = event.target
    if (event.target.id === "select-celsius" || event.target.id === "select-farenheit" ) {
        btnTrue = document.getElementById(event.target.id).parentElement;
    }
    const celsius = document.querySelector(`#${btnTrue.id} #select-celsius`);
    const farenheit = document.querySelector(`#${btnTrue.id} #select-farenheit`);

    btnTrue.classList.toggle("celsius")
    celsius.classList.toggle("active");   
    farenheit.classList.toggle("active");
    if (btnTrue.classList.contains("celsius")){
        for (const temp of temperature) {
            temp.classList.toggle("active");
            if (temp.classList.contains("temp-celsius")) {
                temp.style.display = "inline";
                
            }
            else {
                temp.style.display = "none";
            }
        }
    }
    else {
        for (const temp of temperature) {
            temp.classList.toggle("active");
            if (temp.classList.contains("temp-farenheit")) {
                temp.style.display = "inline";
            }
            else {
                temp.style.display = "none";
            }
        }
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

const getWeatherComp = (weather, id) => {
    const weatherComp = document.createElement("div");
    const rainContainer = document.createElement("div");
    const rain = document.createElement("p");
    const rainIcon = document.createElement("img");
    const humidityContainer = document.createElement("div");
    const humidity = document.createElement("p");
    const humidityIcon = document.createElement("img");

    weatherComp.id = id;
    weatherComp.className = "weather-comp";

    rain.textContent = `${weather.day.daily_chance_of_rain}%`;
    rainIcon.src = `./assets/icons/rain.svg`;
    rainIcon.id = "icon-rain";
    rainIcon.className = "icon rain";
    rainContainer.appendChild(rainIcon);
    rainContainer.appendChild(rain);

    humidity.textContent = `${weather.day.avghumidity}%`;
    humidityIcon.src = `./assets/icons/humidity.svg`;
    humidityIcon.id = "icon-humidity";
    humidityIcon.className = "icon humidity";
    humidityContainer.appendChild(humidityIcon);
    humidityContainer.appendChild(humidity);

    weatherComp.appendChild(rainContainer);
    weatherComp.appendChild(humidityContainer);

    return weatherComp;
}

const getUIWeather = (weather, id) => {
    const weatherV = document.createElement("div");
    const temperature = document.createElement("p");
    const icon = document.createElement("img");

    weatherV.id = id;
    weatherV.className = "weather-general"

    temperature.innerHTML = `
                            <span class="temperature temp-celsius active">
                                ${weather.day.avgtemp_c}°C,
                            </span>
                            <span class="temperature temp-farenheit" style="display: none;">
                                ${weather.day.avgtemp_f}°F,
                            </span>
                            ${weather.day.condition.text}
                            `;
    icon.src = weather.day.condition.icon;
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

const buildForecast = (weather) => {
    const container = document.createElement("div");
    const containerCard = document.createElement("div");
    const title = document.createElement("h3");
    const dateDict = {
        Today: 0,
        Tomorrow: 1,
        Overmorrow: 2
    };

    container.className = "card";

    container.id = "forecast-weather-container-global";
    containerCard.id = "forecast-weather-container"
    title.id = "forceast-title";

    title.textContent = "Forecast";
    container.appendChild(title);


    for (const date in dateDict) {
        const card = document.createElement("div");
        const subTitle = document.createElement("h5");
        const forecast = weather.forecast.forecastday[dateDict[date]];
        const weatherForecast = getUIWeather(forecast, `${date}-weather`)[0];
        const weatherComp = getWeatherComp(forecast, `${date}-weather-comp`)

        subTitle.textContent = date;
        subTitle.id = `${date}-title`;

        card.className = "card";
        card.appendChild(subTitle);
        card.appendChild(weatherForecast);
        card.appendChild(weatherComp);
        containerCard.appendChild(card);
    }

    container.appendChild(containerCard);

    return container;

};


const buildCurrent = (weather) => {
    const container = document.createElement("div");
    const location = getLocation(weather, "current-weather-location");
    const [weatherV, temperature] = getUIWeather(weather.forecast.forecastday[0], "current-weather");
    const weatherComp = getWeatherComp(weather.forecast.forecastday[0], "current-weather-comp");
    const btnFormatTemp = getBtnFormat(weather.forecast.forecastday[0], temperature, "current-weather-container");

    container.className = "card";

    container.id = "current-weather-container";

    container.appendChild(btnFormatTemp);
    container.appendChild(location);
    container.appendChild(weatherV);
    container.appendChild(weatherComp);
    
    return container;

};

const buildCards = (weather) => {
    const main = document.getElementsByTagName("main")[0];
    main.innerHTML = "";
    main.appendChild(buildCurrent(weather));
    main.appendChild(buildForecast(weather));
};

const getLoading = () => {
    const main = document.getElementsByTagName("main")[0];
    const loadContainer = document.createElement("div");
    const loading = document.createElement("h1");

    loadContainer.id = "load-container";
    loading.id = "loading";

    loading.textContent = "Loading..."

    loadContainer.appendChild(loading);
    main.appendChild(loadContainer);
}

const setUI = () => {
    const input = document.getElementById("location-input");
    const form = document.getElementById("location-form");
    getWeather("Geneve")
        .then(weather => {
            console.log(weather);
            buildCards(weather);
        })
        .catch(handleError);

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
