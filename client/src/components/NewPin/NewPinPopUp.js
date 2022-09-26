import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DatalistInput, useComboboxControls } from "react-datalist-input";
import Uploader from "./Uploader.js";
import { addMarker } from "../../redux/user-markers/slice";
import { resetUserMarker } from "../../redux/new-user-marker/slice";
import { addAvailableBird } from "../../redux/birds-filter/slice";
import "react-datalist-input/dist/styles.css";
import "../../stylesheets/NewPin.css";

export default function NewPinPopUp({ toggleNewPinPopUp, userPin }) {
    const dispatch = useDispatch();
    const [selectedBird, setSelectedBird] = useState(null);
    const { value, setValue } = useComboboxControls({
        initialValue: "",
    });
    const [view, setView] = useState(0);
    const [uploaderIsVisible, setUploader] = useState(false);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const birdList = useSelector(
        (state) =>
            state.birdData &&
            state.birdData.map((bird, idx) => ({
                id: idx,
                value: bird.comName,
                sciName: bird.sciName,
                img: bird.image,
                url: bird.url,
            }))
    );

    //hide success message after 3 seconds
    useEffect(() => {
        if (view === 4) {
            setTimeout(() => {
                toggleNewPinPopUp();
                dispatch(resetUserMarker());
            }, 1500);
        }
        // eslint-disable-next-line
    }, [view]);

    //onSelect function for the birdlist input
    const onSelect = (bird) => {
        setSelectedBird(bird);
        setValue(bird.value);

        //disable focus on the text input for soft keyboard on mobile
        const dataListInput = document.querySelector(
            ".react-datalist-input__textbox"
        );
        dataListInput.blur();
    };

    const resetSelection = () => {
        setValue("");
        setSelectedBird(null);
    };

    const toggleUploader = () => {
        setUploader(!uploaderIsVisible);
    };

    const submitPin = async () => {
        try {
            const date = new Date()
                .toLocaleString("en-GB", {
                    timeZone: "Europe/Brussels",
                })
                .split(",")
                .join("");
            const res = await fetch("/api/submit-pin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    geoJSON: {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [userPin.lng, userPin.lat],
                        },
                        properties: {
                            comName: selectedBird.value,
                            sciName: selectedBird.sciName,
                            date: date,
                            comment: comment,
                        },
                    },
                }),
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.log("error in fetch add new pin", err);
            setError("Something went wrong, please try again");
        }
    };

    const savePinWithoutPhotos = async () => {
        const data = await submitPin();

        if (data.error) {
            setError(data.error);
        } else {
            dispatch(addMarker(data));
            dispatch(
                addAvailableBird({
                    [data.id]: data.sighting.properties.comName,
                })
            );
            setView(4);
        }
    };

    return (
        <>
            {" "}
            {view === 0 && (
                <div className="new-pin-pop-up">
                    <h4>Add a new bird sighting here?</h4>
                    <p id="save" onClick={() => setView(1)}>
                        Yes
                    </p>
                    <p
                        id="cancel"
                        onClick={() => {
                            toggleNewPinPopUp();
                            dispatch(resetUserMarker());
                        }}
                    >
                        Cancel
                    </p>
                </div>
            )}
            {view === 1 && (
                <>
                    <div className="new-pin-pane">
                        <p
                            id="cancel"
                            onClick={() => {
                                toggleNewPinPopUp();
                                dispatch(resetUserMarker());
                            }}
                        >
                            Cancel
                        </p>
                        <div id="datalist-container">
                            <DatalistInput
                                placeholder="Start typing a bird name"
                                showLabel={false}
                                items={birdList}
                                value={value}
                                onSelect={onSelect}
                            />
                            {
                                <span
                                    className="reset-search"
                                    onClick={resetSelection}
                                >
                                    X
                                </span>
                            }
                        </div>

                        {selectedBird && (
                            <>
                                <p className="sciname">
                                    {selectedBird.sciName}
                                </p>
                                <div className="pin-images">
                                    <img
                                        id="bird-img"
                                        src={selectedBird.img}
                                        alt={selectedBird.comName}
                                    />
                                    <a
                                        href={selectedBird.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <img
                                            id="info-icon"
                                            src="../../info_icon_white.png"
                                            alt="info icon"
                                        />
                                    </a>
                                </div>
                                <p id="save" onClick={() => setView(2)}>
                                    Continue
                                </p>
                            </>
                        )}
                    </div>
                    <div className="overlay"></div>
                </>
            )}
            {view === 2 && (
                <>
                    <div className="new-pin-pane">
                        <h4>Add a comment for this sighting?</h4>
                        <textarea
                            name="comment"
                            id="comment"
                            onChange={(e) => {
                                setComment(e.currentTarget.value);
                            }}
                        ></textarea>

                        <>
                            <p
                                id="save"
                                onClick={() => {
                                    setView(3);
                                }}
                            >
                                Save comment &amp; continue
                            </p>
                            <p
                                id="save"
                                onClick={() => {
                                    setView(3);
                                    setComment("");
                                }}
                            >
                                Skip
                            </p>
                        </>
                    </div>
                    <div className="overlay"></div>
                </>
            )}
            {view === 3 && (
                <>
                    <div className="new-pin-pane">
                        <h4>Add one or more photos for this sighting?</h4>
                        {uploaderIsVisible && (
                            <>
                                <Uploader
                                    toggleUploader={toggleUploader}
                                    setView={setView}
                                    setError={setError}
                                />
                            </>
                        )}
                        {!uploaderIsVisible && (
                            <>
                                <p
                                    id="save"
                                    onClick={() => {
                                        submitPin();
                                        toggleUploader();
                                    }}
                                >
                                    Yes
                                </p>
                                <p id="save" onClick={savePinWithoutPhotos}>
                                    Save without photos
                                </p>
                            </>
                        )}
                        {error && <p className="error-popup">{error}</p>}
                    </div>
                    <div className="overlay"></div>
                </>
            )}
            {view === 4 && (
                <div className="new-pin-pop-up">
                    <h4>Pin added successfully</h4>
                </div>
            )}
        </>
    );
}
