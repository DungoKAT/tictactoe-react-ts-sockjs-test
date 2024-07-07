import Board from "./Board";
import { FaFlag } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { useLocation } from "react-router-dom";

interface GamePlayPropsType {
    userId?: string;
    gameId?: string;
    playerXId?: string;
    playerOId?: string;
    playerXName: string;
    playerOName: string;
    boardArray: string[];
    boardSize: number;
    currentTurn: string;
    playerMark: string;
    winner?: string;
    isGameNew: boolean;
    isGameInProgress: boolean;
    isGameFinished: boolean;
    handlePlayGame?: (index: number) => void;
    handleSurrender?: (gameId: string, playerSurrender: string) => void;
    handleTerminate?: (gameId: string) => void;
    handlePlayGameBot?: (index: number) => void;
    handleLeaveGameBot?: () => void;
}
const GamePlay = ({
    userId,
    gameId,
    playerXId,
    playerOId,
    playerXName,
    playerOName,
    boardArray,
    boardSize,
    currentTurn,
    playerMark,
    winner,
    isGameNew,
    isGameInProgress,
    isGameFinished,
    handlePlayGame,
    handleSurrender,
    handleTerminate,
    handlePlayGameBot,
    handleLeaveGameBot,
}: GamePlayPropsType) => {
    const location = useLocation();
    const isGameWithBot = location.pathname === "/game-bot";
    console.log("Game play Component");
    return (
        <div
            className="w-full h-full grid grid-cols-12 gap-5 flex-col  text-center overflow-y-auto 
    max-desktop1280:px-10 max-desktop1280:pb-10 max-desktop1280:flex "
        >
            <div
                className="col-start-2 col-span-2 my-14 py-10 px-5 flex flex-col items-center bg-components-sidenav rounded-lg order-1 
        max-desktop1920:col-start-1 max-desktop1920:col-span-3 max-desktop1920:mx-10
        max-desktop1280:my-0 max-desktop1280:mx-0 max-desktop1280:px-10 max-desktop1280:flex-row max-desktop1280:justify-between max-desktop1280:order-2
        max-tablet767:flex-col"
            >
                <h1 className="text-4xl font-semibold text-black">
                    Player X :
                </h1>
                <h1 className="mt-10 text-4xl font-semibold text-black max-desktop1280:mt-0 max-tablet767:my-10">
                    {playerXName}
                </h1>
                {isGameNew ? (
                    <button
                        className="mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                        onClick={() => {
                            isGameWithBot
                                ? handleLeaveGameBot?.()
                                : gameId !== undefined &&
                                  handleTerminate?.(gameId);
                        }}
                    >
                        Leave room
                        <IoExit className="ml-2" />
                    </button>
                ) : (
                    <button
                        className={
                            (playerXId === userId
                                ? "opacity-100 pointer-events-auto"
                                : "opacity-0 pointer-events-none") +
                            " mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                        }
                        onClick={() =>
                            gameId !== undefined &&
                            handleSurrender?.(gameId, "X")
                        }
                    >
                        Surrender
                        <FaFlag className="ml-2" />
                    </button>
                )}
            </div>
            <div className="col-start-5 col-span-4 py-14 flex flex-col items-center order-2 max-desktop1280:order-1">
                <h1 className="text-4xl font-semibold text-white">
                    {isGameFinished
                        ? "Game Over!"
                        : !isGameInProgress && !isGameWithBot
                        ? "Waiting for Player O ..."
                        : "Turn " + currentTurn}
                </h1>
                {!isGameWithBot ? (
                    <button
                        className={
                            (isGameInProgress
                                ? "opacity-0 pointer-events-none"
                                : "opacity-1 pointer-events-auto") +
                            " mt-10 py-2 px-3 flex items-center text-white bg-components-nav rounded-lg transition-colors hover:bg-gray-600"
                        }
                        onClick={() => {
                            gameId !== undefined &&
                                navigator.clipboard.writeText(gameId);
                        }}
                    >
                        Copy Game ID <FaCopy className="ml-2" />
                    </button>
                ) : (
                    <h1
                        className={
                            (isGameFinished ? "opacity-100" : "opacity-0") +
                            " mt-10 text-4xl font-semibold text-white"
                        }
                    >
                        {winner === "DRAW"
                            ? "The game is DRAW!"
                            : "The winner is " + winner}
                    </h1>
                )}
                <Board
                    board={boardArray}
                    size={boardSize}
                    turn={currentTurn}
                    player={playerMark}
                    isGameInProgress={isGameInProgress}
                    handlePlayGame={
                        !isGameWithBot ? handlePlayGame : handlePlayGameBot
                    }
                />
            </div>
            <div
                className="col-start-10 col-span-2 my-14 py-10 px-5 flex flex-col items-center bg-components-sidenav rounded-lg order-3
        max-desktop1920:col-start-10 max-desktop1920:col-span-3 max-desktop1920:mx-10
        max-desktop1280:my-0 max-desktop1280:mx-0 max-desktop1280:px-10 max-desktop1280:flex-row max-desktop1280:justify-between
        max-tablet767:flex-col"
            >
                <h1 className="text-4xl font-semibold text-black">
                    Player O :
                </h1>
                <h1 className="mt-10 text-4xl font-semibold text-black max-desktop1280:mt-0 max-tablet767:my-10">
                    {playerOName}
                </h1>
                <button
                    className={
                        (playerOId === userId && !isGameWithBot
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none") +
                        " mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                    }
                    onClick={() =>
                        gameId !== undefined && handleSurrender?.(gameId, "O")
                    }
                >
                    Surrender
                    <FaFlag className="ml-2" />
                </button>
            </div>
        </div>
    );
};

export default GamePlay;
