import { useEffect, useRef, useState } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export function useScrollDirection(): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setScrollDirection(null);
        lastScrollY.current = 0;
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollDirection;
}
