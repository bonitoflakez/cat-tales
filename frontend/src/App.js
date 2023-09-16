import { Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.page";
import Inventory from "./pages/Inventory.page";
import Settings from "./pages/Settings.page";
import Store from "./pages/Store.page";
import Navbar from "./components/Navbar/Navbar";
import Auth from "./pages/Auth.page";
import Special from "./pages/Special.page";

function PrivateRoute({ component: Component }) {
  const userLocalData = JSON.parse(localStorage.getItem("userData"));

  if (!userLocalData?.user_token) {
    return <Navigate to="/auth" replace />;
  }

  return <Component />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <>
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
        </Routes>
      </>
    </>
  );
}
