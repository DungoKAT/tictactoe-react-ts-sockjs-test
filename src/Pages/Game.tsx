import { useUserContext } from "../Context/UserContext";
import { useGameContext } from "../Context/GameContext";
import { useLocalStorage } from "@uidotdev/usehooks";
import Loader from "./Loader";
import { FaFlag } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { BiCircle } from "react-icons/bi";
import { FaCopy } from "react-icons/fa";

const Game = () => {
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
    const { isLogin, currentUser } = useUserContext();
    const {
        currentGame,
        playCurrentGame,
        surrenderCurrentGame,
        terminateCurrentGame,
    } = useGameContext();
    const [currentGameIdLocal, setCurrentGameIdLocal] =
        useLocalStorage("currentGameId");
    const [currentGameLocal] = useLocalStorage("currentGame");

    const handlePlayGame = (index: number) => {
        const size = currentGame?.gameBoard?.size;
        let positionX;
        let positionY;
        if (size !== undefined) {
            positionX = Math.floor(index / size);
            positionY = index % size;
        }
        const newMove: GamePlay = {
            gameId: currentGame?.gameId,
            markType: currentGame?.turn,
            coordinateX: positionX,
            coordinateY: positionY,
        };
        playCurrentGame?.(newMove);
    };

    const handleSurrender = (gameId: string, playerSurrender: string) => {
        const surrender: Surrender = { gameId, playerSurrender };
        surrenderCurrentGame?.(surrender);
    };

    const handleTerminate = (gameId: string) => {
        if (currentGame?.gameId !== undefined) {
            terminateCurrentGame?.(gameId);
            handleBackToHome();
        }
    };

    const handleBackToHome = () => {
        if (currentGameIdLocal !== "" && currentGameIdLocal !== undefined) {
            setCurrentGameIdLocal("");
            location.reload();
        }
    };
    const player =
        currentGame?.playerX?.playerId === currentUser?.userId ? "X" : "O";
    const isGameNew = currentGame?.status === "NEW";
    const isGameInProgress = currentGame?.status === "IN_PROGRESS";
    const isGameFinised = currentGame?.status === "FINISHED";

    return (
        <>
            {isGameFinised && currentGame?.winner !== undefined && (
                <GameEndModal
                    winner={currentGame?.winner}
                    handleBackToHome={handleBackToHome}
                />
            )}
            {isLogin &&
            (currentGameLocal === undefined || currentGameLocal === "") ? (
                <Loader />
            ) : (
                <div className="w-full h-full grid grid-cols-12 gap-5">
                    <div className="col-start-2 col-span-2 py-14 flex flex-col items-center">
                        <h1 className="text-4xl font-semibold text-white">
                            Player X
                        </h1>
                        <h1 className="mt-10 text-4xl font-semibold text-white">
                            {currentGame?.playerX?.playerName}
                        </h1>
                        {isGameNew ? (
                            <button
                                className="mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                                onClick={() => {
                                    currentGame?.gameId !== undefined &&
                                        handleTerminate(currentGame?.gameId);
                                }}
                            >
                                Leave room
                                <FaFlag className="ml-2" />
                            </button>
                        ) : (
                            currentGame?.playerX?.playerId ===
                                currentUser?.userId && (
                                <button
                                    className="mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                                    onClick={() =>
                                        currentGame?.gameId !== undefined &&
                                        handleSurrender(
                                            currentGame?.gameId,
                                            "X"
                                        )
                                    }
                                >
                                    Surrender
                                    <FaFlag className="ml-2" />
                                </button>
                            )
                        )}
                    </div>
                    <div className="col-start-5 col-span-4 py-14 flex flex-col items-center">
                        <h1 className="text-4xl font-semibold text-white">
                            {isGameFinised
                                ? "Game Over!"
                                : !isGameInProgress
                                ? "Waiting for Player O ..."
                                : "Turn " + currentGame?.turn}
                        </h1>
                        <button
                            className={
                                (isGameInProgress
                                    ? "opacity-0 pointer-events-none"
                                    : "opacity-1 pointer-events-auto") +
                                " mt-10 py-2 px-3 flex items-center text-white bg-components-nav rounded-lg transition-colors hover:bg-gray-600"
                            }
                            onClick={() => {
                                currentGame?.gameId !== undefined &&
                                    navigator.clipboard.writeText(
                                        currentGame?.gameId
                                    );
                            }}
                        >
                            Copy Game ID <FaCopy className="ml-2" />
                        </button>
                        {currentGame?.gameBoard?.board !== undefined &&
                            currentGame?.gameBoard?.size !== undefined &&
                            currentGame?.turn !== undefined && (
                                <Board
                                    board={currentGame?.gameBoard?.board}
                                    size={currentGame?.gameBoard?.size}
                                    turn={currentGame?.turn}
                                    player={player}
                                    isGameInProgress={isGameInProgress}
                                    handlePlayGame={handlePlayGame}
                                />
                            )}
                    </div>
                    <div className="col-start-10 col-span-2 py-14 flex flex-col items-center">
                        <h1 className="text-4xl font-semibold text-white">
                            Player O
                        </h1>
                        <h1 className="mt-10 text-4xl font-semibold text-white">
                            {currentGame?.playerO?.playerName}
                        </h1>
                        {currentGame?.playerO?.playerId ===
                            currentUser?.userId && (
                            <button
                                className="mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                                onClick={() =>
                                    currentGame?.gameId !== undefined &&
                                    handleSurrender(currentGame?.gameId, "O")
                                }
                            >
                                Surrender
                                <FaFlag className="ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

interface BoardInfo {
    board: string[][];
    size: number;
    turn: string;
    player: string;
    isGameInProgress: boolean;
    handlePlayGame: (index: number) => void;
}

const Board = ({
    board,
    size,
    turn,
    player,
    isGameInProgress,
    handlePlayGame,
}: BoardInfo) => {
    const boardArray = new Array(size * size).fill(null);
    let counterIndex = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            boardArray[counterIndex] = board[i][j];
            counterIndex++;
        }
    }
    return (
        <div
            className={
                (size === 3
                    ? "grid-cols-3 grid-rows-3 gap-5"
                    : size === 5
                    ? "grid-cols-5 grid-rows-5 gap-4"
                    : size === 7 && "grid-cols-7 grid-rows-7 gap-3") +
                ` w-[620px] h-[620px] mt-10 p-5 grid bg-components-board rounded-xl`
            }
        >
            {Array(size * size)
                .fill(null)
                .map((_, index) => (
                    <SquareButton
                        key={index}
                        boardMark={boardArray[index]}
                        turn={turn}
                        player={player}
                        isGameInProgress={isGameInProgress}
                        onClick={() => {
                            handlePlayGame(index);
                        }}
                    />
                ))}
        </div>
    );
};

