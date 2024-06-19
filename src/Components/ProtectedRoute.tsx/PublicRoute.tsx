import * as React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isLogin } = useUserContext();
    console.log("Public Route isLogin: ", isLogin);

    return !isLogin ? children : <Navigate to="/" />;
};

export default PublicRoute;
