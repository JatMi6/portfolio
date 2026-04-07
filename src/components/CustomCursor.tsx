'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if device supports touch (mobile/tablet)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Don't initialize custom cursor on touch devices
    if (isTouchDevice) return;

    const updateCursorPosition = (e: MouseEvent) => {
      // Add small offset to center the cursor on the mouse position
      setPosition({ 
        x: e.clientX - 10, // Half of cursor width (20px / 2)
        y: e.clientY - 10  // Half of cursor height (20px / 2)
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, textarea, [role="button"], .cursor-pointer')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, textarea, [role="button"], .cursor-pointer')) {
        setIsHovering(false);
      }
    };

    const handleMouseEnterViewport = () => setIsVisible(true);
    const handleMouseLeaveViewport = () => setIsVisible(false);

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnterViewport);
    document.addEventListener('mouseleave', handleMouseLeaveViewport);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnterViewport);
      document.removeEventListener('mouseleave', handleMouseLeaveViewport);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <>
      <div
        className={`custom-cursor ${isHovering ? 'hover' : ''} ${!isVisible ? 'opacity-0' : 'opacity-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      <div
        className={`custom-cursor-dot ${!isVisible ? 'opacity-0' : 'opacity-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}
