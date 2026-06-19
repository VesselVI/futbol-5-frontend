import api from "./api.js"

export const createUser = (userData) => {
    return api.post("/users", userData)
};