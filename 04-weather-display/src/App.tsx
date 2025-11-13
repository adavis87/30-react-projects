import { type ChangeEvent, useState } from "react";
import "./App.css";
import LocaleInput from "./components/LocaleInput";

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
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
      >{JSON.stringify(query, null, 2)}</pre>
    </section>
  );
}

export default App;
