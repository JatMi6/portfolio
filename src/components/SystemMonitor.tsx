'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, Wifi, Activity, Clock, Zap } from 'lucide-react';

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: 'online' | 'offline';
  uptime: string;
  processes: number;
}

export default function SystemMonitor({ className = '' }: { className?: string }) {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 'online',
    uptime: '0:00:00',
    processes: 0
  });

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate system stats
  useEffect(() => {
    const updateStats = () => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
        memory: Math.floor(Math.random() * 40) + 30, // 30-70%
        disk: Math.floor(Math.random() * 20) + 60, // 60-80%
        network: Math.random() > 0.1 ? 'online' : 'offline',
        uptime: generateUptime(),
        processes: Math.floor(Math.random() * 50) + 100 // 100-150
      });
    };

    const timer = setInterval(updateStats, 2000);
    updateStats(); // Initial update
    return () => clearInterval(timer);
  }, []);

  const generateUptime = () => {
    const days = Math.floor(Math.random() * 30);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const getStatusColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage < 50) return 'text-green-500';
    if (percentage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBarColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`border-2 border-green-500 bg-black font-mono text-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-green-500 bg-black/50 p-3 flex items-center gap-2">
        <Activity size={16} className="text-green-500" />
        <span className="text-green-500 font-bold">SYSTEM_MONITOR</span>
        <div className="flex-1 flex justify-end">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Clock */}
      <div className="border-b border-green-500 p-4">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={16} className="text-green-500" />
          <span className="text-green-400 font-bold">SYSTEM_TIME</span>
        </div>
        <div className="text-green-300 text-lg font-bold">
          {formatDate(time)}
        </div>
      </div>

      {/* System Stats */}
      <div className="p-4 space-y-4">
        {/* CPU */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-green-500" />
              <span className="text-green-400">CPU Usage</span>
            </div>
            <span className={`font-bold ${getStatusColor(stats.cpu, 100)}`}>
              {stats.cpu}%
            </span>
          </div>
          <div className="h-2 bg-black border border-green-500 overflow-hidden">
            <motion.div
              className={`h-full ${getBarColor(stats.cpu, 100)}`}
              initial={{ width: 0 }}
              animate={{ width: `${stats.cpu}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Memory */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-green-500" />
              <span className="text-green-400">Memory</span>
            </div>
            <span className={`font-bold ${getStatusColor(stats.memory, 100)}`}>
              {stats.memory}%
            </span>
          </div>
          <div className="h-2 bg-black border border-green-500 overflow-hidden">
            <motion.div
              className={`h-full ${getBarColor(stats.memory, 100)}`}
              initial={{ width: 0 }}
              animate={{ width: `${stats.memory}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Disk */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-green-500" />
              <span className="text-green-400">Disk Space</span>
            </div>
            <span className={`font-bold ${getStatusColor(stats.disk, 100)}`}>
              {stats.disk}% Used
            </span>
          </div>
          <div className="h-2 bg-black border border-green-500 overflow-hidden">
            <motion.div
              className={`h-full ${getBarColor(stats.disk, 100)}`}
              initial={{ width: 0 }}
              animate={{ width: `${stats.disk}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi size={14} className={stats.network === 'online' ? 'text-green-500' : 'text-red-500'} />
            <span className="text-green-400">Network</span>
          </div>
          <span className={`font-bold ${stats.network === 'online' ? 'text-green-500' : 'text-red-500'}`}>
            {stats.network.toUpperCase()}
          </span>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-green-500">
          <div>
            <span className="text-green-600 text-xs">UPTIME</span>
            <div className="text-green-300 font-bold">{stats.uptime}</div>
          </div>
          <div>
            <span className="text-green-600 text-xs">PROCESSES</span>
            <div className="text-green-300 font-bold">{stats.processes}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-green-500 bg-black/50 p-2">
        <div className="text-xs text-green-600 text-center">
          Last updated: {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
