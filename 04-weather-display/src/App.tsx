import { type ChangeEvent, useEffect, useState } from "react";
import { Button } from "./components/ui/button";

import LocaleInput from "./components/LocaleInput";
import { CardDemo } from "./components/CardDemo";
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
    <>
      <section className="border-solid border-4 border-indigo-500">
        <h1 className="text-2xl pt-2">Weather App</h1>
        <div className="flex justify-between">
          <CardDemo />
          <CardDemo />
          <CardDemo />
          <CardDemo />
        </div>
      </section>
    </>
  );
}

export default App;
