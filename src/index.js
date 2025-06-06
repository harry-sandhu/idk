import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LovePage from "./LovePage";
import HeartPage from "./HeartPage"; // 👈 add this import if HeartPage exists
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/love" element={<LovePage />} />
      <Route path="/hearts" element={<HeartPage />} />
    </Routes>
  </BrowserRouter>
);
