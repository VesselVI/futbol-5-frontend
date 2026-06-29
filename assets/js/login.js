import { loginUser } from "../../services/userService.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", handleLogin);

async function handleLogin(event) {
    event.preventDefault();

    const credentials = {
        user_email: document.getElementById("emailInput").value.trim(),
        user_password: document.getElementById("passwordInput").value
    };

    console.log(credentials);
    try {
        const response = await loginUser(credentials);
        console.log(response);
        alert("login exitoso");
        window.location.replace("../../indexAuth.html")
    } catch (error) {
        console.log(error)
        alert("error en el inicio de sesión")
    }
}