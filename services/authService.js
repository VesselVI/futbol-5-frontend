import api from "./api.js"

export const createRental = (data) => {
    return api.post("/rental", data);
};

export const verifyAuth = () => {
    return api.get("/users/verify");
};

export async function isAuthenticated() {
    try {
        const response = await verifyAuth();
        return response.data.authenticated === true;
    } catch (error) {
        return false;
    }
}

export const getRentalByUserId = () => {
    return api.get("/rental/rentals");
};

export const deleteRental = (id) => {
    return api.delete(`/rental/${id}`);
};

export const logout = () => {
    return api.post("/users/logout");
}