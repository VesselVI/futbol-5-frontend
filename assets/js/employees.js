document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body-employees');
  const API_URL = `http://127.0.0.1:8000/api/employees`;

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      const employees = response.data;
      renderTable(employees);
    } catch (error) {
      console.error('Error obteniendo empleados:', error);
      tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> Error al cargar los empleados. Verifica tu conexión al servidor.
                    </td>
                </tr>
            `;
    }
  };

  const renderTable = (employees) => {
    tableBody.innerHTML = '';

    if (employees.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No hay empleados registrados.</td></tr>`;
      return;
    }

    employees.forEach((emp) => {
      const tr = document.createElement('tr');
      let statusBadge = 'bg-secondary';
      if (emp.employee_status_name === 'Activo') statusBadge = 'bg-success';
      if (emp.employee_status_name === 'Inactivo') statusBadge = 'bg-danger';
      if (emp.employee_status_name === 'De Vacaciones')
        statusBadge = 'bg-warning text-dark';

      tr.innerHTML = `
                <td><span class="badge bg-secondary">#${emp.id_employee}</span></td>
                <td class="fw-medium">${emp.name_employee}</td>
                <td>${emp.dni_employee}</td>
                <td>${emp.phone_employee}</td>
                <td>${emp.facility_address}</td>
                <td><span class="badge ${statusBadge}">${emp.employee_status_name}</span></td>
                <td class="text-center">
                    <div class="btn-group shadow-sm">
                        <!-- El botón Update redirige pasando el ID por la URL -->
                        <a href="employee-update.html?id=${emp.id_employee}" class="btn btn-sm btn-outline-primary" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${emp.id_employee}" title="Eliminar">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </td>
            `;
      tableBody.appendChild(tr);
    });
  };

  tableBody.addEventListener('click', async (e) => {
    const btnDelete = e.target.closest('.btn-delete');

    if (btnDelete) {
      const employeeId = btnDelete.getAttribute('data-id');

      if (
        confirm(
          `¿Estás seguro de que deseas eliminar permanentemente al empleado #${employeeId}?`,
        )
      ) {
        await deleteEmployee(employeeId);
      }
    }
  });

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error al borrar empleado:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Ocurrió un error al intentar eliminar el empleado.';
      alert(`Error: ${errorMessage}`);
    }
  };

  fetchEmployees();
});
