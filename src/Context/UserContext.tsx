import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import UserRequestApi from "../api/UserRequestApi";
import { useLocalStorage } from "@uidotdev/usehooks";

interface Move {
    markType: string;
    position: number[];
}
interface GameHistory {
    allMoves: Move[];
    startTime: Date;
    endTime: Date;
}
interface Player {
    playerId?: string;
    playerName?: string;
    markType?: string;
}
interface GameHistories {
    gameId?: string;
    playerX?: Player;
    playerO?: Player;
    turn?: string;
    gameBoard?: {
        board?: string[][];
        size?: number;
    };
    status?: string;
    winner?: string;
    gameHistory?: GameHistory;
}
interface User {
    userId?: string;
    username?: string;
    password?: string;
    isLogin?: boolean;
    gameHistories?: GameHistories[];
}
interface UserContextType {
    isLogin: boolean;
    allUsers: User[];
    currentUser: User;
    register: (user: object) => void;
    login: (user: object) => void;
    logout: (user: object) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentLoginIdLocal, setCurrentLoginIdLocal] =
        useLocalStorage("currentLoginId");
    const { registerUser, loginUser, logoutUser, getAllUsers, getUserById } =
        UserRequestApi;
    const [isLogin, setIsLogin] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState<User>({});

    const loginIdLocalCheckType = typeof currentLoginIdLocal === "string";
    const checkLoginId =
        loginIdLocalCheckType &&
        (currentLoginIdLocal === "" || currentLoginIdLocal === undefined);

    const setLoginId = (id: string) => {
        setCurrentLoginIdLocal(id);
        setIsLogin(true);
    };

    const setLogoutId = () => {
        setCurrentLoginIdLocal("");
        setIsLogin(false);
    };

    const register = async (user: User) => {
        try {
            const response = await registerUser(user);
            console.log("Register response:", response);
            alert("Register Success");
        } catch (err) {
            console.error(err);
            alert("This username is already registered");
        }
    };

    const login = async (user: User) => {
        console.log("Is Login ? : ", user);
        if (!user.isLogin) {
            try {
                const response = await loginUser(user);
                setLoginId(response.userId);
                console.log("Login response:", response);
                alert("Login Success");
            } catch (err) {
                console.error("Login failed: ", err);
                alert("Wrong username or password!");
            }
        } else {
            alert("This username is already logged in!");
        }
    };

    const logout = async (user: User) => {
        if (user.isLogin) {
            try {
                const response = await logoutUser(user);
                setLogoutId();
                console.log("Logout response:", response);
                alert("Logout Success");
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await getAllUsers();
                setAllUsers(response);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAllUsers();
    }, [getAllUsers]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (loginIdLocalCheckType) {
                try {
                    const response = await getUserById(currentLoginIdLocal);
                    setCurrentUser(response);
                    console.log("Get currentUser response: ", response);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchCurrentUser();
    }, [getUserById, checkLoginId, currentLoginIdLocal, loginIdLocalCheckType]);

    useEffect(() => {
        checkLoginId ? setIsLogin(false) : setIsLogin(true);
    }, [checkLoginId, currentLoginIdLocal]);

    useEffect(() => {
        if (
            typeof currentUser !== "string" &&
            currentUser !== undefined &&
            currentUser.isLogin
        ) {
            setCurrentLoginIdLocal(currentUser.userId);
        } else {
            setCurrentLoginIdLocal("");
        }
    }, [
        currentUser,
        checkLoginId,
        currentLoginIdLocal,
        setCurrentLoginIdLocal,
    ]);

    return (
        <UserContext.Provider
            value={{ register, isLogin, login, logout, allUsers, currentUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within an AuthProvider");
    }
    return context;
};
