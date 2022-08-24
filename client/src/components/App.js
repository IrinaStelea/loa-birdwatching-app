import { useState, useEffect } from "react";
// import logo from "../logo.svg";
import "./App.css";
import Map from "./Map.js";
import UserLocation from "./UserLocation";

export default function App() {
    const [data, setData] = useState(null);
    const [userLng, setLng] = useState();
    const [userLat, setLat] = useState();
    const [userLocationModal, setUserLocationModal] = useState(true);
    let latitude;
    let longitude;
    const setUserLocation = () => {
        console.log("click on my location");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            });
        }

        setTimeout(() => {
            setLng(longitude);
            setLat(latitude);
            // console.log("user lat and long", userLat, userLng);
            setUserLocationModal(!userLocationModal);
        }, 3000);
    };

    useEffect(() => {
        //fetch the json with the recent sightings
        fetch("/api/data.json")
            .then((res) => res.json())
            .then((data) => {
                // console.log("response from server, data", data);
                setData(data);
            });
    }, []);

    return (
        <>
            <div className="map">
                <UserLocation setUserLocation={setUserLocation} />
                {!userLocationModal && (
                    <Map data={data} userLng={userLng} userLat={userLat} />
                )}
            </div>
        </>
    );
}
