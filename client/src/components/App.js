import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Map from "./Map.js";
import Popup from "./Popup/Popup";
import NewPin from "./NewPin/NewPin.js";
import { receiveBirdData } from "../redux/bird-data/slice";
import { receiveUserData } from "../redux/user-markers/slice";
import "../stylesheets/App.css";

export default function App() {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    // const [userData, setUserData] = useState(null);

    //UNCOMMENT WHEN DEPLOYING - set user location
    const [userLng, setLng] = useState();
    const [userLat, setLat] = useState();
    // const [userLocationModal, setUserLocationModal] = useState(true);
    // let latitude;
    // let longitude;
    // const setUserLocation = () => {
    //     console.log("click on my location");
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function (position) {
    //             latitude = position.coords.latitude;
    //             longitude = position.coords.longitude;
    //         });
    //     }

    //     setTimeout(() => {
    //         setLng(longitude);
    //         setLat(latitude);
    //         // console.log("user lat and long", userLat, userLng);
    //         setUserLocationModal(!userLocationModal);
    //     }, 3000);
    // };

    //fetch api data stored in back-end
    useEffect(() => {
        //fetch the json with the recent sightings
        const fetchAPIData = async () => {
            const res = await fetch("/api/data.json");
            const data = await res.json();
            // console.log("api data", data);
            setData(data);
        };
        fetchAPIData();
    }, []);

    //fetch user sightings
    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetch("/api/user-data.json");
            const userData = await res.json();
            // console.log("user data on mountin", userData);

            dispatch(receiveUserData(userData));
        };
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetch("/api/birddata.json")
            .then((res) => res.json())
            .then((birdData) => {
                dispatch(receiveBirdData(birdData));
            });
    });

    const userPin = useSelector((state) => state.pinCoordinates);
    const popupCoord = useSelector((state) => state.popupInfo.coordinates);

    return (
        <>
            <div className="map">
                {/* <UserLocation setUserLocation={setUserLocation} /> */}
                {/* {!userLocationModal && ( */}
                <Map data={data} userLng={userLng} userLat={userLat} />
                {/* )} */}
            </div>
            {Object.keys(userPin).length !== 0 && <NewPin userPin={userPin} />}
            {popupCoord && popupCoord.length !== 0 && <Popup />}
        </>
    );
}
