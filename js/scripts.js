/**
 * Website Core Functionality - Minimal Version
 * 
 * Features:
 * - Navbar shrink on scroll
 * - Smooth scrolling for anchor links
 * - Lazy loading for images
 * - Footer year update
 * - Basic error handling
 */

class Website {
  constructor() {
    this.config = {
      shrinkThreshold: 50,
      throttleDelay: 100,
      lazyLoadRootMargin: '100px 0px'
    };

    this.state = {
      isNavbarShrunk: false,
      scrollPosition: 0
    };

    this.cacheElements();
    this.init();
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      currentYear: document.getElementById('currentYear'),
      navbar: document.querySelector('.navbar'),
      anchors: [].slice.call(document.querySelectorAll('a[href^="#"]')),
      lazyMedia: [].slice.call(document.querySelectorAll('[loading="lazy"]'))
    };
  }

  /**
   * Initialize functionality
   */
  init() {
    try {
      this.updateFooterYear();
      this.setupSmoothScrolling();
      this.setupNavbarEffects();
      this.setupLazyLoading();
      this.setupEventListeners();
      this.injectGlobalStyles();

      console.info('Website initialized successfully');
    } catch (error) {
      this.handleError('Initialization', error, true);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const throttledScroll = this.throttle(
      this.handleScroll.bind(this),
      this.config.throttleDelay
    );
    window.addEventListener('scroll', throttledScroll);
  }

  /**
   * Update footer copyright year
   */
  updateFooterYear() {
    try {
      if (this.elements.currentYear) {
        const year = new Date().getFullYear();
        this.elements.currentYear.textContent = year;
        this.elements.currentYear.setAttribute('datetime', year.toString());
      }
    } catch (error) {
      this.handleError('Footer Year Update', error);
    }
  }

  /**
   * Setup smooth scrolling
   */
  setupSmoothScrolling() {
    if (!this.elements.anchors.length) return;

    const handleAnchorClick = (e) => {
      try {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
          const navbarToggler = document.querySelector('.navbar-toggler[aria-expanded="true"]');
          if (navbarToggler) {
            navbarToggler.click();
          }
        }
      } catch (error) {
        this.handleError('Smooth Scrolling', error);
      }
    };

    this.elements.anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });
  }

  /**
   * Setup navbar effects
   */
  setupNavbarEffects() {
    if (this.elements.navbar) {
      this.handleScroll();
    }
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    this.state.scrollPosition = window.scrollY || window.pageYOffset;
    const shouldShrink = this.state.scrollPosition > this.config.shrinkThreshold;

    if (shouldShrink !== this.state.isNavbarShrunk) {
      this.elements.navbar.classList.toggle('navbar-shrink', shouldShrink);
      this.state.isNavbarShrunk = shouldShrink;
    }
  }

  /**
   * Setup lazy loading
   */
  setupLazyLoading() {
    if (!this.elements.lazyMedia.length) return;

    if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadLazyMedia(entry.target);
              lazyObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: this.config.lazyLoadRootMargin,
          threshold: 0.01
        }
      );

      this.elements.lazyMedia.forEach(media => {
        lazyObserver.observe(media);
      });
    } else {
      this.loadAllMedia();
    }
  }

  /**
   * Load lazy media element
   */
  loadLazyMedia(element) {
    try {
      if (element.dataset.src) {
        element.src = element.dataset.src;
        if (element.dataset.srcset) {
          element.srcset = element.dataset.srcset;
        }
      }
      element.classList.add('fade-in');
    } catch (error) {
      this.handleError('Lazy Loading', error);
    }
  }

  /**
   * Fallback for lazy loading
   */
  loadAllMedia() {
    this.elements.lazyMedia.forEach(element => {
      this.loadLazyMedia(element);
    });
  }

  /**
   * Throttle function calls
   */
  throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
      const context = this;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  /**
   * Inject global styles
   */
  injectGlobalStyles() {
    if (document.querySelector('style[data-global-styles]')) return;

    const styles = document.createElement('style');
    styles.dataset.globalStyles = 'true';
    styles.textContent = `
      .navbar-shrink {
        padding: 0.5rem 0;
        box-shadow: var(--shadow-md);
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Error handling
   */
  handleError(context, error, isCritical = false) {
    console.error(`[${context}]`, error);
    if (isCritical) {
      const errorContainer = document.createElement('div');
      errorContainer.className = 'global-error';
      errorContainer.innerHTML = `
        <p>An error occurred. Please refresh the page.</p>
        <button class="error-dismiss">Dismiss</button>
      `;
      document.body.prepend(errorContainer);
      
      errorContainer.querySelector('.error-dismiss').addEventListener('click', () => {
        errorContainer.remove();
      });
    }
  }
}

// Initialize website
document.addEventListener('DOMContentLoaded', () => {
  try {
    new Website();
  } catch (error) {
    console.error('Failed to initialize website:', error);
    document.documentElement.classList.add('js-failed');
  }
});