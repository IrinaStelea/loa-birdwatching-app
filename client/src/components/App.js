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

//fetch to eBird API
// React.useEffect(() => {
//     let myHeaders = new Headers();
//     myHeaders.append("X-eBirdApiToken", "roeouv9euh7o");

//     let requestOptions = {
//         method: "GET",
//         headers: myHeaders,
//         redirect: "follow",
//     };
//     let lat = 52.62;
//     let lng = 13.41;
//     //query params: "back" sets the time frame (up to 30 days), "dist" sets the range (up to 50 km), includeProvisional includes observations that have not been reviewed
//     (async () => {
//         const response = await fetch(
//             `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&back=30&dist=50&includeProvisional=true`,
//             requestOptions
//         );
//         const data = await response.json();
//         console.log("data from fetch", data);
//         setData(data);
//     })();
// }, []);
