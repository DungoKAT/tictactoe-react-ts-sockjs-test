import { useUserContext } from "../Context/UserContext";
import { useGameContext } from "../Context/GameContext";
import { useLocalStorage } from "@uidotdev/usehooks";
import Loader from "./Loader";
import GamePlay from "../Components/GamePlay";

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
    const playerXName: string =
        currentGame?.playerX?.playerName !== undefined
            ? currentGame?.playerX?.playerName
            : "";
    const playerOName: string =
        currentGame?.playerO?.playerName !== undefined
            ? currentGame?.playerO?.playerName
            : "";
    const turn: string =
        currentGame?.turn !== undefined ? currentGame?.turn : "";
    const size: number =
        currentGame?.gameBoard?.size !== undefined
            ? currentGame?.gameBoard?.size
            : 3;
    const board =
        currentGame?.gameBoard?.board !== undefined
            ? currentGame?.gameBoard?.board
            : "";
    const boardArray =
        size !== undefined ? new Array(size * size).fill(null) : [];
    let counterIndex = 0;
    if (size && board) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                boardArray[counterIndex] = board[i][j];
                counterIndex++;
            }
        }
    }

    const handlePlayGame = (index: number) => {
        let positionX;
        let positionY;
        if (size) {
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
    const isGameFinished = currentGame?.status === "FINISHED";

    return (
        <>
            {isGameFinished && currentGame?.winner !== undefined && (
                <GameEndModal
                    winner={currentGame?.winner}
                    handleBackToHome={handleBackToHome}
                />
            )}
            {!isLogin &&
            (currentGameLocal === undefined || currentGameLocal === "") ? (
                <Loader />
            ) : (
                <GamePlay
                    userId={currentUser.userId}
                    gameId={currentGame?.gameId}
                    playerXId={currentGame?.playerX?.playerId}
                    playerOId={currentGame?.playerO?.playerId}
                    playerXName={playerXName}
                    playerOName={playerOName}
                    boardArray={boardArray}
                    boardSize={size}
                    currentTurn={turn}
                    playerMark={player}
                    isGameNew={isGameNew}
                    isGameInProgress={isGameInProgress}
                    isGameFinished={isGameFinished}
                    handlePlayGame={handlePlayGame}
                    handleSurrender={handleSurrender}
                    handleTerminate={handleTerminate}
                />
                // <div
                //     className="w-full h-full grid grid-cols-12 gap-5 flex-col  text-center overflow-y-auto
                //     max-desktop1280:px-10 max-desktop1280:pb-10 max-desktop1280:flex "
                // >
                //     <div
                //         className="col-start-2 col-span-2 my-14 py-10 px-5 flex flex-col items-center bg-components-sidenav rounded-lg order-1
                //         max-desktop1920:col-start-1 max-desktop1920:col-span-3 max-desktop1920:mx-10
                //         max-desktop1280:my-0 max-desktop1280:mx-0 max-desktop1280:px-10 max-desktop1280:flex-row max-desktop1280:justify-between max-desktop1280:order-2
                //         max-tablet767:flex-col"
                //     >
                //         <h1 className="text-4xl font-semibold text-black">
                //             Player X :
                //         </h1>
                //         <h1 className="mt-10 text-4xl font-semibold text-black max-desktop1280:mt-0 max-tablet767:my-10">
                //             {currentGame?.playerX?.playerName}
                //         </h1>
                //         {isGameNew ? (
                //             <button
                //                 className="mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                //                 onClick={() => {
                //                     currentGame?.gameId !== undefined &&
                //                         handleTerminate(currentGame?.gameId);
                //                 }}
                //             >
                //                 Leave room
                //                 <IoExit className="ml-2" />
                //             </button>
                //         ) : (
                //             <button
                //                 className={
                //                     (currentGame?.playerX?.playerId ===
                //                     currentUser?.userId
                //                         ? "opacity-100 pointer-events-auto"
                //                         : "opacity-0 pointer-events-none") +
                //                     " mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                //                 }
                //                 onClick={() =>
                //                     currentGame?.gameId !== undefined &&
                //                     handleSurrender(currentGame?.gameId, "X")
                //                 }
                //             >
                //                 Surrender
                //                 <FaFlag className="ml-2" />
                //             </button>
                //         )}
                //     </div>
                //     <div className="col-start-5 col-span-4 py-14 flex flex-col items-center order-2 max-desktop1280:order-1">
                //         <h1 className="text-4xl font-semibold text-white">
                //             {isGameFinished
                //                 ? "Game Over!"
                //                 : !isGameInProgress
                //                 ? "Waiting for Player O ..."
                //                 : "Turn " + currentGame?.turn}
                //         </h1>
                //         <button
                //             className={
                //                 (isGameInProgress
                //                     ? "opacity-0 pointer-events-none"
                //                     : "opacity-1 pointer-events-auto") +
                //                 " mt-10 py-2 px-3 flex items-center text-white bg-components-nav rounded-lg transition-colors hover:bg-gray-600"
                //             }
                //             onClick={() => {
                //                 currentGame?.gameId !== undefined &&
                //                     navigator.clipboard.writeText(
                //                         currentGame?.gameId
                //                     );
                //             }}
                //         >
                //             Copy Game ID <FaCopy className="ml-2" />
                //         </button>
                //         {board && size && turn && (
                //             <Board
                //                 board={boardArray}
                //                 size={size}
                //                 turn={turn}
                //                 player={player}
                //                 isGameInProgress={isGameInProgress}
                //                 handlePlayGame={handlePlayGame}
                //             />
                //         )}
                //     </div>
                //     <div
                //         className="col-start-10 col-span-2 my-14 py-10 px-5 flex flex-col items-center bg-components-sidenav rounded-lg order-3
                //         max-desktop1920:col-start-10 max-desktop1920:col-span-3 max-desktop1920:mx-10
                //         max-desktop1280:my-0 max-desktop1280:mx-0 max-desktop1280:px-10 max-desktop1280:flex-row max-desktop1280:justify-between
                //         max-tablet767:flex-col"
                //     >
                //         <h1 className="text-4xl font-semibold text-black">
                //             Player O :
                //         </h1>
                //         <h1 className="mt-10 text-4xl font-semibold text-black max-desktop1280:mt-0 max-tablet767:my-10">
                //             {currentGame?.playerO?.playerName}
                //         </h1>
                //         <button
                //             className={
                //                 (currentGame?.playerO?.playerId ===
                //                 currentUser?.userId
                //                     ? "opacity-100 pointer-events-auto"
                //                     : "opacity-0 pointer-events-none") +
                //                 " mt-auto mb-0 py-3 px-5 flex items-center font-semibold text-white bg-components-button rounded-lg transition-colors hover:bg-components-buttonHover"
                //             }
                //             onClick={() =>
                //                 currentGame?.gameId !== undefined &&
                //                 handleSurrender(currentGame?.gameId, "O")
                //             }
                //         >
                //             Surrender
                //             <FaFlag className="ml-2" />
                //         </button>
                //     </div>
                // </div>
            )}
        </>
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
