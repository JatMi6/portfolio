'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, ChevronRight } from 'lucide-react';

interface TerminalOutput {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

interface LiveTerminalProps {
  className?: string;
}

export default function LiveTerminal({ className = '' }: LiveTerminalProps) {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = {
    help: {
      description: 'Show available commands',
      action: () => `Available commands:
  about    - Learn about Mijat
  skills    - View technical skills
  projects  - See portfolio projects
  contact   - Get in touch
  clear     - Clear terminal
  hello     - Say hello
  weather   - Check weather
  calc      - Simple calculator`
    },
    about: {
      description: 'Learn about Mijat',
      action: () => `Hi! I'm Mijat Goločevac, a Creative Engineer & Full-Stack Developer.
I design and build production-ready web products for startups and agencies.
My focus is on creating things that look great, work fast, and launch on time.
Let's build something amazing together!`
    },
    skills: {
      description: 'View technical skills',
      action: () => `Technical Skills:
  Frontend: Next.js, React, TypeScript, Tailwind CSS
  Backend: Node.js, Express, MongoDB
  Design: UI/UX, Figma, Responsive Design
  Tools: Git, Vercel, AWS
  Founded: 2023 | Projects: 5+ | Clients: 2`
    },
    projects: {
      description: 'See portfolio projects',
      action: () => `Recent Projects:
  Balkanflix - Streaming platform (2024)
  Cocrafts - Steel construction website (2024)
  WAMA Agency - Creative agency site (2024)
  Nikolass Design - Portfolio website (2023)
  All built with modern web technologies`
    },
    contact: {
      description: 'Get in touch',
      action: () => `Let's connect!
  Email: mijatgolocevac@gmail.com
  GitHub: github.com/JatMi6
  Instagram: @mijat_golocevac
  Available for freelance projects
  Responding within 24h`
    },
    hello: {
      description: 'Say hello',
      action: () => `Hello there! Thanks for visiting Mijat's portfolio!
Type 'about' to learn more about me,
or 'projects' to see my work.`
    },
    weather: {
      description: 'Check weather',
      action: () => `Weather in Novi Sad:
  Temperature: 22°C
  Conditions: Partly cloudy
  Perfect day for coding!`
    },
    calc: {
      description: 'Simple calculator',
      action: (args: string) => {
        const expression = args.trim();
        if (!expression) return 'Usage: calc <expression> (e.g., calc 2+2)';
        try {
          // Simple calculation (only basic operations)
          const result = Function('"use strict"; return (' + expression + ')')();
          return `Result: ${result}`;
        } catch {
          return 'Invalid expression. Try: calc 2+2 or calc 10*5';
        }
      }
    },
    clear: {
      description: 'Clear terminal',
      action: () => {
        setOutputs([]);
        return '';
      }
    }
  };

  useEffect(() => {
    // Add welcome message
    setOutputs([{
      id: '1',
      type: 'success',
      content: 'Welcome to Mijat\'s Portfolio Terminal - Type "help" to explore',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    // Auto-focus input
    inputRef.current?.focus();
  }, []);

  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const [command, ...args] = trimmedCmd.split(' ');
    const commandStr = command.toLowerCase();

    if (commandStr === '') return;

    // Add command to history
    setHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Add input to output
    const inputOutput: TerminalOutput = {
      id: Date.now().toString(),
      type: 'input',
      content: `$ ${trimmedCmd}`,
      timestamp: new Date()
    };

    let response = '';
    let responseType: TerminalOutput['type'] = 'output';

    if (commands[commandStr as keyof typeof commands]) {
      response = commands[commandStr as keyof typeof commands].action(args.join(' '));
      responseType = 'output';
    } else {
      response = `Command not found: ${commandStr}. Type 'help' for available commands.`;
      responseType = 'error';
    }

    const commandOutput: TerminalOutput = {
      id: (Date.now() + 1).toString(),
      type: responseType,
      content: response,
      timestamp: new Date()
    };

    setOutputs(prev => [...prev, inputOutput, commandOutput]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className={`border-2 border-green-500 bg-black font-mono text-sm ${className}`}>
      {/* Terminal Header */}
      <div className="border-b border-green-500 bg-black/50 px-4 py-2 flex items-center gap-2">
        <Terminal size={16} className="text-green-500" />
        <span className="text-green-500 font-bold">mijat@portfolio</span>
        <div className="flex-1 flex justify-end gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="h-96 overflow-y-auto p-4 space-y-2">
        {outputs.map((output) => (
          <motion.div
            key={output.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="whitespace-pre-wrap"
          >
            <span className={
              output.type === 'input' ? 'text-green-400' :
              output.type === 'error' ? 'text-red-500' :
              output.type === 'success' ? 'text-green-500' :
              'text-green-300'
            }>
              {output.content}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="border-t border-green-500 p-4">
        <div className="flex items-center gap-2">
          <span className="text-green-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-300 outline-none placeholder-green-700"
            placeholder="Type a command..."
          />
          <button
            type="submit"
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
