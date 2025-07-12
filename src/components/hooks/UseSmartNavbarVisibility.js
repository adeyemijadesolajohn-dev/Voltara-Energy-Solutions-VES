import { useEffect, useState, useRef } from "react";

const useSmartNavbarVisibility = ({
  scrollThreshold = 10,
  delay = 70,
  idleTimeout = 7000,
} = {}) => {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const timeoutRef = useRef(null);
  const idleTimerRef = useRef(null);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY.current;

    clearTimeout(timeoutRef.current);
    clearTimeout(idleTimerRef.current);

    // Always show at the top
    if (currentScrollY <= 0) {
      setVisible(true);
      return;
    }

    // Hide after idle
    idleTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, idleTimeout);

    // Ignore tiny scrolls
    if (Math.abs(delta) < scrollThreshold) return;

    // Scroll detection logic
    timeoutRef.current = setTimeout(() => {
      if (delta > 0 && currentScrollY > 50) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    }, delay);
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimerRef.current);
    if (window.scrollY > 0) {
      idleTimerRef.current = setTimeout(() => setVisible(false), idleTimeout);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    resetIdleTimer();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      clearTimeout(timeoutRef.current);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  return visible;
};

export default useSmartNavbarVisibility;
