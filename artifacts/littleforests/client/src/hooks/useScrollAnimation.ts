import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    // Delay initialization to not block page rendering
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              // Stop observing once animated to improve performance
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );

      const animatedElements = document.querySelectorAll(
        '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-rotate'
      );

      animatedElements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100); // Small delay to let page render first

    return () => clearTimeout(timeoutId);
  }, []);
};