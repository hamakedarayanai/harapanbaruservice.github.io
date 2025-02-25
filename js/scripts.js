// scripts.js

class Website {
  constructor() {
    this.currentYearElem = document.getElementById("currentYear");
    this.navbar = document.querySelector(".navbar");
    this.anchors = document.querySelectorAll('a[href^="#"]');
    this.whatsappForm = document.getElementById("whatsappForm");
    this.lazyImages = document.querySelectorAll("img[loading='lazy']");
  }

  updateFooterYear() {
    try {
      if (this.currentYearElem) {
        this.currentYearElem.textContent = new Date().getFullYear();
      }
    } catch (error) {
      console.error("Error updating footer year:", error);
    }
  }

  navbarShrinkEffect() {
    try {
      if (this.navbar) {
        if (window.scrollY > 50) {
          this.navbar.classList.add("shadow-lg");
        } else {
          this.navbar.classList.remove("shadow-lg");
        }
      }
    } catch (error) {
      console.error("Error applying navbar shrink effect:", error);
    }
  }

  smoothScrolling() {
    try {
      this.anchors.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    } catch (error) {
      console.error("Error initializing smooth scrolling:", error);
    }
  }

  whatsappChatFormHandler() {
    try {
      if (this.whatsappForm) {
        this.whatsappForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const phoneInput = document.getElementById("phone");
          const messageInput = document.getElementById("message");
          const phone = phoneInput? phoneInput.value.trim() : "";
          const message = messageInput? messageInput.value.trim() : "";

          // Validate phone number format (basic check)
          const phonePattern = /^\+?[1-9]\d{7,14}$/;
          if (!phonePattern.test(phone)) {
            phoneInput.classList.add("is-invalid");
            return;
          } else {
            phoneInput.classList.remove("is-invalid");
          }

          // Sanitize user input for WhatsApp message
          const sanitizedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

          // Construct WhatsApp URL
          let whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phone)}`;
          if (sanitizedMessage) {
            whatsappUrl += `&text=${encodeURIComponent(sanitizedMessage)}`;
          }

          // Open WhatsApp chat in a new tab
          window.open(whatsappUrl, "_blank");
        });
      }
    } catch (error) {
      console.error("Error handling WhatsApp chat form submission:", error);
    }
  }

  lazyLoadingImages() {
    try {
      this.lazyImages.forEach(img => {
        img.addEventListener("load", function () {
          img.classList.add("fade-in");
        });
      });
    } catch (error) {
      console.error("Error initializing lazy loading images:", error);
    }
  }

  injectFadeInStyles() {
    try {
      const fadeInStyle = `
        <style>
         .fade-in { animation: fadeIn 1s ease-in-out; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", fadeInStyle);
    } catch (error) {
      console.error("Error injecting fade-in styles:", error);
    }
  }

  init() {
    this.updateFooterYear();
    this.smoothScrolling();
    this.whatsappChatFormHandler();
    this.lazyLoadingImages();
    this.injectFadeInStyles();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const website = new Website();
  website.init();
});

window.addEventListener("scroll", function () {
  const website = new Website();
  website.navbarShrinkEffect();
});