import "./NewPin.css";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
export default function NewPinPopUp({ togglePinPopUp, userPin }) {
    const [value, setValue] = useState("");
    const [birds, setBirds] = useState([]);

    // console.log("uesr pin in new pin pop up component", userPin);
    const birdList = useSelector(
        (state) => state.birdData && state.birdData.map((bird) => bird.comName)
    );

    console.log("bird list in component", birdList);
    const onChange = (e) => {
        setValue(e.target.value);
        console.log("e target value", e.target.value);
    };

    // useEffect(() => {
    //     //   let abort;
    //     //   console.log("useEffect on mount is running");
    //     (async () => {
    //         const data = await fetch(`/api/getbirdlist`).then((response) =>
    //             response.json()
    //         );
    //         //only update user data if abort is falsey
    //         console.log("data from fetch birds", data);
    //     })();
    // }, []);

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
                        comName: "Common Swift",
                        sciName: "Apus apus",
                        date: date,
                    },
                },
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data after add new pin", data);
            })
            .catch((err) => {
                console.log("error in fetch add new pin", err);
            });
    };
    return (
        <>
            <div className="new-pin-pop-up">
                <h4 id="close-button" onClick={togglePinPopUp}>
                    x
                </h4>
                <h4>Add a new bird sighting</h4>
                    <input
                        type="text"
                        list="birdlist"
                        id="birds"
                        name="birds"
                        onChange={onChange}
                    />
                    <datalist id="birdlist">
                        {birdList.map((bird) => (
                            <option key={bird} value={bird}></option>
                        ))}
                    </datalist>
                    <button id="save" type="submit" onClick={submitPin}>
                        Save
                    </button>
               
            </div>
        </>
    );
}
