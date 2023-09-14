import { Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Store from "./pages/Store";
import Navbar from "./components/Navbar/Navbar";
import Auth from "./pages/Auth";
import Special from "./pages/Special";

function PrivateRoute({ component: Component }) {
  const userLocalData = JSON.parse(localStorage.getItem("userData"));

  if (!userLocalData || !userLocalData.user_token) {
    return <Navigate to="/auth" />;
  }

  return <Component />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<PrivateRoute component={Dashboard} />} />
          <Route
            path="/inventory"
            element={<PrivateRoute component={Inventory} />}
          />
          <Route path="/store" element={<PrivateRoute component={Store} />} />
          <Route
            path="/special"
            element={<PrivateRoute component={Special} />}
          />
          <Route
            path="/settings"
            element={<PrivateRoute component={Settings} />}
          />
          <Route path="/auth" element={<Auth />} />

          {/* <Route path="/" element={<Dashboard />} /> */}
          {/* <Route path="/inventory" element={<Inventory />} /> */}
          {/* <Route path="/store" element={<Store />} /> */}
          {/* <Route path="/special" element={<Special />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </div>
    </>
  );
}
