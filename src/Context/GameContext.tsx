import * as React from "react";
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs";
import { createContext, useContext, useState, useEffect } from "react";
import GameRequestApi from "../api/GameRequestApi";
import { useLocalStorage } from "@uidotdev/usehooks";

interface Player {
    playerId?: string;
    playerName?: string;
    markType?: string;
}

interface Move {
    markType: string;
    position: number[];
}

interface Game {
    gameId?: string;
    playerX?: Player;
    playerO?: Player;
    turn?: string;
    gameBoard?: {
        board?: string[][];
        size?: number;
    };
    status?: string;
    winner?: string;
    gameHistory?: {
        allMoves?: Move[];
        startTime?: Date;
        endTime?: Date;
    };
}

interface CreateGame {
    usernameX?: string;
    size?: number;
}

interface ConnectGame {
    usernameO?: string;
    gameId?: string;
}

interface ConnectRandomGame {
    usernameO?: string;
}

interface GamePlay {
    gameId?: string;
    markType?: string;
    coordinateX?: number;
    coordinateY?: number;
}

interface Surrender {
    gameId?: string;
    playerSurrender?: string;
}

interface useGameContextType {
    isInGameRoom: boolean;
    allGames: Game[];
    currentGame?: Game;
    createGameRoom?: (createGame: CreateGame) => void;
    connectGameRoom?: (connect: ConnectGame) => void;
    connectRandomGameRoom?: (connectRandom: ConnectRandomGame) => void;
    playCurrentGame?: (gamePlay: GamePlay) => void;
    surrenderCurrentGame?: (gamePlay: GamePlay) => void;
    terminateCurrentGame?: (param: string) => void;
}

const UserContext = createContext<useGameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [currentGameIdLocal, setCurrentGameIdLocal] =
        useLocalStorage("currentGameId");
    const [currentGameLocal, setCurrentGameLocal] =
        useLocalStorage("currentGame");
    const {
        getAllGames,
        createGame,
        connectGame,
        connectRandomGame,
        playGame,
        surrenderGame,
        terminateGame,
    } = GameRequestApi;
    const [allGames, setAllGames] = useState([]);
    const [isInGameRoom, setIsInGameRoom] = useState(false);
    const [currentGame, setCurrentGame] = useState<Game>(() => {
        if (currentGameIdLocal !== undefined && currentGameIdLocal !== "") {
            const savedGame: string | null =
                typeof currentGameLocal === "string" ? currentGameLocal : null;
            return savedGame ? JSON.parse(savedGame) : null;
        } else {
            return "";
        }
    });

    useEffect(() => {
        if (currentGame) {
            setCurrentGameLocal(JSON.stringify(currentGame));
        } else {
            setCurrentGameLocal("");
        }
    }, [currentGame, setCurrentGameLocal]);

    useEffect(() => {
        const socket = new SockJS(
            "https://tictactoe-javasb-ws-api-test-56fc563f6ba3.herokuapp.com/game"
        );

        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket: ");
            if (currentGameIdLocal !== undefined) {
                client.subscribe("/topic/game-progress/", (message) => {
                    console.log("Message body: ", message.body);
                    const game = JSON.parse(message.body);
                    if (game.gameId === currentGameIdLocal) {
                        setCurrentGame(game);
                    }
                });
            }
            setStompClient(client);
        };

        client.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
        };

        client.activate();

        return () => {
            client && client.deactivate();
        };
    }, [currentGameIdLocal]);

    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const response = await getAllGames();
                setAllGames(response);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAllGames();
    }, [getAllGames]);

    useEffect(() => {
        if (currentGameIdLocal !== undefined && stompClient) {
            const foundGame = allGames.find(
                (game: Game) => game.gameId === currentGameIdLocal
            );
            console.log("Found Game: ", foundGame);
            stompClient.publish({
                destination: "/topic/game-progress/",
                body: JSON.stringify(foundGame),
            });
        }
    }, [allGames, currentGameIdLocal, stompClient]);

    const setCreateOrConnectGame = async (id: string) => {
        setCurrentGameIdLocal(id);
        setIsInGameRoom(true);
    };

    const createGameRoom = async (create: CreateGame) => {
        if (create) {
            try {
                const response = await createGame(create);
                setCreateOrConnectGame(response.gameId);
                console.log("Create game response:", response);
                alert("Create game Success");
                location.reload();
            } catch (err) {
                console.error("Create game failed: ", err);
            }
        }
    };

    const connectGameRoom = async (connect: ConnectGame) => {
        if (connect && stompClient) {
            try {
                const response = await connectGame(connect);
                setCreateOrConnectGame(response.gameId);
                stompClient.publish({
                    destination: "/topic/game-progress/",
                    body: JSON.stringify(response),
                });
                console.log("Connect game response:", response);
                alert("Connect game Success");
                location.reload();
            } catch (err) {
                console.error("Connect game failed: ", err);
            }
        }
    };

    const connectRandomGameRoom = async (connectRandom: ConnectRandomGame) => {
        if (connectRandom && stompClient) {
            try {
                const response = await connectRandomGame(connectRandom);
                setCreateOrConnectGame(response.gameId);
                console.log("Connect random game response:", response);
                alert("Connect random game Success");
                location.reload();
            } catch (err) {
                console.error("Connect random game failed: ", err);
                alert("Not have any rooms available now.");
            }
        }
    };

    const playCurrentGame = async (gamePlay: GamePlay) => {
        if (gamePlay && stompClient) {
            try {
                const response = await playGame(gamePlay);
                stompClient.publish({
                    destination: "/topic/game-progress/",
                    body: JSON.stringify(response),
                });
                console.log("Play game response:", response);
            } catch (err) {
                console.error("Play game failed: ", err);
            }
        }
    };

    const surrenderCurrentGame = async (surrender: Surrender) => {
        if (surrender && stompClient) {
            try {
                const response = await surrenderGame(surrender);
                console.log("Surrender response : ", response);
                stompClient.publish({
                    destination: "/topic/game-progress/",
                    body: JSON.stringify(response),
                });
            } catch (err) {
                console.error("Surrender game failed: ", err);
            }
        }
    };

    const terminateCurrentGame = async (param: string) => {
        if (param && stompClient) {
            try {
                const response = await terminateGame(param);
                console.log("Terminate response : ", response);
                stompClient.publish({
                    destination: "/topic/game-progress/",
                    body: JSON.stringify(response),
                });
            } catch (err) {
                console.error("Surrender game failed: ", err);
            }
        }
    };

    useEffect(() => {
        if (currentGameIdLocal !== undefined && currentGameIdLocal !== "") {
            setIsInGameRoom(true);
        } else {
            setIsInGameRoom(false);
        }
    }, [currentGameIdLocal]);

    return (
        <UserContext.Provider
            value={{
                isInGameRoom,
                createGameRoom,
                connectGameRoom,
                connectRandomGameRoom,
                playCurrentGame,
                allGames,
                currentGame,
                surrenderCurrentGame,
                terminateCurrentGame,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useGameContext must be used within an AuthProvider");
    }
    return context;
};
