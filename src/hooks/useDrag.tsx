import { useState, useEffect, useRef } from 'react';

export default function useDrag() {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isTouching = useRef(false);

  function handleStart(e: MouseEvent | TouchEvent) {
    const point = e instanceof TouchEvent ? e.touches[0] : e;
    setStartPosition({ x: point.clientX, y: point.clientY });
    setEndPosition({ x: point.clientX, y: point.clientY });
    setIsDragging(true);
    isTouching.current = true;
  }

  function handleMove(e: MouseEvent | TouchEvent) {
    if (!isTouching.current) return;
    const point = e instanceof TouchEvent ? e.touches[0] : e;
    setEndPosition({ x: point.clientX, y: point.clientY });
  }

  function handleEnd() {
    setIsDragging(false);
    isTouching.current = false;
  }

  useEffect(() => {
    window.addEventListener('touchstart', handleStart);
    window.addEventListener('mousedown', handleStart);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('mousedown', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, []);

  return { startPosition, endPosition, isDragging };
}
