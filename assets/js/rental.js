document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body-rentals');
  const btnLogout = document.getElementById('btn-logout');
  const API_URL = `http://127.0.0.1:8000/api/rental`;

  const fetchRentals = async () => {
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      const rentals = response.data;
      renderTable(rentals);
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger py-4">
                        <i class="bi bi-exclamation-triangle"></i> Error al cargar las reservas. Verifica tu conexión.
                    </td>
                </tr>
            `;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const totalHours = (rental_start, rental_end) => {
    if (!rental_start || !rental_end) return 0;

    const [startHour, startMin] = rental_start.split(':').map(Number);
    const [endHour, endMin] = rental_end.split(':').map(Number);
    const startDecimal = startHour + startMin / 60;
    let endDecimal = endHour + endMin / 60;

    if (endDecimal < startDecimal) {
      endDecimal += 24;
    }

    return endDecimal - startDecimal;
  };

  const formatDate = (dateString) => {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const renderTable = (rentals) => {
    tableBody.innerHTML = '';

    if (rentals.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No hay reservas registradas.</td></tr>`;
      return;
    }

    rentals.forEach((rental) => {
      const tr = document.createElement('tr');
      const fieldInfo = `${rental.category_name} <br><small class="text-muted">${rental.facility_address}</small>`;
      const schedule = `${formatTime(rental.rental_start)} - ${formatTime(rental.rental_end)}`;
      tr.innerHTML = `
                <td><span class="badge bg-secondary">#${rental.id_rental}</span></td>
                <td class="fw-medium">${formatDate(rental.rental_date)}</td>
                <td><span class="badge bg-light text-dark border">${schedule}</span></td>
                <td>${fieldInfo}</td>
                <td>
                    ${rental.user_name} <br>
                    <small class="text-muted"><i class="bi bi-telephone-fill"></i> ${rental.user_phone}</small>
                </td>
                <td class="fw-bold text-success">${formatCurrency(totalHours(rental.rental_start, rental.rental_end) * rental.rental_price)}</td>
                <td class="text-center">
                    <div class="btn-group shadow-sm">
                        <a href="rental-update.html?id=${rental.id_rental}" class="btn btn-sm btn-outline-primary" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${rental.id_rental}" title="Eliminar">
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
      const rentalId = btnDelete.getAttribute('data-id');

      if (
        confirm(
          `¿Estás seguro de que deseas cancelar la reserva #${rentalId}? Esta acción no se puede deshacer.`,
        )
      ) {
        await deleteRental(rentalId);
      }
    }
  });

  const deleteRental = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      fetchRentals();
    } catch (error) {
      console.error('Error al borrar reserva:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Ocurrió un error al intentar eliminar la reserva.';
      alert(`Error: ${errorMessage}`);
    }
  };

  fetchRentals();

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
