import React, { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const { toasts } = useContext(ToastContext);

  return (
    <div className="fixed top-5 right-5 z-[9999] space-y-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-md text-white text-sm font-medium
              ${t.type === "error" ? "bg-red-500" : "bg-green-500"}
            `}
          >
            {/* Icon */}
            <i
              className={`bi ${
                t.type === "error" ? "bi-x-circle-fill" : "bi-check-circle-fill"
              } text-lg`}
            ></i>

            {/* Message */}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
