document.addEventListener("DOMContentLoaded", function () {
    
    // 1. SWIPER HERO SLIDER INIT
    if (document.querySelector('.mySwiper')) {
        const swiper = new Swiper(".mySwiper", {
            loop: true,
            effect: "fade",
            speed: 1500,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            on: {
                slideChangeTransitionStart: function () {
                    gsap.set('.hero-content', { opacity: 0, y: 50 });
                },
                slideChangeTransitionEnd: function () {
                    gsap.to('.hero-content', { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
                }
            }
        });
        // Initial animation trigger
        gsap.to('.hero-content', { opacity: 1, y: 0, duration: 1.5, delay: 0.5, ease: "power3.out" });
    }

    // 2. QUOTE SLIDER (SIMPLE)
    if (document.querySelector('.quoteSwiper')) {
        new Swiper(".quoteSwiper", {
            loop: true,
            autoplay: { delay: 4000 },
        });
    }

    // 3. MAGIC CURSOR LOGIC
    const cursor = document.querySelector('.cb-cursor');
    const follower = document.querySelector('.cb-cursor-follower');

    if (window.innerWidth > 768) { // Only on Desktop
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1 });
            gsap.to(follower, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.3 });
        });

        // Hover expand effect
        const links = document.querySelectorAll('a, button, .btn');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 2.5, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "transparent" });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, backgroundColor: "transparent", borderColor: "#fff" });
            });
        });
    }

    // 4. NAVBAR SCROLL EFFECT
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5. GSAP SCROLL REVEAL (The "Effect" from PDF)
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, y: 50 },
            {
                opacity: 1, 
                y: 0, 
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", // Starts animation when element is 85% down viewport
                }
            }
        );
    });

});