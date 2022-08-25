import { useState, useEffect } from "react";
// import logo from "../logo.svg";
import "./App.css";
import Map from "./Map.js";
import NewPin from "./NewPin/NewPin.js";
import { useSelector } from "react-redux";

export default function App() {
    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);
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
    //fetch api data stored in back-end
    useEffect(() => {
        //fetch the json with the recent sightings
        fetch("/api/data.json")
            .then((res) => res.json())
            .then((data) => {
                // console.log("response from server api data, data", data);
                setData(data);
            });
    }, []);
    //fetch user sightings
    useEffect(() => {
        fetch("/api/user-data.json")
            .then((res) => res.json())
            .then((userData) => {
                // console.log("response from server, user data", userData);
                setUserData(userData);
            });
    }, []);

    const userPin = useSelector((state) => state.pinCoordinates);
    console.log("user pin length in main app", Object.keys(userPin).length);

    return (
        <>
            <div className="map">
                {/* <UserLocation setUserLocation={setUserLocation} /> */}
                {/* {!userLocationModal && ( */}
                <Map
                    data={data}
                    userData={userData}
                    userLng={userLng}
                    userLat={userLat}
                />
                {/* )} */}
            </div>
            {Object.keys(userPin).length !== 0 && <NewPin userPin={userPin} />}
        </>
    );
}
