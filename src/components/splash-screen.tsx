import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Leaf, Sun, Battery, Wind } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [tick, setTick] = useState(0);
  const icons = [Sun, Battery, Wind, Leaf];

  // Trigger onComplete after the animation finishes
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // 4.5s total duration so the loop can be seen
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Cycle through icons
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000); // Switch every 1 second
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = icons[tick % icons.length];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.15)_0%,transparent_50%)]" />

      {/* Main Spinner Animation */}
      <div className="relative flex flex-col items-center">
        
        {/* Icon Switcher Animation */}
        <div 
          className="relative w-[280px] h-[120px] flex items-center justify-center"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%, black 75%, transparent)' }}
        >
          <AnimatePresence>
            <motion.div
              key={tick}
              initial={{ opacity: 0, rotate: 60, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -60, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="absolute flex flex-col items-center justify-start origin-bottom h-[120px] w-full"
            >
              <ActiveIcon 
                className="size-14 text-[#40bb6b]" 
                strokeWidth={2.5}
                style={{ filter: 'drop-shadow(0px 6px 12px rgba(64,187,107,0.5))' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading Dots Conveyor */}
        <div 
          className="relative h-6 w-32 mx-auto flex items-center justify-center -mt-6 mb-2"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)' }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute size-1.5 rounded-full bg-[#40bb6b]"
              animate={{ 
                x: [24, -24],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        {/* Tagline Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="mt-0 text-center relative z-20"
        >
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs font-semibold tracking-[0.4em] text-slate-500 uppercase ml-1"
          >
            清洁能源 · 智慧未来
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
