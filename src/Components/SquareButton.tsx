import { RxCross1 } from "react-icons/rx";
import { BiCircle } from "react-icons/bi";

interface SquareButtonInfo {
    boardMark: string;
    turn?: string;
    player?: string;
    isGameInProgress?: boolean;
    onClick?: () => void;
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
    // console.log("Check Is Player Turn: ", checkIsPlayerTurn);
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
export default SquareButton;
