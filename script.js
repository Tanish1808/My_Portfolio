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
    const roleEl = document.querySelector(".hero-role");
    const phrase = "IT Student | Coder | Problem Solver";
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
    const sections = document.querySelectorAll("section");
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
        ".hero-box .stat-item, .about-me, .edu-card, .skills-card > div, .projects-dashboard, .cert-card, .contact input, .contact textarea"
    );
    animatedElements.forEach(el => {
        el.classList.add("fade-in");
        observer.observe(el);
    });

    // ── Hamburger Menu Toggle ──────────────────────────────────────────
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.querySelector(".nav-links");
    const menuIcon = document.getElementById("menuIcon");

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
    // Selecting the terminal elements from index.html
    const mockTerminal = document.querySelector(".mock-terminal");
    const terminalInput = document.getElementById("terminalInput");
    const terminalHistory = document.getElementById("terminalHistory");
    const terminalBody = document.querySelector(".terminal-body");

    // UX: Focus the input field when the user clicks anywhere inside the terminal area
    if (mockTerminal && terminalInput) {
        mockTerminal.addEventListener("click", () => {
            terminalInput.focus();
        });
    }

    if (terminalInput && terminalHistory) {
        // Command History Tracking
        const commandHistory = [];
        let historyIndex = -1;

        // Commands Dictionary: Maps command keys to functions returning HTML strings
        const commands = {
            help: () => `Available commands:
  - <span class="terminal-command-info">about</span>    : Learn more about Tanish Shah
  - <span class="terminal-command-info">skills</span>   : Print coding languages and tech stack
  - <span class="terminal-command-info">projects</span> : View major portfolio projects
  - <span class="terminal-command-info">contact</span>  : Show email and social profiles
  - <span class="terminal-command-info">theme</span>    : Toggle Light/Dark mode of the site
  - <span class="terminal-command-info">clear</span>    : Clear the console screen
  - <span class="terminal-command-info">cat developer.json</span> : Output raw developer info
  - <span class="terminal-command-info">matrix</span>   : Run Matrix digital rain animation
  - <span class="terminal-command-info">joke</span>     : Print a random coding joke
  - <span class="terminal-command-info">sudo</span>     : Run a superuser command
  - <span class="terminal-command-info">help</span>     : Show this instructions message`,
            about: () => `Tanish Shah is an enthusiastic Information Technology student, problem solver, and coder. 
Currently building premium user interfaces and software systems, focusing on clean code, scalability, and modern web APIs.`,
            skills: () => `Core Tech Stack & Skills:
  - Languages  : Java, Python, .NET
  - Web Tech   : HTML5, CSS3, JavaScript, React JS
  - Databases  : PostgreSQL, MySQL, MongoDB, Git
  - Frameworks : Node JS, Express JS, Bootstrap, Tailwind CSS
  - Suites     : Data Structures & Algorithms, Problem Solving, UI/UX Design`,
            projects: () => `Portfolio Projects:
  1. <span class="terminal-command-info">Bus Seat Reservation System (SEM-I)</span> — Java app automating real-time seat availability & booking.
  2. <span class="terminal-command-info">Hostel Management System (SEM-I)</span> — OOPs-based administration portal for room management & payments.
  3. <span class="terminal-command-info">Course Management System (SEM-II)</span> — Institutional platform for digital course enrollment, grading & DB structures.`,
            contact: () => `Let's connect!
  - Email    : <a href="mailto:tanish.shahdev@gmail.com" target="_blank" style="color: var(--accent-cyan);">tanish.shahdev@gmail.com</a>
  - GitHub   : <a href="https://github.com/Tanish1808" target="_blank" style="color: var(--accent-cyan);">github.com/Tanish1808</a>
  - LinkedIn : <a href="https://www.linkedin.com/in/tanish-shah-703489349/" target="_blank" style="color: var(--accent-cyan);">tanish-shah-703489349</a>`,
            "cat developer.json": () => `<span class="bracket">{</span>
  <div class="indent"><span class="key">"name"</span>: <span class="val">"Tanish Shah"</span>,</div>
  <div class="indent"><span class="key">"role"</span>: <span class="val">"IT Student & Coder"</span>,</div>
  <div class="indent"><span class="key">"skills"</span>: <span class="bracket">[</span><span class="val">"Java"</span>, <span class="val">"JS"</span>, <span class="val">"DBMS"</span><span class="bracket">]</span>,</div>
  <div class="indent"><span class="key">"focus"</span>: <span class="val">"Clean Code"</span>,</div>
  <div class="indent"><span class="key">"status"</span>: <span class="val">"Building the future..."</span></div>
<span class="bracket">}</span>`,
            // Toggle theme and update localStorage preference
            theme: () => {
                document.body.classList.toggle("light-theme");
                const isLight = document.body.classList.contains("light-theme");
                localStorage.setItem("theme", isLight ? "light" : "dark");
                return `<span class="terminal-command-success">Theme toggled to ${isLight ? "Light Mode" : "Dark Mode"}!</span>`;
            },
            joke: () => {
                const jokes = [
                    "Why do programmers wear glasses? Because they can't C#!",
                    "There are 10 types of people in the world: those who understand binary, and those who don't.",
                    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
                    "A SQL query goes into a bar, walks up to two tables and asks, 'Can I join you?'",
                    "['hip', 'hip'] (hip hip array!)",
                    "Why did the programmer quit their job? Because they didn't get arrays.",
                    "What is a programmer's favorite hangout place? Foo Bar!"
                ];
                const randomIndex = Math.floor(Math.random() * jokes.length);
                return `<span class="terminal-command-success">Joke:</span> ${jokes[randomIndex]}`;
            },
            sudo: () => {
                return `<span class="terminal-command-error">Permission denied. user 'guest' is not in the sudoers file. This incident will be reported.</span>`;
            },
            git: () => {
                return `git: 'git' is not a registered terminal command here.<br>Try using git in your computer's native terminal to clone repositories!`;
            },
            matrix: () => {
                if (document.querySelector(".matrix-canvas")) return "";

                const canvas = document.createElement("canvas");
                canvas.className = "matrix-canvas";

                const exitHint = document.createElement("div");
                exitHint.className = "matrix-exit-hint";
                exitHint.innerText = "PRESS ANY KEY TO EXIT";

                terminalBody.appendChild(canvas);
                terminalBody.appendChild(exitHint);

                terminalInput.disabled = true;
                terminalInput.blur();

                // Track launch time to prevent accidental immediate exits (key repeats / event bubbling)
                const startTime = Date.now();

                const ctx = canvas.getContext("2d");
                const originalOverflow = terminalBody.style.overflow;
                terminalBody.style.overflow = "hidden";

                // Align scroll position so the absolute canvas container matches the viewport
                terminalBody.scrollTop = 0;
                terminalBody.scrollLeft = 0;

                function resizeCanvas() {
                    canvas.width = terminalBody.clientWidth;
                    canvas.height = terminalBody.clientHeight;
                }
                resizeCanvas();

                const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン".split("");
                const fontSize = 12;
                let columns = Math.floor(canvas.width / fontSize);
                let drops = [];
                for (let i = 0; i < columns; i++) {
                    // Populate some drops instantly across height and stagger others above the screen
                    drops[i] = Math.random() * (canvas.height / fontSize) - 20;
                }

                let animationId;

                function draw() {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Match cyan accent theme and apply a glowing text filter
                    ctx.fillStyle = "#00E5FF";
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "#00E5FF";
                    ctx.font = `${fontSize}px monospace`;

                    for (let i = 0; i < drops.length; i++) {
                        const text = chars[Math.floor(Math.random() * chars.length)];
                        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                            drops[i] = 0;
                        }
                        drops[i]++;
                    }
                    animationId = requestAnimationFrame(draw);
                }

                draw();

                window.addEventListener("resize", resizeCanvas);

                function exitMatrix() {
                    // Ignore keydowns/clicks within first 400ms to avoid immediate exit
                    if (Date.now() - startTime < 400) return;

                    cancelAnimationFrame(animationId);
                    window.removeEventListener("resize", resizeCanvas);

                    canvas.remove();
                    exitHint.remove();

                    terminalBody.style.overflow = originalOverflow;
                    terminalInput.disabled = false;
                    terminalInput.focus();

                    document.removeEventListener("keydown", exitMatrix);
                    canvas.removeEventListener("click", exitMatrix);
                }

                document.addEventListener("keydown", exitMatrix);
                canvas.addEventListener("click", exitMatrix);

                return "";
            },
            // Empties the history container
            clear: () => {
                terminalHistory.innerHTML = "";
                return "";
            }
        };

        // Listen for key presses in the terminal input field
        terminalInput.addEventListener("keydown", (e) => {
            // Check if user pressed "Enter"
            if (e.key === "Enter") {
                const rawInput = terminalInput.value;
                const cleanedInput = rawInput.trim().toLowerCase();

                // 1. Echo user's typed command back to history log (skip on 'clear')
                if (cleanedInput !== "clear" && rawInput.trim() !== "") {
                    const cmdLine = document.createElement("div");
                    cmdLine.className = "terminal-line";
                    cmdLine.innerHTML = `<span class="prompt">tanishshah ~ %</span> <span class="cmd">${escapeHTML(rawInput)}</span>`;
                    terminalHistory.appendChild(cmdLine);
                }

                // 2. Process command and route to appropriate outputs
                if (rawInput.trim() !== "") {
                    // Save to command history
                    commandHistory.push(rawInput);
                    historyIndex = -1; // Reset pointer

                    let outputHTML = "";
                    if (commands[cleanedInput]) {
                        outputHTML = commands[cleanedInput](); // Execute command function
                    } else if (cleanedInput === "cat" || cleanedInput === "cat developer") {
                        outputHTML = `<span class="terminal-command-error">Usage: cat developer.json</span>`;
                    } else {
                        // Fallback message for invalid/unknown commands
                        outputHTML = `<span class="terminal-command-error">command not found: ${escapeHTML(rawInput)}</span>. Type 'help' for options.`;
                    }

                    // 3. Print command results in history container
                    if (cleanedInput !== "clear" && outputHTML !== "") {
                        const outputDiv = document.createElement("div");
                        outputDiv.className = "terminal-output";
                        outputDiv.innerHTML = outputHTML;
                        terminalHistory.appendChild(outputDiv);
                    }
                }

                // 4. Reset input field so user can type the next command
                terminalInput.value = "";

                // 5. Scroll log window down to make sure new output is visible (skip if matrix mode is active)
                if (terminalBody && !document.querySelector(".matrix-canvas")) {
                    setTimeout(() => {
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                    }, 10);
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (commandHistory.length === 0) return;
                if (historyIndex === -1) {
                    historyIndex = commandHistory.length - 1;
                } else if (historyIndex > 0) {
                    historyIndex--;
                }
                terminalInput.value = commandHistory[historyIndex];
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (commandHistory.length === 0) return;
                if (historyIndex !== -1 && historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    terminalInput.value = "";
                }
            } else if (e.key === "Tab") {
                e.preventDefault();
                const rawInput = terminalInput.value;
                const cleanedInput = rawInput.trim().toLowerCase();
                if (cleanedInput === "") return;

                // Get all command keys
                const commandKeys = Object.keys(commands);
                const matches = commandKeys.filter(cmd => cmd.startsWith(cleanedInput));

                if (matches.length === 1) {
                    terminalInput.value = matches[0];
                } else if (matches.length > 1) {
                    // Echo current state and print matches
                    const cmdLine = document.createElement("div");
                    cmdLine.className = "terminal-line";
                    cmdLine.innerHTML = `<span class="prompt">tanishshah ~ %</span> <span class="cmd">${escapeHTML(rawInput)}</span>`;
                    terminalHistory.appendChild(cmdLine);

                    const matchesDiv = document.createElement("div");
                    matchesDiv.className = "terminal-output";
                    matchesDiv.innerHTML = `<span class="terminal-command-info">Possibilities:</span> ${matches.join("  ")}`;
                    terminalHistory.appendChild(matchesDiv);

                    // Find common prefix to autocomplete as much as possible
                    let commonPrefix = cleanedInput;
                    let finished = false;
                    while (!finished) {
                        let nextChar = null;
                        for (let i = 0; i < matches.length; i++) {
                            const match = matches[i];
                            if (match.length <= commonPrefix.length) {
                                finished = true;
                                break;
                            }
                            const char = match[commonPrefix.length];
                            if (nextChar === null) {
                                nextChar = char;
                            } else if (nextChar !== char) {
                                finished = true;
                                break;
                            }
                        }
                        if (!finished && nextChar !== null) {
                            commonPrefix += nextChar;
                        } else {
                            finished = true;
                        }
                    }
                    terminalInput.value = commonPrefix;

                    if (terminalBody) {
                        setTimeout(() => {
                            terminalBody.scrollTop = terminalBody.scrollHeight;
                        }, 10);
                    }
                }
            }
        });

        // Security Utility: Escapes dangerous HTML characters to prevent XSS (script injection)
        function escapeHTML(str) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }

    // ── Interactive Canvas Particle Background ─────────────────────────
    const canvas = document.getElementById("heroCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");

        let particles = [];
        let mouse = { x: null, y: null, radius: 110 }; // Interaction radius

        // Configuration parameters
        let particleCount = 70;
        let connectionDistance = 115;

        // Colors mapping based on light/dark mode theme
        function getThemeColors() {
            const isLight = document.body.classList.contains("light-theme");
            return {
                cyan: isLight ? "rgba(0, 136, 163," : "rgba(0, 229, 255,",
                purple: isLight ? "rgba(109, 40, 217," : "rgba(139, 92, 246,"
            };
        }

        let colors = getThemeColors();

        // Adjust Canvas size to match hero element
        const heroSection = document.getElementById("home");
        function resizeCanvas() {
            if (heroSection) {
                canvas.width = heroSection.offsetWidth;
                canvas.height = heroSection.offsetHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            // Adjust particle count dynamically based on width for mobile performance
            if (canvas.width < 768) {
                particleCount = 30;
                connectionDistance = 80;
            } else {
                particleCount = 70;
                connectionDistance = 115;
            }
            initParticles();
        }

        // Particle Class definition
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;

                // Slow, elegant speed vector
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;

                this.radius = Math.random() * 2 + 1.2; // Radius between 1.2px and 3.2px

                // Assign a color group (cyan or purple)
                this.type = Math.random() > 0.5 ? "cyan" : "purple";
            }

            update() {
                // Move particle
                this.x += this.vx;
                this.y += this.vy;

                // Bounce on boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Cursor interaction (repulsion)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);

                        // Push away gently
                        this.x += Math.cos(angle) * force * 1.6;
                        this.y += Math.sin(angle) * force * 1.6;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.type === "cyan" ? `${colors.cyan} 0.65)` : `${colors.purple} 0.6)`;
                ctx.shadowBlur = this.radius * 1.5;
                ctx.shadowColor = this.type === "cyan" ? "rgba(0, 229, 255, 0.3)" : "rgba(139, 92, 246, 0.2)";
                ctx.fill();
                // Reset shadow properties to avoid performance degradation during lines draw
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        // Determine line opacity based on distance
                        const alpha = (1 - dist / connectionDistance) * 0.15;

                        // Color matching
                        let strokeColor;
                        if (p1.type === "cyan" && p2.type === "cyan") {
                            strokeColor = `${colors.cyan} ${alpha})`;
                        } else if (p1.type === "purple" && p2.type === "purple") {
                            strokeColor = `${colors.purple} ${alpha})`;
                        } else {
                            strokeColor = `${colors.cyan} ${alpha * 0.5})`;
                        }

                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = strokeColor;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Draw connecting lines from cursor to nearby particles
                if (mouse.x !== null && mouse.y !== null) {
                    const p = particles[i];
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = p.type === "cyan" ? `${colors.cyan} ${alpha})` : `${colors.purple} ${alpha})`;
                        ctx.lineWidth = 1.0;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connecting lines
            drawConnections();

            requestAnimationFrame(animate);
        }

        // Track mouse position relative to hero canvas bounding rect
        if (heroSection) {
            heroSection.addEventListener("mousemove", (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            heroSection.addEventListener("mouseleave", () => {
                mouse.x = null;
                mouse.y = null;
            });
        }

        // Observe theme class changes on body to update colors dynamically (covers both toggle click & terminal commands)
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    colors = getThemeColors();
                }
            });
        });
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

        // Initialize
        resizeCanvas();
        animate();

        // Resize listener with debouncer
        window.addEventListener("resize", () => {
            clearTimeout(window.resizeCanvasTimeout);
            window.resizeCanvasTimeout = setTimeout(resizeCanvas, 150);
        });
    }

    // ── Contact Form Handling ──────────────────────────────────────────
    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");
    const contactSubmitBtn = document.getElementById("contactSubmitBtn");

    if (contactForm && contactStatus && contactSubmitBtn) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Reset status state
            contactStatus.className = "contact-status";
            contactStatus.innerHTML = "";

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const subjectInput = document.getElementById("subject");
            const messageInput = document.getElementById("message");

            // Reset previous validation styles
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (input) input.classList.remove("invalid");
            });

            // Perform client-side validation
            let isValid = true;
            if (!nameInput || !nameInput.value.trim()) {
                if (nameInput) nameInput.classList.add("invalid");
                isValid = false;
            }

            // Basic email validation regex
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || !emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                if (emailInput) emailInput.classList.add("invalid");
                isValid = false;
            }
            if (!subjectInput || !subjectInput.value.trim()) {
                if (subjectInput) subjectInput.classList.add("invalid");
                isValid = false;
            }
            if (!messageInput || !messageInput.value.trim()) {
                if (messageInput) messageInput.classList.add("invalid");
                isValid = false;
            }

            if (!isValid) {
                showStatus("Please fill out all fields correctly.", "error");
                return;
            }

            // Disable submit button and show loading state
            contactSubmitBtn.disabled = true;
            const originalBtnText = contactSubmitBtn.innerHTML;
            contactSubmitBtn.innerHTML = "Sending... <i class='fa-solid fa-spinner fa-spin'></i>";
            showStatus("Sending message...", "loading");

            // Access token placeholder (swappable by the user)
            const web3FormsToken = "910f5326-cda3-4580-b2c3-6ddc2629962e";

            try {
                if (web3FormsToken === "YOUR_ACCESS_KEY_HERE" || !web3FormsToken || web3FormsToken === "") {
                    throw new Error("No Web3Forms access key configured. Falling back to local mail client.");
                }

                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        access_key: web3FormsToken,
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        subject: subjectInput.value.trim(),
                        message: messageInput.value.trim()
                    })
                });

                const result = await response.json();

                if (response.status === 200 && result.success) {
                    showStatus("Message sent successfully! 🚀", "success");
                    contactForm.reset();
                } else {
                    throw new Error(result.message || "Failed to submit using API.");
                }
            } catch (error) {
                console.warn(error.message);

                // Fallback to pre-filled mailto link
                const subject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()}`);
                const body = encodeURIComponent(
                    `Name: ${nameInput.value.trim()}\n` +
                    `Email: ${emailInput.value.trim()}\n\n` +
                    `Message:\n${messageInput.value.trim()}`
                );

                showStatus("Web3Forms token missing. Opening mail client...", "loading");

                setTimeout(() => {
                    window.open(`mailto:tanish.shahdev@gmail.com?subject=${subject}&body=${body}`, "_self");
                    showStatus("Mail client opened. Please send the email! ❤️", "success");
                }, 1200);
            } finally {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.innerHTML = originalBtnText;
            }
        });

        function showStatus(message, type) {
            contactStatus.innerHTML = message;
            contactStatus.className = `contact-status show ${type}`;
        }
    }

    // ── Projects Detail Modal Logic ────────────────────────────────────
    const projectsData = {
        bus: {
            title: "Bus Seat Reservation System (SEM-I)",
            description: "This application automates the bus ticketing and seat booking process. It provides real-time availability mapping, user details registration, and secure seat locks, replacing paper-based manual administration.",
            tech: ["Core Java", "Conditional Statements", "Arrays", "Git"],
            features: [
                "Real-time visual seat allocation matrix",
                "Automated check-ins and ticket generation",
                "Validation system preventing double bookings",
                "Console UI designed with structured formatting"
            ],
            image: "assets/bus_reservation.png",
            github: "https://github.com/Tanish1808/Bus_Management_System/blob/main/src/BusSeatReservationSystem.java"
        },
        hostel: {
            title: "Hostel Management System (SEM-I)",
            description: "A centralized software portal developed to help administrators manage rooms, student profiles, transaction payments, and custom service complaints. Built on solid OOP principles for structured object data representation.",
            tech: ["Java", "OOPs Concepts", "SRS Documentation", "Arrays"],
            features: [
                "Detailed room allocation tracker (occupancy and vacancy metrics)",
                "Student registration directory with check-in details",
                "Centralized payment history logger",
                "Structured request/complaints management workflow"
            ],
            image: "assets/hostel_management.png",
            github: "https://github.com/Tanish1808/Hostel_Management_System/blob/main/src/HostelManagementSystem.java"
        },
        course: {
            title: "Course Management System (SEM-II)",
            description: "An educational platform built to digitalize academic schedules, student enrollments, course catalogs, and grade records. Leverages basic database storage structures and custom Java OOP classes.",
            tech: ["Java", "DBMS Concepts", "Data Structures", "OOPs"],
            features: [
                "Dynamic course listing, editing, and creation workflows",
                "Student academic enrollment panel with prerequisites checking",
                "Grading spreadsheet calculator",
                "Performance visualization metrics for academic reporting"
            ],
            image: "assets/course_management.png",
            github: "https://github.com/Tanish1808/Course_Management_System/tree/main/src"
        }
    };

    // ── Projects Dashboard Logic ───────────────────────────────────────
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const displayPanel = document.querySelector(".projects-display");
    const displayImg = document.getElementById("displayImg");
    const displayTitle = document.getElementById("displayTitle");
    const displayTags = document.getElementById("displayTags");
    const displayDesc = document.getElementById("displayDesc");
    const displayFeatures = document.getElementById("displayFeatures");
    const displayCodeBtn = document.getElementById("displayCodeBtn");

    if (sidebarItems.length > 0 && displayPanel) {
        sidebarItems.forEach(item => {
            item.addEventListener("click", () => {
                // If already active, do nothing
                if (item.classList.contains("active")) return;

                const projectId = item.getAttribute("data-project");
                const data = projectsData[projectId];

                if (data) {
                    // Remove active class from all items
                    sidebarItems.forEach(sib => {
                        sib.classList.remove("active");
                        // Also reset the transform inline styles from 3D tilt
                        sib.style.transform = "";
                        sib.style.transition = "";
                    });

                    // Add active class to clicked item
                    item.classList.add("active");

                    // Trigger fade out / slide down transition on display panel
                    displayPanel.classList.add("updating");

                    // Wait for transition duration (350ms) to update content
                    setTimeout(() => {
                        // Update media content
                        if (displayImg) {
                            displayImg.src = data.image;
                            displayImg.alt = `${data.title} Screenshot`;
                        }

                        // Update text details
                        if (displayTitle) displayTitle.textContent = data.title;
                        if (displayDesc) displayDesc.textContent = data.description;

                        // Update tags
                        if (displayTags) {
                            displayTags.innerHTML = "";
                            data.tech.forEach(techName => {
                                const span = document.createElement("span");
                                span.textContent = techName;
                                displayTags.appendChild(span);
                            });
                        }

                        // Update features
                        if (displayFeatures) {
                            displayFeatures.innerHTML = "";
                            data.features.forEach(feat => {
                                const li = document.createElement("li");
                                li.textContent = feat;
                                displayFeatures.appendChild(li);
                            });
                        }

                        // Update code link
                        if (displayCodeBtn) {
                            displayCodeBtn.href = data.github;
                        }

                        // Transition back in: remove "updating" class
                        displayPanel.classList.remove("updating");
                    }, 350);
                }
            });
        });
    }

    // ── Certifications Detail Modal Logic ──────────────────────────────
    const certModal = document.getElementById("certModal");
    const certModalCloseBtn = document.getElementById("certModalCloseBtn");
    const certModalOverlay = document.getElementById("certModalOverlay");
    const certModalTitle = document.getElementById("certModalTitle");
    const certModalIframe = document.getElementById("certModalIframe");

    if (certModal && certModalCloseBtn && certModalOverlay && certModalIframe) {
        // Select all cert cards View Certificate buttons
        const certViewButtons = document.querySelectorAll(".cert-card .view-btn");

        certViewButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const pdfUrl = btn.getAttribute("href");
                
                // If it is a real PDF (does not start with '#' or is empty)
                if (pdfUrl && pdfUrl !== "#" && pdfUrl !== "") {
                    e.preventDefault(); // Intercept browser navigation
                    
                    // Find the certificate card title
                    const card = btn.closest(".cert-card");
                    const titleEl = card ? card.querySelector("h3") : null;
                    const certTitle = titleEl ? titleEl.textContent.trim() : "Certification";
                    
                    openCertModal(pdfUrl, certTitle);
                }
            });
        });

        // Close button click
        certModalCloseBtn.addEventListener("click", closeCertModal);

        // Overlay backdrop click
        certModalOverlay.addEventListener("click", closeCertModal);

        // Escape key close
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && certModal.classList.contains("active")) {
                closeCertModal();
            }
        });

        function openCertModal(url, title) {
            certModalTitle.textContent = title;
            // Append PDF view parameters to fit the page horizontally and hide navigation panes
            certModalIframe.src = url + "#toolbar=0&navpanes=0&view=FitH";
            
            // Show Modal and disable background scrolling
            certModal.classList.add("active");
            certModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        }

        function closeCertModal() {
            certModal.classList.remove("active");
            certModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            
            // Clear iframe src after transition to stop PDF loading/audio in background
            setTimeout(() => {
                certModalIframe.src = "";
            }, 400);
        }
    }

    // ── 3D Hover Tilt Effect ───────────────────────────────────────────
    const tiltElements = document.querySelectorAll(".sidebar-item, .cert-card, .edu-card");

    tiltElements.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Maximum tilt angle (in degrees)
            const maxTilt = 8;
            
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = ((centerY - y) / centerY) * maxTilt;
            
            // Apply perspective, 3D rotations, and scale
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = "transform 0.08s ease, box-shadow 0.08s ease, border-color 0.08s ease";
        });

        card.addEventListener("mouseleave", () => {
            // Smoothly ease back to flat state on mouse exit
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        });
    });
});
