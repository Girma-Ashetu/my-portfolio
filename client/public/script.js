document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    //  PREMIUM PARTICLE ENGINE (NETWORK)
    // ==========================================
    const initParticles = () => {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = [190, 210, 270, 300][Math.floor(Math.random() * 4)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsl(${this.hue}, 100%, 65%)`;
                ctx.fillStyle = `hsl(${this.hue}, 100%, 75%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const COUNT = Math.min(50, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            
            // Draw connective constellation lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    if (Math.abs(dx) > 120) continue;
                    const dy = particles[i].y - particles[j].y;
                    if (Math.abs(dy) > 120) continue;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 - distance / 800})`;
                        ctx.lineWidth = 0.5;
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
    //  DEEP SPACE UNIVERSE ENGINE
    // ==========================================
    const initUniverse = () => {
        const nebula = document.querySelector('.bg-nebula-deep');
        const stars = document.querySelector('.bg-stars-far');
        const universe = document.querySelector('.universe-background');

        let isTicking = false;
        window.addEventListener('mousemove', (e) => {
            if (isTicking) return;
            isTicking = true;
            requestAnimationFrame(() => {
                const xVal = (e.clientX / window.innerWidth) * 100;
                const yVal = (e.clientY / window.innerHeight) * 100;
                
                if (universe) {
                    universe.style.setProperty('--mouse-x', `${xVal}%`);
                    universe.style.setProperty('--mouse-y', `${yVal}%`);
                }

                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;

                if (nebula) nebula.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
                if (stars) stars.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;

                // Profile Visual Parallax
                const heroVisual = document.querySelector('.hero-visual');
                if (heroVisual) {
                    const profile = heroVisual.querySelector('.profile-mask');
                    const badge1 = heroVisual.querySelector('.float-1');
                    const badge2 = heroVisual.querySelector('.float-2');
                    const rings = heroVisual.querySelector('.rotating-rings');

                    if (profile) profile.style.transform = `translate(${x * -0.5}px, ${y * -0.5}px)`;
                    if (badge1) badge1.style.transform = `translate(${x * 1.5}px, ${y * 1.5}px)`;
                    if (badge2) badge2.style.transform = `translate(${x * 2.5}px, ${y * 2.5}px)`;
                    if (rings) rings.style.transform = `translate(${x * -0.2}px, ${y * -0.2}px)`;
                }
                isTicking = false;
            });
        }, { passive: true });
    };

    // ==========================================
    //  ELITE REVEAL & INTERACTION ENGINE
    // ==========================================
    const initRevealEngine = () => {
        const options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Trigger skill bar animations if applicable
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
            observer.observe(el);
        });
    };

    // ==========================================
    //  SMOOTH SCROLL & NAVBAR DYNAMICS
    // ==========================================
    const initNavigation = () => {
        const nav = document.querySelector('.glass-navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav?.classList.add('scrolled');
            } else {
                nav?.classList.remove('scrolled');
            }
        }, { passive: true });

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    };

    // ==========================================
    //  TILT INTERACTION (PREMIUM HOVER)
    // ==========================================
    const initTilt = () => {
        const elements = document.querySelectorAll('.bento-item, .bento-item-large, .glass-pane-hover');
        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (-(y - centerY) / centerY) * 8;
                const rotateY = ((x - centerX) / centerX) * 8;
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
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
                }, 3000);
            }, 1500);
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
            
            let speed = isDeleting ? 50 : 100;
            
            if (!isDeleting && index === text.length) {
                speed = 3000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                speed = 500;
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
        const options = { threshold: 1.0 };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = +entry.target.getAttribute('data-target');
                    const count = +entry.target.innerText;
                    const speed = 2000 / target; // Max 2 seconds for all

                    const updateCount = () => {
                        const current = +entry.target.innerText;
                        if (current < target) {
                            entry.target.innerText = Math.ceil(current + (target / 100));
                            setTimeout(updateCount, speed);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        counters.forEach(c => observer.observe(c));
    };

    // Launch all systems
    initParticles();
    initUniverse();
    initRevealEngine();
    initNavigation();
    initTilt();
    initContactForm();
    initTyping();
    initCounters();
});
