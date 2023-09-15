import { NavLink } from "react-router-dom";

export default function Navbar() {
  const logoutUser = () => {
    localStorage.removeItem("userData");
  };

  return (
    <nav className="bg-black py-4">
      <div className="container mx-auto flex justify-center space-x-4">
        <NavLink
          to="/"
          className="px-4 py-2 text-white hover:bg-neutral-900 rounded-lg focus:outline-none"
          activeClassName="bg-neutral-900"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/inventory"
          className="px-4 py-2 text-white hover:bg-neutral-900 rounded-lg focus:outline-none"
          activeClassName="bg-neutral-900"
        >
          Inventory
        </NavLink>
        <NavLink
          to="/store"
          className="px-4 py-2 text-white hover:bg-neutral-900 rounded-lg focus:outline-none"
          activeClassName="bg-neutral-900"
        >
          Store
        </NavLink>
        <NavLink
          to="/special"
          className="px-4 py-2 text-white hover:bg-neutral-900 rounded-md focus:outline-none"
          activeClassName="bg-neutral-900"
        >
          Special
        </NavLink>
        <NavLink
          to="/settings"
          className="px-4 py-2 text-white hover:bg-neutral-900 rounded-md focus:outline-none"
          activeClassName="bg-neutral-900"
        >
          Settings
        </NavLink>
        <NavLink
          to="/auth"
          className="px-4 py-2 text-white hover:bg-neutral-900 rounded-md focus:outline-none"
          activeClassName="bg-neutral-900"
        >
          Login/Signup
        </NavLink>
        <NavLink
          to="/auth"
          className="px-4 py-2 text-white hover:bg-neutral-900 rounded-md focus:outline-none"
          activeClassName="bg-neutral-900"
          onClick={logoutUser}
        >
          Logout
        </NavLink>
      </div>
    </nav>
  );
}
