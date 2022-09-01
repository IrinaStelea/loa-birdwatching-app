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
                <h1>Birdwatching app</h1>
                <span id="tagline">
                    Discover local bird species and keep track of bird sightings
                    around you
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
