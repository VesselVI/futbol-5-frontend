document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form-edit-employee');
  const selectFacility = document.getElementById('selectFacility');
  const selectStatus = document.getElementById('selectStatus');
  const empIdSpan = document.getElementById('display-emp-id');
  const errorMessage = document.getElementById('error-message');
  const btnSubmit = document.getElementById('btn-submit');
  const btnLogout = document.getElementById('btn-logout');
  const API_EMPLOYEES = `http://127.0.0.1:8000/api/employees`;
  const API_FACILITIES = `http://127.0.0.1:8000/api/facilities`;
  const urlParams = new URLSearchParams(window.location.search);
  const empId = urlParams.get('id');

  if (!empId) {
    alert('ID de empleado inválido.');
    window.location.href = 'employees.html';
    return;
  }

  const loadData = async () => {
    try {
      const facilitiesRes = await axios.get(API_FACILITIES, {
        withCredentials: true,
      });
      const empRes = await axios.get(`${API_EMPLOYEES}/${empId}`, {
        withCredentials: true,
      });

      const facilities = facilitiesRes.data;
      selectFacility.innerHTML = facilities
        .map((f) => `<option value="${f.id}">${f.address}</option>`)
        .join('');

      const emp = empRes.data;
      empIdSpan.textContent = `#${emp.id_employee}`;

      document.getElementById('inputName').value = emp.name_employee;
      document.getElementById('inputDni').value = emp.dni_employee;
      document.getElementById('inputPhone').value = emp.phone_employee;

      selectFacility.value = emp.id_facility;
      selectStatus.value = emp.id_status_employee;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert(
        'No se pudo cargar la información del empleado. Verifica tu conexión.',
      );
      window.location.href = 'employees.html';
    }
  };

  await loadData();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('d-none');

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...`;

    const updateData = {
      name_employee: document.getElementById('inputName').value.trim(),
      dni_employee: document.getElementById('inputDni').value.trim(),
      phone_employee: document.getElementById('inputPhone').value.trim(),
      id_facility: parseInt(selectFacility.value),
      id_status_employee: parseInt(selectStatus.value),
    };

    try {
      const response = await axios.put(
        `${API_EMPLOYEES}/${empId}`,
        updateData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        alert('Empleado actualizado con éxito.');
        window.location.href = 'employees.html';
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
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
