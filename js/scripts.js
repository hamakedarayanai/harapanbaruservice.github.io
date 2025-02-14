// Update the footer year dynamically
document.addEventListener("DOMContentLoaded", function () {
  const currentYearElem = document.getElementById("currentYear");
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }
});

// Navbar shrink effect on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("shadow-lg");
    } else {
      navbar.classList.remove("shadow-lg");
    }
  }
});

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", function () {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});

// WhatsApp Chat Form Handler
document.addEventListener("DOMContentLoaded", function () {
  const whatsappForm = document.getElementById("whatsappForm");
  if (whatsappForm) {
    whatsappForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const phoneInput = document.getElementById("phone");
      const messageInput = document.getElementById("message");
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";
      
      // Validate phone number format (basic check)
      const phonePattern = /^\+?[1-9]\d{7,14}$/;
      if (!phonePattern.test(phone)) {
        phoneInput.classList.add("is-invalid");
        return;
      } else {
        phoneInput.classList.remove("is-invalid");
      }
  
      // Construct WhatsApp URL
      let whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phone)}`;
      if (message) {
        whatsappUrl += `&text=${encodeURIComponent(message)}`;
      }
  
      // Open WhatsApp chat in a new tab
      window.open(whatsappUrl, "_blank");
    });
  }
});

// Lazy loading images with fade-in effect
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll("img[loading='lazy']");
  lazyImages.forEach(img => {
    img.addEventListener("load", function () {
      img.classList.add("fade-in");
    });
  });
});

// Inject fade-in animation styles into the document head
document.addEventListener("DOMContentLoaded", function () {
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
});