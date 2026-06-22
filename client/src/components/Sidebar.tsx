import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  UsersIcon,
 LogOutIcon
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboardIcon, path: "/dashboard" },
    { name: "Accounts", icon: UsersIcon, path: "/accounts" },
    { name: "Scheduler", icon: CalendarDaysIcon, path: "/scheduler" },
    { name: "AI Composer", icon: SparklesIcon, path: "/ai-composer" },
  ];
  const location = useLocation();

  const { logout, user } = {
    logout: () => {
      window.location.href = "/";
    },
    user: { name: "Ramiz", email: "ramiz@example.com" },
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 flex flex-col h-full transform transition-transform duration-300 ease-in-out z-50 md:translate-x-0 -translate-x-full md:relative
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      {/* logo */}
      <div className="text-2xl font-bold mb-6">
        <div className="flex items-center gap-2 text-xl tracking-tight text-slate-100">
          <img src="/logo.svg" alt="Logo" className="size-6" />
          Scheduler
        </div>
      </div>

      {/* Nav section Label*/}
      <div className="px-6 py-2">
        <span className="text-gray-400 text-sm uppercase tracking-wide">
          Menu
        </span>
      </div>

      {/* NavLinka */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${isActive ? "bg-gray-700 text-red-500" : "text-gray-300 hover:text-white"}`}
            >
              <item.icon
                className={`size-5 shrink-0 ${isActive ? "text-red-500" : "text-gray-400"}`}
              />
              {item.name}
              {isActive && (
                <span className="ml-auto w-[10px] h-[10px] bg-red-500 rounded-full " />
              )}
            </NavLink>
          );
        })}
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center   rounded-xl  hover:bg-slate-50 gap-2 transition-colors">
            <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
                <div className="text-sm font-medium">{user?.name || "User"}</div>
                <div className="text-xs text-slate-400">{user?.email || "user@example.com"}</div>
            </div>
        </div>
        <button 
        onClick={logout}
        className="mt-1 w-full px-3 py-2 flex items-center  gap-2 text-sm text-red-500 hover:bg-red-50 transition-all rounded duration-150">
            <LogOutIcon className="size-4"/>
            Sign Out
        </button>



      </div>
    </div>
  );
};

export default Sidebar;
