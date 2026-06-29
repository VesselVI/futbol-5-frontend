document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-create-rental');
  const errorMessage = document.getElementById('error-message');
  const btnSubmit = document.getElementById('btn-submit');
  const selectUser = document.getElementById('selectUser');
  const selectField = document.getElementById('selectField');
  const inputPrice = document.getElementById('inputPrice');
  const btnLogout = document.getElementById('btn-logout');
  const API_RENTAL = `http://127.0.0.1:8000/api/rental/admin`;
  const API_USERS = `http://127.0.0.1:8000/api/users`;
  const API_FIELDS = `http://127.0.0.1:8000/api/fields`;

  const loadData = async () => {
    try {
      const usersRes = await axios.get(API_USERS, { withCredentials: true });
      console.log(usersRes);
      const fieldsRes = await axios.get(API_FIELDS, { withCredentials: true });
      const users = usersRes.data;
      selectUser.innerHTML =
        '<option value="" selected disabled>Seleccione un cliente</option>';
      users.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.user_name} (${user.user_email})`;
        selectUser.appendChild(option);
      });

      const fields = fieldsRes.data;
      selectField.innerHTML =
        '<option value="" selected disabled>Seleccione una cancha</option>';
      fields.forEach((field) => {
        const option = document.createElement('option');
        option.value = field.id_field;
        option.dataset.price = field.hourly_price;
        option.textContent = `Cancha #${field.id_field} - $${field.hourly_price}/hr`;
        selectField.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar datos para los selects:', error);
      selectUser.innerHTML =
        '<option value="" disabled>Error al cargar clientes</option>';
      selectField.innerHTML =
        '<option value="" disabled>Error al cargar canchas</option>';
    }
  };

  loadData();

  selectField.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const defaultPrice = selectedOption.dataset.price;
    if (defaultPrice) {
      inputPrice.value = parseFloat(defaultPrice).toFixed(2);
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('d-none');

    if (!selectUser.value || !selectField.value) {
      errorMessage.textContent =
        'Por favor, asegúrese de seleccionar un cliente y una cancha.';
      errorMessage.classList.remove('d-none');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...`;

    const rentalData = {
      id_user: parseInt(selectUser.value),
      id_field: parseInt(selectField.value),
      rental_date: document.getElementById('inputDate').value,
      rental_start: document.getElementById('inputStartTime').value,
      rental_end: document.getElementById('inputEndTime').value,
      rental_price: parseFloat(inputPrice.value),
    };

    try {
      const response = await axios.post(API_RENTAL, rentalData, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        alert('Reserva creada exitosamente.');
        window.location.href = 'rentals.html';
      }
    } catch (error) {
      console.error('Error al crear reserva:', error);

      const errorText =
        error.response?.data?.message ||
        'Ocurrió un error inesperado al intentar guardar la reserva.';
      errorMessage.textContent = errorText;
      errorMessage.classList.remove('d-none');

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = 'Guardar Reserva';
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
