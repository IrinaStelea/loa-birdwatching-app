import Registration from "./Registration.js";
import Login from "./Login.js";
import StartScreen from "./StartScreen.js";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<StartScreen />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
