document.addEventListener("DOMContentLoaded", () => {

    // ── Theme Switcher ──────────────────────────────────────────────────
    const themeToggleBtn = document.getElementById("themeToggle");
    
    // Check saved theme (default is dark, ignoring system preferences for initial load)
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const isLight = document.body.classList.contains("light-theme");
            
            // Save theme
            localStorage.setItem("theme", isLight ? "light" : "dark");
        });
    }

    // ── Typewriter Effect (Continuous Loop) ───────────────────────────
    const roleEl  = document.querySelector(".hero-role");
    const phrase  = "IT Student | Coder | Problem Solver";
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        if (!isDeleting) {
            // Typing forward
            roleEl.textContent = phrase.slice(0, charIndex + 1);
            charIndex++;

            if (charIndex === phrase.length) {
                // Finished typing → pause 1.5s then start deleting
                isDeleting = true;
                setTimeout(typeWriter, 1500);
                return;
            }
            setTimeout(typeWriter, 80);
        } else {
            // Deleting backward
            roleEl.textContent = phrase.slice(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // Finished deleting → tiny pause then retype
                isDeleting = false;
                setTimeout(typeWriter, 400);
                return;
            }
            setTimeout(typeWriter, 40); // delete is faster than typing
        }
    }

    if (roleEl) {
        roleEl.textContent = "";
        typeWriter();
    }
    // ── End Typewriter ─────────────────────────────────────────────────

    // Back to top button logic
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
            backToTop.style.opacity = "1";
        } else {
            backToTop.style.opacity = "0";
            setTimeout(() => {
                if (window.scrollY <= 300) backToTop.style.display = "none";
            }, 300);
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Scroll Spy for Navbar Links
    const sections     = document.querySelectorAll("section");
    const scrollNavLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        scrollNavLinks.forEach(link => {
            link.classList.remove("active");
            if (current && link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // Intersection Observer for Fade-In Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add .fade-in class to elements we want to animate, then observe them
    const animatedElements = document.querySelectorAll(
        ".hero-box .stat-item, .about-me, .edu-card, .skills-card > div, .project, .cert-card, .contact input, .contact textarea"
    );
    animatedElements.forEach(el => {
        el.classList.add("fade-in");
        observer.observe(el);
    });

    // ── Hamburger Menu Toggle ──────────────────────────────────────────
    const menuToggle   = document.getElementById("menuToggle");
    const mobileNav    = document.querySelector(".nav-links");
    const menuIcon     = document.getElementById("menuIcon");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            mobileNav.classList.toggle("nav-open");
            const isOpen = mobileNav.classList.contains("nav-open");
            menuIcon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
        });

        // Auto-close menu when a nav link is clicked
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("nav-open");
                menuIcon.className = "fa-solid fa-bars";
            });
        });
    }
    // ── End Hamburger ──────────────────────────────────────────────────
});