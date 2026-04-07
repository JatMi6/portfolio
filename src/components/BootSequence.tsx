'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  const bootLines = [
    { text: 'SYSTEM.INIT - Starting Mijat\'s Portfolio...', delay: 0 },
    { text: 'Loading creative modules...', delay: 200 },
    { text: 'Initializing design systems...', delay: 400 },
    { text: 'Mounting project files...', delay: 600 },
    { text: 'System ready. Welcome to Mijat\'s Portfolio.', delay: 700 },
  ];

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, bootLines[currentLine].delay);
      return () => clearTimeout(timer);
    } else if (!bootComplete) {
      setBootComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [currentLine, bootLines.length, bootComplete, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center font-mono">
      <div className="max-w-2xl w-full px-8">
        {/* Terminal header */}
        <div className="mb-4 text-green-500 text-sm opacity-50">
          Mijat's Portfolio v1.0 [Built with Next.js]
        </div>
        
        {/* Boot sequence lines */}
        <div className="space-y-2">
          {bootLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: index <= currentLine ? 1 : 0,
                x: index <= currentLine ? 0 : -20 
              }}
              transition={{ duration: 0.3 }}
              className="text-green-400 text-sm"
            >
              <span className="text-red-500 mr-2">$</span>
              {line.text}
              {index === currentLine - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="ml-2"
                >
                  _
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="h-2 border border-green-500 bg-black overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentLine / bootLines.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-green-500 text-xs opacity-70">
            {Math.round((currentLine / bootLines.length) * 100)}%
          </div>
        </div>

        {/* Boot complete message */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-green-500 text-center"
          >
            <div className="text-lg font-bold mb-2">PORTFOLIO ONLINE</div>
            <div className="text-sm opacity-70">Welcome to Mijat's creative space</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
