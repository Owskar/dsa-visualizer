import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import LandingPage from "./components/LandingPage.jsx";
import AlgorithmPage from "./components/AlgorithmPage.jsx";
import { useProgress } from "./hooks/useProgress.js";
import { useTheme } from "./hooks/useTheme.js";

export default function App() {
  const progress = useProgress();
  const { theme, toggle } = useTheme();

  return (
    <HashRouter>
      <Header theme={theme} onToggleTheme={toggle} />
      <Routes>
        <Route path="/" element={<LandingPage progress={progress} />} />
        <Route path="/algo/:id" element={<AlgorithmPage progress={progress} theme={theme} />} />
      </Routes>
    </HashRouter>
  );
}
