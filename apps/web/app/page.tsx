"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/layout/Navbar";

export default function Home() {
  const headline = "CRAFTING CINEMATIC DIGITAL EXPERIENCES.";
  const words = headline.split(" ");

  // Framer Motion animation containers for staggered word reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Premium bezier curve
      },
    },
  };

  return (
    <>
      {/* <Navbar /> */}

      <main className="flex-1 min-h-screen bg-bg relative overflow-hidden flex flex-col justify-center items-center px-6 pt-0">
        {/* Abstract structural grid line overlays to represent premium brutalism */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-4 gap-0 max-w-7xl mx-auto h-full px-6 opacity-[0.02]">
          <div className="border-l border-r border-fg h-full" />
          <div className="border-r border-fg h-full" />
          <div className="border-r border-fg h-full" />
          <div className="h-full" />
        </div>

        {/* Hero Content Wrapper */}
        <div className="max-w-5xl mx-auto w-full z-10 text-center flex flex-col items-center">
          {/* Tagline Badge */}
          {/* <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-2 border border-border-custom px-3 py-1 rounded-full mb-8 bg-border-custom/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              CREATIVE DEVELOPER & ARCHITECT
            </span>
          </motion.div> */}

          {/* Large Editorial Headline */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-dislplay text-[9.5vw] font-semiBold tracking-tight text-fg leading-[1.0] text-balance mb-8"
          >
            {words.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-3 pb-2">
                <motion.span variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Subtitle description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
            className="text-muted-foreground text-base md:text-xl font-normal max-w-2xl text-center leading-relaxed mb-12 text-pretty"
          >
            Revitalizing digital identities through bold typography grids, high-performance
            Next.js infrastructures, and purpose-driven animations.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/work"
              className="px-8 py-4 bg-accent text-bg font-semibold text-sm tracking-wider uppercase rounded-md hover:bg-fg hover:text-bg transition-colors duration-300 w-full sm:w-auto text-center"
            >
              Explore Portfolio
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-border-custom text-fg font-semibold text-sm tracking-wider uppercase rounded-md hover:bg-border-custom/50 hover:border-fg transition-all duration-300 w-full sm:w-auto text-center"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>


      </main>
    </>
  );
}
