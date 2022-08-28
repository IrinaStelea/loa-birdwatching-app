import "./NewPin.css";
import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import DatalistInput from "react-datalist-input";
import { addMarker } from "../../redux/user-markers/slice";
import "react-datalist-input/dist/styles.css";

export default function NewPinPopUp({ togglePinPopUp, userPin }) {
    const [selectedBird, setSelectedBird] = useState(null);
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

    console.log("bird list in component", birdList);

    const onSelect = useCallback((bird) => {
        console.log("selected bird", bird);
        setSelectedBird(bird);
    }, []);

    const submitPin = (e) => {
        const date = new Date()
            .toLocaleString("en-GB", {
                timeZone: "Europe/Brussels",
            })
            .split(",")
            .join("");
        console.log("date", date);

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
                console.log("data after add new pin", data);
                dispatch(addMarker(data));
                togglePinPopUp();
            })
            .catch((err) => {
                console.log("error in fetch add new pin", err);
            });
    };

    return (
        <>
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
                        <img
                            id="bird-img"
                            src={selectedBird.img}
                            alt={selectedBird.comName}
                        />
                        <p id="save" onClick={submitPin}>
                            Save
                        </p>
                    </>
                )}
                <p id="cancel" onClick={togglePinPopUp}>
                    Cancel
                </p>
            </div>
        </>
    );

    // return (
    //     <>
    //         <div className="new-pin-pop-up">
    //             <h4 id="close-button" onClick={togglePinPopUp}>
    //                 x
    //             </h4>
    //             <h4>Add a new bird sighting</h4>
    //                 <input
    //                     type="text"
    //                     list="birdlist"
    //                     id="birds"
    //                     name="birds"
    //                     onChange={onChange}
    //                 />
    //                 <datalist id="birdlist">
    //                     {birdList.map((bird) => (
    //                         <option key={bird} value={bird}></option>
    //                     ))}
    //                 </datalist>
    //                 <button id="save" type="submit" onClick={submitPin}>
    //                     Save
    //                 </button>

    //         </div>
    //     </>
    // );
}
