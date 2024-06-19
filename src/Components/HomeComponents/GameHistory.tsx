import { useLoaderData } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { BiCircle } from "react-icons/bi";

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
    const loaderGameHistory = useLoaderData() as Game;
    console.log("Loading Game History: ", loaderGameHistory.gameId);
    const gameBoard = loaderGameHistory.gameBoard;
    const gameHistory = loaderGameHistory.gameHistory;
    const allMoves = gameHistory.allMoves;

    return (
        <div className="w-full h-full flex">
            <div className="h-full flex flex-1 justify-center">
                <Board
                    board={gameBoard.board}
                    size={gameBoard.size}
                    allMoves={allMoves}
                />
            </div>
            <div className="max-w-[300px] w-full h-full p-5 flex flex-col bg-components-sidenav">
                <div className="mb-14">
                    <h1 className="mb-3 text-3xl font-semibold">Player X</h1>
                    <h1 className="mb-3 text-4xl font-semibold">
                        {loaderGameHistory.playerX.playerName}
                    </h1>
                </div>
                <div className="mb-12">
                    <h1 className="mb-3 text-3xl font-semibold">Player O</h1>
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
        </div>
    );
};

interface BoardInfo {
    board: string[][];
    size: number;
    allMoves: Move[];
}

const Board = ({ board, size, allMoves }: BoardInfo) => {
    const boardArray = new Array(size * size).fill(null);
    let counter1 = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            boardArray[counter1] = board[i][j];
            counter1++;
        }
    }
    let counter2 = 0;
    const moveArray = new Array(size * size).fill(null);
    for (let i = 0; i < size * size; i++) {
        moveArray[counter2] = allMoves[i];
        counter2++;
    }

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
                        boardMark={boardArray[index]}
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

const SquareButton = ({ boardMark, index }: SquareButtonType) => {
    console.log("Index: ", index);
    return (
        <div className=" p-2 flex justify-center items-center text-9xl text-components-nav bg-components-sidenav rounded-lg">
            {boardMark !== null &&
                (boardMark === "X" ? <RxCross1 /> : <BiCircle />)}
        </div>
    );
};

export default GameHistory;
