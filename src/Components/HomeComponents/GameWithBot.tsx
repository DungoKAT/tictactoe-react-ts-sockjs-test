import { Link, useLocation } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";
import Board from "../Board";

interface GameWithBotType {
    isInGame: boolean;
    username: string;
    size: number;
    turn: string;
    isGameFinished: boolean;
}

const GameWithBot = () => {
    const [gameWithBotLocal, setGameWithBotLocal] =
        useLocalStorage<GameWithBotType>("gameWithBot");

    const username = gameWithBotLocal.username;
    const size = gameWithBotLocal.size;
    const turn = gameWithBotLocal.turn;
    const isGameFinised = gameWithBotLocal.isGameFinished;
    const player = "X";
    const boardArray = new Array(size * size).fill(null);

    // const handleClick = ()

    return (
        <div className="w-full h-full grid grid-cols-12 gap-5">
            <div className="col-start-2 col-span-2 py-14 flex flex-col items-center">
                <h1 className="text-4xl font-semibold text-white">Player X</h1>
                <h1 className="mt-10 text-4xl font-semibold text-white">
                    {username}
                </h1>
                <Link
                    to="/"
                    className="mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                    onClick={() => localStorage.removeItem("gameWithBot")}
                >
                    Leave game
                </Link>
            </div>
            <div className="col-start-5 col-span-4 py-14 flex flex-col items-center">
                <h1 className="text-4xl font-semibold text-white">
                    {isGameFinised ? "The winner is " : "Turn " + turn}
                </h1>
                <Board
                    board={boardArray}
                    size={size}
                    turn={turn}
                    player={player}
                    isGameInProgress={!isGameFinised}
                    // handlePlayGame={handlePlayGame}
                />
            </div>
            <div className="col-start-10 col-span-2 py-14 flex flex-col items-center">
                <h1 className="text-4xl font-semibold text-white">Player O</h1>
                <h1 className="mt-10 text-4xl font-semibold text-white">Bot</h1>
            </div>
        </div>
    );
};

export default GameWithBot;
