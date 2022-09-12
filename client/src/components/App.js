import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Map from "./Map.js";
import Popup from "./Popup/Popup";
import NewPin from "./NewPin/NewPin.js";
import Infobox from "./Infobox.js";
import { receiveBirdData } from "../redux/bird-data/slice";
import { receiveUserData } from "../redux/user-markers/slice";
import "../stylesheets/App.css";

export default function App() {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [isInfoBoxVisible, setInfoBoxVisibility] = useState(false);
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

    const toggleInfoBox = () => {
        setInfoBoxVisibility(!isInfoBoxVisible);
    };

    return (
        <>
            <Router>
                <Routes>
                    {/* <UserLocation setUserLocation={setUserLocation} /> */}
                    {/* {!userLocationModal && ( */}
                    <Route
                        exact
                        path="/"
                        element={
                            <div className="map">
                                <Map
                                    data={data}
                                    userLng={userLng}
                                    userLat={userLat}
                                    toggleInfoBox={toggleInfoBox}
                                />
                            </div>
                        }
                    />
                    {/* <Map
                            data={data}
                            userLng={userLng}
                            userLat={userLat}
                            toggleInfoBox={toggleInfoBox}
                        /> */}
                    {/* )} */}

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
            {Object.keys(userPin).length !== 0 && <NewPin userPin={userPin} />}
            {popupCoord && popupCoord.length !== 0 && <Popup />}
            {isInfoBoxVisible && <Infobox toggleInfoBox={toggleInfoBox} />}
        </>
    );
}
