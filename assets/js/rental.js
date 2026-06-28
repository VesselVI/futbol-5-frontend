import { createRental } from "../../services/authService.js";
const form = document.getElementById("formBooking");

form.addEventListener("submit", async (e) => {
    e.preventDefault();


    const formData = Object.fromEntries(new FormData(form));
    let rental_price = 0;

    const fieldId = Number(formData.id_field)

    if (fieldId === 1) {
        rental_price = Number(10000)
    } else if (fieldId === 2) {
        rental_price = Number(12000)
    } else {
        rental_price = Number(15000)
    }
    const payload = {
        id_field: fieldId,
        rental_price,
        rental_date: formData.rental_date,
        rental_start: formData.rental_start,
        rental_end: formData.rental_end
    }
    try {
        await createRental(payload);
        alert("✅ Reserva creada correctamente");
        form.reset();
    } catch (error) {
        if (error.response?.status === 409) {
            alert("⛔ La cancha ya está ocupada en ese horario");
        } else {
            alert("❌ Error al crear la reserva");
        }
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



