export interface CurrentWeather {
  timestamp: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string; // ej. "03d"
}

export async function fetchCurrentWeather(
  cityName: string
): Promise<CurrentWeather> {
  const key = process.env.WEATHER_API_KEY;
  if (!key) throw new Error("Missing WEATHER_API_KEY");

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", cityName);
  url.searchParams.set("appid", key);
  url.searchParams.set("units", "metric");

  const res = await fetch(url.toString());
  if (res.status === 401) {
    throw new Error("Unauthorized: invalid API key");
  }
  if (!res.ok) {
    throw new Error(`OpenWeather error: ${res.status}`);
  }
  const data = await res.json();

  return {
    timestamp: data.dt * 1000,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0]?.description || "",
    icon: data.weather[0]?.icon || "01d",
  };
}
