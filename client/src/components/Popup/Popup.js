import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Images from "./Images.js";
import DeleteUserMarker from "./DeleteUserMarker.js";
import { closePopup } from "../../redux/popup/slice";
import "../../stylesheets/Popup.css";

export default function Popup() {
    //  const [popUpVisible, setPopUp] = useState(true);
    const dispatch = useDispatch();

    const togglePopUp = () => {
        dispatch(closePopup());
    };

    const popup = useSelector((state) => state.popupInfo);
    const fullUserDataforPopup = useSelector(
        (state) =>
            state.userData &&
            state.userData.filter((bird) => bird.id === popup.id)
    );
    const isUserPopup = useSelector((state) => state.isUserPopup);

    // console.log("popup info in component", popup);

    return (
        <>
            <div className="popup">
                <h4 id="close" onClick={togglePopUp}>
                    x
                </h4>
                <h2>{popup.comName}</h2>
                <p className="sci-name">{popup.sciName}</p>
                <Images
                    popup={popup}
                    fullUserDataforPopup={fullUserDataforPopup}
                />
                <p className="date">
                    Seen on{" "}
                    {popup.date.slice(0, 10).split("-").reverse().join("-")} at{" "}
                    {popup.date.slice(11, 16)}
                </p>
                {isUserPopup && (
                    <DeleteUserMarker info={popup} togglePopUp={togglePopUp} />
                )}
            </div>
        </>
    );
}
