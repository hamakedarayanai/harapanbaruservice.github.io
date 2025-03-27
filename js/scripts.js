// scripts.js

class Website {
  constructor() {
    this.elements = {
      currentYear: document.getElementById("currentYear"),
      navbar: document.querySelector(".navbar"),
      anchors: document.querySelectorAll('a[href^="#"]'),
      whatsappForm: document.getElementById("whatsappForm"),
      lazyImages: document.querySelectorAll("img[loading='lazy']"),
    };
    this.state = {
      scrollTimeout: null,
      isNavbarShrunk: false,
    };
    this.config = {
      shrinkThreshold: 50,
      throttleDelay: 100,
    };
  }

  // Utility method for error logging
  #logError(methodName, error) {
    console.error(`Error in ${methodName}:`, error);
  }

  updateFooterYear() {
    const { currentYear } = this.elements;
    if (!currentYear) return;

    try {
      currentYear.textContent = new Date().getFullYear().toString();
    } catch (error) {
      this.#logError("updateFooterYear", error);
    }
  }

  navbarShrinkEffect(scrollY = window.scrollY) {
    const { navbar } = this.elements;
    if (!navbar) return;

    const { shrinkThreshold } = this.config;
    const shouldShrink = scrollY > shrinkThreshold;

    if (shouldShrink !== this.state.isNavbarShrunk) {
      navbar.classList.toggle("shadow-lg", shouldShrink);
      this.state.isNavbarShrunk = shouldShrink;
    }
  }

  throttle(fn, wait) {
    let timeout;
    return (...args) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          fn.apply(this, args);
        }, wait);
      }
    };
  }

  smoothScrolling() {
    const { anchors } = this.elements;
    if (!anchors.length) return;

    const handleClick = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      try {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          const navbarToggler = document.querySelector(".navbar-toggler");
          if (navbarToggler?.getAttribute("aria-expanded") === "true") {
            navbarToggler.click();
          }
        }
      } catch (error) {
        this.#logError("smoothScrolling", error);
      }
    };

    anchors.forEach((anchor) => anchor.addEventListener("click", handleClick));
  }

  whatsappChatFormHandler() {
    const { whatsappForm } = this.elements;
    if (!whatsappForm) return;

    const validatePhone = (phone) => /^\+?[1-9]\d{7,14}$/.test(phone.trim());
    const sanitizeInput = (input) => input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    whatsappForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phoneInput = whatsappForm.querySelector("#phone");
      const messageInput = whatsappForm.querySelector("#message");
      
      if (!phoneInput || !messageInput) return;

      const phone = phoneInput.value.trim();
      const message = messageInput.value.trim();

      phoneInput.classList.toggle("is-invalid", !validatePhone(phone));
      messageInput.classList.toggle("is-invalid", !message);

      if (validatePhone(phone) && message) {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(sanitizeInput(message))}`;
        try {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
          whatsappForm.reset();
        } catch (error) {
          this.#logError("whatsappChatFormHandler", error);
        }
      }
    });
  }

  lazyLoadingImages() {
    const { lazyImages } = this.elements;
    if (!lazyImages.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add("fade-in");
            obs.unobserve(img);
          }
        });
      },
      { rootMargin: "0px 0px 100px 0px" }
    );

    lazyImages.forEach((img) => {
      img.classList.remove("fade-in");
      observer.observe(img);
    });
  }

  injectFadeInStyles() {
    try {
      if (!document.querySelector("style[data-fade-in]")) {
        const style = document.createElement("style");
        style.dataset.fadeIn = "true";
        style.textContent = `
          .fade-in {
            animation: fadeIn 1s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      }
    } catch (error) {
      this.#logError("injectFadeInStyles", error);
    }
  }

  init() {
    try {
      this.updateFooterYear();
      this.smoothScrolling();
      this.whatsappChatFormHandler();
      this.lazyLoadingImages();
      this.injectFadeInStyles();

      const throttledShrink = this.throttle(this.navbarShrinkEffect.bind(this), this.config.throttleDelay);
      window.addEventListener("scroll", () => throttledShrink(window.scrollY));

      // Initial check
      this.navbarShrinkEffect();
    } catch (error) {
      this.#logError("init", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    const website = new Website();
    website.init();
  } catch (error) {
    console.error("Error initializing Website:", error);
  }
});