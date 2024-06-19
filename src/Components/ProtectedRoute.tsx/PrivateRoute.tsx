import * as React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLogin } = useUserContext();
    console.log("Private Route isLogin: ", isLogin);

    return isLogin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
