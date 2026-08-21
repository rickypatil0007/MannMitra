"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const QUOTES = [
  '"Jab tak tum khud par vishwas nahi karte, tab tak koi aur bhi nahi karega."',
  '"You don\'t have to be perfect to be worthy of peace."',
  '"Small steps forward are still steps forward."',
  '"Your academic worth does not define your human worth."',
  '"It is okay to pause and catch your breath."'
];

export function DailyMotivationCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3] flex items-center justify-center">
      {/* Back Card (Stacked Effect) */}
      <motion.div
        initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
        animate={{ rotate: -3, scale: 0.95, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl"
      />
      
      {/* Front Card */}
      <motion.div
        initial={{ rotate: 6, scale: 0.9, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center gap-2 mb-6">
          <Quote className="w-8 h-8 text-[var(--primary)] opacity-80" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-[var(--primary)] uppercase">
              Daily Motivation
            </span>
          </div>
        </div>
        
        <div className="relative flex-1 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-display text-2xl text-white/90 leading-[1.4] italic absolute w-full"
            >
              {QUOTES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
