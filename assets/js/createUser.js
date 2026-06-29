document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-create-user');
  const errorMessage = document.getElementById('error-message');
  const btnSubmit = document.getElementById('btn-submit');
  const btnLogout = document.getElementById('btn-logout');
  const API_URL = 'http://127.0.0.1:8000/api/users';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorMessage.classList.add('d-none');

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...`;

    const userData = {
      user_email: document.getElementById('inputEmail').value.trim(),
      user_password: document.getElementById('inputPassword').value,
      user_name: document.getElementById('inputName').value.trim(),
      user_dni: document.getElementById('inputDni').value.trim(),
      user_phone: document.getElementById('inputPhone').value.trim(),
      id_rol: parseInt(document.getElementById('selectRole').value),
    };

    try {
      const response = await axios.post(`${API_URL}/`, userData, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        alert('Usuario creado exitosamente.');
        window.location.href = 'users.html';
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);

      const errorText =
        error.response?.data?.message ||
        'Ocurrió un error inesperado al intentar guardar el usuario.';

      errorMessage.textContent = errorText;
      errorMessage.classList.remove('d-none');

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = 'Guardar Usuario';
    }
  });

  if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
      e.preventDefault();

      const API_LOGOUT = 'http://127.0.0.1:8000/api/users/logout';

      try {
        await axios.post(
          API_LOGOUT,
          {},
          {
            withCredentials: true,
          },
        );

        window.location.href = '/';
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Ocurrió un problema al cerrar la sesión. Intenta nuevamente.');
      }
    });
  }
});
