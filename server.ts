import { Application, Router, ensureFile } from "./deps.ts";
// import { loadEnv } from "./utils.ts";
import { WeatherData, NoiseEntry } from "./interfaces.ts";

// await loadEnv();
const TOKEN = Deno.env.get("TOKEN");

const app = new Application();

const router = new Router();
router.get("/", async () => {
  const json = await Deno.readTextFile("_data/data.json");
  return new Response(json, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
});
router.post("/", async (request) => {
  const token = request.headers.get("Authorization");
  if (token !== `Bearer ${TOKEN}`) {
    return new Response(null, { status: 401 });
  }
  const lat = Deno.env.get("LAT");
  const lon = Deno.env.get("LON");
  const key = Deno.env.get("OPEN_WEATHER_KEY");
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`
  );
  const weatherData: WeatherData = await response.json();

  const entry: NoiseEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    noiseLevel: parseInt(await request.text()),
    weather: {
      temp: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      tempMin: weatherData.main.temp_min,
      tempMax: weatherData.main.temp_max,
      pressure: weatherData.main.pressure,
      humidity: weatherData.main.humidity,
      clouds: weatherData.clouds.all,
      wind: {
        ...weatherData.wind,
      },
      condition: {
        category: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
      },
    },
  };

  if (weatherData.rain) {
    entry.weather.rain = {
      lastHour: weatherData.rain["1h"],
      last3Hours: weatherData.rain["3h"],
    };
  }

  const data: NoiseEntry[] = JSON.parse(
    (await Deno.readTextFile("_data/data.json")) || "[]"
  );
  data.push(entry);
  await Deno.writeTextFile(
    "_data/data.json",
    JSON.stringify(data, undefined, 2)
  );

  return new Response(JSON.stringify(entry), {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
});

await ensureFile("_data/data.json");

app.use(router);
app.start({ port: 7575 });
