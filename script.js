document.addEventListener("DOMContentLoaded", () => {

    // ── 3D Rotatable Avatar (Three.js) ────────────────────────────────
    (function buildAvatar() {
        const canvas = document.getElementById("avatar-canvas");
        if (!canvas || typeof THREE === "undefined") return;

        const SIZE = 230;
        canvas.width  = SIZE * window.devicePixelRatio;
        canvas.height = SIZE * window.devicePixelRatio;

        const scene    = new THREE.Scene();
        const camera   = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0.4, 5);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(SIZE, SIZE);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;

        // ── Lights ──
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const cyanLight = new THREE.PointLight(0x00E5FF, 4, 30);
        cyanLight.position.set(-4, 4, 4);
        scene.add(cyanLight);

        const purpleLight = new THREE.PointLight(0x8B5CF6, 3, 30);
        purpleLight.position.set(4, -2, 3);
        scene.add(purpleLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(0, 5, 5);
        scene.add(fillLight);

        // ── Materials ──
        const skinMat    = new THREE.MeshPhongMaterial({ color: 0xD4956A, shininess: 20 });
        const darkSkinMat= new THREE.MeshPhongMaterial({ color: 0xBB7A52, shininess: 10 });
        const hairMat    = new THREE.MeshPhongMaterial({ color: 0x180e04, shininess: 5  });
        const eyeMat     = new THREE.MeshPhongMaterial({ color: 0x0d0805, shininess: 80 });
        const whiteMat   = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
        const shirtMat   = new THREE.MeshPhongMaterial({ color: 0x0f172a, shininess: 30 });
        const lipMat     = new THREE.MeshPhongMaterial({ color: 0x8B3A3A, shininess: 20 });

        const avatar = new THREE.Group();

        // ── Head ──
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 64, 64), skinMat);
        head.position.y = 0.15;
        avatar.add(head);

        // ── Hair (top cap) ──
        const hairCap = new THREE.Mesh(
            new THREE.SphereGeometry(0.93, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.48),
            hairMat
        );
        hairCap.position.y = 0.15;
        avatar.add(hairCap);

        // ── Hair sides ──
        [-1, 1].forEach(s => {
            const side = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.65), hairMat);
            side.position.set(s * 0.86, 0.05, 0);
            avatar.add(side);
        });

        // ── Forehead hair tuft ──
        const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), hairMat);
        tuft.scale.set(1.4, 0.55, 0.6);
        tuft.position.set(0, 1.01, 0.55);
        avatar.add(tuft);

        // ── Eyes (white sclera) ──
        [-0.3, 0.3].forEach(x => {
            const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), whiteMat);
            sclera.position.set(x, 0.28, 0.82);
            avatar.add(sclera);
            // Iris
            const iris = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 24), eyeMat);
            iris.position.set(x, 0.28, 0.9);
            avatar.add(iris);
            // Highlight
            const hl = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), whiteMat);
            hl.position.set(x + 0.04, 0.31, 0.96);
            avatar.add(hl);
        });

        // ── Eyebrows ──
        [-0.3, 0.3].forEach(x => {
            const brow = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), hairMat);
            brow.position.set(x, 0.47, 0.85);
            brow.rotation.z = x > 0 ? -0.15 : 0.15;
            avatar.add(brow);
        });

        // ── Nose ──
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 16), darkSkinMat);
        nose.position.set(0, 0.02, 0.9);
        avatar.add(nose);

        // ── Smile (torus arc) ──
        const smile = new THREE.Mesh(
            new THREE.TorusGeometry(0.22, 0.035, 10, 20, Math.PI * 0.75),
            lipMat
        );
        smile.position.set(0, -0.25, 0.85);
        smile.rotation.z = Math.PI + 0.18;
        avatar.add(smile);

        // ── Ears ──
        [-1, 1].forEach(s => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), skinMat);
            ear.scale.set(0.5, 0.75, 0.5);
            ear.position.set(s * 0.92, 0.1, 0);
            avatar.add(ear);
        });

        // ── Neck ──
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.35, 24), skinMat);
        neck.position.y = -0.85;
        avatar.add(neck);

        // ── Shirt body ──
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.75, 1.0, 32), shirtMat);
        body.position.y = -1.45;
        avatar.add(body);

        // ── Shirt collar (V-neck hint) ──
        const collar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.28, 0.12, 24, 1, true),
            shirtMat
        );
        collar.position.y = -0.98;
        avatar.add(collar);

        // ── Shoulders ──
        [-1, 1].forEach(s => {
            const sh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), shirtMat);
            sh.position.set(s * 0.72, -1.15, 0);
            avatar.add(sh);
        });

        scene.add(avatar);

        // ── Drag Controls ──
        let targetRotY = 0, currentRotY = 0;
        let isDragging = false, prevX = 0, autoRotate = true;

        canvas.addEventListener("mousedown",  e => { isDragging = true;  autoRotate = false; prevX = e.clientX; });
        window.addEventListener("mouseup",    ()=> { isDragging = false; setTimeout(()=> autoRotate = true, 2500); });
        window.addEventListener("mousemove",  e => { if (isDragging) { targetRotY += (e.clientX - prevX) * 0.012; prevX = e.clientX; } });

        canvas.addEventListener("touchstart", e => { isDragging = true;  autoRotate = false; prevX = e.touches[0].clientX; }, { passive: true });
        window.addEventListener("touchend",   ()=> { isDragging = false; setTimeout(()=> autoRotate = true, 2500); });
        window.addEventListener("touchmove",  e => { if (isDragging) { targetRotY += (e.touches[0].clientX - prevX) * 0.012; prevX = e.touches[0].clientX; } }, { passive: true });

        // ── Animate ──
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            if (autoRotate) targetRotY += 0.004;
            currentRotY += (targetRotY - currentRotY) * 0.06;
            avatar.rotation.y = currentRotY;

            // Gentle bob
            avatar.position.y = Math.sin(t * 1.1) * 0.04;

            // Light orbit
            cyanLight.position.x   = Math.sin(t * 0.6) * 5;
            cyanLight.position.z   = Math.cos(t * 0.6) * 5;
            purpleLight.position.x = Math.sin(t * 0.4 + 2) * 5;

            renderer.render(scene, camera);
        }
        animate();
    })();
    // ── End 3D Avatar ─────────────────────────────────────────────────

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