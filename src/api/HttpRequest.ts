import axios, { AxiosRequestConfig } from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000,
});

axiosClient.interceptors.request.use(function (request) {
    console.log("axiosClient request=", request);
    return request;
});

axiosClient.interceptors.response.use(
    (response) => {
        console.log("axiosClient response=", response);
        return response;
    },
    (error) => {
        const res = error.response;
        console.error(
            `Looks like there was a problem. Status Code: ` + res.status
        );
        return Promise.reject(error);
    }
);

const get = async (path: string) => {
    const response = await axiosClient.get(path);
    return response.data;
};

const getWithParams = async (
    path: string,
    params: AxiosRequestConfig<string> | undefined
) => {
    const response = await axiosClient.get(path, params);
    return response.data;
};

const post = async (path: string, data: object) => {
    const response = await axiosClient.post(path, data);
    return response.data;
};

const put = async (path: string, data: object) => {
    const response = await axiosClient.put(path, data);
    return response.data;
};

const deleted = async (path: string) => {
    const response = await axiosClient.delete(path);
    return response.data;
};

const Request = { get, getWithParams, put, post, deleted };
export default Request;
