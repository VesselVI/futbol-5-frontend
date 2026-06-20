import api from "./api.js"

export const createUser = (userData) => {
    return api.post("/users", userData)
};


export const loginUser = (credetials) => {
    return api.post("/login",
        credetials);
};