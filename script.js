document.addEventListener('DOMContentLoaded', () => {
    // Smoother Parallax Logic
    const parallaxItems = document.querySelectorAll('.parallax-item');
    
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateParallax = () => {
        const scrollY = window.pageYOffset;
        
        parallaxItems.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-speed')) || 0.05;
            // Very subtle movement
            const yPos = (scrollY * speed);
            item.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Intersection Observer for elegant fade-ins
    const fadeElements = document.querySelectorAll('.fade-in-up, .glass-card, .timeline-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Minimal Mouse Parallax for Hero
    const hero = document.querySelector('#hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Highly subtle effect
            const moveX = (clientX - centerX) / 80;
            const moveY = (clientY - centerY) / 80;
            
            const content = document.querySelector('.hero-content');
            if (content) {
                content.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Scroll Transition
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(8, 8, 8, 0.98)';
            navbar.style.padding = '1rem 8%';
        } else {
            navbar.style.background = 'rgba(8, 8, 8, 0.9)';
            navbar.style.padding = '1.5rem 8%';
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }
});
