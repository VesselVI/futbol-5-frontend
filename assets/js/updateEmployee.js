document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form-edit-employee');
  const selectFacility = document.getElementById('selectFacility');
  const selectStatus = document.getElementById('selectStatus');
  const empIdSpan = document.getElementById('display-emp-id');
  const errorMessage = document.getElementById('error-message');
  const btnSubmit = document.getElementById('btn-submit');

  // Configuración de URLs
  const hostname = window.location.hostname;
  const API_EMPLOYEES = `http://127.0.0.1:8000/api/employees`;
  const API_FACILITIES = `http://127.0.0.1:8000/api/facilities`;

  // 1. Obtener el ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const empId = urlParams.get('id');

  if (!empId) {
    alert('ID de empleado inválido.');
    window.location.href = 'employees.html';
    return;
  }

  // 2. Función para cargar Sedes y Datos del Empleado simultáneamente
  const loadData = async () => {
    try {
      // Disparamos ambas peticiones GET a tus controladores
      const [facilitiesRes, empRes] = await Promise.all([
        axios.get(API_FACILITIES, { withCredentials: true }),
        axios.get(`${API_EMPLOYEES}/${empId}`, { withCredentials: true }),
      ]);

      // -- A. Llenar el selector de Sedes --
      const facilities = facilitiesRes.data;
      selectFacility.innerHTML = facilities
        .map((f) => `<option value="${f.id}">${f.address}</option>`)
        .join('');

      // -- B. Rellenar los inputs con los datos del empleado --
      const emp = empRes.data;
      empIdSpan.textContent = `#${emp.id_employee}`;

      document.getElementById('inputName').value = emp.name_employee;
      document.getElementById('inputDni').value = emp.dni_employee;
      document.getElementById('inputPhone').value = emp.phone_employee;

      // -- C. Seleccionar automáticamente los <select> --
      // Esto ahora funcionará gracias a que agregaste estos campos en el backend
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

  // Disparamos la carga al inicio
  await loadData();

  // 3. Lógica para enviar el Update al backend
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.classList.add('d-none');

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...`;

    // Armamos el objeto con las mismas claves que espera tu req.body
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
});
