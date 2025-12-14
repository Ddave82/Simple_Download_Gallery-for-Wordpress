/**
 * Simple Download Gallery - Lightbox Functionality
 * Version 1.1
 * Vanilla JavaScript implementation with touch support
 */

(function() {
    'use strict';

    // Lightbox state
    let lightbox = null;
    let lightboxImage = null;
    let lightboxTitle = null;
    let prevButton = null;
    let nextButton = null;
    let closeButton = null;
    let images = [];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    /**
     * Initialize lightbox on DOM ready
     */
    function init() {
        // Check if gallery exists
        const gallery = document.querySelector('.sdg-gallery');
        if (!gallery) {
            console.log('SDG Lightbox: No gallery found on this page');
            return;
        }

        // Get all view buttons
        const viewButtons = document.querySelectorAll('.sdg-view-button');

        if (viewButtons.length === 0) {
            console.log('SDG Lightbox: No view buttons found');
            return;
        }

        console.log('SDG Lightbox: Found ' + viewButtons.length + ' images');

        // Create lightbox HTML
        createLightboxHTML();

        // Collect all images data
        viewButtons.forEach(function(button) {
            images.push({
                src: button.getAttribute('data-image'),
                title: button.getAttribute('data-title'),
                index: parseInt(button.getAttribute('data-index'), 10)
            });

            // Add click event
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openLightbox(parseInt(this.getAttribute('data-index'), 10));
            });
        });

        // Add event listeners
        if (lightbox) {
            setupEventListeners();
        }
    }

    /**
     * Create lightbox HTML structure
     */
    function createLightboxHTML() {
        // Check if lightbox already exists
        if (document.querySelector('.sdg-lightbox')) {
            console.log('SDG Lightbox: Lightbox already exists');
            lightbox = document.querySelector('.sdg-lightbox');
            lightboxImage = document.querySelector('.sdg-lightbox-image');
            lightboxTitle = document.querySelector('.sdg-lightbox-title');
            prevButton = document.querySelector('.sdg-lightbox-prev');
            nextButton = document.querySelector('.sdg-lightbox-next');
            closeButton = document.querySelector('.sdg-lightbox-close');
            return;
        }

        const lightboxDiv = document.createElement('div');
        lightboxDiv.className = 'sdg-lightbox';
        lightboxDiv.setAttribute('role', 'dialog');
        lightboxDiv.setAttribute('aria-modal', 'true');
        lightboxDiv.setAttribute('aria-label', 'Bildvorschau');

        lightboxDiv.innerHTML = `
            <button class="sdg-lightbox-close" aria-label="Schließen">&times;</button>
            <button class="sdg-lightbox-prev" aria-label="Vorheriges Bild">&#8249;</button>
            <button class="sdg-lightbox-next" aria-label="Nächstes Bild">&#8250;</button>
            <div class="sdg-lightbox-content">
                <img class="sdg-lightbox-image" src="" alt="" />
                <div class="sdg-lightbox-title"></div>
            </div>
        `;

        document.body.appendChild(lightboxDiv);

        console.log('SDG Lightbox: HTML created and appended to body');

        // Get references
        lightbox = document.querySelector('.sdg-lightbox');
        lightboxImage = document.querySelector('.sdg-lightbox-image');
        lightboxTitle = document.querySelector('.sdg-lightbox-title');
        prevButton = document.querySelector('.sdg-lightbox-prev');
        nextButton = document.querySelector('.sdg-lightbox-next');
        closeButton = document.querySelector('.sdg-lightbox-close');
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Close button
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });

        // Navigation buttons
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showPrevImage();
        });

        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showNextImage();
        });

        // Click outside image to close
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Touch events for swipe
        lightboxImage.addEventListener('touchstart', handleTouchStart, { passive: true });
        lightboxImage.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Prevent image dragging
        lightboxImage.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });

        console.log('SDG Lightbox: Event listeners attached');
    }

    /**
     * Open lightbox with specific image
     */
    function openLightbox(index) {
        console.log('SDG Lightbox: Opening image ' + index);
        currentIndex = index;
        updateImage();

        // Add active class with small delay to trigger animation
        setTimeout(function() {
            lightbox.classList.add('active');
        }, 10);

        document.body.classList.add('sdg-no-scroll');

        // Focus close button for accessibility
        setTimeout(function() {
            closeButton.focus();
        }, 300);

        // Set aria-hidden on main content
        const mainContent = document.querySelector('#content, main, .site-content, #main');
        if (mainContent) {
            mainContent.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Close lightbox
     */
    function closeLightbox() {
        console.log('SDG Lightbox: Closing');
        lightbox.classList.remove('active');
        document.body.classList.remove('sdg-no-scroll');

        // Remove aria-hidden from main content
        const mainContent = document.querySelector('#content, main, .site-content, #main');
        if (mainContent) {
            mainContent.removeAttribute('aria-hidden');
        }

        // Return focus to the button that opened the lightbox
        const viewButtons = document.querySelectorAll('.sdg-view-button');
        if (viewButtons[currentIndex]) {
            setTimeout(function() {
                viewButtons[currentIndex].focus();
            }, 100);
        }
    }

    /**
     * Update image and navigation state
     */
    function updateImage() {
        if (!images[currentIndex]) {
            console.error('SDG Lightbox: Image not found at index ' + currentIndex);
            return;
        }

        const currentImage = images[currentIndex];

        // Update image
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.title;

        // Update title
        lightboxTitle.textContent = currentImage.title;

        // Update navigation buttons state
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === images.length - 1;

        // Update ARIA live region for screen readers
        lightbox.setAttribute('aria-label',
            'Bild ' + (currentIndex + 1) + ' von ' + images.length + ': ' + currentImage.title
        );
    }

    /**
     * Show previous image
     */
    function showPrevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateImage();
        }
    }

    /**
     * Show next image
     */
    function showNextImage() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateImage();
        }
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyboard(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPrevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextImage();
                break;
        }
    }

    /**
     * Handle touch start for swipe detection
     */
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    /**
     * Handle touch end for swipe detection
     */
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    /**
     * Handle swipe gesture
     */
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - show previous
                showPrevImage();
            } else {
                // Swipe left - show next
                showNextImage();
            }
        }
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, initialize immediately
        init();
    }

})();
