import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PopupImages from "./PopupImages.js";
import DeleteUserMarker from "./DeleteUserMarker.js";
import { closePopup } from "../../redux/popup/slice";
import "../../stylesheets/Popup.css";

export default function Popup() {
    const dispatch = useDispatch();

    const [error, setError] = useState("");

    const popup = useSelector((state) => state.popupInfo);
    const fullUserDataforPopup = useSelector(
        (state) =>
            state.userData &&
            state.userData.filter((bird) => bird.id === popup.id)
    );
    const isUserPopup = useSelector((state) => state.isUserPopup);

    const togglePopUp = () => {
        dispatch(closePopup());
    };

    return (
        <>
            <div className="popup">
                <h4 id="close" onClick={togglePopUp}>
                    x
                </h4>
                <h2>{popup.comName}</h2>
                <p className="sci-name">{popup.sciName}</p>
                <PopupImages
                    popup={popup}
                    fullUserDataforPopup={fullUserDataforPopup}
                />
                <p className="date">
                    Seen on{" "}
                    {popup.date.slice(0, 10).split("-").reverse().join("-")} at{" "}
                    {popup.date.slice(11, 16)}
                </p>
                {isUserPopup && popup.comment && (
                    <>
                        <p className="popup-comment">
                            <span id="span-comment">Comment: </span>
                            {popup.comment}
                        </p>
                    </>
                )}
                {isUserPopup && (
                    <DeleteUserMarker
                        info={popup}
                        togglePopUp={togglePopUp}
                        setError={setError}
                    />
                )}
                {error && <p className="error-delete">{error}</p>}
            </div>
        </>
    );
}
