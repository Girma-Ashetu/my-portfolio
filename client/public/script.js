document.addEventListener('DOMContentLoaded', () => {
    // Lightweight scheduler — defer heavy visuals to idle time when possible
    const scheduleInit = (fn) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(fn, { timeout: 800 });
        } else {
            setTimeout(fn, 600);
        }
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth < 768;
    const skipHeavy = prefersReducedMotion || isCoarsePointer || isSmallScreen;

    // ==========================================
    //  PREMIUM PARTICLE ENGINE (NETWORK) - optimized
    // ==========================================
    const initParticles = () => {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];

        // debounce helper
        const debounce = (fn, wait = 150) => {
            let t;
            return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
        };

        const resize = () => {
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            canvas.width = Math.round(window.innerWidth * dpr);
            canvas.height = Math.round(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
        };
        resize();
        window.addEventListener('resize', debounce(resize, 200), { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.08;
                this.hue = [190, 210, 240, 270][Math.floor(Math.random() * 4)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `hsl(${this.hue}, 90%, 60%)`;
                ctx.fillStyle = `hsl(${this.hue}, 90%, 72%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const baseCount = Math.floor(window.innerWidth / 30);
        const maxParticles = isSmallScreen ? 18 : 48;
        const COUNT = Math.min(maxParticles, Math.max(10, baseCount));

        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        let connectionsEnabled = particles.length <= 40; // avoid O(n^2) on many particles
        const connectionDist = 90;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });

            if (connectionsEnabled) {
                // simple O(n^2) guard: only run if small
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq > connectionDist * connectionDist) continue;
                        const distance = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 200, 255, ${Math.max(0.02, 0.12 - distance / 700)})`;
                        ctx.lineWidth = 0.45;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        };
        animate();
    };

    // ==========================================
    //  DEEP SPACE UNIVERSE ENGINE - optimized
    // ==========================================
    const initUniverse = () => {
        const nebula = document.querySelector('.bg-nebula-deep');
        const stars = document.querySelector('.bg-stars-far');
        const universe = document.querySelector('.universe-background');

        if (!nebula && !stars && !universe) return;

        let isTicking = false;
        window.addEventListener('mousemove', (e) => {
            if (isTicking) return;
            isTicking = true;
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 14;
                const y = (e.clientY / window.innerHeight - 0.5) * 14;

                if (universe) {
                    universe.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
                    universe.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
                }
                if (nebula) nebula.style.transform = `translate(${x * 0.45}px, ${y * 0.45}px)`;
                if (stars) stars.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;

                // Profile Visual Parallax (lightweight checks)
                const heroVisual = document.querySelector('.hero-visual');
                if (heroVisual) {
                    const profile = heroVisual.querySelector('.profile-mask');
                    if (profile) profile.style.transform = `translate(${x * -0.45}px, ${y * -0.45}px)`;
                }
                isTicking = false;
            });
        }, { passive: true });
    };

    // ==========================================
    //  ELITE REVEAL & INTERACTION ENGINE
    // ==========================================
    const initRevealEngine = () => {
        const options = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Trigger skill bar animations if applicable
                    const skillBar = entry.target.querySelector('.progress-fill');
                    if (skillBar) {
                        const width = skillBar.getAttribute('data-width') || skillBar.style.width || '85%';
                        skillBar.style.width = width;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.reveal, .reveal-up, .bento-item, .bento-item-large, .glass-pane').forEach(el => {
            observer.observe(el);
        });
    };

    // ==========================================
    //  SMOOTH SCROLL & NAVBAR DYNAMICS
    // ==========================================
    const initNavigation = () => {
        const nav = document.querySelector('.glass-navbar');
        const onScroll = () => {
            if (!nav) return;
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Smooth scroll for nav links (delegation)
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest && e.target.closest('a[href^="#"]');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    };

    // ==========================================
    //  TILT INTERACTION (PREMIUM HOVER) - throttled per element
    // ==========================================
    const initTilt = () => {
        const elements = document.querySelectorAll('.bento-item, .bento-item-large, .glass-pane-hover');
        elements.forEach(el => {
            let ticking = false;
            const onMove = (e) => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    const rotateX = (-y) * 8;
                    const rotateY = (x) * 8;
                    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    ticking = false;
                });
            };
            el.addEventListener('mousemove', onMove);
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            });
        });
    };

    // ==========================================
    //  CONTACT FORM ENCRYPTION SIMULATION
    // ==========================================
    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            if (!btn) return;

            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin me-2"></i> Encrypting...';

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check me-2"></i> Transmission Secured';
                btn.style.background = 'var(--success)';
                form.reset();
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 1800);
            }, 900);
        });
    };

    // ==========================================
    //  PREMIUM TYPING ENGINE
    // ==========================================
    const initTyping = () => {
        const target = document.getElementById('typing-hero');
        if (!target) return;
        
        const text = "Software Engineer & AI Specialist";
        let index = 0;
        let isDeleting = false;
        
        const type = () => {
            const current = text.substring(0, index);
            target.textContent = current;
            
            let speed = isDeleting ? 40 : 90;
            
            if (!isDeleting && index === text.length) {
                speed = 2500; // Pause at end
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                speed = 450;
            }
            
            index = isDeleting ? index - 1 : index + 1;
            setTimeout(type, speed);
        };
        
        type();
    };

    // ==========================================
    //  STAT COUNTER ENGINE
    // ==========================================
    const initCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const options = { threshold: 0.9 };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    const speed = Math.max(8, Math.floor(2000 / Math.max(1, target)));

                    let start = 0;
                    const step = () => {
                        start += Math.ceil(target / 100);
                        if (start < target) {
                            entry.target.innerText = start;
                            setTimeout(step, speed);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    step();
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        counters.forEach(c => observer.observe(c));
    };

    // Launch fast/critical systems immediately
    initRevealEngine();
    initNavigation();
    initContactForm();
    initTyping();
    initCounters();

    // Schedule heavy systems for idle time or skip on low-power / touch
    if (!skipHeavy) {
        scheduleInit(() => { initParticles(); });
        scheduleInit(() => { initUniverse(); });
        scheduleInit(() => { initTilt(); });
    }
});
