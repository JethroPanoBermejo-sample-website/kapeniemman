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
            document.getElementById(targetCategory).classList.add('active');
        });
    });
    
    // Carousel functionality for each menu category
    const carousels = document.querySelectorAll('.menu-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.menu-carousel-track');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const items = track.querySelectorAll('.menu-item');
        
        if (items.length === 0) return;
        
        let currentIndex = 0;
        
        function getVisibleItems() {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 767) return 3; // Desktop and tablets above 766px - 3 items
            if (screenWidth >= 700) return 2; // 700px-766px - 2 items  
            return 1; // 699px and below - 1 item
        }
        
        function getItemWidth() {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1200) return 340; // 320px width + 20px gap
            if (screenWidth >= 900) return 330; // 310px width + 20px gap
            if (screenWidth >= 767) return 320; // 300px width + 20px gap
            if (screenWidth >= 700) return 340; // For 2 items - 320px width + 20px gap
            if (screenWidth >= 480) return 320; // 300px width + 20px gap
            if (screenWidth >= 360) return 300; // 280px width + 20px gap
            return 280; // 260px width + 20px gap for very small screens
        }
        
        function shouldShowCarousel() {
            const visibleItems = getVisibleItems();
            return items.length > visibleItems;
        }
        
        function updateCarousel() {
            const visibleItems = getVisibleItems();
            const itemWidth = getItemWidth();
            const maxIndex = Math.max(0, items.length - visibleItems);
            
            // Check if we need carousel functionality
            if (!shouldShowCarousel()) {
                // Center the items and hide buttons
                track.style.transform = 'translateX(0)';
                track.classList.add('centered');
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                currentIndex = 0;
                return;
            }
            
            // Show carousel controls
            track.classList.remove('centered');
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            
            // Adjust currentIndex if it's beyond the new max
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            const translateX = currentIndex * itemWidth;
            track.style.transform = `translateX(-${translateX}px)`;
            
            // Update button states
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
        }
        
        prevBtn.addEventListener('click', () => {
            const visibleItems = getVisibleItems();
            const maxIndex = Math.max(0, items.length - visibleItems);
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const visibleItems = getVisibleItems();
            const maxIndex = Math.max(0, items.length - visibleItems);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Initialize carousel
        updateCarousel();
        
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel();
            }, 100);
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let isDragging = false;
        let startTransform = 0;
        
        track.addEventListener('touchstart', (e) => {
            if (!shouldShowCarousel()) return;
            startX = e.touches[0].clientX;
            isDragging = true;
            const transform = track.style.transform;
            startTransform = transform ? parseInt(transform.match(/-?\d+/)?.[0] || 0) : 0;
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging || !shouldShowCarousel()) return;
            e.preventDefault();
            
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            const newTransform = startTransform + diffX;
            
            // Add some resistance at the boundaries
            const visibleItems = getVisibleItems();
            const itemWidth = getItemWidth();
            const maxTransform = (items.length - visibleItems) * itemWidth;
            
            if (newTransform < 0) {
                track.style.transform = `translateX(${Math.max(newTransform * 0.3, -itemWidth * 0.5)}px)`;
            } else if (newTransform > maxTransform) {
                track.style.transform = `translateX(-${Math.min(maxTransform + (newTransform - maxTransform) * 0.3, maxTransform + itemWidth * 0.5)}px)`;
            } else {
                track.style.transform = `translateX(-${newTransform}px)`;
            }
        });
        
        track.addEventListener('touchend', (e) => {
            if (!isDragging || !shouldShowCarousel()) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const itemWidth = getItemWidth();
            const visibleItems = getVisibleItems();
            const maxIndex = Math.max(0, items.length - visibleItems);
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0 && currentIndex < maxIndex) {
                    currentIndex++;
                } else if (diffX < 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            updateCarousel();
        });
        
        // Mouse drag support for desktop
        let mouseStartX = 0;
        let isMouseDragging = false;
        let mouseStartTransform = 0;
        
        track.addEventListener('mousedown', (e) => {
            if (!shouldShowCarousel()) return;
            mouseStartX = e.clientX;
            isMouseDragging = true;
            track.style.cursor = 'grabbing';
            const transform = track.style.transform;
            mouseStartTransform = transform ? parseInt(transform.match(/-?\d+/)?.[0] || 0) : 0;
        });
        
        track.addEventListener('mousemove', (e) => {
            if (!isMouseDragging || !shouldShowCarousel()) return;
            e.preventDefault();
            
            const currentX = e.clientX;
            const diffX = mouseStartX - currentX;
            const newTransform = mouseStartTransform + diffX;
            
            // Add resistance at boundaries
            const visibleItems = getVisibleItems();
            const itemWidth = getItemWidth();
            const maxTransform = (items.length - visibleItems) * itemWidth;
            
            if (newTransform < 0) {
                track.style.transform = `translateX(${Math.max(newTransform * 0.3, -itemWidth * 0.5)}px)`;
            } else if (newTransform > maxTransform) {
                track.style.transform = `translateX(-${Math.min(maxTransform + (newTransform - maxTransform) * 0.3, maxTransform + itemWidth * 0.5)}px)`;
            } else {
                track.style.transform = `translateX(-${newTransform}px)`;
            }
        });
        
        track.addEventListener('mouseup', (e) => {
            if (!isMouseDragging || !shouldShowCarousel()) return;
            isMouseDragging = false;
            track.style.cursor = 'grab';
            
            const mouseEndX = e.clientX;
            const diffX = mouseStartX - mouseEndX;
            const itemWidth = getItemWidth();
            const visibleItems = getVisibleItems();
            const maxIndex = Math.max(0, items.length - visibleItems);
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0 && currentIndex < maxIndex) {
                    currentIndex++;
                } else if (diffX < 0 && currentIndex > 0) {
                    currentIndex--;
                }
            }
            updateCarousel();
        });
        
        track.addEventListener('mouseleave', () => {
            if (isMouseDragging) {
                isMouseDragging = false;
                track.style.cursor = 'grab';
                updateCarousel();
            }
        });
        
        // Set initial cursor
        track.style.cursor = 'grab';
    });
});

// Back to Top Button functionality
if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.slide-up, .fade-in');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animated elements
document.querySelectorAll('.slide-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
});

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'all 1s ease-in';
});

// Trigger animations when elements come into view
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Full Menu Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const viewFullMenuBtn = document.getElementById('view-full-menu-btn');
    const fullMenuModal = document.getElementById('full-menu-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Open modal
    viewFullMenuBtn.addEventListener('click', function() {
        fullMenuModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close modal when clicking close button
    closeModalBtn.addEventListener('click', function() {
        fullMenuModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside the modal content
    fullMenuModal.addEventListener('click', function(e) {
        if (e.target === fullMenuModal) {
            fullMenuModal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !fullMenuModal.classList.contains('hidden')) {
            fullMenuModal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    });
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
