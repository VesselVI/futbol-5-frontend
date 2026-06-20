# futbol-5-frontend

# Autenticación con JWT + Cookies HttpOnly (Frontend)

## 1. Crear formulario de Login

```html
<form id="loginForm">

    <input
        id="email"
        type="email"
    >

    <input
        id="password"
        type="password"
    >

    <button type="submit">
        Iniciar Sesión
    </button>

</form>
```

---

## 2. Capturar Submit

```javascript
const form =
    document.getElementById('loginForm');

form.addEventListener(
    'submit',
    handleLogin
);
```

---

## 3. Obtener datos del formulario

```javascript
const credentials = {

    user_email:
        document.getElementById('email').value,

    user_password:
        document.getElementById('password').value
};
```

---

## 4. Enviar Login al Backend

```javascript
await axios.post(
    'http://localhost:8000/api/users/login',
    credentials,
    {
        withCredentials: true
    }
);
```

---

## 5. Redireccionar al Home

```javascript
window.location.replace(
    '../pages/home.html'
);
```

---

## Ejemplo Completo

```javascript
async function handleLogin(event) {

    event.preventDefault();

    const credentials = {

        user_email:
            document.getElementById('email').value,

        user_password:
            document.getElementById('password').value
    };

    try {

        await axios.post(
            'http://localhost:8000/api/users/login',
            credentials,
            {
                withCredentials: true
            }
        );

        window.location.replace(
            '../pages/home.html'
        );

    } catch (error) {

        alert(
            'Credenciales inválidas'
        );
    }
}
```

---

## 6. Consumir rutas protegidas

```javascript
const response = await axios.get(
    'http://localhost:8000/api/users/profile',
    {
        withCredentials: true
    }
);
```

### Importante

Siempre incluir:

```javascript
withCredentials: true
```

para que el navegador envíe la cookie automáticamente.

---

## 7. Logout

```javascript
await axios.post(
    'http://localhost:8000/api/users/logout',
    {},
    {
        withCredentials: true
    }
);
```

---

## 8. Redireccionar a Login

```javascript
window.location.replace(
    '../pages/login.html'
);
```

---

## Flujo General

```text
Usuario ingresa email y contraseña
                ↓
POST /login
                ↓
Backend valida
                ↓
Backend crea JWT
                ↓
Backend guarda JWT en Cookie HttpOnly
                ↓
200 OK
                ↓
Redirección a Home


Peticiones posteriores
                ↓
Cookie enviada automáticamente
                ↓
verifyToken
                ↓
Usuario autenticado


Logout
                ↓
POST /logout
                ↓
clearCookie()
                ↓
Cookie eliminada
                ↓
Redirección a Login
```

---

## Qué NO hacer

❌ Guardar el JWT en:

```javascript
localStorage
sessionStorage
```

❌ Guardar contraseñas en el frontend.

---

## Qué SÍ hacer

✅ Usar Cookies HttpOnly.

✅ Usar:

```javascript
withCredentials: true
```

en todas las peticiones autenticadas.

✅ Dejar que el navegador administre la cookie automáticamente.


        <!-- name
        <div class="form-group col-md-6 mb-2 mt-1">
        <label for="inputName" class="mb-2">Nombre</label>
        <input type="text" class="form-control" id="inputName" required>
        </div>
        email
        <div class="form-group col-md-6 mb-2 mt-1">
        <label for="inputEmail" class="mb-2">Email</label>
        <input type="email" class="form-control" id="inputEmail" required>
        </div>
        phone Number
        <div class="form-group col-md-6 mb-2 mt-1">
        <label for="inputPhone" class="mb-2">Telefono</label>
        <input type="tel" class="form-control" id="inputPhone" required>
        </div>
        dni
        <div class="form-group col-md-6 mb-2 mt-1">
        <label for="inputDni" class="mb-2">DNI</label>
        <input type="text" class="form-control" id="inputDni" required>
        </div>
        password
        <div class="form-group col-md-6 mb-2 mt-1">
        <label for="inputPassword" class="mb-2">Contraseña</label>
        <input type=" password" class="form-control" id="inputPassword" required>
        </div>-->