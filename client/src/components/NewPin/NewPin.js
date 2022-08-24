import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./NewPin.css";
import NewPinPopUp from "./NewPinPopUp";
import { resetUserMarker } from "../../redux/new-user-marker/slice";
import { useDispatch } from "react-redux";

export default function NewPin({ userPin }) {
    const dispatch = useDispatch();
    const [popUpVisible, setPopUp] = useState(true);
    const togglePopUp = () => {
        setPopUp(!popUpVisible);
        dispatch(resetUserMarker());
    };
    return (
        <>
            {popUpVisible && (
                <>
                    <img id="new-pin" src="../../newMarker.png" alt="new pin" />

                    <NewPinPopUp userPin={userPin} togglePopUp={togglePopUp} />
                </>
            )}
        </>
    );
}
