document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body-users');
  const API_URL = 'http://127.0.0.1:8000/api/users';

  const getUsers = async () => {
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });
      const users = response.data;
      renderTable(users);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> Error al cargar los usuarios. Verifica la conexión al servidor.
                    </td>
                </tr>
            `;
    }
  };

  const renderTable = (users) => {
    tableBody.innerHTML = '';

    if (users.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No hay usuarios registrados.</td></tr>`;
      return;
    }

    users.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
                <td><span class="badge bg-secondary">#${user.id}</span></td>
                <td class="fw-medium">${user.user_name || 'Sin especificar'}</td>
                <td>${user.user_email}</td>
                <td>${user.user_dni || '-'}</td>
                <td>${user.user_phone || '-'}</td>
                <td class="text-center">
                    <div class="btn-group shadow-sm">
                        <a href="user-update.html?id=${user.id}" class="btn btn-sm btn-outline-primary" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        ${
                          user.id_rol === 1
                            ? `<button type="button" class="btn btn-sm btn-outline-secondary" disabled title="No se puede eliminar al Administrador Principal">
                                <i class="bi bi-lock-fill"></i>
                             </button>`
                            : `<button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${user.id}" title="Eliminar">
                                <i class="bi bi-trash3"></i>
                             </button>`
                        }
                    </div>
                </td>
            `;
      tableBody.appendChild(tr);
    });
  };

  tableBody.addEventListener('click', async (e) => {
    const btnDelete = e.target.closest('.btn-delete');

    if (btnDelete) {
      const userId = btnDelete.getAttribute('data-id');

      if (
        confirm(
          `¿Estás seguro de que deseas eliminar permanentemente al usuario #${userId}?`,
        )
      ) {
        await deleteUser(userId);
      }
    }
  });

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });

      getUsers();
    } catch (error) {
      console.error('Error al borrar usuario:', error);

      const errorMessage =
        error.response?.data?.message ||
        'Ocurrió un error al intentar eliminar el usuario.';
      alert(`Error: ${errorMessage}`);
    }
  };

  getUsers();
});
