const API_URL = "http://127.0.0.1:8000/api/facilities";
const tableHeadquarters = document.getElementById("tableHeadquarters");
const btnNewHeadquarters = document.getElementById("btnNewHeadquarters");
async function loadHeadquarters() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            throw new Error("Error al cargar las sedes");
        }
        const headquarters = await response.json();
        tableHeadquarters.innerHTML = "";
        headquarters.forEach((headquarter) => {
            tableHeadquarters.innerHTML += `
                <tr>
                    <td>${headquarter.id}</td>
                    <td>Sede ${headquarter.id}</td>
                    <td>${headquarter.address}</td>
                    <td>
                        <button class="btn btn-warning btn-sm"
                            onclick="btnEditHeadquarters(${headquarter.id}, '${headquarter.address}')">
                            <i class="bi bi-pencil-square"></i>
                            Editar
                        </button>
                       <button
                             class="btn btn-danger btn-sm"
                              onclick="btnDeleteHeadquarters(${headquarter.id})">
                              <i class="bi bi-trash"></i>
                              Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
    }
}
btnNewHeadquarters.addEventListener("click", async () => {
    const address = prompt("Ingrese la dirección de la nueva sede:");
    if (!address) return;
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              address: address
            })
        });
        const data = await response.json();
        alert(data.message);
        loadHeadquarters();
    } catch (error) {
        console.error(error);
    }
});
async function btnEditHeadquarters(id, address) {
    const newAddress = prompt(
        "Ingrese la nueva dirección:",
        address
    );
    if (!newAddress) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                address: newAddress
            })
        });
        const data = await response.json();
        alert(data.message);
        loadHeadquarters();
    } catch (error) {
        console.error(error);
    }
}
async function btnDeleteHeadquarters(id) {
    const confirmDelete = confirm("¿Está seguro de que desea eliminar esta sede?");
    if (!confirmDelete) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await response.json();
        alert(data.message);
        loadHeadquarters();
    } catch (error) {
        console.error(error);
    }
}
loadHeadquarters();