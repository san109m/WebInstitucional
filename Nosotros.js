// Scroll reveal
const reveals = document.querySelectorAll(".reveal, .reveal-right");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
});

// Mobile menu
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("nav-links");

btn.addEventListener("click", () => {
  nav.classList.toggle("active");
});
