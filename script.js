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
    const phrases = [
        "IT Student | Coder | Problem Solver"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        if (!roleEl) return;
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            // Typing forward
            roleEl.textContent = currentPhrase.slice(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                // Finished typing → pause 1.5s then start deleting
                isDeleting = true;
                setTimeout(typeWriter, 1500);
                return;
            }
            setTimeout(typeWriter, 80);
        } else {
            // Deleting backward
            roleEl.textContent = currentPhrase.slice(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // Finished deleting → tiny pause then retype
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
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
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 250) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Scroll Spy for Navbar Links
    const sections = document.querySelectorAll("section");
    const scrollNavLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
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

    // ── Intersection Observer for Smooth Staggered Scroll Animations ──
    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 1. Sibling Element Groups (Staggered Reveals with dynamic CSS transition-delay)
    const staggerGroups = [
        // Hero Section: Quick Stat Items (4 items in 2x2 grid)
        { selector: ".hero-box .stat-item", staggerMs: 90, maxDelay: 600 },
        // About Section: Education Cards (3 cards in vertical sequence)
        { selector: "#about .edu-card", staggerMs: 110, maxDelay: 600 },
        // Skills Section: Bento Mastery Tiles (6 grid tiles)
        { selector: ".skills-bento-wall .bento-tile", staggerMs: 80, maxDelay: 600 },
        // Projects Section: Sidebar Project Selector Items (5 project items)
        { selector: ".projects-sidebar .sidebar-item", staggerMs: 90, maxDelay: 600 },
        // Contact Section: Telemetry Info Cards (4 telemetry cards in left panel)
        { selector: ".contact-telemetry-panel .telemetry-card", staggerMs: 90, maxDelay: 600 }
    ];

    staggerGroups.forEach(group => {
        const elements = document.querySelectorAll(group.selector);
        elements.forEach((el, index) => {
            el.classList.add("fade-in");
            const delay = Math.min(index * group.staggerMs, group.maxDelay);
            el.style.transitionDelay = `${delay}ms`;
            scrollObserver.observe(el);
        });
    });

    // 2. Standalone Single Elements (Instant Reveal with 0ms Delay)
    const singleElements = document.querySelectorAll(
        ".about-me > h2, .about-me > p, .about-me > h5, .skills-filter-bar, .skills-bento-wall, .projects-dashboard, .cert-deck-console, .contact-info-column, .contact-form-panel"
    );
    singleElements.forEach(el => {
        if (!el.classList.contains("fade-in")) {
            el.classList.add("fade-in");
            el.style.transitionDelay = "0ms";
            scrollObserver.observe(el);
        }
    });

    // ── Skills Bento Wall Category Filter ────────────────────────────────
    const skillFilterBtns = document.querySelectorAll(".skills-filter-btn");
    const bentoTiles = document.querySelectorAll(".bento-tile");
    const bentoWall = document.querySelector(".skills-bento-wall");

    if (skillFilterBtns.length > 0 && bentoWall) {
        skillFilterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                skillFilterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.getAttribute("data-filter");

                let visibleCount = 0;
                bentoTiles.forEach(tile => {
                    const matches = (filter === "all" || tile.getAttribute("data-category") === filter);
                    if (matches) {
                        visibleCount++;
                        tile.style.display = "flex";
                        tile.style.opacity = "1";
                        tile.style.transform = "translateY(0)";
                    } else {
                        tile.style.display = "none";
                        tile.style.opacity = "0";
                    }
                });

                if (visibleCount === 1) {
                    bentoWall.classList.add("is-single-card");
                } else {
                    bentoWall.classList.remove("is-single-card");
                }
            });
        });
    }

    // ── Bento Interactive Code Snippet Tabs ─────────────────────────────
    const snippetTabs = document.querySelectorAll(".snippet-tab");
    const snippetCode = document.getElementById("snippetCode");

    const codeSnippets = {
        java: `// Core Object-Oriented Architecture
public class Developer {
    private final String name = "Tanish";
    private final String[] stacks = {"Java", "React", "PostgreSQL", "Flask", "PyTorch"};

    public void buildApplication() {
        System.out.println("Architecting scalable & robust software solutions.");
    }
}`,
        python: `# Async ML & REST Pipeline
from fastapi import FastAPI
import torch

app = FastAPI(title="Civic Lens API")

@app.get("/classify")
async def classify_issue(image_tensor: torch.Tensor):
    return {"status": "classified", "severity": "High"}`,
        sql: `-- Relational Schema & SLA Query
SELECT t.ticket_id, t.subject, t.priority, s.sla_status
FROM it_tickets t
JOIN sla_policies s ON t.policy_id = s.id
WHERE t.status = 'OPEN'
ORDER BY t.priority_weight DESC;`
    };

    if (snippetTabs.length > 0 && snippetCode) {
        snippetTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                snippetTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const lang = tab.getAttribute("data-lang");
                if (codeSnippets[lang]) {
                    snippetCode.textContent = codeSnippets[lang];
                    snippetCode.className = `language-${lang}`;
                }
            });
        });
    }

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
  - <span class="terminal-command-info">resume</span>   : View &amp; open official resume in new tab
  - <span class="terminal-command-info">contact</span>  : Scroll to contact form &amp; view profiles
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
  - Languages  : Java, Python, JavaScript, SQL, .NET
  - Web & Front: HTML5, CSS3, React JS, Tailwind CSS, Bootstrap
  - Back & ML  : Node JS, Express JS, Flask, Django, DRF, FastAPI, PyTorch
  - Databases  : PostgreSQL, MySQL, MongoDB, Git & GitHub
  - Dev Tools  : VS Code, Postman, pgAdmin
  - Concepts   : Data Structures & Algorithms, Authentication, JWT, REST APIs, UI/UX Design`,
            projects: () => `Portfolio Projects:
  1. <span class="terminal-command-info">Bus Seat Reservation System (SEM-I)</span> — Core Java real-time booking matrix & seat locking.
  2. <span class="terminal-command-info">Hostel Management System (SEM-I)</span> — OOPs-based room allocation, student records & payments.
  3. <span class="terminal-command-info">Course Management System (SEM-II)</span> — Relational DBMS course catalog, prerequisites & GPA calc.
  4. <span class="terminal-command-info">Ticket Tally (ITSM Platform)</span> — Priority Queue triage, JWT auth, SLA tracking & Flask/PostgreSQL.
  5. <span class="terminal-command-info">Civic Lens (AI Platform)</span> — PyTorch ML classification, geospatial duplicate detection & React.`,
            resume: () => {
                fetch("assets/resume.pdf", { method: "HEAD" })
                    .then(res => {
                        if (res.ok) {
                            window.open("assets/resume.pdf", "_blank");
                        } else {
                            const fallbackDiv = document.createElement("div");
                            fallbackDiv.className = "terminal-output";
                            fallbackDiv.innerHTML = `<span class="terminal-command-error">Notice:</span> Resume document currently being updated. Please check back shortly!`;
                            terminalHistory.appendChild(fallbackDiv);
                            if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
                        }
                    })
                    .catch(() => {
                        window.open("assets/resume.pdf", "_blank");
                    });
                return `<span class="terminal-command-success">Accessing Resume:</span> Opening <span class="terminal-command-info">assets/resume.pdf</span> in a new tab...`;
            },
            contact: () => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                        const nameInput = document.getElementById("name");
                        if (nameInput) nameInput.focus();
                    }, 650);
                }
                return `<span class="terminal-command-success">Navigating to Contact Section...</span> Auto-focusing transmission form.
  - Email    : <a href="mailto:tanishshah1808@gmail.com" target="_blank" style="color: var(--accent-cyan);">tanishshah1808@gmail.com</a>
  - GitHub   : <a href="https://github.com/Tanish1808" target="_blank" style="color: var(--accent-cyan);">github.com/Tanish1808</a>
  - LinkedIn : <a href="https://www.linkedin.com/in/tanish-shah-703489349/" target="_blank" style="color: var(--accent-cyan);">tanish-shah-703489349</a>`;
            },
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
                    window.open(`mailto:tanishshah1808@gmail.com?subject=${subject}&body=${body}`, "_self");
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

    // ── One-Click Email Copy Telemetry Handler ─────────────────────────
    const copyEmailBtn = document.getElementById("copyEmailBtn");
    const copyEmailCard = document.getElementById("copyEmailCard");
    const copyTooltip = document.getElementById("copyTooltip");
    const copyIcon = document.getElementById("copyIcon");

    if (copyEmailBtn && copyTooltip) {
        const copyEmailAction = (e) => {
            if (e) e.stopPropagation();
            const emailText = "tanishshah1808@gmail.com";
            navigator.clipboard.writeText(emailText).then(() => {
                copyTooltip.textContent = "Copied! 🎉";
                if (copyIcon) copyIcon.className = "fa-solid fa-check";
                copyEmailBtn.style.background = "var(--accent-cyan)";
                copyEmailBtn.style.color = "#0b0f19";

                setTimeout(() => {
                    copyTooltip.textContent = "Copy";
                    if (copyIcon) copyIcon.className = "fa-regular fa-copy";
                    copyEmailBtn.style.background = "";
                    copyEmailBtn.style.color = "";
                }, 2000);
            }).catch(() => {
                copyTooltip.textContent = "Copied!";
            });
        };

        copyEmailBtn.addEventListener("click", copyEmailAction);
    }

    // ── Projects Detail & Live Git Graph Logic ────────────────────────
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
            metrics: [
                "Entities: 12+ Bus Routes, 40-Seat Visual Matrices & Passenger Records",
                "Core Logic: 5 Modular Java Classes / 450+ Lines of Clean Code",
                "Impact: Eliminated manual paper ticketing with zero double-booking lock",
                "Complexity: Real-time 2D array state sync & coordinate reservation algorithms"
            ],
            image: "assets/bus_reservation.webp",
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
            metrics: [
                "Entities: 50+ Room Inventories, 200+ Student Profiles & Transaction Ledgers",
                "Core Logic: 8 Modular Java Classes / 650+ Lines of Clean Code",
                "Impact: Automated room allocations, student check-ins & fee audit workflows",
                "Complexity: Dynamic occupancy calculation & relational record integrity validation"
            ],
            image: "assets/hostel_management.webp",
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
            metrics: [
                "Entities: 15+ Relational Tables (Courses, Students, Faculty, Prerequisites, Grades)",
                "Core Logic: 10+ Java Service Handlers / 800+ Lines with Relational DBMS Queries",
                "Impact: Digitalized academic course allocation & automated GPA calculation pipelines",
                "Complexity: Multi-tier prerequisite graph validation & transactional enrollment locking"
            ],
            image: "assets/course_management.webp",
            github: "https://github.com/Tanish1808/Course_Management_System/tree/main/src"
        },
        ticket: {
            title: "Ticket Tally – Smart IT Ticket Management System",
            description: "An internal IT support ticket management system developed for creating, assigning, tracking, and resolving support requests with automated lifecycle workflows.",
            tech: ["Flask", "PostgreSQL", "JavaScript", "JWT"],
            features: [
                "Priority Queue-based ticket prioritization system to efficiently handle high-priority support requests",
                "Role-based dashboards for Employees, IT Staff, and Administrators with secure JWT authentication",
                "Integrated email notifications, SLA tracking, and automated PDF ticket generation",
                "Automated end-to-end support ticket lifecycle tracking and resolution workflows"
            ],
            metrics: [
                "Entities: PostgreSQL Relational Schemas (Tickets, Users, SLA Policies, Audit Logs)",
                "Core Logic: Priority Queue algorithms & JWT-authenticated Flask API routes",
                "Impact: Streamlines IT support triage with real-time SLA compliance tracking",
                "Complexity: Priority Queue dispatch algorithms & role-based dashboard access control"
            ],
            image: "assets/ticket_tally.webp",
            github: "https://github.com/Tanish1808/Trial_Ticket_Tally"
        },
        civiclens: {
            title: "Civic Lens – AI-Powered Civic Issue Reporting Platform",
            description: "An AI-powered civic issue reporting platform that enables citizens to report infrastructure problems using geotagged photos and track their resolution through a public transparency dashboard.",
            tech: ["React", "Django", "DRF", "FastAPI", "PyTorch", "MongoDB"],
            features: [
                "ML pipeline using PyTorch and FastAPI to automatically classify issue category and severity with manual review queue",
                "Two-stage duplicate detection using MongoDB 2dsphere geospatial queries, perceptual hashing, and CNN embedding similarity",
                "Community-driven ticket verification, JWT-based authentication with RBAC, and RESTful APIs",
                "Admin analytics dashboard for real-time municipal KPIs, issue trends, and ticket management"
            ],
            metrics: [
                "Entities: MongoDB 2dsphere Geospatial Collections & PyTorch CNN Embedding Vectors",
                "Core Logic: FastAPI ML inference pipeline & Django REST Framework backend APIs",
                "Impact: Eliminates duplicate municipal reports & transparently accelerates civic resolution",
                "Complexity: Two-stage duplicate detection via perceptual hashing + CNN feature embeddings"
            ],
            image: "assets/civic_lens_placeholder.webp",
            github: "https://github.com/Tanish1808/civic-lens"
        }
    };

    // ── Projects Dashboard & Live Git Graph Controller ─────────────────
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const displayPanel = document.querySelector(".projects-display");
    const projectStandardView = document.getElementById("projectStandardView");
    const projectGitGraphView = document.getElementById("projectGitGraphView");
    const gitCommitTree = document.getElementById("gitCommitTree");
    const gitRefreshBtn = document.getElementById("gitRefreshBtn");
    const gitSyncState = document.getElementById("gitSyncState");
    const ideGitGraphToggleBtn = document.getElementById("ideGitGraphToggleBtn");
    const ideToggleLabel = document.getElementById("ideToggleLabel");
    const ideRepoCountText = document.getElementById("ideRepoCountText");
    const ideLatencyText = document.getElementById("ideLatencyText");
    const ideBranchText = document.getElementById("ideBranchText");
    const displayImg = document.getElementById("displayImg");
    const displayTitle = document.getElementById("displayTitle");
    const displayTags = document.getElementById("displayTags");
    const displayDesc = document.getElementById("displayDesc");
    const displayFeatures = document.getElementById("displayFeatures");
    const displayMetrics = document.getElementById("displayMetrics");
    const displayCodeBtn = document.getElementById("displayCodeBtn");

    const GH_USERNAME = "Tanish1808";
    const GH_CACHE_KEY = `gh_git_graph_${GH_USERNAME}`;
    const GH_CACHE_TTL = 15 * 60 * 1000; // 15 minutes TTL

    // Format relative timestamp
    const formatGitTimeAgo = (dateStr) => {
        if (!dateStr) return "Active";
        const now = new Date();
        const past = new Date(dateStr);
        const diffSec = Math.floor((now - past) / 1000);
        if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))}m ago`;
        if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
        if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}d ago`;
        return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    // DevIcon language resolver
    const getGitLangBadge = (lang) => {
        if (!lang) return `<i class="fa-solid fa-code" style="color: var(--accent-cyan);"></i> <span>Code</span>`;
        const lower = lang.toLowerCase();
        if (lower === "python") return `<i class="devicon-python-plain colored"></i> <span>Python</span>`;
        if (lower === "java") return `<i class="devicon-java-plain colored"></i> <span>Java</span>`;
        if (lower === "javascript") return `<i class="devicon-javascript-plain colored"></i> <span>JavaScript</span>`;
        if (lower === "typescript") return `<i class="devicon-typescript-plain colored"></i> <span>TypeScript</span>`;
        if (lower === "html") return `<i class="devicon-html5-plain colored"></i> <span>HTML</span>`;
        return `<i class="fa-solid fa-code" style="color: var(--accent-purple);"></i> <span>${lang}</span>`;
    };

    // Render Git Commit Tree Nodes
    const renderGitGraphTree = (user, repos, latencyMs = 24) => {
        if (ideRepoCountText && user && typeof user.public_repos !== "undefined") {
            ideRepoCountText.textContent = `${user.public_repos} Public Repos`;
        }
        if (ideLatencyText) {
            ideLatencyText.textContent = `UTF-8 · ${latencyMs}ms`;
        }
        if (gitSyncState) {
            gitSyncState.textContent = "SYNCHRONIZED";
        }

        if (!gitCommitTree) return;

        const colorClasses = ["dot-green", "dot-cyan", "dot-purple", "dot-amber"];

        if (repos && repos.length > 0) {
            gitCommitTree.innerHTML = repos.slice(0, 5).map((repo, idx) => {
                const dotColor = colorClasses[idx % colorClasses.length];
                const hash = repo.node_id ? repo.node_id.slice(-7) : `#${Math.floor(Math.random()*16777215).toString(16).slice(0,6)}`;
                const branch = repo.default_branch || "main";
                const timeAgo = formatGitTimeAgo(repo.pushed_at || repo.updated_at);
                const desc = repo.description || "Public open-source repository & software module by @Tanish1808.";
                const langBadge = getGitLangBadge(repo.language);
                const isLast = idx === repos.length - 1 || idx === 4;

                return `
                    <div class="git-tree-node">
                        <div class="node-branch-line-col">
                            <span class="node-branch-track" style="${isLast ? 'bottom: 50%;' : ''}"></span>
                            <span class="node-commit-dot ${dotColor}"></span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="node-commit-card">
                            <div class="node-card-head">
                                <div class="node-head-left">
                                    <span class="node-hash-tag">${hash}</span>
                                    <span class="node-branch-badge">${branch}</span>
                                    <h4 class="node-repo-title">${repo.name}</h4>
                                </div>
                                <span class="node-time-badge">${timeAgo}</span>
                            </div>
                            <p class="node-commit-msg">${desc}</p>
                            <div class="node-card-foot">
                                <span class="node-lang-tag">${langBadge}</span>
                                <span class="node-view-link"><span>Inspect Code</span> <i class="fa-solid fa-arrow-right"></i></span>
                            </div>
                        </a>
                    </div>
                `;
            }).join("");
        } else {
            renderGitFallbackTree();
        }
    };

    // Fallback Git Tree for Offline or Rate-Limited States
    const renderGitFallbackTree = () => {
        if (gitSyncState) gitSyncState.textContent = "OFFLINE SNAPSHOT";
        if (ideLatencyText) ideLatencyText.textContent = "UTF-8 · CACHED";
        if (ideRepoCountText) ideRepoCountText.textContent = "4 Public Repos";
        if (!gitCommitTree) return;

        const fallbackRepos = [
            { name: "Trial_Ticket_Tally", hash: "#8f1b2c", branch: "main", lang: "Python", time: "Recent", url: "https://github.com/Tanish1808/Trial_Ticket_Tally", desc: "Enterprise-grade IT Service Management (ITSM) incident orchestration platform with SLA tracking & Neon PostgreSQL." },
            { name: "Course_Management_System", hash: "#4a9e3d", branch: "main", lang: "Java", time: "Verified", url: "https://github.com/Tanish1808/Course_Management_System", desc: "Academic course allocation and student enrollment architecture built with object-oriented Java & DBMS concepts." },
            { name: "Bus_Management_System", hash: "#2c77e1", branch: "main", lang: "Java", time: "Verified", url: "https://github.com/Tanish1808/Bus_Management_System", desc: "Real-time transit scheduling and automated ticketing transaction core with multithreading." },
            { name: "My_Portfolio", hash: "#011c349", branch: "dev", lang: "JavaScript", time: "Active", url: "https://github.com/Tanish1808/My_Portfolio", desc: "Interactive personal developer portfolio featuring mock terminal, VS Code Git Graph, and 3D credential deck." }
        ];

        const colorClasses = ["dot-green", "dot-cyan", "dot-purple", "dot-amber"];

        gitCommitTree.innerHTML = fallbackRepos.map((repo, idx) => {
            const dotColor = colorClasses[idx % colorClasses.length];
            const langBadge = getGitLangBadge(repo.lang);
            const isLast = idx === fallbackRepos.length - 1;

            return `
                <div class="git-tree-node">
                    <div class="node-branch-line-col">
                        <span class="node-branch-track" style="${isLast ? 'bottom: 50%;' : ''}"></span>
                        <span class="node-commit-dot ${dotColor}"></span>
                    </div>
                    <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="node-commit-card">
                        <div class="node-card-head">
                            <div class="node-head-left">
                                <span class="node-hash-tag">${repo.hash}</span>
                                <span class="node-branch-badge">${repo.branch}</span>
                                <h4 class="node-repo-title">${repo.name}</h4>
                            </div>
                            <span class="node-time-badge">${repo.time}</span>
                        </div>
                        <p class="node-commit-msg">${repo.desc}</p>
                        <div class="node-card-foot">
                            <span class="node-lang-tag">${langBadge}</span>
                            <span class="node-view-link"><span>Inspect Code</span> <i class="fa-solid fa-arrow-right"></i></span>
                        </div>
                    </a>
                </div>
            `;
        }).join("");
    };

    // Fetch Live GitHub Telemetry with Session Cache
    const fetchLiveGitStream = async (forceRefresh = false) => {
        if (!forceRefresh) {
            try {
                const cachedRaw = sessionStorage.getItem(GH_CACHE_KEY);
                if (cachedRaw) {
                    const cached = JSON.parse(cachedRaw);
                    if (Date.now() - cached.timestamp < GH_CACHE_TTL) {
                        renderGitGraphTree(cached.user, cached.repos, cached.latency || 22);
                        return;
                    }
                }
            } catch (e) {
                // Ignore storage read error
            }
        }

        if (gitSyncState) gitSyncState.textContent = "SYNCING...";
        const startTime = performance.now();

        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${GH_USERNAME}`, { headers: { "Accept": "application/vnd.github.v3+json" } }),
                fetch(`https://api.github.com/users/${GH_USERNAME}/repos?sort=updated&per_page=6`, { headers: { "Accept": "application/vnd.github.v3+json" } })
            ]);

            const latencyMs = Math.round(performance.now() - startTime);

            if (!userRes.ok || !reposRes.ok) {
                renderGitFallbackTree();
                return;
            }

            const userData = await userRes.json();
            const reposData = await reposRes.json();

            try {
                sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify({
                    user: userData,
                    repos: reposData,
                    latency: latencyMs,
                    timestamp: Date.now()
                }));
            } catch (e) {}

            renderGitGraphTree(userData, reposData, latencyMs);
        } catch (err) {
            renderGitFallbackTree();
        }
    };

    // Switch View Helper Function
    const switchToView = (viewType) => {
        if (!projectStandardView || !projectGitGraphView || !displayPanel) return;

        displayPanel.classList.add("updating");
        setTimeout(() => {
            if (viewType === "live-git") {
                projectStandardView.style.display = "none";
                projectGitGraphView.style.display = "flex";
                if (ideToggleLabel) ideToggleLabel.textContent = "View Project";
                if (ideBranchText) ideBranchText.textContent = "remote/live*";
                fetchLiveGitStream();
            } else {
                projectStandardView.style.display = "flex";
                projectGitGraphView.style.display = "none";
                if (ideToggleLabel) ideToggleLabel.textContent = "View Git Graph";
                if (ideBranchText) ideBranchText.textContent = "main*";
            }
            displayPanel.classList.remove("updating");
        }, 220);
    };

    // Event listener for Sidebar clicks
    if (sidebarItems.length > 0 && displayPanel) {
        sidebarItems.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("active")) return;

                const projectId = item.getAttribute("data-project");

                // Clear active state across all sidebar items
                sidebarItems.forEach(sib => {
                    sib.classList.remove("active");
                    sib.style.transform = "";
                    sib.style.transition = "";
                });

                item.classList.add("active");

                if (projectId === "live-git") {
                    switchToView("live-git");
                } else {
                    const data = projectsData[projectId];
                    if (data) {
                        switchToView("standard");
                        setTimeout(() => {
                            if (displayImg) {
                                displayImg.src = data.image;
                                displayImg.alt = `${data.title} Screenshot`;
                            }
                            if (displayTitle) displayTitle.textContent = data.title;
                            if (displayDesc) displayDesc.textContent = data.description;
                            if (displayTags) {
                                displayTags.innerHTML = "";
                                data.tech.forEach(techName => {
                                    const span = document.createElement("span");
                                    span.textContent = techName;
                                    displayTags.appendChild(span);
                                });
                            }
                            if (displayFeatures) {
                                displayFeatures.innerHTML = "";
                                data.features.forEach(feat => {
                                    const li = document.createElement("li");
                                    li.textContent = feat;
                                    displayFeatures.appendChild(li);
                                });
                            }
                            if (displayMetrics) {
                                displayMetrics.innerHTML = "";
                                if (data.metrics && data.metrics.length > 0) {
                                    const getMetricMeta = (label, idx) => {
                                        const l = label.toLowerCase();
                                        if (l.includes("entities") || l.includes("model") || l.includes("scale") || l.includes("table")) {
                                            return { icon: "fa-solid fa-cubes-stacked", colorClass: "metric-cyan" };
                                        }
                                        if (l.includes("logic") || l.includes("core") || l.includes("code") || l.includes("class")) {
                                            return { icon: "fa-solid fa-code-branch", colorClass: "metric-purple" };
                                        }
                                        if (l.includes("problem") || l.includes("solved") || l.includes("impact") || l.includes("outcome")) {
                                            return { icon: "fa-solid fa-bullseye", colorClass: "metric-emerald" };
                                        }
                                        if (l.includes("complexity") || l.includes("algo") || l.includes("state") || l.includes("validation")) {
                                            return { icon: "fa-solid fa-microchip", colorClass: "metric-amber" };
                                        }
                                        const fallbacks = [
                                            { icon: "fa-solid fa-cubes-stacked", colorClass: "metric-cyan" },
                                            { icon: "fa-solid fa-code-branch", colorClass: "metric-purple" },
                                            { icon: "fa-solid fa-bullseye", colorClass: "metric-emerald" },
                                            { icon: "fa-solid fa-microchip", colorClass: "metric-amber" }
                                        ];
                                        return fallbacks[idx % fallbacks.length];
                                    };

                                    data.metrics.forEach((metricItem, idx) => {
                                        let labelText = "Metric";
                                        let valText = metricItem;

                                        if (typeof metricItem === "string" && metricItem.includes(":")) {
                                            const parts = metricItem.split(":");
                                            labelText = parts[0].trim();
                                            valText = parts.slice(1).join(":").trim();
                                        } else if (typeof metricItem === "object" && metricItem.label) {
                                            labelText = metricItem.label;
                                            valText = metricItem.value;
                                        }

                                        const meta = getMetricMeta(labelText, idx);
                                        const row = document.createElement("div");
                                        row.className = `metric-row ${meta.colorClass}`;

                                        const leadDiv = document.createElement("div");
                                        leadDiv.className = "metric-row-lead";

                                        const iconBox = document.createElement("span");
                                        iconBox.className = "metric-icon-box";
                                        iconBox.innerHTML = `<i class="${meta.icon}"></i>`;

                                        const labelSpan = document.createElement("span");
                                        labelSpan.className = "metric-label";
                                        labelSpan.textContent = labelText;

                                        leadDiv.appendChild(iconBox);
                                        leadDiv.appendChild(labelSpan);

                                        const valSpan = document.createElement("span");
                                        valSpan.className = "metric-val";
                                        valSpan.textContent = valText;

                                        row.appendChild(leadDiv);
                                        row.appendChild(valSpan);
                                        displayMetrics.appendChild(row);
                                    });
                                }
                            }
                            if (displayCodeBtn) {
                                displayCodeBtn.href = data.github;
                            }
                        }, 220);
                    }
                }
            });
        });
    }

    // Toggle button on bottom status bar
    if (ideGitGraphToggleBtn) {
        ideGitGraphToggleBtn.addEventListener("click", () => {
            const isGitViewActive = projectGitGraphView && projectGitGraphView.style.display !== "none";
            if (isGitViewActive) {
                // Switch back to first project (bus)
                const firstItem = document.querySelector('.sidebar-item[data-project="bus"]');
                if (firstItem) firstItem.click();
            } else {
                // Switch to live-git
                const gitItem = document.querySelector('.sidebar-item[data-project="live-git"]');
                if (gitItem) gitItem.click();
            }
        });
    }

    // Manual Refresh button in Git Graph view
    if (gitRefreshBtn) {
        gitRefreshBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            gitRefreshBtn.style.transform = "rotate(360deg)";
            gitRefreshBtn.style.transition = "transform 0.5s ease";
            fetchLiveGitStream(true);
            setTimeout(() => {
                gitRefreshBtn.style.transform = "";
                gitRefreshBtn.style.transition = "";
            }, 500);
        });
    }

    // Initial background prefetch for status bar metrics
    fetchLiveGitStream();

    // ── Certifications Detail Modal Logic ──────────────────────────────
    const certModal = document.getElementById("certModal");
    const certModalCloseBtn = document.getElementById("certModalCloseBtn");
    const certModalOverlay = document.getElementById("certModalOverlay");
    const certModalTitle = document.getElementById("certModalTitle");
    const certModalIframe = document.getElementById("certModalIframe");

    if (certModal && certModalCloseBtn && certModalOverlay && certModalIframe) {
        const handleCertOpen = (pdfUrl, card) => {
            if (pdfUrl && pdfUrl !== "#" && pdfUrl !== "") {
                const titleEl = card ? card.querySelector(".deck-title") : null;
                const certTitle = titleEl ? titleEl.textContent.trim() : "Accreditation";
                openCertModal(pdfUrl, certTitle);
            }
        };

        const actionButtons = document.querySelectorAll(".deck-card .deck-action-btn");
        actionButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                const pdfUrl = btn.getAttribute("href");
                handleCertOpen(pdfUrl, btn.closest(".deck-card"));
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
            certModalIframe.src = url + "#toolbar=0&navpanes=0&view=FitH";
            
            certModal.classList.add("active");
            certModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        }

        function closeCertModal() {
            certModal.classList.remove("active");
            certModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            
            setTimeout(() => {
                certModalIframe.src = "";
            }, 400);
        }
    }

    // ── Holographic Credential Deck Controller ────────────────────────
    const deckCards = Array.from(document.querySelectorAll("#deckStageTrack .deck-card"));
    const deckCapsules = Array.from(document.querySelectorAll("#deckNavStrip .deck-capsule"));
    const deckFilterBtns = Array.from(document.querySelectorAll(".deck-category-filters .deck-filter-btn"));
    const deckPrevBtn = document.getElementById("deckPrevBtn");
    const deckNextBtn = document.getElementById("deckNextBtn");
    const deckCounterText = document.getElementById("deckCounterText");
    const deckConsole = document.getElementById("certDeckConsole");

    if (deckCards.length > 0) {
        let currentIdx = 0;
        let currentFilter = "all";

        const getVisibleCards = () => {
            if (currentFilter === "all") return deckCards;
            return deckCards.filter(card => card.getAttribute("data-category") === currentFilter);
        };

        const updateDeck = (newIdx) => {
            const visible = getVisibleCards();
            if (visible.length === 0) return;

            // Clamp index
            if (newIdx < 0) newIdx = visible.length - 1;
            if (newIdx >= visible.length) newIdx = 0;
            currentIdx = newIdx;

            const activeCard = visible[currentIdx];
            const activeCardIdx = parseInt(activeCard.getAttribute("data-index"), 10);

            // Update Cards State
            deckCards.forEach(card => {
                card.classList.remove("active", "prev", "next");
                const cardCat = card.getAttribute("data-category");
                if (currentFilter !== "all" && cardCat !== currentFilter) {
                    card.style.display = "none";
                } else {
                    card.style.display = "block";
                }
            });

            activeCard.classList.add("active");

            // Update Counter
            if (deckCounterText) {
                const curStr = String(currentIdx + 1).padStart(2, "0");
                const totStr = String(visible.length).padStart(2, "0");
                deckCounterText.textContent = `CREDENTIAL ${curStr} / ${totStr}`;
            }

            // Update Capsules
            deckCapsules.forEach(cap => {
                const capIdx = parseInt(cap.getAttribute("data-index"), 10);
                if (capIdx === activeCardIdx) {
                    cap.classList.add("active");
                } else {
                    cap.classList.remove("active");
                }
            });
        };

        // Navigation arrow triggers
        if (deckPrevBtn) {
            deckPrevBtn.addEventListener("click", () => updateDeck(currentIdx - 1));
        }
        if (deckNextBtn) {
            deckNextBtn.addEventListener("click", () => updateDeck(currentIdx + 1));
        }

        // Capsule strip triggers
        deckCapsules.forEach(capsule => {
            capsule.addEventListener("click", () => {
                const targetIdx = parseInt(capsule.getAttribute("data-index"), 10);
                const targetCard = deckCards.find(c => parseInt(c.getAttribute("data-index"), 10) === targetIdx);
                
                // If filter is active and this card belongs to different category, switch filter to all
                if (targetCard && currentFilter !== "all" && targetCard.getAttribute("data-category") !== currentFilter) {
                    currentFilter = "all";
                    deckFilterBtns.forEach(b => b.classList.toggle("active", b.getAttribute("data-filter") === "all"));
                }

                const visible = getVisibleCards();
                const newPos = visible.indexOf(targetCard);
                if (newPos !== -1) {
                    updateDeck(newPos);
                }
            });
        });

        // Filter tab triggers
        deckFilterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                deckFilterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.getAttribute("data-filter");
                updateDeck(0);
            });
        });

        // Keyboard arrow navigation when hovering over or focused inside certDeckConsole
        document.addEventListener("keydown", (e) => {
            if (document.body.classList.contains("modal-open")) return;
            const rect = deckConsole ? deckConsole.getBoundingClientRect() : null;
            const inViewport = rect && rect.top < window.innerHeight && rect.bottom > 0;

            if (inViewport) {
                if (e.key === "ArrowLeft") {
                    updateDeck(currentIdx - 1);
                } else if (e.key === "ArrowRight") {
                    updateDeck(currentIdx + 1);
                }
            }
        });

        // Mobile touch swipe gestures on stage
        const stageTrack = document.getElementById("deckStageTrack");
        if (stageTrack) {
            let touchStartX = 0;
            let touchEndX = 0;

            stageTrack.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            stageTrack.addEventListener("touchend", (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diffX = touchStartX - touchEndX;
                if (Math.abs(diffX) > 45) {
                    if (diffX > 0) {
                        updateDeck(currentIdx + 1); // Swipe left -> Next
                    } else {
                        updateDeck(currentIdx - 1); // Swipe right -> Prev
                    }
                }
            }, { passive: true });
        }

        // Initialize First Card
        updateDeck(0);
    }

    // ── Resume Modal Logic ─────────────────────────────────────────────
    // Note: Once 'assets/resume.pdf' is placed in the 'assets/' directory,
    // clicking 'Resume' will automatically embed the PDF viewer and show
    // the 'Download PDF' button — no code modifications required.
    const resumeLink = document.getElementById("resumeNavLink");
    const resumeModal = document.getElementById("resumeModal");
    const resumeModalCloseBtn = document.getElementById("resumeModalCloseBtn");
    const resumeModalOverlay = document.getElementById("resumeModalOverlay");
    const resumeModalBody = document.getElementById("resumeModalBody");
    const resumeDownloadBtn = document.getElementById("resumeDownloadBtn");

    if (resumeLink && resumeModal && resumeModalCloseBtn && resumeModalOverlay && resumeModalBody) {
        resumeLink.addEventListener("click", (e) => {
            e.preventDefault();
            openResumeModal();
        });

        resumeModalCloseBtn.addEventListener("click", closeResumeModal);
        resumeModalOverlay.addEventListener("click", closeResumeModal);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && resumeModal.classList.contains("active")) {
                closeResumeModal();
            }
        });

        async function openResumeModal() {
            // Show loading placeholder while verifying PDF availability
            resumeModalBody.innerHTML = `
                <div class="resume-placeholder-card">
                    <div class="resume-placeholder-icon">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                    </div>
                    <h3>Loading Resume...</h3>
                </div>
            `;
            resumeModal.classList.add("active");
            resumeModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");

            try {
                const res = await fetch("assets/resume.pdf", { method: "HEAD" });
                if (res.ok) {
                    // PDF exists -> Render iframe viewer and reveal download button
                    resumeModalBody.innerHTML = `<iframe id="resumeIframe" src="assets/resume.pdf#toolbar=0&navpanes=0&view=FitH" frameborder="0" width="100%" height="100%"></iframe>`;
                    if (resumeDownloadBtn) resumeDownloadBtn.style.display = "inline-flex";
                } else {
                    throw new Error("Resume not found");
                }
            } catch {
                // PDF is missing -> Show sleek glassmorphic Coming Soon card
                if (resumeDownloadBtn) resumeDownloadBtn.style.display = "none";
                resumeModalBody.innerHTML = `
                    <div class="resume-placeholder-card">
                        <div class="resume-placeholder-icon">
                            <i class="fa-solid fa-file-pdf"></i>
                        </div>
                        <h3>Resume Coming Soon</h3>
                        <p>I'm currently updating my resume with recent academic achievements and projects. Feel free to explore my showcased projects or get in touch directly!</p>
                        <div class="resume-placeholder-highlights">
                            <span>🎓 Bachelor of Engineering in IT (LJ University)</span>
                            <span>💻 Java & Web Developer</span>
                            <span>🚀 Seeking Internship</span>
                        </div>
                        <a href="#contact" class="resume-contact-shortcut" id="resumeContactBtn">
                            <span>Let's Connect</span> <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                `;
                const contactBtn = document.getElementById("resumeContactBtn");
                if (contactBtn) {
                    contactBtn.addEventListener("click", () => {
                        closeResumeModal();
                    });
                }
            }
        }

        function closeResumeModal() {
            resumeModal.classList.remove("active");
            resumeModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");

            setTimeout(() => {
                resumeModalBody.innerHTML = "";
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

