import { registerUser } from "../../services/userService.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();

    const userData = {
        user_name: document.getElementById("inputName").value.trim(),
        user_email: document.getElementById("inputEmail").value.trim(),
        user_phone: document.getElementById("inputPhone").value,
        user_password: document.getElementById("inputPassword").value,
        user_dni: document.getElementById("inputDni").value,
        id_rental_status: 2,

    }
    console.log(userData);
    try {

        const response = await registerUser(userData);
        console.log(response);
        alert("usuario registrado!");
    } catch (error) {
        console.log(error);
        alert("error en el registro")
    }

}





































// window.addEventListener("scroll", function () {
//     const nav = document.querySelector(".main-nav");

//     if (window.scrollY > 50) {
//         nav.classList.add("scrolled");
//     } else {
//         nav.classList.remove("scrolled");
//     }
// });

// AOS.init({
//     duration: 900,
//     easing: "ease-in-out",
//     once: true,
// });


// const counters = document.querySelectorAll(".counter");

// counters.forEach((counter) => {
//     counter.innerText = "0";

//     const updateCounter = () => {
//         const target = +counter.getAttribute("data-target");
//         const current = +counter.innerText;

//         const increment = target / 100;

//         if (current < target) {
//             counter.innerText = Math.ceil(current + increment);
//             setTimeout(updateCounter, 20);
//         } else {
//             counter.innerText = target;
//         }
//     };

//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 updateCounter();
//                 observer.unobserve(counter);
//             }

//         });
//     });


//     observer.observe(counter);
// });
