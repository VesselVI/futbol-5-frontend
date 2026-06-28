const API_FIELDS = "http://127.0.0.1:8000/api/fields";
const API_FACILITIES = "http://127.0.0.1:8000/api/facilities";
const API_CATEGORIES = "http://127.0.0.1:8000/api/fieldCategories";
const API_STATUSES = "http://127.0.0.1:8000/api/fieldStatuses";
const fieldForm = document.getElementById("fieldForm");
const facilitySelect = document.getElementById("facilitySelect");
const categorySelect = document.getElementById("categorySelect");
const statusSelect = document.getElementById("statusSelect");
const hourlyPrice = document.getElementById("hourlyPrice");
const tableFields = document.getElementById("tableFields");
let editingField = null;
let fields = [];
async function loadFacilities() {
    try {
        const response = await fetch(API_FACILITIES, {
            credentials: "include"
        });
        const facilities = await response.json();
        facilitySelect.innerHTML =
            `<option value="">Seleccione una sede</option>`;
        facilities.forEach(facility => {
            facilitySelect.innerHTML +=
                `<option value="${facility.id}">
                ${facility.address}
            </option>`;
        });
    }
    catch (error) {
        console.error(error);
    }
}
async function loadCategories() {
    try {
        const response = await fetch(API_CATEGORIES, {
            credentials: "include"
        });
        const categories = await response.json();
        categorySelect.innerHTML =
            `<option value="">Seleccione una categoría</option>`;
        categories.forEach(category => {
            categorySelect.innerHTML +=
                `<option value="${category.id}">
                ${category.category_name}
            </option>`;
        });
    }
    catch (error) {
        console.error(error);
    }
}
async function loadStatuses() {
    try {
        const response = await fetch(API_STATUSES, {
            credentials: "include"
        });
        const statuses = await response.json();
        statusSelect.innerHTML =
            `<option value="">Seleccione un estado</option>`;
        statuses.forEach(status => {
            statusSelect.innerHTML +=
                `<option value="${status.id}">
                ${status.field_status_name}
            </option>`;
        });
    }
    catch (error) {
        console.error(error);
    }
}
async function loadFields() {
    try {
        const response = await fetch(API_FIELDS, {
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Error al cargar las canchas");
        }
        fields = await response.json();
        tableFields.innerHTML = "";
fields.forEach(field => {
    tableFields.innerHTML += `
        <tr>

            <td>${field.id_field}</td>
            <td>${field.facility_address}</td>
            <td>${field.category_name}</td>
            <td>${field.field_capacity}</td>
            <td>${field.field_status_name}</td>
            <td>$${field.hourly_price}</td>
            <td>
                <button
                    class="btn btn-warning btn-sm"
                    onclick="editField(${field.id_field})">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteField(${field.id_field})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
}); 
    }
    catch (error) {
        console.error(error);
    }
}
fieldForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
        id_facility: facilitySelect.value,
        id_field_status: statusSelect.value,
        id_field_category: categorySelect.value,
        hourly_price: hourlyPrice.value
    };
    try {
        let response;
        if (editingField === null) {
            response = await fetch(API_FIELDS, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        }
        else {
            response = await fetch(`${API_FIELDS}/${editingField}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        }
        const data = await response.json();
        alert(data.message);
        clearForm();
        loadFields();
    }
    catch (error) {
        console.error(error);
    }
});
function editField(id) {
    const field = fields.find(f => f.id_field == id);
    if (!field) return;
    editingField = id;
    facilitySelect.value = field.id_facility;
    categorySelect.value = field.id_field_category;
    statusSelect.value = field.id_field_status;
    hourlyPrice.value = field.hourly_price;
    document.querySelector("#fieldForm button[type='submit']").innerHTML = `
    <i class="bi bi-check-circle"></i>
    Actualizar Cancha`;
}
function clearForm() {
    editingField = null;
    fieldForm.reset();
    document.querySelector("#fieldForm button[type='submit']").innerHTML = `
    <i class="bi bi-save"></i>
    Guardar Cancha`;
}
async function deleteField(id) {
    if (!confirm("¿Desea eliminar esta cancha?")) return;
    try {
        const response = await fetch(`${API_FIELDS}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await response.json();
        alert(data.message);
        loadFields();
    }
    catch (error) {
        console.error(error);
    }
}
loadFacilities();
loadCategories();
loadStatuses();
loadFields();