import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
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
    const userImages = fullUserDataforPopup[0]?.image_url;
    const isUserPopup = useSelector((state) => state.isUserPopup);

    // console.log("popup info in component", popup);
    const selBird = useSelector(
        (state) =>
            state.birdData &&
            state.birdData.filter((bird) => bird.sciName === popup.sciName)
    );

    return (
        <>
            <div className="popup">
                <h4 id="close" onClick={togglePopUp}>
                    x
                </h4>
                <h2>{popup.comName}</h2>
                <p className="sci-name">{popup.sciName}</p>
                <div className="pin-images">
                    {userImages && userImages[0] ? (
                        <div id="preview-images">
                            {userImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    id="bird-thumbnail"
                                    src={img}
                                    alt={popup.comName}
                                />
                            ))}
                        </div>
                    ) : (
                        <img
                            id="bird-thumbnail"
                            src={
                                selBird.length !== 0
                                    ? selBird[0].image
                                    : "../../default_pic.png"
                            }
                            alt={popup.comName}
                        />
                    )}
                    {selBird.length !== 0 && (
                        <a
                            href={selBird[0].url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                id="info-icon"
                                src="../../info_icon_pink.png"
                                alt="info icon"
                            />
                        </a>
                    )}
                </div>
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
