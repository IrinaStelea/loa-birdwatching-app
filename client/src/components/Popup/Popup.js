import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { closePopup } from "../../redux/popup/slice";
import "./Popup.css";
import DeleteUserMarker from "./DeleteUserMarker.js";

export default function Popup() {
    //  const [popUpVisible, setPopUp] = useState(true);
    const dispatch = useDispatch();

    const togglePopUp = () => {
        dispatch(closePopup());
    };

    const popup = useSelector((state) => state.popupInfo);
    const isUserPopup = useSelector((state) => state.isUserPopup);
    console.log("popupinfo in popup component", popup);
    console.log("isUserPopup in popup component", isUserPopup);
    const birdImg = useSelector(
        (state) =>
            state.birdData &&
            state.birdData.filter((bird) => bird.sciName === popup.sciName)
    );
    // const singleBird = birdInfo.find((bird) => bird.sciName === sciName);
    console.log("img url", birdImg[0].image);

    return (
        <>
            <div className="popup">
                <h4 id="close" onClick={togglePopUp}>
                    x
                </h4>
                <h2>{popup.comName}</h2>
                <p>{popup.sciName}</p>
                <img
                    id="bird-thumbnail"
                    src={birdImg[0].image}
                    alt={popup.comName}
                />
                <p>
                    Spotted on{" "}
                    {popup.date.slice(0, 10).split("-").reverse().join("-")} at{" "}
                    {popup.date.slice(11, 16)}
                </p>
                {isUserPopup && (
                    <DeleteUserMarker info={popup} togglePopUp={togglePopUp} />
                )}
            </div>
        </>
        // <div className="popup">
        //     <h2 className="comName">{comName}</h2>
        //     <p>{sciName}</p>
        //     {/* <img id="bird-thumbnail" src={imgUrl.image} alt={comName} /> */}
        //     <p>
        //         Spotted on {date.slice(0, 10).split("-").reverse().join("-")} at{" "}
        //         {date.slice(11, 19)}
        //     </p>
        // </div>
    );
}
