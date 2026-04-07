'use client';

import { motion } from 'framer-motion';

interface TerminalLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  progress?: number;
}

export default function TerminalLoader({ 
  message = 'Loading...', 
  size = 'medium',
  showProgress = false,
  progress = 0
}: TerminalLoaderProps) {
  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm', 
    large: 'text-base'
  };

  const barSizes = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3'
  };

  return (
    <div className="flex flex-col items-center gap-4 font-mono">
      {/* Loading message */}
      <div className={`text-green-500 ${sizeClasses[size]} flex items-center gap-2`}>
        <span className="text-red-500">$</span>
        <span>{message}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-green-500"
        >
          _
        </motion.span>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className={`w-full max-w-xs ${barSizes[size]} border border-green-500 bg-black overflow-hidden`}>
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Dots animation */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-green-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Specialized loading components
export function ProjectLoader() {
  return (
    <TerminalLoader 
      message="Compiling project data..."
      showProgress={true}
      progress={75}
      size="medium"
    />
  );
}

export function SystemLoader() {
  return (
    <TerminalLoader 
      message="Initializing system..."
      size="large"
    />
  );
}

export function CodeLoader() {
  return (
    <TerminalLoader 
      message="Executing code..."
      size="small"
    />
  );
}
