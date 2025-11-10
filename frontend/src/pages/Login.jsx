import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Hospital } from "lucide-react";

export default function Login() {
  const { login, loading, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "doctor") navigate("/doctor");
      else if (user.role === "patient") navigate("/patient");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 flex items-center justify-between px-6 py-3">
        <div
          className="flex items-center gap-2 text-sky-600 font-bold text-lg cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Hospital className="w-5 h-5" />
          <span>Prescripto</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="rounded-full border-sky-300 dark:border-sky-700 dark:text-sky-300"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </nav>

      {/* Login Card */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex flex-col items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="Hospital"
                className="w-24 h-24 object-cover rounded-xl border-4 border-sky-100 shadow-sm"
              />
              <CardTitle className="text-xl font-semibold text-sky-600">
                Welcome to Prescripto
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hospital Management System
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              New patient?{" "}
              <Link
                to="/register"
                className="text-sky-600 hover:underline font-medium"
              >
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
