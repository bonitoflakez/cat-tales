import { Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Store from "./pages/Store";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/store" element={<Store />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
}
