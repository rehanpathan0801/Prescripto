import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm rounded-b-2xl">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-primary font-semibold text-xl"
      >
        <i className="bi bi-hospital text-primary text-2xl"></i>
        Prescripto
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <ThemeSwitch />

        {user && (
          <>
            {/* User Info */}
            <div className="text-right mr-3">
              <div className="text-gray-800 font-semibold">{user.name}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>

          {/*  Doctor link temporarily disabled
            {user.role === "doctor" && (
              <Button
                variant="outline"
                onClick={() => navigate("/doctor/patient-tests")}
                className="text-sm"
              >
                Patient Tests
              </Button>
            )}
            */}


           {/* Admin Links 
            {user.role === "admin" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/manage-tests")}
                  className="text-sm"
                >
                  Manage Tests
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/manage-test-bookings")}
                  className="text-sm"
                >
                  Test Bookings
                </Button>
              </div>
            )}
            */}
            {/* Logout */}
            <Button
              variant="destructive"
              size="sm"
              className="ml-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
