// Main JavaScript file for TechSolutions website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.classList.add('mobile-nav-toggle');
    mobileNavToggle.innerHTML = '<span></span><span></span><span></span>';
    
    const header = document.querySelector('header .container');
    header.appendChild(mobileNavToggle);
    
    const navList = document.querySelector('nav ul');
    
    mobileNavToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Performance Dashboard Toggle
    const toggleDashboardBtn = document.getElementById('toggle-dashboard');
    const performanceDashboard = document.getElementById('performance-dashboard');
    
    toggleDashboardBtn.addEventListener('click', function() {
        performanceDashboard.classList.toggle('minimized');
        
        if (performanceDashboard.classList.contains('minimized')) {
            document.getElementById('metrics-container').style.display = 'none';
            this.textContent = 'Show Metrics';
        } else {
            document.getElementById('metrics-container').style.display = 'block';
            this.textContent = 'Hide Metrics';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy loading images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('.lazy');
        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }
    
    // Testimonial slider (simple version)
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    // Initialize testimonial display
    if (testimonials.length > 1) {
        showTestimonial(currentTestimonial);
        
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
});
