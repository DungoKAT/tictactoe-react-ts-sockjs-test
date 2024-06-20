import { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import Loader from "../../Pages/Loader";
import { RxCross1 } from "react-icons/rx";
import { BiCircle } from "react-icons/bi";
import { MdOutlineReplay } from "react-icons/md";
import { IoMdSkipForward } from "react-icons/io";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

interface Player {
    playerId: string;
    playerName: string;
    markType: string;
}
interface Move {
    markType: string;
    position: number[];
}
interface Game {
    gameId: string;
    playerX: Player;
    playerO: Player;
    turn: string;
    gameBoard: {
        board: string[][];
        size: number;
    };
    status: string;
    winner: string;
    gameHistory: {
        allMoves: Move[];
        startTime: Date;
        endTime: Date;
    };
}

const GameHistory = () => {
    const location = useLocation();
    const loaderGameHistory = useLoaderData() as Game;
    const gameBoard = loaderGameHistory.gameBoard;
    const gameHistory = loaderGameHistory.gameHistory;
    const allMoves = gameHistory.allMoves;
    const [isReplay, setIsReplay] = useState(false);
    const [currentMove, setCurrentMove] = useState(0);
    const [boardArrayReplay, setBoardArrayReplay] = useState(
        new Array(gameBoard.size * gameBoard.size).fill(null)
    );
    const boardArrayEnd = new Array(gameBoard.size * gameBoard.size).fill(null);
    let counter1 = 0;
    for (let i = 0; i < gameBoard.size; i++) {
        for (let j = 0; j < gameBoard.size; j++) {
            boardArrayEnd[counter1] = gameBoard.board[i][j];
            counter1++;
        }
    }
    useEffect(() => {
        setBoardArrayReplay(
            new Array(gameBoard.size * gameBoard.size).fill(null)
        );
        setCurrentMove(0);
        setIsReplay(false);
    }, [gameBoard.size, location.pathname]);
    const handleReplay = () => {
        setBoardArrayReplay(
            new Array(gameBoard.size * gameBoard.size).fill(null)
        );
        setCurrentMove(0);
        setIsReplay(!isReplay);
    };
    const handleNextMove = () => {
        if (currentMove < allMoves.length) {
            const newBoard = [...boardArrayReplay];
            const markType = allMoves[currentMove].markType;
            const index =
                allMoves[currentMove].position[0] * gameBoard.size +
                allMoves[currentMove].position[1];
            newBoard[index] = markType;
            setBoardArrayReplay(newBoard);
            setCurrentMove(currentMove + 1);
        }
    };
    const handlePrevMove = () => {
        if (currentMove > 0) {
            const newBoard = [...boardArrayReplay];
            const index =
                allMoves[currentMove - 1].position[0] * gameBoard.size +
                allMoves[currentMove - 1].position[1];
            newBoard[index] = null;
            setBoardArrayReplay(newBoard);
            setCurrentMove(currentMove - 1);
        }
    };

    return (
        <div className="w-full h-full flex">
            {loaderGameHistory === undefined ? (
                <Loader />
            ) : (
                <>
                    <div className="h-full flex flex-1 flex-col items-center">
                        <Board
                            board={isReplay ? boardArrayReplay : boardArrayEnd}
                            size={gameBoard.size}
                            allMoves={allMoves}
                        />
                        <button
                            className="mt-10 py-3 px-5 flex items-center text-2xl bg-components-buttonHover rounded-lg transition-colors hover:bg-components-button"
                            onClick={handleReplay}
                        >
                            {isReplay ? (
                                <>
                                    Skip <IoMdSkipForward className="ml-2" />
                                </>
                            ) : (
                                <>
                                    Replay <MdOutlineReplay className="ml-2" />
                                </>
                            )}
                        </button>
                        {isReplay && (
                            <div className="mt-5 grid grid-cols-2 gap-5">
                                <button
                                    className={
                                        (currentMove === 0
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-components-buttonHover hover:bg-components-button") +
                                        " py-3 px-5 flex justify-center items-center text-2xl rounded-lg transition-colors"
                                    }
                                    onClick={handlePrevMove}
                                >
                                    <GrCaretPrevious className="mr-2" />{" "}
                                    Previous
                                </button>
                                <button
                                    className={
                                        (currentMove === allMoves.length
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-components-buttonHover hover:bg-components-button") +
                                        " py-3 px-5 flex justify-center items-center text-2xl rounded-lg transition-colors"
                                    }
                                    onClick={handleNextMove}
                                >
                                    Next <GrCaretNext className="ml-2" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="max-w-[300px] w-full h-full p-5 flex flex-col bg-components-sidenav">
                        <div className="mb-14">
                            <h1 className="mb-3 text-3xl font-semibold">
                                Player X
                            </h1>
                            <h1 className="mb-3 text-4xl font-semibold">
                                {loaderGameHistory.playerX.playerName}
                            </h1>
                        </div>
                        <div className="mb-12">
                            <h1 className="mb-3 text-3xl font-semibold">
                                Player O
                            </h1>
                            <h1 className="mb-3 text-4xl font-semibold">
                                {loaderGameHistory.playerO.playerName}
                            </h1>
                        </div>
                        <div className="mb-12">
                            <h1 className="mb-3 text-3xl font-semibold">
                                {loaderGameHistory.winner === "DRAW"
                                    ? "The game is"
                                    : "The winner is"}
                            </h1>
                            <h1 className="mb-3 text-4xl font-semibold">
                                {loaderGameHistory.winner === "DRAW"
                                    ? "Draw"
                                    : loaderGameHistory.playerX.markType ===
                                      loaderGameHistory.winner
                                    ? loaderGameHistory.playerX.playerName
                                    : loaderGameHistory.playerO.playerName}
                            </h1>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

interface BoardInfo {
    board: string[];
    size: number;
    allMoves: Move[];
}

const Board = ({ board, size }: BoardInfo) => {
    return (
        <div
            className={
                (size === 3
                    ? "grid-cols-3 grid-rows-3 gap-5"
                    : size === 5
                    ? "grid-cols-5 grid-rows-5 gap-4"
                    : size === 7 && "grid-cols-7 grid-rows-7 gap-3") +
                ` w-[620px] h-[620px] mt-20 p-5 grid bg-components-board rounded-xl`
            }
        >
            {Array(size * size)
                .fill(null)
                .map((_, index) => (
                    <SquareButton
                        key={index}
                        boardMark={board[index]}
                        index={index}
                    />
                ))}
        </div>
    );
};

interface SquareButtonType {
    boardMark: string;
    index: number;
}

const SquareButton = ({ boardMark }: SquareButtonType) => {
    return (
        <div className=" p-2 flex justify-center items-center text-9xl text-components-nav bg-components-sidenav rounded-lg">
            {boardMark !== null &&
                (boardMark === "X" ? <RxCross1 /> : <BiCircle />)}
        </div>
    );
};

export default GameHistory;
