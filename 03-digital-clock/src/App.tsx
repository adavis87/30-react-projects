import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState(Date.now());
  const frameDelay = 1000;
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      console.log(date);
    }, frameDelay);
    return () => clearInterval(intervalId);
  });
  return <>Hours:Minutes:Seconds {date}</>;
}

export default App;
