document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-create-employee');
  const errorMessage = document.getElementById('error-message');
  const btnSubmit = document.getElementById('btn-submit');
  const selectFacility = document.getElementById('selectFacility');
  const btnLogout = document.getElementById('btn-logout');
  const API_EMPLOYEES_URL = `http://127.0.0.1:8000/api/employees`;
  const API_FACILITIES_URL = `http://127.0.0.1:8000/api/facilities`;

  const loadFacilities = async () => {
    try {
      const response = await axios.get(API_FACILITIES_URL, {
        withCredentials: true,
      });

      const facilities = response.data;

      selectFacility.innerHTML =
        '<option value="" selected disabled>Seleccione una sede</option>';

      facilities.forEach((facility) => {
        const option = document.createElement('option');
        option.value = facility.id;
        option.textContent = facility.address;
        selectFacility.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar sedes:', error);
      selectFacility.innerHTML =
        '<option value="" disabled>Error de conexión al cargar sedes</option>';
    }
  };

  loadFacilities();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('d-none');

    if (!selectFacility.value) {
      errorMessage.textContent =
        'Por favor, seleccione una sede asignada para el empleado.';
      errorMessage.classList.remove('d-none');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...`;

    const employeeData = {
      name_employee: document.getElementById('inputName').value.trim(),
      dni_employee: document.getElementById('inputDni').value.trim(),
      phone_employee: document.getElementById('inputPhone').value.trim(),
      id_facility: parseInt(selectFacility.value),
      id_status_employee: parseInt(
        document.getElementById('selectStatus').value,
      ),
    };

    try {
      const response = await axios.post(API_EMPLOYEES_URL, employeeData, {
        withCredentials: true,
      });

      if (response.status === 201 || response.status === 200) {
        alert('Empleado registrado exitosamente.');
        window.location.href = 'employees.html';
      }
    } catch (error) {
      console.error('Error al crear empleado:', error);

      const errorText =
        error.response?.data?.message ||
        'Ocurrió un error inesperado al intentar guardar el empleado.';
      errorMessage.textContent = errorText;
      errorMessage.classList.remove('d-none');

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = 'Guardar Empleado';
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
