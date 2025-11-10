import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react"; 

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border border-sky-300 text-sky-600 hover:bg-sky-50 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-800 transition-all"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span>Light</span>
        </>
      )}
    </Button>
  );
}
