
document.addEventListener('DOMContentLoaded', () => {
    // Existing intersection observer code...
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up, .cinematic-settle, .editorial-motion');
    fadeElements.forEach(el => observer.observe(el));


    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');

            // Toggle current item
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
                i.querySelector('.icon').textContent = '+';
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
                header.querySelector('.icon').textContent = '-';
            }
        });
    });

    // Color Selector Configuration
    const productImage = document.getElementById('product-image-display');
    const colorOptions = document.querySelectorAll('.color-option');
    const imageContainer = document.querySelector('.product-intro-image');
    let isAnimating = false;

    // Preload images
    colorOptions.forEach(option => {
        const img = new Image();
        img.src = option.dataset.image;
    });

    colorOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Ignore if already active or currently animating
            if (this.classList.contains('active') || isAnimating) return;

            // Remove active class from all
            colorOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            // Add active class to clicked
            this.classList.add('active');

            const newImageSrc = this.dataset.image;
            isAnimating = true;

            // Create Overlay for Double Buffer Effect
            let overlay = document.querySelector('.product-img-overlay');
            if (!overlay) {
                overlay = document.createElement('img');
                overlay.classList.add('product-img-overlay');
                overlay.alt = "Mamalap Product Transition"; // meaningful alt
                // Ensure styling matches main image (class reuse if needed, or inherited styles)
                // Since main img has specific class, we rely on .product-img-overlay CSS
                imageContainer.appendChild(overlay);
            }

            // Setup Overlay
            overlay.src = newImageSrc;
            overlay.classList.remove('fading-in'); // Reset state

            // Wait for load to prevent empty flash
            const startTransition = () => {
                // Trigger Transition
                // Force Reflow
                void overlay.offsetWidth;
                overlay.classList.add('fading-in');

                // Wait for transition duration (450ms)
                setTimeout(() => {
                    // Update Main Image silently behind the scenes
                    productImage.src = newImageSrc;

                    // Reset Overlay
                    overlay.classList.remove('fading-in');

                    isAnimating = false;
                }, 450);
            };

            if (overlay.complete) {
                startTransition();
            } else {
                overlay.onload = startTransition;
            }
        });
    });

    // Parallax Effect for Context Image & Editorial Motion
    const contextSection = document.querySelector('.context');
    const contextImg = document.querySelector('.context-image img');

    // Editorial Parallax (Shaped for Natural Alignment)
    const ergoSection = document.querySelector('.ergonomics');
    const ergoImg = document.querySelector('.editorial-motion img');

    window.addEventListener('scroll', () => {
        const viewHeight = window.innerHeight;

        requestAnimationFrame(() => {
            // Context Section Parallax
            if (contextSection && contextImg) {
                const rect = contextSection.getBoundingClientRect();
                if (rect.top < viewHeight && rect.bottom > 0) {
                    const scrollCenter = (viewHeight - rect.top) / (viewHeight + rect.height);
                    const movement = (scrollCenter - 0.5) * 40;
                    contextImg.style.transform = `translateY(${movement}px)`;
                }
            }

            // Editorial Motion Parallax (Very Slow Drift)
            if (ergoSection && ergoImg) {
                const rect = ergoSection.getBoundingClientRect();
                if (rect.top < viewHeight && rect.bottom > 0) {
                    // Calculate relative scroll position
                    const scrollCenter = (viewHeight - rect.top) / (viewHeight + rect.height);

                    // Max 8-12px total drift
                    const movement = (scrollCenter - 0.5) * 10;

                    // Apply ONLY parallax translation here, assuming the 'visible' class handles the base settle
                    // Adding to the base transform might conflict if not careful, but transform on img is separate from container
                    ergoImg.style.transform = `translateY(${movement}px)`;
                    ergoImg.style.willChange = 'transform';
                }
            }
        });
    });

    // Testimonial Infinite Scroll Cloning
    const galleryTrack = document.querySelector('.gallery-track');
    if (galleryTrack) {
        const items = Array.from(galleryTrack.children);
        // Clone items to ensure seamless loop (Doubling the content)
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            galleryTrack.appendChild(clone);
        });
    }


});
