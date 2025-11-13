import { type ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import LocaleInput from "./components/LocaleInput";
import Forecast from "./components/Forecast";
import { apiTest } from "./lib/api";

function App() {
  const weather_data = apiTest();
  console.log(weather_data)
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

  const handleQueryChange = (
    { target: { value } }: ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(value);
  };

  // Cast LocaleInput to any to allow passing props until the component is properly typed
  const LocaleInputAny = LocaleInput as any;

  return (
    <section className="container">
      <LocaleInputAny handleInputChange={handleQueryChange} />
      <pre
        style={{ textAlign: "center" }}
      >{JSON.stringify(weather, null, 2)}</pre>
      <Forecast />
    </section>
  );
}

export default App;
