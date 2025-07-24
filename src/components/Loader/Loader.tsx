"use client";

import { motion } from "framer-motion";

export default function PageLoaderModal() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Light, soft blurred transparent background */}
      <div className="absolute inset-0 bg-white/10 dark:bg-white/10 backdrop-blur-sm" />

      {/* Foreground content */}
      <motion.div
        className="relative z-10 flex flex-col items-center space-y-4"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Spinning Diamond Icon */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1,
            ease: "easeInOut",
          }}
          className="text-sky-900 dark:text-sky-900 drop-shadow-[0_4px_16px_rgba(56,189,248,0.6)]"
        >
          {/* Spinning Diamond Image */}
          <motion.img src="/diamond.png" alt="Diamond" className="h-24 w-24" />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-700 tracking-wider drop-shadow-lg"
          initial={{ y: 10, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          JewellPlus
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base font-semibold text-black drop-shadow-md"
          initial={{ opacity: 1 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Fetching your sparkle...
        </motion.p>
      </motion.div>
    </div>
  );
}
