import { type ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import LocaleInput from "./components/LocaleInput";
import Forecast from "./components/Forecast";
function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<{
    data: any;
    isLoading: boolean;
    error: boolean;
  }>({
    data: [],
    isLoading: false,
    error: false,
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const API_URL =
      `https://api.openweathermap.org/data/3.0/onecall?lat=40.09&lon=-75.12&exclude=hourly&appid=${import.meta.env.VITE_API_KEY}`;
      fetch(API_URL, { signal }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error: ${API_URL}`);
      }
      return res.json().then((data) =>
        setWeather({ data, isLoading: false, error: false })
      );
    });
    return () => controller.abort();
  }, []);

  const handleQueryChange = (
    { target: { value } }: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(value);
  };

  const LocaleInputAny = LocaleInput as any;

  return (
    <section className="container">
      <LocaleInputAny handleInputChange={handleQueryChange} />
      <pre
        style={{ textAlign: "center", fontSize: "10pt" }}
      >{JSON.stringify({weather, query}, null, 2)}</pre>
      <Forecast />
    </section>
  );
}

export default App;
