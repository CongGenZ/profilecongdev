"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? scrolled / total : 0);
      setVisible(scrolled > 320);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Arc: starts at 12 o'clock (rotated -90deg in SVG), fills clockwise
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={scrollTop}
          aria-label="Cuộn lên đầu trang"
          className="fixed bottom-[100px] right-8 z-50 cursor-pointer active:scale-95 transition-transform duration-100"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <div className="relative w-12 h-12">
            {/* SVG progress ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 48 48"
              fill="none"
            >
              {/* Track (background circle) */}
              <circle
                cx="24"
                cy="24"
                r={RADIUS}
                stroke="#DBEAFE"
                strokeWidth="2.5"
              />
              {/* Progress arc */}
              <circle
                cx="24"
                cy="24"
                r={RADIUS}
                stroke="url(#scrollGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.1s linear" }}
              />
              <defs>
                <linearGradient id="scrollGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            {/* White inner circle + arrow */}
            <div
              className="absolute inset-[4px] rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: "0 2px 8px rgba(59,130,246,0.15)" }}
            >
              <ArrowUp size={16} strokeWidth={2.2} style={{ color: "#3B82F6" }} />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
