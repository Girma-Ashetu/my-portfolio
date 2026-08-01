import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useAnimations() {
  const location = useLocation();

  useEffect(() => {
    let cleanups = [];
    let observer;

    const timer = setTimeout(() => {
      // 1. Reveal Engine
      const options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
      observer = new IntersectionObserver((entries) => {
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
        if (!el.classList.contains('active')) {
          observer.observe(el);
        }
      });

      // 2. Tilt Interaction (React-Safe, no replaceChild or cloneNode)
      const elements = document.querySelectorAll('.bento-item, .bento-item-large, .glass-pane-hover');
      elements.forEach(el => {
        const handleMouseMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (-(y - centerY) / centerY) * 8;
          const rotateY = ((x - centerX) / centerX) * 8;
          el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const handleMouseLeave = () => {
          el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);

        cleanups.push(() => {
          el.removeEventListener('mousemove', handleMouseMove);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      cleanups.forEach(cleanup => cleanup());
    };
  }, [location.pathname]);
}

export default useAnimations;
