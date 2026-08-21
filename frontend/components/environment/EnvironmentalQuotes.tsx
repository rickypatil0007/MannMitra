"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { environmentalQuotes, Quote } from "@/frontend/data/quotes";

interface ActiveQuote {
  instanceId: string;
  quote: Quote;
  xOffset: number; // Final X translation
  yOffset: number; // Final Y translation
  duration: number; // Lifetime in seconds
}

export function EnvironmentalQuotes() {
  const [activeQuotes, setActiveQuotes] = useState<ActiveQuote[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // History tracking to prevent immediate repeats
  const historyRef = useRef<{ id: string; category: string }[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const spawnQuote = useCallback(() => {
    const history = historyRef.current;
    
    // Filter out recently shown quotes (last 5) or recently shown categories (last 2)
    const recentIds = history.slice(-5).map(h => h.id);
    const recentCategories = history.slice(-2).map(h => h.category);
    
    let validQuotes = environmentalQuotes.filter(
      q => !recentIds.includes(q.id) && !recentCategories.includes(q.category)
    );
    
    if (validQuotes.length === 0) {
      validQuotes = environmentalQuotes.filter(q => !recentIds.includes(q.id));
    }
    
    const randomQuote = validQuotes[Math.floor(Math.random() * validQuotes.length)];
    
    // Update history
    historyRef.current.push({ id: randomQuote.id, category: randomQuote.category });
    if (historyRef.current.length > 20) historyRef.current.shift();

    // Determine strictly left/right trajectory "exerting out" of the center
    const isLeft = Math.random() > 0.5;
    const xBase = Math.random() * 200 + 200; // 200px to 400px drift strictly outwards
    const xOffset = isLeft ? -xBase : xBase;
    
    // Minimal Y drift to keep it strictly left/right flat
    const yOffset = Math.random() * 20 - 10; // -10px to +10px variance to avoid identical overlaps

    const duration = Math.random() * 3 + 5; // 5 to 8 seconds

    const newQuote: ActiveQuote = {
      instanceId: `quote-${Date.now()}-${Math.random()}`,
      quote: randomQuote,
      xOffset,
      yOffset,
      duration,
    };

    setActiveQuotes((prev) => [...prev, newQuote]);

    // Automatically remove after duration
    setTimeout(() => {
      setActiveQuotes((prev) => prev.filter((q) => q.instanceId !== newQuote.instanceId));
    }, duration * 1000);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const loopSpawn = () => {
      // Spawn a new quote every 2 to 4 seconds for a constant stream
      const nextSpawnTime = Math.random() * 2000 + 2000;
      timeoutId = setTimeout(() => {
        spawnQuote();
        loopSpawn();
      }, nextSpawnTime);
    };

    // Initial spawn delay
    timeoutId = setTimeout(() => {
      spawnQuote();
      loopSpawn();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [spawnQuote]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {activeQuotes.map((active) => (
          <motion.div
            key={active.instanceId}
            initial={{ 
              opacity: 0, 
              y: -100, // Shifted up to align exactly with the heading
              x: 0,
              scale: prefersReducedMotion ? 1 : 0.8,
              filter: prefersReducedMotion ? 'blur(0px)' : 'blur(12px)',
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: prefersReducedMotion ? -100 : [-100, (active.yOffset * 0.5) - 100, active.yOffset - 100],
              x: prefersReducedMotion ? 0 : [0, active.xOffset * 0.6, active.xOffset],
              scale: prefersReducedMotion ? 1 : [0.8, 1, 0.95], 
              filter: prefersReducedMotion ? 'blur(0px)' : ['blur(12px)', 'blur(0px)', 'blur(8px)'],
            }}
            transition={{
              duration: active.duration,
              times: [0, 0.2, 0.7, 1], // Timing mapping
              ease: "easeOut" 
            }}
            className="absolute max-w-[85vw] md:max-w-[400px] text-center"
          >
            <p className="font-display text-quote text-[#F4F3ED]/60 leading-[1.3] tracking-wide drop-shadow-[0_4px_32px_rgba(121,175,194,0.6)]">
              {active.quote.text}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
