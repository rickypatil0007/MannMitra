"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const QUOTES = [
  "Jab tak tum khud par vishwas nahi karte, tab tak koi aur bhi nahi karega.",
  "Har naya din ek nayi shuruaat hoti hai. Kal ki chinta chhod do.",
  "Khushi kisi aur se nahi, khud ke andar se aati hai.",
  "Mushkilen aati hain, par woh tumhe todne nahi, mazboot banane aati hain.",
  "Acha socho, acha hoga. Tumhari soch tumhara kal banati hai.",
  "Ruk jao thodi der, saans lo. Sab theek ho jayega.",
  "Tum akele nahi ho, ye waqt bhi guzar jayega.",
  "Andhere ke baad hi savera aata hai. Thoda sabar rakho.",
  "Tumhari muskaan kisi aur ka din bana sakti hai.",
  "Zindagi lambi hai, ek choti si galti sab kuch khatam nahi karti.",
  "Apne aap ko waqt do, har ghaav bhar jata hai.",
  "Rona koi kamzori nahi hai, yeh toh dil halka karne ka tarika hai.",
  "Koshish karne walon ki kabhi haar nahi hoti.",
  "Tum kal se behtar ho, aur kal aur bhi behtar hoge.",
  "Duniya kya sochegi, yeh sochna chhod do. Tum apne liye jiyo.",
  "Thodi der rukna theek hai. Haar manna theek nahi.",
  "Choti choti baaton mein khushi dhundna seekho.",
  "Jo hota hai ache ke liye hota hai, bas waqt lagta hai samajhne mein.",
  "Apni tulna kisi aur se mat karo, tumhari journey alag hai.",
  "Ek lamba saans lo, aur khud se kaho: Main kar sakta hoon."
];

export function HinglishQuotes() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * QUOTES.length);
        } while (next === prev);
        return next;
      });
    }, 6000); // Change every 6 seconds
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="relative w-full max-w-md mx-auto h-[220px] my-10 flex items-center justify-center">
      {/* Background stacked cards for the tilted deck effect */}
      <div className="absolute inset-0 bg-[var(--surface)] shadow-sm border border-[var(--border-subtle)] rounded-3xl rotate-[6deg] scale-[0.95] -z-10 transition-transform duration-500" />
      <div className="absolute inset-0 bg-[var(--surface-secondary)] shadow-sm border border-[var(--border-subtle)] rounded-3xl -rotate-[4deg] scale-[0.90] translate-y-4 -z-20 transition-transform duration-500" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50, rotate: 10, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, rotate: -2, scale: 1 }} // Rests at a slight tilt
          exit={{ opacity: 0, x: -50, rotate: -15, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[var(--surface)] shadow-xl border border-[var(--primary-soft)] rounded-3xl p-8 flex flex-col justify-center items-center text-center overflow-hidden"
        >
          {/* Decorative quotes icon */}
          <div className="absolute top-4 left-4 opacity-10">
            <Quote className="w-16 h-16 text-[var(--primary)]" />
          </div>
          
          <div className="text-[var(--primary)] font-semibold text-xs mb-4 tracking-wider uppercase flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
            Daily Motivation
          </div>
          
          <p className="text-lg sm:text-xl font-display font-medium text-[var(--text-primary)] leading-snug italic relative z-10">
            "{QUOTES[index]}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
