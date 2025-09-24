"use client";

import React, { useState, useEffect } from "react";

const SybHeading = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const messages = [
    "Organize and track your inventory tasks efficiently",
    "Happy Durga Puja! May this season bring you joy.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsAnimating(false);
      }, 400); // Wait for animation to complete before changing text
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="h-8 md:h-10 flex items-center overflow-hidden ">
      <p
        className={`text-sm md:text-lg text-gray-600 dark:text-gray-300 transition-all duration-400 transform-gpu ${
          isAnimating
            ? "animate-[rotateOut_0.4s_ease-in-out] opacity-0 -translate-y-full rotate-x-90"
            : "animate-[rotateIn_0.4s_ease-in-out] opacity-100 translate-y-0 rotate-x-0"
        }`}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {messages[currentIndex]}
      </p>

      <style jsx>{`
        @keyframes rotateOut {
          0% {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) rotateX(-90deg);
            opacity: 0;
          }
        }

        @keyframes rotateIn {
          0% {
            transform: translateY(100%) rotateX(90deg);
            opacity: 0;
          }
          100% {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SybHeading;
