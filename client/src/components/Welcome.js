import Registration from "./Registration.js";
import Login from "./Login.js";
import StartScreen from "./StartScreen.js";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    // Redirect,
} from "react-router-dom";

export default function Welcome() {
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/" element={<StartScreen />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<StartScreen />} />
                </Routes>
            </Router>
        </>
    );
}
