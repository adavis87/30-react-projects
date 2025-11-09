import { useState } from "react";
import "./App.css";

function App() {
  let time = new Date().toLocaleTimeString();
  const [localTime, setTime] = useState(time);
  const updateTime = () => {
    time = new Date().toLocaleTimeString();
    setTime(time);
  };
  setInterval(updateTime);
  return (
    <div className="container">
    <h1>
      The current time is: <br /> {localTime}
    </h1>
    <h2>{new Date().toDateString()}</h2>
    </div>
  );
}

export default App;
