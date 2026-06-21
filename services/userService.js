import api from "./api.js"

export const registerUser = (userData) => {
    return api.post("/users/register", userData)
};


export const loginUser = (credetials) => {
    return api.post("/users/login",
        credetials);
};

const response = await api.get('/users/me');

console.log(response.data);