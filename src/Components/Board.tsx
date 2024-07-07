import SquareButton from "./SquareButton";

interface BoardInfo {
    board: string[];
    size: number;
    turn?: string;
    player?: string;
    isGameInProgress?: boolean;
    handlePlayGame?: (index: number) => void;
}

const Board = ({
    board,
    size,
    turn,
    player,
    isGameInProgress,
    handlePlayGame,
}: BoardInfo) => {
    return (
        <div
            className={
                (size === 3
                    ? "grid-cols-3 grid-rows-3 gap-5"
                    : size === 5
                    ? "grid-cols-5 grid-rows-5 gap-4"
                    : size === 7 && "grid-cols-7 grid-rows-7 gap-3") +
                " w-[620px] h-[620px] mt-10 p-5 grid bg-components-board rounded-xl transition-all" +
                " max-tablet991:w-[500px] max-tablet991:h-[500px] max-tablet991:p-3 max-tablet991:gap-3" +
                " max-tablet640:w-[400px] max-tablet640:h-[400px]" +
                " max-mobile479:w-[300px] max-mobile479:h-[300px] max-mobile479:p-2 max-mobile479:gap-2"
            }
        >
            {Array(size * size)
                .fill(null)
                .map((_, index) => (
                    <SquareButton
                        key={index}
                        boardMark={board[index]}
                        turn={turn}
                        player={player}
                        isGameInProgress={isGameInProgress}
                        onClick={() => {
                            handlePlayGame && handlePlayGame(index);
                        }}
                    />
                ))}
        </div>
    );
};
export default Board;
