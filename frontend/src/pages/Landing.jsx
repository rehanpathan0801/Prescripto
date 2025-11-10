import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <LandingNavbar />

      <div className="flex items-center justify-center min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-cyan-100">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6">
          {/* Left Section */}
          <div className="space-y-5 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-blue-600 leading-tight">
              Welcome to <span className="text-cyan-600">Prescripto</span>
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed">
              <b>Prescripto</b> is a next-generation digital healthcare platform
              built to transform the way patients, doctors, and care providers
              connect — with smart prescriptions, real-time doctor availability,
              and effortless appointment management.
            </p>

            <ul className="text-blue-600 text-base space-y-2">
              <li className="flex items-center gap-2">
                <i className="bi bi-person-plus text-green-500"></i>
                Patient Registration & Appointments
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-clipboard2-pulse text-blue-500"></i>
                Test Booking & Results
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-prescription2 text-cyan-500"></i>
                Doctor Prescriptions
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-chat-dots text-yellow-500"></i>
                Feedback & Communication
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-shield-plus text-red-500"></i>
                Admin Management
              </li>
            </ul>

            <Button
                size="lg"
                className="mt-4 font-semibold text-lg px-6 py-5 rounded-xl shadow-md bg-black text-white hover:bg-gray-900"
                onClick={() => navigate("/login")}
              >
               <i className="bi bi-box-arrow-in-right me-2"></i> Get Started / Login
              </Button>

          </div>

          {/* Right Section */}
          <div className="flex justify-center">
            <Card className="overflow-hidden shadow-lg rounded-2xl border-4 border-blue-100 max-w-md">
              <CardContent className="p-0">
                <img
                  src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
                  alt="Hospital"
                  className="object-cover w-full h-[400px]"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
