import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Hospital } from "lucide-react";

export default function Register() {
  const { register, loading, error } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      {/* Register Card */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex flex-col items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80"
                alt="Hospital"
                className="w-24 h-24 object-cover rounded-xl border-4 border-sky-100 shadow-sm"
              />
              <CardTitle className="text-xl font-semibold text-sky-600">
                Create Your Account
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Join Prescripto!
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && (
                <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 text-green-600 text-sm px-3 py-2 rounded-md">
                  Registration successful! Redirecting...
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>

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
      </div>
    </>
  );
}
