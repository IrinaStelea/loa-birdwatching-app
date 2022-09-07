import { useState } from "react";
import { useDispatch } from "react-redux";
import NewPinPopUp from "./NewPinPopUp";
import { resetUserMarker } from "../../redux/new-user-marker/slice";
import "../../stylesheets/NewPin.css";

export default function NewPin({ userPin }) {
    const dispatch = useDispatch();
    const [popUpVisible, setPopUp] = useState(true);
    const togglePinPopUp = () => {
        setPopUp(!popUpVisible);
        dispatch(resetUserMarker());
    };
    return (
        <>
            {popUpVisible && (
                <>
                    <img id="new-pin" src="../../newMarker.png" alt="new pin" />

                    <NewPinPopUp
                        userPin={userPin}
                        togglePinPopUp={togglePinPopUp}
                    />
                </>
            )}
        </>
    );
}
