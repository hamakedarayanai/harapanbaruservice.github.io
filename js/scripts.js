// scripts.js

class Website {
  constructor() {
    this.currentYearElem = document.getElementById("currentYear");
    this.navbar = document.querySelector(".navbar");
    this.anchors = document.querySelectorAll('a[href^="#"]');
    this.whatsappForm = document.getElementById("whatsappForm");
    this.lazyImages = document.querySelectorAll("img[loading='lazy']");
    this.scrollTimeout = null;
    this.isNavbarShrunk = false; // Track navbar state
  }

  updateFooterYear() {
    if (this.currentYearElem) {
      try {
        this.currentYearElem.textContent = new Date().getFullYear();
      } catch (error) {
        console.error("Error updating footer year:", error);
      }
    }
  }

  navbarShrinkEffect() {
    if (!this.navbar) return;

    const scrollY = window.scrollY;
    const shrinkThreshold = 50;

    if (scrollY > shrinkThreshold && !this.isNavbarShrunk) {
      this.navbar.classList.add("shadow-lg");
      this.isNavbarShrunk = true;
    } else if (scrollY <= shrinkThreshold && this.isNavbarShrunk) {
      this.navbar.classList.remove("shadow-lg");
      this.isNavbarShrunk = false;
    }
  }

  throttledNavbarShrink() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.navbarShrinkEffect();
    }, 100); // Debounce delay
  }

  smoothScrolling() {
    this.anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // Optional: Close mobile menu if open
          const navbarToggler = document.querySelector(".navbar-toggler");
          if (navbarToggler && navbarToggler.getAttribute("aria-expanded") === "true") {
            navbarToggler.click(); // Simulate click to close
          }
        }
      });
    });
  }

  whatsappChatFormHandler() {
    if (!this.whatsappForm) return;

    this.whatsappForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById("phone");
      const messageInput = document.getElementById("message");
      const phone = phoneInput.value.trim();
      const message = messageInput.value.trim();

      const phonePattern = /^\+?[1-9]\d{7,14}$/;
      if (!phonePattern.test(phone)) {
        phoneInput.classList.add("is-invalid");
        return;
      } else {
        phoneInput.classList.remove("is-invalid");
      }

      if (!message) {
        messageInput.classList.add("is-invalid");
        return;
      } else {
        messageInput.classList.remove("is-invalid");
      }

      const sanitizedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(sanitizedMessage)}`;

      window.open(whatsappUrl, "_blank");
    });
  }

  lazyLoadingImages() {
    this.lazyImages.forEach((img) => {
      img.classList.remove("fade-in"); // Remove initial class if present
      img.addEventListener("load", () => {
        img.classList.add("fade-in");
      });
    });
  }

  injectFadeInStyles() {
    const fadeInStyle = `
      <style>
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    `;
    document.head.insertAdjacentHTML("beforeend", fadeInStyle);
  }

  init() {
    this.updateFooterYear();
    this.smoothScrolling();
    this.whatsappChatFormHandler();
    this.lazyLoadingImages();
    this.injectFadeInStyles();
    window.addEventListener("scroll", () => this.throttledNavbarShrink());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const website = new Website();
  website.init();
});
      
