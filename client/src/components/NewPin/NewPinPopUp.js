import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMarker } from "../../redux/user-markers/slice";
import { addAvailableBird } from "../../redux/birds-filter/slice";
import DatalistInput from "react-datalist-input";
import Uploader from "./Uploader.js";
import "react-datalist-input/dist/styles.css";

import "../../stylesheets/NewPin.css";

export default function NewPinPopUp({ togglePinPopUp, userPin }) {
    const [selectedBird, setSelectedBird] = useState(null);
    const [view, setView] = useState(1);
    const [uploaderIsVisible, setUploader] = useState(false);
    const dispatch = useDispatch();
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
        if (view === 3) {
            setTimeout(() => togglePinPopUp(), 1500);
        }
        // eslint-disable-next-line
    }, [view]);

    const onSelect = (bird) => {
        setSelectedBird(bird);
    };

    const toggleUploader = () => {
        setUploader(!uploaderIsVisible);
    };

    const submitPin = (e) => {
        const date = new Date()
            .toLocaleString("en-GB", {
                timeZone: "Europe/Brussels",
            })
            .split(",")
            .join("");

        fetch("/api/submit-pin", {
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
                    },
                },
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log("data after add new pin", data);
                dispatch(addMarker(data));
                dispatch(
                    addAvailableBird({
                        [data.id]: data.sighting.properties.comName,
                    })
                );
                setView(2);
            })
            .catch((err) => {
                console.log("error in fetch add new pin", err);
            });
    };

    return (
        <>
            {view === 1 && (
                <div className="new-pin-pop-up">
                    <h4>Add a new bird sighting</h4>
                    <DatalistInput
                        placeholder="Start typing a bird name"
                        showLabel={false}
                        items={birdList}
                        onSelect={onSelect}
                    />
                    {selectedBird && (
                        <>
                            <p className="sciname">{selectedBird.sciName}</p>
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
                            <p id="save" onClick={submitPin}>
                                Save
                            </p>
                        </>
                    )}
                    <p id="cancel" onClick={togglePinPopUp}>
                        Cancel
                    </p>
                </div>
            )}
            {view === 2 && (
                <div className="new-pin-pop-up">
                    <h4>Add photos for this sighting?</h4>
                    {uploaderIsVisible && (
                        <Uploader
                            toggleUploader={toggleUploader}
                            setView={setView}
                        />
                    )}
                    {!uploaderIsVisible && (
                        <p id="save" onClick={toggleUploader}>
                            Yes
                        </p>
                    )}
                    <p id="cancel" onClick={togglePinPopUp}>
                        Cancel
                    </p>
                </div>
            )}
            {view === 3 && (
                <div className="new-pin-pop-up">
                    <h4>Pin added successfully</h4>
                </div>
            )}
        </>
    );
}
