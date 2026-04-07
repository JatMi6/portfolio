'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Terminal, User, Mail, Phone, Home, Briefcase, Code, Settings, Camera } from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'home',
      title: 'Go to Home',
      description: 'Navigate to the hero section',
      icon: <Home size={16} />,
      action: () => {
        window.location.href = '/#hero';
        onClose();
      },
      keywords: ['top', 'hero', 'start']
    },
    {
      id: 'projects',
      title: 'View Projects',
      description: 'Browse Mijat\'s portfolio projects',
      icon: <Briefcase size={16} />,
      action: () => {
        window.location.href = '/#work';
        onClose();
      },
      keywords: ['work', 'portfolio', 'deployments']
    },
    {
      id: 'about',
      title: 'About Mijat',
      description: 'Learn more about Mijat',
      icon: <User size={16} />,
      action: () => {
        window.location.href = '/about#about';
        onClose();
      },
      keywords: ['about', 'me', 'mijat', 'story']
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      description: 'View Mijat\'s technical stack',
      icon: <Code size={16} />,
      action: () => {
        window.location.href = '/about#skills';
        onClose();
      },
      keywords: ['stack', 'tech', 'technologies']
    },
    {
      id: 'contact',
      title: 'Contact Mijat',
      description: 'Get in touch with Mijat',
      icon: <Mail size={16} />,
      action: () => {
        window.location.href = '/#contact';
        onClose();
      },
      keywords: ['email', 'reach', 'connect']
    },
    {
      id: 'github',
      title: 'GitHub Profile',
      description: 'Visit Mijat\'s GitHub repository',
      icon: <Code size={16} />,
      action: () => {
        window.open('https://github.com/JatMi6', '_blank');
        onClose();
      },
      keywords: ['repo', 'source', 'code']
    },
    {
      id: 'email',
      title: 'Send Email',
      description: 'Email Mijat',
      icon: <Mail size={16} />,
      action: () => {
        window.location.href = 'mailto:mijatgolovcevac@gmail.com';
        onClose();
      },
      keywords: ['mail', 'contact', 'message']
    },
    {
      id: 'instagram',
      title: 'Instagram',
      description: 'Follow Mijat on Instagram',
      icon: <Camera size={16} />,
      action: () => {
        window.open('https://instagram.com/mijat_golocevac', '_blank');
        onClose();
      },
      keywords: ['social', 'ig', 'photo']
    }
  ];

  // Calculate filtered commands here
  const filteredCommands = commands.filter(cmd => {
    const searchLower = search.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.description.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Command Palette */}
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="border-2 border-green-500 bg-black overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-green-500 p-4">
                <Search size={20} className="text-green-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-green-300 outline-none placeholder-green-700 font-mono"
                />
                <kbd className="px-2 py-1 text-xs border border-green-500 text-green-500 font-mono">ESC</kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-green-500 font-mono">
                    No commands found
                  </div>
                ) : (
                  filteredCommands.map((command, index) => (
                    <motion.div
                      key={command.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: 'rgba(0, 255, 0, 0.1)' }}
                      onClick={command.action}
                      className={`flex items-center gap-3 p-4 cursor-pointer border-b border-green-500/20 transition-colors ${
                        index === selectedIndex ? 'bg-green-500/10' : ''
                      }`}
                    >
                      <div className="text-green-500">
                        {command.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-green-300 font-mono font-medium">
                          {command.title}
                        </div>
                        <div className="text-green-600 text-sm font-mono">
                          {command.description}
                        </div>
                      </div>
                      {index === selectedIndex && (
                        <kbd className="px-2 py-1 text-xs border border-green-500 text-green-500 font-mono">
                          ENTER
                        </kbd>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-green-500 p-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-green-600 font-mono">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 border border-green-500">K</kbd>
                    <span>or</span>
                    <kbd className="px-1 py-0.5 border border-green-500">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-1 py-0.5 border border-green-500">K</kbd>
                  </div>
                  <span>to open</span>
                </div>
                <div className="text-xs text-green-600 font-mono">
                  {filteredCommands.length} results
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