interface SquareButtonInfo {
    boardMark: string;
    turn: string;
    player: string;
    isGameInProgress: boolean;
    onClick: () => void;
}

const SquareButton = ({
    boardMark,
    turn,
    player,
    isGameInProgress,
    onClick,
}: SquareButtonInfo) => {
    const checkBoardMarkIsNull: boolean = boardMark === null;
    const checkIsPlayerTurn: boolean = turn === player;
    const isDisabled =
        !checkBoardMarkIsNull || !checkIsPlayerTurn || !isGameInProgress;
    return (
        <button
            className={
                (isDisabled ? "cursor-not-allowed" : "cursor-pointer") +
                " p-2 flex justify-center items-center text-9xl text-components-nav bg-components-sidenav rounded-lg transition-colors hover:bg-gray-400"
            }
            onClick={onClick}
            disabled={isDisabled}
        >
            {!checkBoardMarkIsNull &&
                (boardMark === "X" ? <RxCross1 /> : <BiCircle />)}
        </button>
    );
};

interface GameEndModalProps {
    winner: string;
    handleBackToHome: () => void;
}

const GameEndModal = ({ winner, handleBackToHome }: GameEndModalProps) => {
    return (
        <div className="fixed w-screen h-screen flex z-10">
            <div className="absolute w-full h-full backdrop-blur-sm opacity-30 bg-black"></div>
            <div className="w-[400px] h-[300px] p-10 my-auto mx-auto flex flex-col justify-between items-center bg-white rounded-3xl z-10">
                <h1 className="text-4xl font-semibold">
                    The {winner === "DRAW" ? "game" : "winner"} is
                </h1>
                <h1 className=" text-6xl font-semibold">{winner}</h1>
                <button
                    className="py-2 px-5 text-white bg-components-nav rounded-lg transition-colors hover:bg-components-background"
                    onClick={handleBackToHome}
                >
                    Back to home
                </button>
            </div>
        </div>
    );
};

export default Game;
