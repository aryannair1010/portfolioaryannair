document.addEventListener('DOMContentLoaded', async () => {

    // --- Navigation Toggle for Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.section-title, .about-text, .skill-card, .project-card, .contact-wrapper');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // --- Firebase Integration ---
    // Dynamic import for Firebase SDKs to work in classic script
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js");
    const { getDatabase, ref, push } = await import("https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js");

    const firebaseConfig = {
        apiKey: "AIzaSyBNwTLSSX8ed3XLY45glkotJ8rg8HGXxsg",
        authDomain: "portfolio-e76ba.firebaseapp.com",
        databaseURL: "https://portfolio-e76ba-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "portfolio-e76ba",
        storageBucket: "portfolio-e76ba.firebasestorage.app",
        messagingSenderId: "1041558078087",
        appId: "1:1041558078087:web:c9da31673a34d2b52eae22"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Push data to Firebase
            const messagesRef = ref(database, 'contactMessages');
            await push(messagesRef, {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString()
            });

            submitBtn.textContent = 'Message Sent!';
            formMessage.textContent = "Thanks for reaching out! I'll get back to you soon.";
            formMessage.className = "success-message"; // Ensure correct styling
            contactForm.reset();

            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                formMessage.textContent = "";
            }, 3000);

        } catch (error) {
            console.error("Error adding document: ", error);
            submitBtn.textContent = 'Error!';
            formMessage.textContent = "Something went wrong. Please try again later.";
            formMessage.className = "error-message"; // Assuming you might have or want error styling

            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                formMessage.textContent = "";
            }, 3000);
        }
    });
});
