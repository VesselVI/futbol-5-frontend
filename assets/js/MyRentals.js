import { requireAuth } from "./AuthPages.js";
import { verifyAuth, getRentalByUserId, deleteRental } from "../../services/authService.js";
const authenticated = await requireAuth();

if (authenticated) {

    const rentals = (await getRentalByUserId()).data;

    const tbody = document.getElementById("rentalsTableBody");

    let html = "";

    rentals.forEach(rental => {
        html += `
        <tr>
            <td>
                <div>
                    <p class="fw-semibold mb-0"> Reserva N ${rental.id_rental}</p>
                    <p class="text-muted small mb-0">-</p>
                </div>
            </td>
            <td><span class="badge text-bg-primary">${rental.category_name}</span></td>
            <td><span class="fw-semibold">$${Number(rental.rental_price).toLocaleString("es-AR")}</span></td>
            <td>${rental.rental_start}</td>
            <td>${rental.rental_end}</td>
            <td><button class="delete-rental" data-id="${rental.id_rental}">Eliminar Turno</button></td>
            
        </tr>
    `;
    });

    tbody.innerHTML = html;


    document.querySelectorAll(".delete-rental").forEach(button => {
        button.addEventListener("click", async () => {
            const rentalId = button.dataset.id;

            try {
                await deleteRental(rentalId);

                button.closest("tr").remove();

                alert("Reserva eliminada");
            } catch (error) {
                console.error(error);
                alert("Error al eliminar la reserva");
            }
        });
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
    // initPage();
    // loadRentals();
}

