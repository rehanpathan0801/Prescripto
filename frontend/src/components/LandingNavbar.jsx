import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "@/components/ui/button";
import { Hospital, LogIn, UserPlus } from "lucide-react";

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);

  // Add scroll listener for navbar animation
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-all duration-300 border-b
        ${
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 shadow-md border-gray-200 dark:border-gray-800 py-3"
            : "bg-white/60 dark:bg-gray-900/60 border-transparent py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer select-none group transition-all"
        >
          <Hospital className="w-7 h-7 text-sky-600 dark:text-sky-400 group-hover:rotate-6 transition-transform duration-300" />
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-500 dark:from-sky-400 dark:to-blue-300 text-transparent bg-clip-text tracking-tight">
            Prescripto
          </span>
        </div>

        {/* Right Side: Theme + Buttons */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />

          {/* Register Button */}
          <Button
            onClick={() => navigate("/register")}
            variant="outline"
            className="flex items-center gap-2 rounded-full px-5 py-2 text-base font-semibold border-sky-400 text-sky-600 
                       hover:bg-sky-50 dark:border-sky-600 dark:text-sky-400 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <UserPlus className="w-4 h-4" />
            Get Started
          </Button>

          {/* Login Button */}
          <Button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-full px-5 py-2 text-base font-semibold shadow-md 
                       bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 
                       text-white transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
