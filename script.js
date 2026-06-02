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
});