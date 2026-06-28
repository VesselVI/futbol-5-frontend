document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body-rentals');
  // Apuntamos al endpoint de reservas
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

  // Función para dar formato a la moneda (Ej: $ 15.000,00)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  // Función para formatear la fecha (de AAAA-MM-DD a DD/MM/AAAA)
  const formatDate = (dateString) => {
    // Cortamos el string en la 'T' si existe y rearmamos
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  // Función para formatear hora (de "18:00:00" a "18:00")
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

      // Creamos un string para la Cancha (Ej: Fútbol 5 - Av. Principal 123)
      const fieldInfo = `${rental.category_name} <br><small class="text-muted">${rental.facility_address}</small>`;

      // Creamos un string para el Horario (Ej: 18:00 a 19:00)
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
                <td class="fw-bold text-success">${formatCurrency(rental.rental_price)}</td>
                <td class="text-center">
                    <div class="btn-group shadow-sm">
                        <!-- El botón Editar redirige pasando el ID por la URL -->
                        <a href="editar-reserva.html?id=${rental.id_rental}" class="btn btn-sm btn-outline-primary" title="Editar">
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

  // Delegación de eventos para eliminar
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
});
