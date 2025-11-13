import { fetchWeatherApi } from "openmeteo";

async function apiTest() {
    const params = {
        latitude: 52.52,
        longitude: 13.41,
        hourly: "temperature_2m",
        models: "gfs_seamless",
        current: ["temperature_2m", "precipitation"],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
        `\nCoordinates: ${latitude}°N ${longitude}°E`,
        `\nElevation: ${elevation}m asl`,
        `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    );

    const current = response.current()!;
    const hourly = response.hourly()!;

    const start = Number(hourly.time());
    const end = Number(hourly.timeEnd());
    const interval = hourly.interval();
    const count = interval > 0 ? Math.floor((end - start) / interval) : 0;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature_2m: current.variables(0)?.value(),
            precipitation: current.variables(1)?.value(),
        },
        hourly: {
            time: Array.from({ length: count }, (_, i) =>
                new Date((start + i * interval + utcOffsetSeconds) * 1000),
            ),
            temperature_2m: hourly.variables(0)?.valuesArray() ?? [],
        },
    };

    // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
    console.log(
        `\nCurrent time: ${weatherData.current.time}\n`,
        `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
        `\nCurrent precipitation: ${weatherData.current.precipitation}`,
    );
    console.log("\nHourly data:\n", weatherData.hourly);
}

export {apiTest}