import { useState } from "react";
// import { Link } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

const Login = () => {
    const { register, login } = useUserContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [regisOrLogin, setRegistOrLogin] = useState("Register");

    const handleRegister = async () => {
        const newUser = { username, password };
        register(newUser);
    };

    const handleLogin = async () => {
        const user = { username, password };
        login(user);
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <FormCard
                regisOrLoginText={regisOrLogin}
                username={username}
                password={password}
                setRegisOrLogin={setRegistOrLogin}
                setUsername={setUsername}
                setPassword={setPassword}
                handleClick={
                    regisOrLogin === "Register" ? handleRegister : handleLogin
                }
            />
        </div>
    );
};

interface formType {
    regisOrLoginText: string;
    username: string;
    password: string;
    setRegisOrLogin: (value: string) => void;
    setUsername: (value: string) => void;
    setPassword: (value: string) => void;
    handleClick: () => void;
}

const FormCard = ({
    regisOrLoginText,
    username,
    password,
    setRegisOrLogin,
    setUsername,
    setPassword,
    handleClick,
}: formType) => {
    return (
        <div className=" w-[500px] p-10 bg-white rounded-md">
            <div className="mb-5 pb-2 grid grid-cols-2">
                <button
                    className={
                        (regisOrLoginText === "Register"
                            ? "bg-gray-300"
                            : "bg-white") +
                        " py-1 font-semibold border border-gray-300 rounded-l-full transition-colors hover:bg-gray-400"
                    }
                    onClick={() => setRegisOrLogin("Register")}
                >
                    Register
                </button>
                <button
                    className={
                        (regisOrLoginText === "Login"
                            ? "bg-gray-300"
                            : "bg-white") +
                        " py-1 font-semibold border border-gray-300 rounded-r-full transition-colors hover:bg-gray-400"
                    }
                    onClick={() => setRegisOrLogin("Login")}
                >
                    Login
                </button>
            </div>
            <h1 className="mb-5 text-4xl font-semibold text-center">
                {regisOrLoginText}
            </h1>
            <div className="flex flex-col">
                <label className="mb-2 font-semibold" htmlFor="">
                    Username
                </label>
                <input
                    className="mb-5 px-3.5 py-2 border rounded-md"
                    type="text"
                    name="username"
                    value={username}
                    placeholder="Enter your name here"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label className="mb-2 font-semibold" htmlFor="">
                    Password
                </label>
                <input
                    className="mb-5 px-3.5 py-2 border rounded-md"
                    type="text"
                    name="password"
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="mt-5 p-2 w-full font-opensans text-white font-semibold text-center bg-components-button rounded-md transition-colors hover:bg-components-buttonHover"
                    type="submit"
                    onClick={handleClick}
                >
                    {regisOrLoginText}
                </button>
            </div>
        </div>
    );
};

export default Login;
