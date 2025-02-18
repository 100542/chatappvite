import "./App.css";
import { Routes, Route } from "react-router-dom";
import Waves from "./components/Background";
import Index from "./components/Index";
import Network from "./components/Network";

function App() {

  return (
    <>
      <Waves
        lineColor="#E1C09D"
        waveSpeedX={0.03}
        waveSpeedY={0.03}
        waveAmpX={40}
        waveAmpY={30}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/network" element={<Network />} />
      </Routes>
    </>
  );
}

export default App;
