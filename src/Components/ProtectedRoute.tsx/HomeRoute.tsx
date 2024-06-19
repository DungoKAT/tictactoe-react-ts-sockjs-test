import * as React from "react";
import { Navigate } from "react-router-dom";
import { useGameContext } from "../../Context/GameContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isInGameRoom } = useGameContext();
    console.log("Game Route is in game room: ", isInGameRoom);

    return !isInGameRoom ? children : <Navigate to="/game" />;
};

export default ProtectedRoute;
