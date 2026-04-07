"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, Database, Code2, Layout, Zap, Terminal } from "lucide-react";
import CustomCursor from "@/src/components/CustomCursor";
import CommandPalette from "@/src/components/CommandPalette";
import { useState, useEffect } from "react";

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number];

const fadeUp: Variants = {
  initial: { opacity: 0, y: 40, filter: "blur(8px)" },
  whileInView: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease },
  },
};

const staggerContainer: Variants = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function About() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === 'k' && !e.ctrlKey && e.target === document.body)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="bg-black min-h-screen text-green-500 font-mono selection:bg-green-500 selection:text-black overflow-x-hidden">
      <CustomCursor />
      
      {/* Command Palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* Floating Navigation Button - Top */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="fixed top-8 right-8 z-40 border-2 border-green-500 bg-black text-green-500 px-4 py-3 font-mono text-sm transition-all hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,0,0.5)] active:scale-[0.95] flex items-center gap-2"
      >
        <span className="hidden sm:inline">Navigate</span>
        <kbd className="text-xs border border-green-500 px-1">K</kbd>
      </button>

      {/* Hero Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-20 py-16 sm:py-20 md:py-32 relative overflow-hidden terminal-grid">
        {/* Terminal-style accent boxes */}
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 border border-green-500 px-2 sm:px-3 py-1 font-mono text-xs text-green-500 animate-pulse">
          $ ./about.sh
        </div>
        <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 border border-red-500 px-2 sm:px-3 py-1 font-mono text-xs text-red-500">
          STATUS: LOADING
        </div>

        <motion.div
          initial="initial"
          animate="whileInView"
          variants={staggerContainer}
          className="max-w-4xl z-10 text-center"
        >
          <motion.div variants={fadeUp} className="mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-4">
            <div className="h-[1px] sm:h-[2px] w-8 sm:w-12 bg-green-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-green-500 font-bold">
              ABOUT_ME
            </span>
            <div className="h-[1px] sm:h-[2px] w-8 sm:w-12 bg-green-500 animate-pulse" />
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={fadeUp} className="mb-12 sm:mb-16">
            <div className="font-mono text-[clamp(2rem,10vw,6rem)] sm:text-[clamp(3rem,8vw,8rem)] font-black text-green-400 glitch leading-none mb-12 sm:mb-16">
              <motion.div 
                className="text-red-500"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ textShadow: '0 0 2px #ff0000, 0 0 4px rgba(255,0,0,0.3)' }}
              >
                Crafting
              </motion.div>
              <motion.div 
                className="text-green-500"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ textShadow: '0 0 2px #00ff00, 0 0 4px rgba(0,255,0,0.3)' }}
              >
                Perfection
              </motion.div>
              <motion.div 
                className="text-blue-500"
                animate={{ opacity: [1, 0.8, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                style={{ textShadow: '0 0 2px #0000ff, 0 0 4px rgba(0,0,255,0.3)' }}
              >
                In Every Pixel
              </motion.div>
            </div>
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl md:text-2xl font-mono text-green-300 mb-16 sm:mb-20 max-w-3xl mx-auto leading-relaxed"
            style={{ textShadow: '0 0 5px #00ff00' }}
          >
            where client visions become flawless reality
          </motion.p>

          {/* Main Description */}
          <motion.div
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl font-mono text-green-400 max-w-3xl mx-auto leading-relaxed border-l-4 border-green-500 pl-6 sm:pl-8 mb-16 sm:mb-20"
          >
            <p className="mb-6">
              19-year-old Serbian developer and student with 3 years of experience turning ideas into polished web experiences. I don't just build websites - I perfect them.
            </p>
            <p className="mb-6">
              Every project gets my full attention because I believe in doing the greatest work possible, whatever the challenge. My approach is simple: whatever you have in mind, I'll make it perfect.
            </p>
            <p>
              Currently balancing studies with freelance work, bringing fresh perspectives and relentless dedication to every project I undertake.
            </p>
          </motion.div>

          {/* Key Values */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto mb-12"
          >
            <div className="border border-green-500 p-4 sm:p-6 text-center">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 text-green-400" />
              <h3 className="font-mono text-sm sm:text-base font-bold text-green-500 mb-2">PERFECTION</h3>
              <p className="text-xs sm:text-sm text-green-300">No compromise on quality</p>
            </div>
            <div className="border border-green-500 p-4 sm:p-6 text-center">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 text-green-400" />
              <h3 className="font-mono text-sm sm:text-base font-bold text-green-500 mb-2">DEDICATION</h3>
              <p className="text-xs sm:text-sm text-green-300">100% focus on your vision</p>
            </div>
            <div className="border border-green-500 p-4 sm:p-6 text-center">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 text-green-400" />
              <h3 className="font-mono text-sm sm:text-base font-bold text-green-500 mb-2">GROWTH</h3>
              <p className="text-xs sm:text-sm text-green-300">Always learning, always improving</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <a
              href="/"
              className="inline-flex items-center gap-2 sm:gap-3 border-2 border-green-500 bg-black text-green-500 px-6 sm:px-8 py-3 sm:py-4 font-mono font-bold text-sm sm:text-base transition-all hover:bg-green-500 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] active:scale-[0.98]"
            >
              <span>BACK_TO_PORTFOLIO</span>
              <ArrowRight size={16} className="sm:w-5 sm:h-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-20 relative overflow-hidden terminal-grid">
        {/* Terminal-style accent boxes */}
        <div className="absolute top-4 sm:top-10 left-4 sm:left-10 border border-green-500 px-2 sm:px-3 py-1 font-mono text-xs text-green-500 animate-pulse">
          $ ls skills/
        </div>
        <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 border border-blue-500 px-2 sm:px-3 py-1 font-mono text-xs text-blue-500">
          SKILLS_LOADED
        </div>

        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-12 sm:mb-16 text-center">
            <div className="mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-4">
              <div className="h-[1px] sm:h-[2px] w-8 sm:w-12 bg-green-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-green-500 font-bold">
                TECH_STACK
              </span>
              <div className="h-[1px] sm:h-[2px] w-8 sm:w-12 bg-green-500 animate-pulse" />
            </div>
            
            <h2 className="font-mono text-[clamp(2rem,8vw,5rem)] sm:text-[clamp(2.5rem,6vw,6rem)] font-black text-green-400 glitch leading-none mb-8 sm:mb-12">
              <motion.div 
                className="text-red-500"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ textShadow: '0 0 2px #ff0000, 0 0 4px rgba(255,0,0,0.3)' }}
              >
                Technical
              </motion.div>
              <motion.div 
                className="text-green-500"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ textShadow: '0 0 2px #00ff00, 0 0 4px rgba(0,255,0,0.3)' }}
              >
                Expertise
              </motion.div>
            </h2>

            <p className="text-lg sm:text-xl font-mono text-green-300 max-w-3xl mx-auto leading-relaxed">
              3 years of focused development across modern web technologies
            </p>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16 sm:mb-20"
          >
            {[
              { name: "Next.js", icon: Layout, color: "text-green-400" },
              { name: "React", icon: Code2, color: "text-blue-400" },
              { name: "Tailwind CSS", icon: Zap, color: "text-cyan-400" },
              { name: "MongoDB", icon: Database, color: "text-green-500" },
              { name: "TypeScript", icon: Terminal, color: "text-blue-500" },
              { name: "Node.js", icon: Code2, color: "text-green-600" },
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={fadeUp}
                whileHover={{ scale: 1.05, y: -2 }}
                className="border border-green-500 bg-black/50 backdrop-blur-sm p-4 sm:p-6 text-center transition-all hover:border-green-400 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
              >
                <skill.icon className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 ${skill.color}`} />
                <h3 className="font-mono text-sm sm:text-base font-bold text-green-500">{skill.name}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Experience Level */}
          <motion.div variants={fadeUp} className="text-center">
            <div className="border border-green-500 p-6 sm:p-8 max-w-2xl mx-auto">
              <h3 className="font-mono text-lg sm:text-xl font-bold text-green-400 mb-4">Experience Level</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base text-green-300">Frontend Development</span>
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                    ))}
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500/30 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base text-green-300">Backend Development</span>
                  <div className="flex gap-1">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                    ))}
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500/30 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base text-green-300">UI/UX Design</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
