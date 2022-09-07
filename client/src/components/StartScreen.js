import { Link } from "react-router-dom";
import "../stylesheets/StartScreen.css";

export default function StartScreen() {
    return (
        <>
            <div className="start-container">
                <img
                    id="logo"
                    src="../../Loa-logo_transparent.png"
                    alt="Loa logo"
                />
                <h1>Birdwatching app</h1>
                <span id="tagline">
                    Discover local bird species and track your bird sightings
                </span>
                <span id="start-span">
                    <Link to="/register">Register</Link>
                    <p>or</p>
                    <Link to="/login">login</Link>
                </span>
            </div>
        </>
    );
}
