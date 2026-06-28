import api from "./api.js"

export const createRental = (data) => {
    return api.post("/rental", data);
};