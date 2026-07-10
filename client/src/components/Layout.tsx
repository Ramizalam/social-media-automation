import { MenuIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const PageTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Social Accounts",
  "/scheduler": "Post Scheduler",
  "/ai-composer": "AI Composer",
};

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const title = PageTitle[currentPath] || "Social Media Automation";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-row w-full h-screen bg-slate-50 ">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar  */}
        <header
          className="flex items-center justify-between bg-white p-4 shadow-md md:px-8 gap-4"
        >
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon />
          </button>

          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm text-slate-400 hidden sm:block">
              manage and automate your social presence
            </p>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          {/* Main Content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
