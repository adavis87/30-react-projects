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
    const fetchWeatherData = async () => {
      const API_URL = import.meta.env.VITE_API_KEY;
      console.log(API_URL);
    };
    fetchWeatherData();
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
      >{JSON.stringify(weather, null, 2)}</pre>
      <Forecast />
    </section>
  );
}

export default App;
