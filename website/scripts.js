$(document).ready(function() {
    // Add jQuery UI easing if not already included
    $.easing.easeInOutExpo = function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };

    // Navbar scroll effect with throttling
    let ticking = false;
    $(window).scroll(function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if ($(window).scrollTop() > 50) {
                    $('.navbar').addClass('scrolled');
                } else {
                    $('.navbar').removeClass('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Enhanced Timeline Implementation
    class TimelineManager {
        constructor() {
            this.timelineItems = document.querySelectorAll('.timeline-item');
            this.expandButtons = document.querySelectorAll('.expand-btn');
            this.observer = null;
            this.init();
        }

        init() {
            this.setupIntersectionObserver();
            this.setupTimelineContent();
            this.bindEvents();
        }

        setupIntersectionObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        this.animateTimelineItem(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.timelineItems.forEach(item => {
                this.observer.observe(item);
            });
        }

        setupTimelineContent() {
            this.timelineItems.forEach((item, index) => {
                const content = item.querySelector('.timeline-content');
                if (!content) return;

                // Store original content
                const fullContent = content.innerHTML;
                const previewLength = 150;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = fullContent;
                const textContent = tempDiv.textContent || tempDiv.innerText;
                const preview = textContent.substring(0, previewLength);
                const lastSpace = preview.lastIndexOf(' ');
                const trimmedPreview = preview.substring(0, lastSpace) + '...';

                // Add data attributes
                item.setAttribute('data-full-content', fullContent);
                item.setAttribute('data-preview', trimmedPreview);
                item.setAttribute('data-index', index);

                // Set initial state
                if (fullContent.length > previewLength) {
                    content.innerHTML = `${trimmedPreview}<button class="expand-btn">Read More</button>`;
                }
            });
        }

        animateTimelineItem(item) {
            const isLeft = item.offsetLeft < window.innerWidth / 2;
            item.style.opacity = '0';
            item.style.transform = `translateX(${isLeft ? '-50px' : '50px'})`;

            // Trigger reflow
            void item.offsetWidth;

            // Add animation
            item.style.transition = 'all 0.5s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }

        toggleContent(item) {
            const content = item.querySelector('.timeline-content');
            const isExpanded = item.classList.contains('expanded');

            // Add transitioning class
            item.classList.add('transitioning');

            setTimeout(() => {
                if (isExpanded) {
                    content.innerHTML = `${item.getAttribute('data-preview')}<button class="expand-btn">Read More</button>`;
                    item.classList.remove('expanded');
                } else {
                    content.innerHTML = `${item.getAttribute('data-full-content')}<button class="expand-btn">Read Less</button>`;
                    item.classList.add('expanded');
                }

                // Remove transitioning class
                item.classList.remove('transitioning');
            }, 300);
        }

        bindEvents() {
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('expand-btn')) {
                    const timelineItem = e.target.closest('.timeline-item');
                    if (timelineItem) {
                        this.toggleContent(timelineItem);
                    }
                }
            });

            // Handle window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.timelineItems.forEach(item => {
                        if (item.classList.contains('show')) {
                            this.animateTimelineItem(item);
                        }
                    });
                }, 250);
            });
        }
    }

    // Initialize Timeline
    const timelineManager = new TimelineManager();

    // Smooth scrolling with improved error handling
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        $('.navbar-collapse').collapse('hide');
                
        const target = $($(this).attr('href'));
        if (target.length) {
            try {
                const scrollTo = target.offset().top - 70;
                $('html, body').animate({
                    scrollTop: scrollTo
                }, {
                    duration: 800,
                    easing: 'easeInOutExpo',
                    complete: function() {
                        // Update URL hash after scroll
                        window.location.hash = target.attr('id');
                    }
                });
            } catch (error) {
                console.error('Scroll calculation error:', error);
            }
        }
    });

    // Improved scroll progress indicator
    const progressBar = document.querySelector('.progress-bar');
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                const winScroll = document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                if (progressBar) {
                    progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
                }
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    });

    // Global fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(element => {
        fadeObserver.observe(element);
    });

    // Image lazy loading
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imgObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });

    // Loading state handlers
    const showLoading = (element) => {
        element.classList.add('loading');
    };

    const hideLoading = (element) => {
        element.classList.remove('loading');
    };
});

// Initialize Bootstrap dropdowns
document.addEventListener('DOMContentLoaded', function() {
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl)
    });
});