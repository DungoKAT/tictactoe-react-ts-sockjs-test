import { useLocalStorage } from "@uidotdev/usehooks";
import GamePlay from "../GamePlay";

interface GameWithBotPropsType {
    playerXName: string;
    playerOName: string;
    boardArray: string[];
    boardSize: number;
    currentTurn: string;
    playerMark: string;
    winner: string;
    isGameNew: boolean;
    isGameInProgress: boolean;
    isGameFinished: boolean;
}
const GameWithBot = () => {
    const [gameWithBotLocal, setGameWithBotLocal] =
        useLocalStorage<GameWithBotPropsType>("gameWithBot");
    const boardSize = gameWithBotLocal.boardSize;
    const boardArray = gameWithBotLocal.boardArray;

    const newMoveBoard = (
        board: string[],
        index: number,
        playerMark: string
    ) => {
        const newBoardArray = board.slice();
        newBoardArray[index] = playerMark;
        return newBoardArray;
    };

    const checkDraw = (board: string[]) => {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                return false;
            }
        }
        return true;
    };

    const checkWinner = (board: string[], size: number): string | null => {
        const conditionLength = size === 3 ? 3 : 4;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - conditionLength; j++) {
                console.log("J: ", j);
                const rowStart = i * size + j;
                const row = board.slice(rowStart, rowStart + conditionLength);
                if (row.every((cell) => cell === "O")) return "O";
                if (row.every((cell) => cell === "X")) return "X";
            }
        }
        for (let i = 0; i < size; i++) {
            for (let j = 0; j <= size - conditionLength; j++) {
                const col = [];
                for (let j = 0; j < conditionLength; j++) {
                    col.push(board[i + j * size]);
                }
                console.log("Col: ", col);
                if (col.every((cell) => cell === "X")) return "X";
                if (col.every((cell) => cell === "O")) return "O";
            }
        }
        for (let i = 0; i <= size - conditionLength; i++) {
            for (let j = 0; j <= size - conditionLength; j++) {
                const diag1 = [];
                const diag2 = [];
                for (let k = 0; k < conditionLength; k++) {
                    diag1.push(board[(i + k) * size + (j + k)]);
                    diag2.push(
                        board[(i + k) * size + (j + conditionLength - 1 - k)]
                    );
                }
                if (diag1.every((cell) => cell === "X")) return "X";
                if (diag1.every((cell) => cell === "O")) return "O";
                if (diag2.every((cell) => cell === "X")) return "X";
                if (diag2.every((cell) => cell === "O")) return "O";
            }
        }

        return null;
    };

    const botMove = (board: string[]) => {
        const emptyCells = board
            .map((cell, index) => (cell === null ? index : -1))
            .filter((index) => index !== -1);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    };

    const updateMoveLocal = (board: string[], turn: string) => {
        setGameWithBotLocal((prev) => ({
            ...prev,
            boardArray: board,
            currentTurn: turn,
        }));
    };

    const updateEndGameLocal = (board: string[], winner: string) => {
        setGameWithBotLocal((prev) => ({
            ...prev,
            boardArray: board,
            isGameInProgress: false,
            isGameFinished: true,
            winner: winner,
        }));
    };

    const handlePlayGameBot = (index: number) => {
        const newBoardWithPlayerMove = newMoveBoard(boardArray, index, "X");
        console.log("New Board With Player Move: ", newBoardWithPlayerMove);
        updateMoveLocal(newBoardWithPlayerMove, "O");
        const playerWinnerCheck = checkWinner(
            newBoardWithPlayerMove,
            boardSize
        );
        const isDraw = checkDraw(newBoardWithPlayerMove);
        if (isDraw) {
            updateEndGameLocal(newBoardWithPlayerMove, "DRAW");
        } else if (playerWinnerCheck) {
            updateEndGameLocal(newBoardWithPlayerMove, "X");
        } else {
            const newBotMove = botMove(newBoardWithPlayerMove);
            const newBoardWithBotMove = newMoveBoard(
                newBoardWithPlayerMove,
                newBotMove,
                "O"
            );
            setTimeout(() => {
                updateMoveLocal(newBoardWithBotMove, "X");
            }, 1000);
            const botWinnerCheck = checkWinner(newBoardWithBotMove, boardSize);
            if (botWinnerCheck) {
                setTimeout(() => {
                    updateEndGameLocal(newBoardWithBotMove, "O");
                }, 1000);
            }
        }
    };

    const handleLeaveGameBot = () => {
        localStorage.removeItem("gameWithBot");
        location.reload();
    };

    return (
        <GamePlay
            {...gameWithBotLocal}
            handlePlayGameBot={handlePlayGameBot}
            handleLeaveGameBot={handleLeaveGameBot}
        />
    );
};

export default GameWithBot;
