import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "@/components/ui/button"; // ✅ Shadcn Button

export default function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#1a2233] shadow-md z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-hospital text-sky-500 text-2xl"></i>
          <span className="text-xl font-bold text-sky-600 dark:text-sky-400">
            Prescripto
          </span>
        </div>

        {/* Right side: Theme + Login */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <Button
            onClick={() => navigate("/login")}
            className="rounded-full px-5 py-2 text-base font-semibold shadow-sm bg-sky-500 hover:bg-sky-600 text-white transition-all"
          >
            <i className="bi bi-box-arrow-in-right mr-2"></i>
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
