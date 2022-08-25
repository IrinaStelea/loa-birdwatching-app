import "./NewPin.css";
import { useState } from "react";
export default function NewPinPopUp({ togglePopUp, userPin }) {
    const [sighting, setSighting] = useState("");
    console.log("uesr pin in new pin pop up component", userPin);

    const onChange = (e) => {
        setSighting(e.currentTarget.value);
        console.log("e target value", e.currentTarget.value);
    };

    const submitPin = (e) => {
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
                        date: new Date().toLocaleString("en-GB", {
                            timeZone: "Europe/Brussels",
                        }),
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
            <div className="pop-up">
                <h4 id="close-button" onClick={togglePopUp}>
                    x
                </h4>
                <h4>Add a new bird sighting</h4>
                <input
                    type="text"
                    name="bird"
                    placeholder="Bird name"
                    onChange={onChange}
                ></input>
                <button id="save" type="submit" onClick={submitPin}>
                    Save
                </button>
            </div>
        </>
    );
}
