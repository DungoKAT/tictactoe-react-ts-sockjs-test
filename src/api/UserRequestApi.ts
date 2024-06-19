import HttpRequest from "./HttpRequest";

const getAllUsers = async () => {
    return await HttpRequest.get(`/user/all`);
};

const getUserById = async (params: string) => {
    return await HttpRequest.get(`/user/${params}`);
};

const registerUser = async (data: object) => {
    return await HttpRequest.post(`/user/register`, data);
};

const loginUser = async (data: object) => {
    return await HttpRequest.put(`/user/login`, data);
};

const logoutUser = async (data: object) => {
    return await HttpRequest.put(`/user/logout`, data);
};

const UserRequestApi = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    logoutUser,
};

export default UserRequestApi;
