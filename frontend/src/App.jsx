import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import HistoryAction from "./pages/HistoryAction";
import Datasensor from "./pages/Datasensor";
import Home from "./components/Home";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <div className="flex">
      <BrowserRouter>

        <Home></Home>
        <Routes className="">
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<HistoryAction />} />
          <Route path="/datasensor" element={<Datasensor />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}