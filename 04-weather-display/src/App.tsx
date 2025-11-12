import { useState } from "react";
import "./App.css";
import LocaleInput from "./components/LocaleInput";
import monthsAndDays from "./lib/utils";
function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    data: [],
    isLoading: false,
    error: false,
  });

  return (
    <section className="container">
      <LocaleInput />
    </section>
  );
}

export default App;
