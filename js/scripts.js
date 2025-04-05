/**
 * Website Core Functionality - Enhanced Version
 * 
 * Features:
 * - Modern ES6+ syntax
 * - Comprehensive error handling
 * - Performance optimizations
 * - Accessibility improvements
 * - Better code organization
 */

class Website {
  constructor() {
    // Initialize with safe defaults
    this.config = {
      shrinkThreshold: 50,
      throttleDelay: 100,
      phoneRegex: /^\+?[1-9]\d{7,14}$/,
      maxMessageLength: 500,
      lazyLoadRootMargin: '100px 0px',
      audioErrorMessages: {
        aborted: 'Playback was aborted.',
        network: 'Network error occurred.',
        decode: 'Decoding error occurred.',
        unsupported: 'Audio format not supported.',
        generic: 'Unable to play audio stream.'
      }
    };

    this.state = {
      isNavbarShrunk: false,
      scrollPosition: 0,
      formSubmissions: new WeakMap(),
      mediaElements: new Set()
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
      forms: {
        whatsapp: document.getElementById('whatsappForm')
      },
      lazyMedia: [].slice.call(document.querySelectorAll('[loading="lazy"]')),
      audioPlayers: [].slice.call(document.querySelectorAll('audio')),
      interactiveElements: [].slice.call(document.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'))
    };
  }

  /**
   * Initialize all functionality
   */
  init() {
    try {
      // Core functionality
      this.updateFooterYear();
      this.setupSmoothScrolling();
      this.setupNavbarEffects();
      this.setupLazyLoading();
      this.setupAudioPlayers();
      this.setupInteractiveElements();

      // Form handling
      if (this.elements.forms.whatsapp) {
        this.setupWhatsAppForm();
      }

      // Event listeners
      this.setupEventListeners();

      // Inject global styles
      this.injectGlobalStyles();

      // Performance monitoring
      this.setupPerformanceObserver();

      console.info('Website initialized successfully');
    } catch (error) {
      this.handleError('Initialization', error, true);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Throttled scroll event
    const throttledScroll = this.throttle(
      this.handleScroll.bind(this),
      this.config.throttleDelay
    );
    window.addEventListener('scroll', throttledScroll);

    // Window load event
    window.addEventListener('load', this.handleWindowLoad.bind(this));

    // Visibility change
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange.bind(this)
    );

    // Error handling
    window.addEventListener('error', this.handleWindowError.bind(this));
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

          // Update URL
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }

          // Close mobile menu if open
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
        this.state.mediaElements.add(media);
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
        if (element.tagName === 'IMG') {
          element.src = element.dataset.src;
          if (element.dataset.srcset) {
            element.srcset = element.dataset.srcset;
          }
        } else if (element.tagName === 'IFRAME') {
          element.src = element.dataset.src;
        }
      }
      element.classList.add('fade-in');
      this.state.mediaElements.delete(element);
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
   * Setup WhatsApp form
   */
  setupWhatsAppForm() {
    const form = this.elements.forms.whatsapp;
    const phoneInput = form.querySelector('#phone');
    const messageInput = form.querySelector('#message');
    const submitButton = form.querySelector('[type="submit"]');
    const errorElement = form.querySelector('#form-error');

    const validateForm = () => {
      const isValidPhone = this.config.phoneRegex.test(phoneInput.value.trim());
      const isValidMessage = messageInput.value.trim().length > 0;

      phoneInput.classList.toggle('is-invalid', !isValidPhone);
      messageInput.classList.toggle('is-invalid', !isValidMessage);

      return isValidPhone && isValidMessage;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        this.disableForm(form, submitButton);
        
        try {
          const phone = encodeURIComponent(phoneInput.value.trim());
          const message = encodeURIComponent(messageInput.value.trim());
          const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;

          // Track submission
          this.state.formSubmissions.set(form, {
            timestamp: Date.now(),
            phone: phoneInput.value.trim()
          });

          // Attempt to open WhatsApp
          const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
          
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            this.showFormError(errorElement, 'Popup blocked. Please allow popups for this site.');
          } else {
            form.reset();
          }
        } catch (error) {
          this.handleError('WhatsApp Form', error);
          this.showFormError(errorElement, 'Error opening WhatsApp. Please try again.');
        } finally {
          this.enableForm(form, submitButton);
        }
      }
    };

    // Input validation
    phoneInput.addEventListener('blur', () => {
      phoneInput.classList.toggle(
        'is-invalid',
        !this.config.phoneRegex.test(phoneInput.value.trim())
      );
    });

    // Form submission
    form.addEventListener('submit', handleSubmit);
  }

  /**
   * Setup audio players
   */
  setupAudioPlayers() {
    if (!this.elements.audioPlayers.length) return;

    this.elements.audioPlayers.forEach(player => {
      const errorElement = player.nextElementSibling?.querySelector('.form-error');
      
      player.addEventListener('error', () => {
        this.handleAudioError(player, errorElement);
      });

      player.addEventListener('playing', () => {
        if (errorElement) errorElement.style.display = 'none';
      });

      player.addEventListener('stalled', () => {
        this.showAudioMessage(errorElement, 'Stream stalled. Buffering...');
      });

      player.addEventListener('waiting', () => {
        this.showAudioMessage(errorElement, 'Stream buffering...');
      });
    });
  }

  /**
   * Setup interactive elements
   */
  setupInteractiveElements() {
    this.elements.interactiveElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('focused');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focused');
      });
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  /**
   * Handle audio errors
   */
  handleAudioError(player, errorElement) {
    if (!errorElement) return;
    
    let errorMessage = this.config.audioErrorMessages.generic;
    
    if (player.error) {
      switch (player.error.code) {
        case player.error.MEDIA_ERR_ABORTED:
          errorMessage = this.config.audioErrorMessages.aborted;
          break;
        case player.error.MEDIA_ERR_NETWORK:
          errorMessage = this.config.audioErrorMessages.network;
          break;
        case player.error.MEDIA_ERR_DECODE:
          errorMessage = this.config.audioErrorMessages.decode;
          break;
        case player.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = this.config.audioErrorMessages.unsupported;
          break;
      }
    }

    this.showAudioMessage(errorElement, errorMessage);
  }

  /**
   * Show audio status message
   */
  showAudioMessage(element, message) {
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }

  /**
   * Handle window load
   */
  handleWindowLoad() {
    document.documentElement.classList.add('loaded');
    this.logPerformance();
  }

  /**
   * Handle visibility changes
   */
  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.pauseMediaElements();
    }
  }

  /**
   * Handle window errors
   */
  handleWindowError(event) {
    this.handleError(
      'Window Error',
      new Error(`${event.message} (${event.filename}:${event.lineno}:${event.colno})`),
      true
    );
  }

  /**
   * Pause media elements
   */
  pauseMediaElements() {
    this.elements.audioPlayers.forEach(player => {
      if (!player.paused) player.pause();
    });
  }

  /**
   * Log performance metrics
   */
  logPerformance() {
    if ('performance' in window) {
      const perfData = {
        loadTime: performance.now(),
        memory: performance.memory?.usedJSHeapSize || null,
        mediaElements: this.state.mediaElements.size
      };
      console.debug('Performance metrics:', perfData);
    }
  }

  /**
   * Setup Performance Observer
   */
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          console.debug('Performance entry:', entry);
        });
      });
      observer.observe({ entryTypes: ['measure', 'resource'] });
    }
  }

  /**
   * Disable form during submission
   */
  disableForm(form, button) {
    form.classList.add('submitting');
    button.disabled = true;
    button.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending...';
  }

  /**
   * Enable form after submission
   */
  enableForm(form, button) {
    form.classList.remove('submitting');
    button.disabled = false;
    button.textContent = 'Open WhatsApp Chat';
  }

  /**
   * Show form error
   */
  showFormError(element, message) {
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    }
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
      
      .submitting {
        pointer-events: none;
        opacity: 0.7;
      }
      
      .spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 0.15em solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
        vertical-align: text-bottom;
        margin-right: 0.5rem;
      }
      
      .focused {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Error handling
   */
  handleError(context, error, isCritical = false) {
    console.error(`[${context}]`, error);
    
    // Send to analytics if available
    if (typeof gtag === 'function') {
      gtag('event', 'exception', {
        description: `${context}: ${error.message}`,
        fatal: isCritical
      });
    }
    
    // Show user feedback for critical errors
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
    
    // Fallback for critical initialization failures
    document.documentElement.classList.add('js-failed');
  }
});