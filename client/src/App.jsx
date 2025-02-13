import { useEffect } from "react";
import "./App.css";
import axios from "axios";
import { io } from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import Waves from "./components/Background";
import Index from "./components/Index";

function App() {
  const fetchAPI = async () => {
    await axios.get("http://localhost:8080");
  };

  useEffect(() => {
    fetchAPI();

    const socket = io("http://localhost:8080");

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Waves
        lineColor="#E1C09D"
        backgroundColor="rgba(255, 255, 255, 0.2)"
        waveSpeedX={0.03}
        waveSpeedY={0.03}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />

      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </>
  );
}

export default App;
