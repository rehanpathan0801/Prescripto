import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle2, Hospital, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-sky-50 via-white to-sky-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <Hospital className="w-6 h-6 text-sky-600 group-hover:rotate-6 transition-transform" />
            <span className="text-xl font-bold text-sky-700 dark:text-sky-400 tracking-tight">
              Prescripto
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            <ThemeSwitch />

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {user && (
                <>
                  <div className="flex items-center gap-2 bg-sky-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-sky-100 dark:border-gray-700 shadow-sm">
                    <UserCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleLogout}
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-950"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && user && (
        <div className="md:hidden fixed top-[60px] left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col gap-3 shadow-lg z-40">

          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {user.name} ({user.role})
          </div>

          <Button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            variant="outline"
            className="w-full text-red-600"
          >
            Logout
          </Button>
        </div>
      )}
    </>
  );
}