document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form-edit-user');
  const errorMessage = document.getElementById('error-message');
  const btnSubmit = document.getElementById('btn-submit');
  const btnLogout = document.getElementById('btn-logout');
  const API_URL = `http://127.0.0.1:8000/api/users`;

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');

  if (!userId) {
    alert('No se proporcionó un ID de usuario válido.');
    window.location.href = 'users.html';
    return;
  }

  document.getElementById('display-user-id').textContent = `#${userId}`;

  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      withCredentials: true,
    });
    const user = response.data;

    document.getElementById('inputEmail').value = user.user_email || '';
    document.getElementById('inputName').value = user.user_name || '';
    document.getElementById('inputDni').value = user.user_dni || '';
    document.getElementById('inputPhone').value = user.user_phone || '';
    document.getElementById('selectRole').value = user.id_rol || 2;
    document.getElementById('selectRentalStatus').value =
      user.id_rental_status || 2;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    alert('Error al cargar los datos. Es posible que el usuario no exista.');
    window.location.href = 'users.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('d-none');

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...`;

    const updateData = {
      id: userId,
      user_email: document.getElementById('inputEmail').value.trim(),
      user_name: document.getElementById('inputName').value.trim(),
      user_dni: document.getElementById('inputDni').value.trim(),
      user_phone: document.getElementById('inputPhone').value.trim(),
      id_rol: parseInt(document.getElementById('selectRole').value),
      id_rental_status: parseInt(
        document.getElementById('selectRentalStatus').value,
      ),
    };

    try {
      const response = await axios.put(API_URL, updateData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('Usuario actualizado con éxito.');
        window.location.href = 'users.html';
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      const errorText =
        error.response?.data?.message ||
        'Ocurrió un error inesperado al intentar actualizar.';

      errorMessage.textContent = errorText;
      errorMessage.classList.remove('d-none');

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = 'Actualizar Cambios';
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
