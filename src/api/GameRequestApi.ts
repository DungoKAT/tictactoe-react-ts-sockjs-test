import HttpRequest from "./HttpRequest";

const getAllGames = async () => {
    return await HttpRequest.get(`/game/all`);
};

const getGameById = async (params: string) => {
    return await HttpRequest.get(`/game/${params}`);
};

const createGame = async (data: object) => {
    return await HttpRequest.post(`/game/create`, data);
};

const connectGame = async (data: object) => {
    return await HttpRequest.put(`/game/connect`, data);
};

const connectRandomGame = async (data: object) => {
    return await HttpRequest.put(`/game/connect-random`, data);
};

const playGame = async (data: object) => {
    return await HttpRequest.put(`/game/play`, data);
};

const surrenderGame = async (data: object) => {
    return await HttpRequest.put(`/game/surrender`, data);
};

const terminateGame = async (params: string) => {
    return await HttpRequest.deleted(`/game/terminate/${params}`);
};

const GameRequestApi = {
    getAllGames,
    getGameById,
    createGame,
    connectGame,
    connectRandomGame,
    playGame,
    surrenderGame,
    terminateGame,
};

export default GameRequestApi;
