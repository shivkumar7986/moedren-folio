"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// Client-side Live Ticking Clock (Asia/Kolkata timezone default)
export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className="font-mono text-xs tracking-wider text-muted-foreground select-none">
      MUMBAI_{time || "00:00:00"}
    </span>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Disable scrolling when full-screen mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b border-border-custom bg-bg/85 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif text-lg font-bold tracking-tight group-hover:text-accent transition-colors duration-300">
              MOEDREN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider uppercase font-medium relative transition-colors duration-300 hover:text-accent ${
                    isActive ? "text-accent" : "text-fg"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute left-0 -bottom-1 w-full h-[1px] bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Live Clock & Hamburger triggers */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <LiveClock />
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1 text-fg hover:text-accent focus:outline-none transition-colors duration-300"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 w-full h-screen z-40 bg-bg/98 flex flex-col justify-between px-6 pt-24 pb-12"
          >
            {/* Center Navigation Grid */}
            <nav className="flex flex-col gap-6 mt-12">
              {navLinks.map((link, index) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-serif text-4xl tracking-tight hover:text-accent transition-colors duration-300 flex items-center justify-between group ${
                        isActive ? "text-accent" : "text-fg"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                        →
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer Clock Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="border-t border-border-custom pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex flex-col">
                <span className="text-xs uppercase text-muted-foreground tracking-wider">
                  © 2026 MOEDREN
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Inspired by the Bold Editorial Aesthetic of K72
                </span>
              </div>
              <LiveClock />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
