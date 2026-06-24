import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useAnimations() {
  const location = useLocation();

  useEffect(() => {
    // Wait a brief moment for the DOM elements to actually render before observing them
    const timer = setTimeout(() => {
      // 1. Reveal Engine
      const options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            const skillBar = entry.target.querySelector('.progress-fill');
            if (skillBar) {
              const width = skillBar.getAttribute('style')?.match(/width:\s*([\d.%]+)/)?.[1] || '85%';
              skillBar.style.width = width;
            }
            observer.unobserve(entry.target);
          }
        });
      }, options);

      document.querySelectorAll('.reveal, .reveal-up, .bento-item, .bento-item-large, .glass-pane').forEach(el => {
        // Only observe if not already active
        if (!el.classList.contains('active')) {
            observer.observe(el);
        }
      });

      // 2. Tilt Interaction
      const elements = document.querySelectorAll('.bento-item, .bento-item-large, .glass-pane-hover');
      elements.forEach(el => {
        // Remove old listeners to avoid duplicates
        const clone = el.cloneNode(true);
        if(el.parentNode) el.parentNode.replaceChild(clone, el);
        
        clone.addEventListener('mousemove', (e) => {
          const rect = clone.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (-(y - centerY) / centerY) * 8;
          const rotateY = ((x - centerX) / centerX) * 8;
          clone.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        clone.addEventListener('mouseleave', () => {
          clone.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
      });
      
    }, 100); // 100ms delay to ensure elements exist in DOM

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run on route change
}

export default useAnimations;
