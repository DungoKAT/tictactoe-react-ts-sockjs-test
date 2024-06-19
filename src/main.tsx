import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { LoaderFunction, LoaderFunctionArgs } from "react-router";
import App from "./App.tsx";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import GameHistory from "./Components/HomeComponents/GameHistory.tsx";
import Game from "./Pages/Game.tsx";
import PrivateRoute from "./Components/ProtectedRoute.tsx/PrivateRoute.tsx";
import PublicRoute from "./Components/ProtectedRoute.tsx/PublicRoute.tsx";
import HomeRoute from "./Components/ProtectedRoute.tsx/HomeRoute.tsx";
import GameRoute from "./Components/ProtectedRoute.tsx/GameRoute.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./Context/UserContext.tsx";
import { GameProvider } from "./Context/GameContext.tsx";
import GameRequestApi from "./api/GameRequestApi.ts";
import "./index.css";

interface ParamsType {
    gameId: string;
}

const loader: LoaderFunction = async ({
    params,
}: LoaderFunctionArgs<ParamsType>) => {
    const { getGameById } = GameRequestApi;
    const { gameId } = params;
    console.log("Params: ", gameId);
    if (!gameId) {
        throw new Error("Game ID is required");
    } else {
        try {
            const response = await getGameById(gameId);
            console.log("Get Game By Id Response: ", response);
            return response;
        } catch (err) {
            console.error(err);
        }
    }
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/login",
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: "/",
                element: (
                    <PrivateRoute>
                        <HomeRoute>
                            <Home />,
                        </HomeRoute>
                    </PrivateRoute>
                ),
                children: [
                    {
                        path: "/game-histories/:gameId",
                        element: <GameHistory />,
                        loader: loader,
                    },
                ],
            },
            {
                path: "/game",
                element: (
                    <PrivateRoute>
                        <GameRoute>
                            <Game />,
                        </GameRoute>
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <UserProvider>
            <GameProvider>
                <RouterProvider router={router} />
            </GameProvider>
        </UserProvider>
    </React.StrictMode>
);
