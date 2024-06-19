import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
    return (
        <div className="w-screen h-screen bg-components-background overflow-hidden">
            <Outlet />
        </div>
    );
}

export default App;
