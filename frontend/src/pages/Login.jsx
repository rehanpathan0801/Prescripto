import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Hospital, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, loading, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [savedEmails, setSavedEmails] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Redirect logged-in users
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "doctor") navigate("/doctor");
      else if (user.role === "patient") navigate("/patient");
      else if (user.role === "lab") navigate("/lab");
    }
  }, [user, navigate]);

  // Load saved emails
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedEmails")) || [];
    setSavedEmails(saved);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);

    // Save email for future autocomplete
    if (email && !savedEmails.includes(email)) {
      const updated = [email, ...savedEmails].slice(0, 5);
      setSavedEmails(updated);
      localStorage.setItem("savedEmails", JSON.stringify(updated));
    }
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm z-50 flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800"
      >
        <div
          className="flex items-center gap-2 text-sky-600 font-bold text-lg cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          <Hospital className="w-5 h-5" />
          <span>Prescripto</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="rounded-full border-sky-300 dark:border-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-gray-800"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>
      </motion.nav>

      {/* Main Login Section */}
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-cyan-100 to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-black pt-16">
        {/* Left Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex justify-center w-1/2"
        >
          <img
            src="https://plus.unsplash.com/premium_vector-1682298570780-c416aa7b710f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1038"
            alt="Healthcare"
            className="rounded-2xl shadow-2xl object-cover w-4/5 h-[500px] border-4 border-sky-100 dark:border-gray-800"
          />
        </motion.div>

        {/* Right Side - Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center w-full md:w-1/2 px-6"
        >
          <Card className="w-full max-w-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-2">
            <CardHeader>
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                  >
                    <Hospital className="w-16 h-16 text-sky-500 drop-shadow-md" />
                  </motion.div>
                </div>
                <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Sign in to continue managing <b>Prescripto</b>.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field with Autocomplete */}
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    placeholder="Enter your email"
                    autoComplete="on"
                    required
                  />
                  {showDropdown && savedEmails.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
                      {savedEmails
                        .filter((e) => e.toLowerCase().includes(email.toLowerCase()))
                        .map((e, i) => (
                          <li
                            key={i}
                            className="px-3 py-2 hover:bg-sky-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                            onClick={() => {
                              setEmail(e);
                              setShowDropdown(false);
                            }}
                          >
                            {e}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                {/* Password Field with Show/Hide */}
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-8 text-gray-500 hover:text-sky-600"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>

              {/* Register Link */}
              <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                New here?{" "}
                <Link
                  to="/register"
                  className="text-sky-600 hover:underline font-medium"
                >
                  Register now
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
