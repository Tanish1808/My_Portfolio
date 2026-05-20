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

    // ── Interactive Terminal ───────────────────────────────────────────
    const mockTerminal = document.querySelector(".mock-terminal");
    const terminalInput = document.getElementById("terminalInput");
    const terminalHistory = document.getElementById("terminalHistory");
    const terminalBody = document.querySelector(".terminal-body");

    // Click anywhere on terminal to focus the input field
    if (mockTerminal && terminalInput) {
        mockTerminal.addEventListener("click", () => {
            terminalInput.focus();
        });
    }

    if (terminalInput && terminalHistory) {
        // Commands registry
        const commands = {
            help: () => `Available commands:
  - <span class="terminal-command-info">about</span>    : Learn more about Tanish Shah
  - <span class="terminal-command-info">skills</span>   : Print coding languages and tech stack
  - <span class="terminal-command-info">projects</span> : View major portfolio projects
  - <span class="terminal-command-info">contact</span>  : Show email and social profiles
  - <span class="terminal-command-info">theme</span>    : Toggle Light/Dark mode of the site
  - <span class="terminal-command-info">clear</span>    : Clear the console screen
  - <span class="terminal-command-info">cat developer.json</span> : Output raw developer info
  - <span class="terminal-command-info">help</span>     : Show this instructions message`,
            about: () => `Tanish Shah is an enthusiastic Information Technology student, problem solver, and coder. 
Currently building premium user interfaces and software systems, focusing on clean code, scalability, and modern web APIs.`,
            skills: () => `Core Tech Stack & Skills:
  - Languages  : Java, Javascript (ES6+), C++, HTML5, CSS3
  - Web & App  : React.js, Node.js, REST APIs, Bootstrap
  - Databases  : DBMS, SQL, Oracle SQL, MongoDB
  - Core Competencies : Data Structures, Algorithms, OOPs, SDLC`,
            projects: () => `Portfolio Projects:
  1. <span class="terminal-command-info">Online Voting System</span> — Java/Servlets based voting portal with secure verification.
  2. <span class="terminal-command-info">Crop Yield Prediction</span> — ML platform analyzing soil parameters to recommend crops.
  3. <span class="terminal-command-info">Modern Portfolio Website</span> — This interactive, variable-driven glassmorphism showcase.`,
            contact: () => `Let's connect!
  - Email    : <a href="mailto:tanishshah051@gmail.com" target="_blank" style="color: var(--accent-cyan);">tanishshah051@gmail.com</a>
  - GitHub   : <a href="https://github.com/Tanishshah05" target="_blank" style="color: var(--accent-cyan);">github.com/Tanishshah05</a>
  - LinkedIn : <a href="https://linkedin.com/in/tanishshah1808" target="_blank" style="color: var(--accent-cyan);">linkedin.com/in/tanishshah1808</a>`,
            "cat developer.json": () => `<span class="bracket">{</span>
  <div class="indent"><span class="key">"name"</span>: <span class="val">"Tanish Shah"</span>,</div>
  <div class="indent"><span class="key">"role"</span>: <span class="val">"IT Student & Coder"</span>,</div>
  <div class="indent"><span class="key">"skills"</span>: <span class="bracket">[</span><span class="val">"Java"</span>, <span class="val">"JS"</span>, <span class="val">"DBMS"</span><span class="bracket">]</span>,</div>
  <div class="indent"><span class="key">"focus"</span>: <span class="val">"Clean Code"</span>,</div>
  <div class="indent"><span class="key">"status"</span>: <span class="val">"Building the future..."</span></div>
<span class="bracket">}</span>`,
            theme: () => {
                document.body.classList.toggle("light-theme");
                const isLight = document.body.classList.contains("light-theme");
                localStorage.setItem("theme", isLight ? "light" : "dark");
                return `<span class="terminal-command-success">Theme toggled to ${isLight ? "Light Mode" : "Dark Mode"}!</span>`;
            },
            clear: () => {
                terminalHistory.innerHTML = "";
                return "";
            }
        };

        // Listen for command submission
        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const rawInput = terminalInput.value;
                const cleanedInput = rawInput.trim().toLowerCase();
                
                // Add the typed command line to history
                if (cleanedInput !== "clear" && rawInput.trim() !== "") {
                    const cmdLine = document.createElement("div");
                    cmdLine.className = "terminal-line";
                    cmdLine.innerHTML = `<span class="prompt">tanishshah ~ %</span> <span class="cmd">${escapeHTML(rawInput)}</span>`;
                    terminalHistory.appendChild(cmdLine);
                }

                // Process command
                if (rawInput.trim() !== "") {
                    let outputHTML = "";
                    if (commands[cleanedInput]) {
                        outputHTML = commands[cleanedInput]();
                    } else if (cleanedInput === "cat" || cleanedInput === "cat developer") {
                        outputHTML = `<span class="terminal-command-error">Usage: cat developer.json</span>`;
                    } else {
                        outputHTML = `<span class="terminal-command-error">command not found: ${escapeHTML(rawInput)}</span>. Type 'help' for options.`;
                    }

                    // Append output
                    if (cleanedInput !== "clear" && outputHTML !== "") {
                        const outputDiv = document.createElement("div");
                        outputDiv.className = "terminal-output";
                        outputDiv.innerHTML = outputHTML;
                        terminalHistory.appendChild(outputDiv);
                    }
                }

                // Clear input field
                terminalInput.value = "";

                // Auto-scroll terminal to bottom
                if (terminalBody) {
                    setTimeout(() => {
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                    }, 10);
                }
            }
        });

        // Helper to escape HTML
        function escapeHTML(str) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }
});