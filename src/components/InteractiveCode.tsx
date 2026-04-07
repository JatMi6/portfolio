'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code, Terminal, Play, Download } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  runnable?: boolean;
}

interface InteractiveCodeProps {
  snippets: CodeSnippet[];
  className?: string;
}

export default function InteractiveCode({ snippets, className = '' }: InteractiveCodeProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getLanguageColor = (lang: string) => {
    const colors = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400',
      python: 'text-green-400',
      css: 'text-purple-400',
      html: 'text-orange-400',
      bash: 'text-red-400',
      json: 'text-gray-400'
    };
    return colors[lang as keyof typeof colors] || 'text-green-400';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {snippets.map((snippet) => (
        <motion.div
          key={snippet.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-green-500 bg-black overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-green-500 bg-black/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code size={16} className="text-green-500" />
                <h3 className="text-green-400 font-mono font-bold">{snippet.title}</h3>
                <span className={`text-xs font-mono px-2 py-1 border border-green-500 ${getLanguageColor(snippet.language)}`}>
                  {snippet.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {snippet.runnable && (
                  <button className="p-2 text-green-500 hover:text-green-400 transition-colors border border-green-500 hover:bg-green-500/10">
                    <Play size={14} />
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(snippet.code, snippet.id)}
                  className="p-2 text-green-500 hover:text-green-400 transition-colors border border-green-500 hover:bg-green-500/10"
                >
                  {copiedId === snippet.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => toggleExpand(snippet.id)}
                  className="p-2 text-green-500 hover:text-green-400 transition-colors border border-green-500 hover:bg-green-500/10"
                >
                  <Download size={14} className={`transform transition-transform ${expandedId === snippet.id ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2 font-mono">{snippet.description}</p>
          </div>

          {/* Code Content */}
          <div className="relative">
            <div className={`overflow-hidden transition-all duration-300 ${expandedId === snippet.id ? 'max-h-96' : 'max-h-64'}`}>
              <pre className="p-4 text-green-300 font-mono text-sm overflow-x-auto whitespace-pre">
                <code>{snippet.code}</code>
              </pre>
            </div>
            
            {/* Gradient fade for long code */}
            {snippet.code.split('\n').length > 10 && expandedId !== snippet.id && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-green-500 bg-black/50 p-2 flex items-center justify-between">
            <div className="text-xs text-green-600 font-mono">
              {snippet.code.split('\n').length} lines
            </div>
            <div className="text-xs text-green-600 font-mono">
              {copiedId === snippet.id ? 'Copied!' : 'Click to copy'}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Predefined code snippets
export const portfolioSnippets: CodeSnippet[] = [
  {
    id: 'react-component',
    title: 'React Component',
    language: 'javascript',
    description: 'Modern React functional component with hooks',
    code: `import React, { useState, useEffect } from 'react';

const BrutalComponent = () => {
  const [state, setState] = useState('initial');
  
  useEffect(() => {
    // Terminal-style initialization
    console.log('System initialized...');
  }, []);

  return (
    <div className="terminal-component">
      <h1>Brutalist Design</h1>
      <p>Breaking conventions.</p>
    </div>
  );
};

export default BrutalComponent;`,
    runnable: true
  },
  {
    id: 'terminal-command',
    title: 'Terminal Command',
    language: 'bash',
    description: 'Custom terminal command for project setup',
    code: `#!/bin/bash

# Brutal Portfolio Setup
echo "Initializing brutal terminal..."
npm install brutal-ui terminal-effects
npm run build:brutal
npm run deploy:matrix

# System configuration
export THEME=brutal-terminal
export EFFECTS=glitch-matrix

echo "System ready. Access granted."`,
    runnable: true
  },
  {
    id: 'css-animations',
    title: 'CSS Animations',
    language: 'css',
    description: 'Brutalist CSS animations and effects',
    code: `/* Brutalist Terminal Effects */
.terminal-text {
  font-family: 'Courier New', monospace;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  animation: glitch 2s infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

.scanlines {
  background: linear-gradient(
    transparent 50%,
    rgba(0, 255, 0, 0.03) 50%
  );
  background-size: 100% 4px;
}`,
    runnable: false
  },
  {
    id: 'api-endpoint',
    title: 'API Endpoint',
    language: 'typescript',
    description: 'Next.js API route with terminal styling',
    code: `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  
  // Terminal-style logging
  console.log(\`[GET] \${new Date().toISOString()} - \${userAgent}\`);
  
  const data = {
    status: 'online',
    message: 'Brutal Terminal API',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/status', '/api/projects', '/api/skills']
  };

  return NextResponse.json(data, {
    headers: {
      'X-Terminal-Style': 'brutal',
      'Access-Control-Allow-Origin': '*'
    }
  });
}`,
    runnable: true
  }
];
