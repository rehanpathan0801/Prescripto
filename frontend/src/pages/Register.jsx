import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Hospital, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const { register, loading, error } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(name, email, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
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

      {/* Register Section */}
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-cyan-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black pt-16">
        {/* Left Side Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex justify-center w-1/2"
        >
          <img
            src="https://plus.unsplash.com/premium_vector-1720649830326-aec72b8a447b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880"
            alt="Hospital Registration"
            className="rounded-2xl shadow-2xl object-cover w-4/5 h-[500px] border-4 border-sky-100 dark:border-gray-800"
          />
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center w-full md:w-1/2 px-6"
        >
          <Card className="w-full max-w-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl p-2">
            <CardHeader>
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                >
                  <Hospital className="w-16 h-16 text-sky-500 drop-shadow-md" />
                </motion.div>
                <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Create Your Account
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Join <b>Prescripto</b> and manage your digital health journey.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email Field */}
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

                {/* Error + Success Messages */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded-md border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-600 text-sm px-3 py-2 rounded-md border border-green-200"
                  >
                    Registration successful! Redirecting...
                  </motion.div>
                )}

                {/* Register Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>

              {/* Already Registered */}
              <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-sky-600 hover:underline font-medium"
                >
                  Login here
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
