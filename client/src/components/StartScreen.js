import { Link } from "react-router-dom";
import "./StartScreen.css";

export default function StartScreen() {
    return (
        <>
            <div className="start-container">
                <img
                    id="logo"
                    src="../../Loa-logo_transparent.png"
                    alt="Loa logo"
                />
                <h1>A birdwatching app</h1>
                <h2>View &#38; keep track of bird sightings around you</h2>
                <span id="start-span">
                    <Link to="/register">Register</Link>
                    <p>or</p>
                    <Link to="/login">login</Link>
                </span>
            </div>
        </>
    );
}
