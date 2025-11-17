import React from "react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Stethoscope, ClipboardList, ShieldCheck, Users2, HeartPulse } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <LandingNavbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-100 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black">
        {/* Decorative background blobs */}
        <div className="absolute w-[400px] h-[400px] bg-blue-300/30 dark:bg-blue-600/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-cyan-300/30 dark:bg-cyan-600/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" />

        <div className="max-w-7xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center md:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Revolutionizing <br />
              <span className="bg-gradient-to-r from-sky-600 to-cyan-500 text-transparent bg-clip-text">
                Digital Healthcare
              </span>
            </h1>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-md mx-auto md:mx-0">
              <b>Prescripto</b> connects doctors, patients, and labs on one smart platform — enabling secure appointments, e-prescriptions, and real-time health insights.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <Button
                size="lg"
                className="rounded-full px-8 py-5 text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
                onClick={() => navigate("/login")}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i> Get Started / Login
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-5 text-lg border-2 border-sky-400 text-sky-600 dark:border-sky-500 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-gray-800 font-semibold transition-transform duration-300 hover:scale-105"
                onClick={() => navigate("/register")}
              >
                <i className="bi bi-person-plus me-2"></i> Create Account
              </Button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <Card className="overflow-hidden shadow-2xl rounded-2xl border-4 border-sky-100 dark:border-gray-800 hover:shadow-cyan-200/30 transition-all duration-500 max-w-md">
              <CardContent className="p-0">
                <img
                  src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
                  alt="Digital Healthcare"
                  className="object-cover w-full h-[420px] hover:scale-105 transition-transform duration-700"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white"
          >
            Why Choose <span className="text-sky-600">Prescripto?</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Stethoscope className="w-10 h-10 text-sky-600" />,
                title: "Smart Appointments",
                desc: "Book, reschedule, and manage doctor visits in seconds with real-time availability.",
              },
              {
                icon: <ClipboardList className="w-10 h-10 text-blue-600" />,
                title: "Digital Prescriptions",
                desc: "Doctors can instantly send prescriptions, ensuring accuracy and zero paper waste.",
              },
              {
                icon: <HeartPulse className="w-10 h-10 text-pink-600" />,
                title: "Test Management",
                desc: "Labs and patients can track tests, upload reports, and view results seamlessly.",
              },
              {
                icon: <Users2 className="w-10 h-10 text-green-600" />,
                title: "Feedback & Support",
                desc: "Foster communication between patients, doctors, and hospitals effortlessly.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-indigo-600" />,
                title: "Secure & Reliable",
                desc: "Advanced encryption and data protection ensure complete privacy and trust.",
              },
              {
                icon: <Stethoscope className="w-10 h-10 text-cyan-600" />,
                title: "All-in-One Platform",
                desc: "Prescripto unifies healthcare services into one intuitive digital experience.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full hover:shadow-lg hover:shadow-sky-100 dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-sky-50 dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-4">Start Your Digital Health Journey Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of patients, doctors, and labs using Prescripto to simplify and secure healthcare management.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="rounded-full px-8 py-5 text-lg font-semibold bg-white text-sky-600 hover:bg-sky-50 shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <i className="bi bi-rocket-takeoff me-2"></i> Get Started for Free
          </Button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 bg-gray-100 dark:bg-gray-900 text-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} <b>Prescripto</b>. All rights reserved.
      </footer>
    </>
  );
}
