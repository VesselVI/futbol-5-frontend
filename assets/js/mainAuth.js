import { requireAuth } from "./AuthPages.js"; // ajustá el path

const authenticated = await requireAuth();

if (authenticated) {

  document.getElementById("btnLogout").addEventListener("click", async () => {
    try {
      await logout();
      window.location.href = "../../pages/login.html";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar la sesión");
    }
  });

  window.addEventListener("scroll", function () {
    const nav = document.querySelector(".main-nav");

    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  AOS.init({
    duration: 900,
    easing: "ease-in-out",
    once: true,
  });


  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    counter.innerText = "0";

    const updateCounter = () => {
      const target = +counter.getAttribute("data-target");
      const current = +counter.innerText;

      const increment = target / 100;

      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(updateCounter, 20);
      } else {
        counter.innerText = target;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(counter);
        }
      });
    });

    observer.observe(counter);
  });


  const themeSwitch =
    document.getElementById("themeSwitch");


  const savedTheme =
    localStorage.getItem("theme") || "light";


  document.documentElement.setAttribute(
    "data-bs-theme",
    savedTheme
  );


  themeSwitch.checked =
    savedTheme === "dark";

  themeSwitch.addEventListener("change", () => {

    const theme =
      themeSwitch.checked
        ? "dark"
        : "light";

    document.documentElement.setAttribute(
      "data-bs-theme",
      theme
    );

    localStorage.setItem(
      "theme",
      theme
    );
  });

}

