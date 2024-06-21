import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { useGameContext } from "../Context/GameContext";
import Loader from "./Loader";
import { IoLogOut } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

const Home = () => {
    const location = useLocation();
    const { isLogin, logout, currentUser } = useUserContext();
    const { createGameRoom, connectGameRoom, connectRandomGameRoom } =
        useGameContext();
    const [size, setSize] = useState<number>(3);
    const [vsText, setVsText] = useState("VS Player");
    const [difficulty, setDifficulty] = useState("Easy");
    const [gameIdInput, setGameIdInput] = useState("");
    const [selectedGameHistory, setSelectedGameHistory] = useState("");

    type CreateGame = {
        usernameX: string;
        size: number;
    };

    type ConnectGame = {
        usernameO: string;
        gameId: string;
    };

    type ConnectRandomGame = {
        usernameO: string;
    };

    const handleCreatGameRoom = (): void => {
        const newGame: CreateGame = {
            usernameX: currentUser?.username || "",
            size: size,
        };
        if (
            newGame !== undefined &&
            newGame.usernameX !== undefined &&
            newGame.size !== undefined
        ) {
            createGameRoom?.(newGame);
        }
    };

    const handleJoinRoom = () => {
        const joinGame: ConnectGame = {
            usernameO: currentUser?.username || "",
            gameId: gameIdInput,
        };
        if (
            joinGame !== undefined &&
            joinGame.usernameO !== undefined &&
            joinGame.gameId !== undefined
        ) {
            connectGameRoom?.(joinGame);
        }
    };

    const handleJoinRandomRoom = () => {
        const joinRandomGame: ConnectRandomGame = {
            usernameO: currentUser?.username || "",
        };
        if (
            joinRandomGame !== undefined &&
            joinRandomGame.usernameO !== undefined
        ) {
            connectRandomGameRoom?.(joinRandomGame);
        }
    };

    return (
        <>
            {!isLogin ? (
                <Loader />
            ) : (
                <div className="w-full h-full flex">
                    <div className="p-5 max-w-[300px] w-full h-full flex flex-col bg-components-sidenav">
                        <Link
                            to="/"
                            className="mb-3 flex justify-between items-center transition-colors hover:text-gray-600"
                            onClick={() => setSelectedGameHistory("")}
                        >
                            <p className="text-2xl font-semibold">
                                {currentUser.username}
                            </p>
                            <button className="text-2xl">
                                <FaHome />
                            </button>
                        </Link>
                        <div className="w-full h-0.5 bg-black"></div>
                        <h3 className="mt-2 mb-2 text-lg font-bold">
                            Game History
                        </h3>
                        {currentUser.gameHistories?.length === 0 && (
                            <h3>No histories</h3>
                        )}
                        <div className="flex flex-col overflow-y-scroll no-scrollbar">
                            {currentUser?.gameHistories?.map((game, index) => {
                                return (
                                    <Link
                                        to={"/game-histories/" + game.gameId}
                                        className={
                                            (selectedGameHistory === game.gameId
                                                ? "bg-components-board "
                                                : "bg-transparent ") +
                                            " my-2 p-2 text-center border-2 border-components-board rounded-lg transition-colors hover:bg-components-board"
                                        }
                                        key={index}
                                        onClick={() => {
                                            game.gameId !== undefined &&
                                                setSelectedGameHistory(
                                                    game.gameId
                                                );
                                        }}
                                    >
                                        <p>
                                            {game.playerX?.playerName} VS{" "}
                                            {game.playerO?.playerName}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                        <button
                            className="mt-auto mb-0 flex items-center text-xl font-semibold transition-colors hover:text-gray-500"
                            onClick={() => logout(currentUser)}
                        >
                            <IoLogOut className="mr-3" />
                            Logout
                        </button>
                    </div>
                    {location.pathname === "/" ? (
                        <GameOptions
                            vsText={vsText}
                            size={size}
                            gameIdInput={gameIdInput}
                            difficulty={difficulty}
                            setVsText={setVsText}
                            setSize={setSize}
                            setGameIdInput={setGameIdInput}
                            setDifficulty={setDifficulty}
                            handleCreatGameRoom={handleCreatGameRoom}
                            handleJoinRoom={handleJoinRoom}
                            handleJoinRandomRoom={handleJoinRandomRoom}
                        />
                    ) : (
                        location.pathname.includes("/game-histories") && (
                            <Outlet />
                        )
                    )}
                </div>
            )}
        </>
    );
};

interface GameOptions {
    vsText: string;
    size: number;
    gameIdInput: string;
    difficulty: string;
    setVsText: (vsText: string) => void;
    setSize: (size: number) => void;
    setGameIdInput: (gameIdInput: string) => void;
    setDifficulty: (difficulty: string) => void;
    handleCreatGameRoom: () => void;
    handleJoinRoom: () => void;
    handleJoinRandomRoom: () => void;
}

const GameOptions = ({
    vsText,
    size,
    gameIdInput,
    setVsText,
    setSize,
    setGameIdInput,
    handleCreatGameRoom,
    handleJoinRoom,
    handleJoinRandomRoom,
}: GameOptions) => {
    return (
        <div className="w-full flex flex-col">
            <div className="mt-40 px-20 w-full flex flex-col items-center">
                <p className="mb-20 text-2xl text-white">
                    The game has 3 options - the standard tic-tac-toe(3×3), 5×5
                    and 7×7, where you have to place 4 consecutive X or O to
                    win.
                </p>
                <div className="max-w-[350px] p-5 flex flex-col items-center bg-white rounded-lg">
                    <div className="mb-5 pb-2 grid grid-cols-2">
                        <button
                            className={
                                (vsText === "VS Player"
                                    ? "bg-gray-300"
                                    : "bg-white") +
                                " py-1 px-5 font-semibold border border-gray-300 rounded-l-full transition-colors hover:bg-gray-400"
                            }
                            onClick={() => setVsText("VS Player")}
                        >
                            VS Player
                        </button>
                        <button
                            className={
                                (vsText === "VS Bot"
                                    ? "bg-gray-300"
                                    : "bg-white") +
                                " py-1 px-5 font-semibold border border-gray-300 rounded-r-full transition-colors hover:bg-gray-400"
                            }
                            onClick={() => setVsText("VS Bot")}
                        >
                            VS Bot
                        </button>
                    </div>
                    <h2 className="mb-5 text-xl font-bold">{vsText}</h2>
                    <SetSizeButton thisSize={3} size={size} setSize={setSize} />
                    <SetSizeButton thisSize={5} size={size} setSize={setSize} />
                    <SetSizeButton thisSize={7} size={size} setSize={setSize} />
                    {vsText === "VS Player" ? (
                        <>
                            <div className="w-full mt-3 mb-3 grid grid-cols-4 gap-3">
                                <input
                                    className="col-span-3 px-2 border-2 border-gray-500 rounded-lg"
                                    type="text"
                                    value={gameIdInput}
                                    onChange={(e) =>
                                        setGameIdInput(e.target.value)
                                    }
                                />
                                <button
                                    className="col-start-4 col-span-1 mt-auto mb-0 py-2 px-5 text-white bg-components-nav rounded-lg transition-colors hover:bg-gray-700"
                                    onClick={handleJoinRoom}
                                >
                                    Join
                                </button>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-3">
                                <button
                                    className="mt-auto mb-0 py-2 px-5 text-white bg-components-nav rounded-lg transition-colors hover:bg-gray-700"
                                    onClick={handleCreatGameRoom}
                                >
                                    Create Room
                                </button>
                                <button
                                    className="mt-auto mb-0 py-2 px-5 text-white bg-components-nav rounded-lg transition-colors hover:bg-gray-700"
                                    onClick={handleJoinRandomRoom}
                                >
                                    Join Random
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mt-auto mb-0 py-2 px-5 text-black">
                                Not available now
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

interface SizePropType {
    thisSize: number;
    size: number;
    setSize: (size: number) => void;
}

const SetSizeButton = ({ thisSize, size, setSize }: SizePropType) => {
    return (
        <button
            className={
                (size === thisSize
                    ? "border-components-nav"
                    : "border-transparent") +
                " w-full mb-3 py-2 px-5 font-semibold bg-components-buttonHover border-4 rounded-md transition-colors hover:bg-components-button"
            }
            onClick={() => setSize(thisSize)}
        >
            {thisSize} × {thisSize}
        </button>
    );
};

export default Home;
