"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-ana-darkblue/60">
      <motion.div
        className="fixed inset-0 backdrop-blur-[120px] shadow-ana-darkblue flex items-center justify-center z-50"
        initial={{ x: "-100%" }}
        animate={{ x: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Tilted white bar with skeleton loading */}
        <motion.div
          className="absolute w-full min-w-md h-64 overflow-hidden bg-opacity-70"
          style={{
            transform: "rotate(-75deg)",
            background: "rgba(255, 255, 255, 0.25)", // translucent white
            borderRadius: "8px",
            position: "relative",
            backdropFilter: "blur(10px)", // glass blur
            WebkitBackdropFilter: "blur(10px)", // for Safari
            border: "1px solid rgba(255, 255, 255, 0.3)", // subtle border
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // soft shadow
          }}
        >
          {/* Skeleton loading animation */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(220,220,220,0.35) 50%, rgba(255,255,255,0) 100%)",
              backgroundSize: "200% 100%",
              mixBlendMode: "overlay",
            }}
            animate={{
              backgroundPosition: ["200% 0", "-200% 0"],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Cardano Logo */}
          <div className="absolute inset-0 flex items-center justify-center rotate-[75deg]">
            <img
              src="/cardano.webp"
              width={120}
              height={120}
              alt="Cardano Logo"
              className="w-32 h-32"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
