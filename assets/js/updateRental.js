document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form-edit-rental');
  const errorMessage = document.getElementById('error-message');
  const btnSubmit = document.getElementById('btn-submit');
  const btnLogout = document.getElementById('btn-logout');
  const selectUser = document.getElementById('selectUser');
  const selectField = document.getElementById('selectField');
  const inputDate = document.getElementById('inputDate');
  const inputStartTime = document.getElementById('inputStartTime');
  const inputEndTime = document.getElementById('inputEndTime');
  const inputPrice = document.getElementById('inputPrice');
  const rentalIdSpan = document.getElementById('display-rental-id');
  const urlParams = new URLSearchParams(window.location.search);
  const rentalId = urlParams.get('id');

  if (!rentalId) {
    alert('ID de reserva inválido.');
    window.location.href = 'rentals.html';
    return;
  }

  const API_RENTAL = `http://127.0.0.1:8000/api/rental`;
  const API_USERS = `http://127.0.0.1:8000/api/users`;
  const API_FIELDS = `http://127.0.0.1:8000/api/fields`;

  const updateHourlyPrice = () => {
    const selectedOption = selectField.options[selectField.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.price) return;

    const hourlyPrice = parseFloat(selectedOption.dataset.price);
    inputPrice.value = hourlyPrice.toFixed(2);
  };

  const loadData = async () => {
    try {
      const [usersRes, fieldsRes, rentalRes] = await Promise.all([
        axios.get(API_USERS, { withCredentials: true }),
        axios.get(API_FIELDS, { withCredentials: true }),
        axios.get(`${API_RENTAL}/${rentalId}`, { withCredentials: true }),
      ]);

      const users = usersRes.data;
      selectUser.innerHTML = '';
      users.forEach((user) => {
        const option = document.createElement('option');
        option.value = user.id_user || user.id;
        option.textContent = `${user.user_name} (${user.user_email})`;
        selectUser.appendChild(option);
      });

      const fields = fieldsRes.data;
      selectField.innerHTML = '';
      fields.forEach((field) => {
        const option = document.createElement('option');
        option.value = field.id_field || field.id;
        option.dataset.price = field.hourly_price;
        option.textContent = `Cancha #${option.value} - $${field.hourly_price}/hr`;
        selectField.appendChild(option);
      });

      const rental = rentalRes.data;
      rentalIdSpan.textContent = `#${rental.id_rental}`;

      selectUser.value = rental.id_user;
      selectField.value = rental.id_field;

      const dateFormatted = rental.rental_date.split('T')[0];
      inputDate.value = dateFormatted;

      inputStartTime.value = rental.rental_start.substring(0, 5);
      inputEndTime.value = rental.rental_end.substring(0, 5);

      inputPrice.value = parseFloat(rental.rental_price).toFixed(2);
    } catch (error) {
      console.error('Error al cargar la reserva:', error);
      alert('Error al cargar la información. Verifique la conexión.');
      window.location.href = 'rentals.html';
    }
  };

  await loadData();

  selectField.addEventListener('change', updateHourlyPrice);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('d-none');

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Guardando...`;

    const updateData = {
      id_user: parseInt(selectUser.value),
      id_field: parseInt(selectField.value),
      rental_date: inputDate.value,
      rental_start: inputStartTime.value,
      rental_end: inputEndTime.value,
      rental_price: parseFloat(inputPrice.value),
    };

    try {
      const response = await axios.put(
        `${API_RENTAL}/${rentalId}`,
        updateData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        alert('Reserva actualizada exitosamente.');
        window.location.href = 'rentals.html';
      }
    } catch (error) {
      console.error('Error al actualizar reserva:', error);

      const errorText =
        error.response?.data?.message ||
        'Ocurrió un error al intentar actualizar la reserva.';
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
