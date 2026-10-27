// ============================
// NAVIGATION - MOBILE TOGGLE
// ============================
const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("mainNav");

if (hamburger && mainNav) {
  hamburger.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", mainNav.classList.contains("open"));

    // Toggle hamburger icon
    const icon = hamburger.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    }
  });
}

// ============================
// HERO SLIDER
// ============================
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".slider-dots");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let currentIndex = 0;
let sliderInterval;

// Create dots dynamically
if (slides.length && dotsContainer) {
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? "block" : "none";
    slide.setAttribute("aria-hidden", i !== index);
  });

  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");
}

function goToSlide(index) {
  currentIndex = index;
  showSlide(currentIndex);
  resetSliderInterval();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

function startSlider() {
  sliderInterval = setInterval(nextSlide, 5000);
}

function resetSliderInterval() {
  clearInterval(sliderInterval);
  startSlider();
}

if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlide);

if (slides.length) {
  showSlide(currentIndex);
  startSlider();
}

// ============================
// FOOTER YEAR
// ============================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ============================
// IMAGE LOADING ENHANCEMENT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".thumb img");
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
      img.addEventListener("error", () => {
        img.style.display = "none";
        // Add a placeholder
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        placeholder.innerHTML = '<i class="fas fa-image"></i>';
        img.parentNode.appendChild(placeholder);
      });
    }
  });
});

// ============================
// FORM VALIDATION
// ============================
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// ============================
// SMOOTH SCROLLING
// ============================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// ============================
// LAZY LOADING IMAGES
// ============================
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute("data-src");
        if (src) {
          img.src = src;
          img.removeAttribute("data-src");
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ============================
// INITIALIZE ON LOAD
// ============================
document.addEventListener("DOMContentLoaded", function () {
  // Add current year to footer
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initialize tooltips
  const tooltips = document.querySelectorAll("[data-tooltip]");
  tooltips.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = this.getAttribute("data-tooltip");
      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.left =
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
      tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";

      this._tooltip = tooltip;
    });

    element.addEventListener("mouseleave", function () {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });

  // Add active class to current page in navigation
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${
        type === "success"
          ? "check-circle"
          : type === "error"
            ? "exclamation-circle"
            : "info-circle"
      }"></i> 
      <span>${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;

  document.body.appendChild(notification);

  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.remove();
  });

  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}
// ============================
// NAVIGATION - ACCESSIBILITY & CLOSE BEHAVIOUR
// ============================
(function () {
  if (!hamburger || !mainNav) return;
  hamburger.setAttribute("role", "button");
  hamburger.setAttribute("tabindex", "0");
  hamburger.setAttribute("aria-label", "Toggle navigation menu");
  hamburger.setAttribute("aria-controls", "mainNav");
  hamburger.setAttribute("aria-expanded", "false");

  const closeNav = () => {
    mainNav.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      hamburger.click();
    }
  });
  mainNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
  document.addEventListener("click", (e) => {
    if (
      mainNav.classList.contains("open") &&
      !mainNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeNav();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeNav();
  });
})();

// ============================
// BLOG - ARTICLE ENHANCEMENTS (only runs on blog posts)
// ============================
(function () {
  if (!document.body.classList.contains("blog-post")) return;

  // Reading progress bar
  const bar = document.getElementById("reading-progress");
  if (bar) {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  // Table of contents: open on desktop, collapsed on small screens
  const toc = document.querySelector("details.toc");
  if (toc) {
    const mq = window.matchMedia("(min-width: 1000px)");
    const sync = () => {
      toc.open = mq.matches;
    };
    sync();
    if (mq.addEventListener) mq.addEventListener("change", sync);
  }

  // Highlight the current section in the table of contents
  const tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    const byId = {};
    tocLinks.forEach((a) => {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tocLinks.forEach((a) => a.classList.remove("is-active"));
            const link = byId[entry.target.id];
            if (link) link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    Object.keys(byId).forEach((id) => {
      const el = document.getElementById(id);
      if (el) headingObserver.observe(el);
    });
  }

  // Copy-link button
  document.querySelectorAll("[data-copy-link]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = btn.getAttribute("data-copy-link") || window.location.href;
      const label = btn.querySelector("span");
      try {
        await navigator.clipboard.writeText(url);
        if (label) {
          const old = label.textContent;
          label.textContent = "Copied!";
          setTimeout(() => (label.textContent = old), 1800);
        }
      } catch (err) {
        window.prompt("Copy this link:", url);
      }
    });
  });
})();
