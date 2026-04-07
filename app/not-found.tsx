'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
  const errorMessages = [
    'ERROR: File not found in system registry',
    'WARNING: Accessing undefined memory location',
    'CRITICAL: Route handler returned null',
    'FATAL: Component failed to mount',
    'PANIC: Stack overflow detected',
  ];

  const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center px-6">
      <div className="max-w-4xl w-full">
        {/* Terminal header */}
        <div className="mb-8 border-b border-green-500 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={16} className="text-red-500" />
            <span className="text-red-500 text-sm">TERMINAL_ERROR_LOG</span>
          </div>
          <div className="text-xs opacity-70">
            Error Code: 0x404 | Timestamp: {new Date().toISOString()}
          </div>
        </div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-red-500 text-2xl mb-4">[ERROR 404]</div>
          <div className="text-lg mb-4">{randomError}</div>
          <div className="text-sm opacity-70 mb-2">
            The requested resource could not be located in the system directory.
          </div>
          <div className="text-xs opacity-50 font-mono">
            Path: /{typeof window !== 'undefined' ? window.location.pathname : 'unknown'}<br/>
            Method: {typeof window !== 'undefined' ? 'GET' : 'UNKNOWN'}<br/>
            Status: NOT_FOUND
          </div>
        </motion.div>

        {/* Stack trace */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 border border-green-500 bg-black/50 p-4"
        >
          <div className="text-xs mb-2 text-red-500">STACK_TRACE:</div>
          <div className="text-xs space-y-1 opacity-70">
            <div>at RouteHandler.execute (router.js:142:11)</div>
            <div>at ComponentResolver.resolve (component.js:89:23)</div>
            <div>at FileSystem.lookup (fs.js:234:8)</div>
            <div>at MemoryManager.alloc (memory.js:56:15)</div>
            <div>at SystemKernel.panic (kernel.js:401:3)</div>
          </div>
        </motion.div>

        {/* System diagnostics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="text-sm mb-4">SYSTEM_DIAGNOSTICS:</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="opacity-70">Memory:</span> 8192KB OK
            </div>
            <div>
              <span className="opacity-70">CPU:</span> 99% IDLE
            </div>
            <div>
              <span className="opacity-70">Disk:</span> 256GB FREE
            </div>
            <div>
              <span className="opacity-70">Network:</span> CONNECTED
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-green-500 bg-black text-green-500 px-6 py-3 font-mono font-bold transition-all hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]"
          >
            <ArrowLeft size={16} />
            RETURN_TO_HOME
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-red-500 bg-black text-red-500 px-6 py-3 font-mono font-bold transition-all hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          >
            <ArrowLeft size={16} />
            GO_BACK
          </button>
        </motion.div>

        {/* Terminal prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 flex items-center gap-2"
        >
          <span className="text-red-500">$</span>
          <span className="text-green-500">awaiting_command...</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-green-500"
          >
            _
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
