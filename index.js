// ============================================
// SMOOTH SCROLL & NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Header background on scroll
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Menu toggle functionality
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    let isMenuOpen = false;
    
    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        menuToggle.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on menu links
    const menuLinks = document.querySelectorAll('.menu-link, .category-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            dropdownMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            dropdownMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // ============================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        observer.observe(card);
    });

    // Observe service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        observer.observe(item);
    });

    // ============================================
    // INFINITE DRAGGABLE TOOLS SLIDER
    // ============================================
    const toolsContainer = document.querySelector('.tools-container');
    const toolsTrack = document.querySelector('.tools-track');
    
    if (toolsContainer && toolsTrack) {
        // Clone items for infinite loop
        const items = Array.from(toolsTrack.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            toolsTrack.appendChild(clone);
        });

        let currentScroll = 0;
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        let animationId;
        let speed = 1; // Auto-scroll speed
        let lastTime = 0;

        // Auto-scroll animation
        function animate(timestamp) {
            if (!isDragging) {
                currentScroll -= speed;
                
                // Infinite loop logic
                const trackWidth = toolsTrack.scrollWidth / 2; // Since we duplicated items
                
                if (Math.abs(currentScroll) >= trackWidth) {
                    currentScroll = 0;
                }
                
                toolsTrack.style.transform = `translateX(${currentScroll}px)`;
            }
            animationId = requestAnimationFrame(animate);
        }
        
        animationId = requestAnimationFrame(animate);

        // Drag functionality
        toolsContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - toolsContainer.offsetLeft;
            // Get current transform value
            const transformMatrix = window.getComputedStyle(toolsTrack).getPropertyValue('transform');
            if (transformMatrix !== 'none') {
                currentScroll = parseInt(transformMatrix.split(',')[4]) || 0;
            }
            scrollLeft = currentScroll;
            toolsContainer.style.cursor = 'grabbing';
            
            // Pause animation logic handled by isDragging flag
        });

        toolsContainer.addEventListener('mouseleave', () => {
            isDragging = false;
            toolsContainer.style.cursor = 'grab';
        });

        toolsContainer.addEventListener('mouseup', () => {
            isDragging = false;
            toolsContainer.style.cursor = 'grab';
        });

        toolsContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - toolsContainer.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll-fast multiplier
            currentScroll = scrollLeft + walk;
            
            // Boundary checks for seamless dragging
            const trackWidth = toolsTrack.scrollWidth / 2;
            if (currentScroll > 0) {
                currentScroll = -trackWidth;
                scrollLeft = currentScroll - walk; // Adjust base to prevent jump
            } else if (Math.abs(currentScroll) >= trackWidth) {
                currentScroll = 0;
                scrollLeft = currentScroll - walk;
            }
            
            toolsTrack.style.transform = `translateX(${currentScroll}px)`;
        });

        // Touch support
        toolsContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - toolsContainer.offsetLeft;
            const transformMatrix = window.getComputedStyle(toolsTrack).getPropertyValue('transform');
            if (transformMatrix !== 'none') {
                currentScroll = parseInt(transformMatrix.split(',')[4]) || 0;
            }
            scrollLeft = currentScroll;
        }, { passive: true });

        toolsContainer.addEventListener('touchend', () => {
            isDragging = false;
        });

        toolsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - toolsContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            currentScroll = scrollLeft + walk;
            
             const trackWidth = toolsTrack.scrollWidth / 2;
            if (currentScroll > 0) {
                currentScroll = -trackWidth;
                scrollLeft = currentScroll - walk;
            } else if (Math.abs(currentScroll) >= trackWidth) {
                currentScroll = 0;
                scrollLeft = currentScroll - walk;
            }

            toolsTrack.style.transform = `translateX(${currentScroll}px)`;
        }, { passive: true });
    }

    // Tooltips logic (Updated to work with clones)
    // We need to re-select icons because we added clones
    const allToolIcons = document.querySelectorAll('.tool-icon');
    
    allToolIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            if (isDragging) return; // Don't show tooltip while dragging
            
            const toolName = this.getAttribute('data-tool');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = toolName;
            tooltip.style.cssText = `
                position: absolute;
                top: -50px;
                left: 50%;
                transform: translateX(-50%);
                background: #FFB84D;
                color: #0a0a0a;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                white-space: nowrap;
                pointer-events: none;
                animation: fadeIn 0.3s ease-out;
                z-index: 100;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            `;
            this.appendChild(tooltip);
        });
        
        icon.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // ============================================
    // PROJECT CARDS TILT EFFECT
    // ============================================
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Only prevent default if href is not just "#"
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // CURSOR TRAIL EFFECT (Optional Enhancement)
    // ============================================
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ============================================
    // INTERACTIVE CYBER GRID ANIMATION
    // ============================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let lines = [];
        const gap = 40;
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initLines();
        }
        
        function initLines() {
            lines = [];
            // Vertical lines
            for (let x = 0; x <= width; x += gap) {
                lines.push({
                    x: x,
                    y: 0,
                    type: 'vertical'
                });
            }
            // Horizontal lines
            for (let y = 0; y <= height; y += gap) {
                lines.push({
                    x: 0,
                    y: y,
                    type: 'horizontal'
                });
            }
        }
        
        function draw() {
            ctx.fillStyle = '#0a0a0a'; // Dark background
            ctx.fillRect(0, 0, width, height);
            
            ctx.strokeStyle = 'rgba(252, 155, 9, 0.15)'; // Orange grid lines
            ctx.lineWidth = 1;
            
            const time = Date.now() * 0.001;
            
            lines.forEach(line => {
                ctx.beginPath();
                
                if (line.type === 'vertical') {
                    // Warp vertical lines based on mouse
                    const distX = (line.x - mouseX) * 0.05;
                    const x = line.x + Math.sin(time + line.x * 0.01) * 5 - distX;
                    
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                } else {
                    // Warp horizontal lines
                    const distY = (line.y - mouseY) * 0.05;
                    const y = line.y + Math.cos(time + line.y * 0.01) * 5 - distY;
                    
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                }
                
                ctx.stroke();
            });
            
            // Add a subtle vignette
            const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            requestAnimationFrame(draw);
        }
        
        window.addEventListener('resize', resize);
        resize();
        draw();
    }

    // ============================================
    // SERVICE ITEMS COUNTER ANIMATION
    // ============================================
    serviceItems.forEach((item, index) => {
        const number = document.createElement('span');
        number.textContent = `0${index + 1}`;
        number.style.cssText = `
            font-size: 0.8rem;
            opacity: 0.6;
            margin-right: 0.5rem;
            font-weight: 600;
        `;
        item.insertBefore(number, item.firstChild);
    });


    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    // Add focus visible for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // ============================================
    // EASTER EGG: KONAMI CODE
    // ============================================
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiPattern.join(',')) {
            activateEasterEgg();
        }
    });

    function activateEasterEgg() {
        document.body.style.animation = 'rotate 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
            alert('🎉 You found the easter egg! You\'re awesome!');
        }, 2000);
    }

    // ============================================
    // THEME PREFERENCES (Optional)
    // ============================================
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Log load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`%c⚡ Page loaded in ${Math.round(loadTime)}ms`, 'color: #FFB84D; font-weight: bold;');
    });

});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
