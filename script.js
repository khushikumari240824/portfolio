document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileMenuButton.querySelector('i');
    const navbar = document.getElementById('navbar');

    function toggleMenu() {
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
            // Remove glass effect if at top
            if(window.scrollY <= 20) {
                 navbar.classList.remove('glass-nav');
            }
        } else {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
            // Ensure glass effect is on when menu is open
            navbar.classList.add('glass-nav');
        }
    }

    mobileMenuButton.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMenu();
            }
        });
    });

    // 2. Set Current Year in Footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 3. Navbar background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('glass-nav');
        } else {
            if (mobileMenu.classList.contains('hidden')) {
                navbar.classList.remove('glass-nav');
            }
        }
    });

    // Initial check in case page is refreshed halfway down
    if (window.scrollY > 20) {
        navbar.classList.add('glass-nav');
    }

    // 4. Scroll Fade-in Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stop observing once faded in to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 5. Hero Section automatic fade in on load
    const heroSection = document.querySelector('#home .fade-in-section');
    if(heroSection){
        setTimeout(() => {
            heroSection.classList.add('is-visible');
        }, 150); // Small delay for smoother feel
    }

    // 6. Contact Form Interaction
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Store original button content
            const originalBtnContent = submitText.innerHTML;

            // Change to loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('cursor-not-allowed', 'opacity-80');
            submitText.innerHTML = `Sending... <i class="fas fa-spinner fa-spin text-lg ml-2 group-hover:translate-x-0 group-hover:-translate-y-0"></i>`;
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Send actual email using FormSubmit.co
            fetch("https://formsubmit.co/ajax/khushisinghrajput240@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    _subject: subject || 'New Message from Portfolio',
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                // Success
                // Hide form, show success message
                contactForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Trigger fade-in animation
                setTimeout(() => {
                    successMessage.classList.remove('opacity-0');
                    successMessage.classList.add('opacity-100');
                }, 50);
                
                // Reset form fields
                contactForm.reset();
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('cursor-not-allowed', 'opacity-80');
                submitText.innerHTML = originalBtnContent;
            })
            .catch(error => {
                console.error("Error sending message:", error);
                alert("Sorry, there was an error sending your message. Please try again later.");
                
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('cursor-not-allowed', 'opacity-80');
                submitText.innerHTML = originalBtnContent;
            });
        });

        // Reset form functionality
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                // Fade out success message
                successMessage.classList.remove('opacity-100');
                successMessage.classList.add('opacity-0');
                
                // After fade effects, switch displays
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                    contactForm.classList.remove('hidden');
                }, 500); // 500ms matches Tailwind transition duration
            });
        }
    }
});
