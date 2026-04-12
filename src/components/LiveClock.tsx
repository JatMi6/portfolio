"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex items-center gap-2 font-mono text-sm ${className}`}>
      <Clock size={14} className="text-green-500" />
      <span className="text-green-400">
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </span>
    </div>
  );
}
