import { loginUser } from "../../services/userService";

async function handleLogin(event) {
    event.preventDefault();

    const credentials = {
        user_email: document.getElementById("emailInput"),
        user_password: document.getElementById("passwordInput")
    };

    console.log(credentials);
    try {
        const response = await loginUser(credentials);
        console.log(response);
        alert("login exitoso");
        window.location.replace("../../index.html")
    } catch (error) {
        console.log(error)
        alert("error en el inicio de sesión")
    }

}