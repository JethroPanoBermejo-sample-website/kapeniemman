// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (mobileMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});

// Menu Category Navigation
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.menu-category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Category switching functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCategory = button.getAttribute('data-category');
            
            // Remove active class from all buttons and categories
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            menuCategories.forEach(category => category.classList.remove('active'));
            
            // Add active class to clicked button and corresponding category
            button.classList.add('active');
            const targetCategoryElement = document.querySelector(`.menu-category[data-category="${targetCategory}"]`);
            if (targetCategoryElement) {
                targetCategoryElement.classList.add('active');
            }
        });
    });
});

// Animations on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}

// Initialize fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'all 1s ease-in';
});

// Trigger animations when elements come into view
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Order Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const orderNowBtn = document.getElementById('order-now-btn');
    const orderModal = document.getElementById('order-modal');
    const closeOrderModalBtn = document.getElementById('close-order-modal-btn');

    // Check if elements exist (for pages that don't have this modal)
    if (orderNowBtn && orderModal && closeOrderModalBtn) {
        // Open modal
        orderNowBtn.addEventListener('click', function() {
            orderModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close modal when clicking close button
        closeOrderModalBtn.addEventListener('click', function() {
            orderModal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Close modal when clicking outside the modal content
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                orderModal.classList.add('hidden');
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !orderModal.classList.contains('hidden')) {
                orderModal.classList.add('hidden');
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        });
    }
});

// Gallery Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item[data-image]');
    const galleryModal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalImageTitle = document.getElementById('modal-image-title');
    const modalImageCounter = document.getElementById('modal-image-counter');
    const closeGalleryModal = document.getElementById('close-gallery-modal');
    const prevImageBtn = document.getElementById('prev-image');
    const nextImageBtn = document.getElementById('next-image');
    
    if (!galleryItems.length || !galleryModal) return;
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Prepare gallery data
    galleryItems.forEach((item, index) => {
        galleryImages.push({
            src: item.dataset.image,
            title: item.dataset.title,
            alt: item.querySelector('img').alt
        });
        
        // Add click event to open modal
        item.addEventListener('click', function() {
            currentImageIndex = index;
            openGalleryModal();
        });
    });
    
    function openGalleryModal() {
        if (galleryImages.length === 0) return;
        
        updateModalImage();
        galleryModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeGalleryModalFunc() {
        galleryModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    function updateModalImage() {
        const currentImage = galleryImages[currentImageIndex];
        modalImage.src = currentImage.src;
        modalImage.alt = currentImage.alt;
        modalImageTitle.textContent = currentImage.title;
        modalImageCounter.textContent = `${currentImageIndex + 1} of ${galleryImages.length}`;
        
        // Update navigation button states
        prevImageBtn.style.opacity = currentImageIndex === 0 ? '0.5' : '1';
        nextImageBtn.style.opacity = currentImageIndex === galleryImages.length - 1 ? '0.5' : '1';
    }
    
    function showPreviousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateModalImage();
        }
    }
    
    function showNextImage() {
        if (currentImageIndex < galleryImages.length - 1) {
            currentImageIndex++;
            updateModalImage();
        }
    }
    
    // Event listeners
    closeGalleryModal.addEventListener('click', closeGalleryModalFunc);
    prevImageBtn.addEventListener('click', showPreviousImage);
    nextImageBtn.addEventListener('click', showNextImage);
    
    // Close modal when clicking outside the image
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeGalleryModalFunc();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!galleryModal.classList.contains('hidden')) {
            switch(e.key) {
                case 'Escape':
                    closeGalleryModalFunc();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    modalImage.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    modalImage.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swiped left - show next image
                showNextImage();
            } else {
                // Swiped right - show previous image
                showPreviousImage();
            }
        }
    }
});

// Menu Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuSection = document.getElementById('menu');
    const slides = document.querySelectorAll('.menu-slide');
    const navDots = document.querySelectorAll('.nav-dot');
    
    let currentSlide = 0;
    
    // Theme configurations
    const themes = {
        'yesua': {
            background: 'linear-gradient(135deg, #4a2c2a 0%, #6b3e3a 50%, #8b4513 100%)'
        },
        'blush-latte': {
            background: 'linear-gradient(135deg, #d4a5a5 0%, #e8b5b5 50%, #f0c5c5 100%)'
        },
        'ice-brown-sugar': {
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)'
        }
    };
    
    // Function to show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update nav dots
        navDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        navDots[index].classList.add('active');
        
        // Update background theme
        const currentTheme = slides[index].getAttribute('data-theme');
        menuSection.setAttribute('data-current-theme', currentTheme);
        
        if (themes[currentTheme]) {
            menuSection.style.background = themes[currentTheme].background;
        }
        
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Event listeners for navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Touch/swipe support for mobile and desktop
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    const carousel = document.querySelector('.menu-carousel');
    
    if (carousel) {
        // Touch events for mobile
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swiped left - next slide
                    nextSlide();
                } else {
                    // Swiped right - previous slide
                    prevSlide();
                }
            }
        });
        
        // Mouse events for desktop swipe simulation
        let isMouseDown = false;
        
        carousel.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
            startY = e.clientY;
            carousel.style.cursor = 'grabbing';
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
        });
        
        carousel.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            isMouseDown = false;
            carousel.style.cursor = 'grab';
            
            endX = e.clientX;
            endY = e.clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                    // Swiped left - next slide
                    nextSlide();
                } else {
                    // Swiped right - previous slide
                    prevSlide();
                }
            }
        });
        
        carousel.addEventListener('mouseleave', () => {
            isMouseDown = false;
            carousel.style.cursor = 'grab';
        });
        
        // Set initial cursor
        carousel.style.cursor = 'grab';
    }
    
    // Initialize carousel
    showSlide(0);
    
    // Keyboard navigation (optional)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
});
