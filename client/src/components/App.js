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
import Instructions from "./Instructions.js";
import SearchPane from "./Search/SearchPane.js";
import SearchResults from "./Search/SearchResults.js";
import { receiveBirdData } from "../redux/bird-data/slice";
import { receiveUserData } from "../redux/user-markers/slice";
import "../stylesheets/App.css";

export default function App() {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [isInfoBoxVisible, setInfoBoxVisibility] = useState(false);
    const [isInstructionsVisible, setInstructionsVisibility] = useState(false);
    const [instructions, setInstructions] = useState("");
    const [isSearchPaneVisible, setPane] = useState(false);
    const [isSearchResultsVisible, setSearchResults] = useState(false);
    const [isNewPinVisible, setNewPinVisibility] = useState(false);

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

    const toggleInstructions = (param) => {
        setInstructionsVisibility(!isInstructionsVisible);
        if (param === "no sightings") {
            setInstructions(
                "It looks like you don't have any bird sightings yet. Click/tap on the map to add a new pin."
            );
        }
    };

    const toggleSearchPane = () => {
        setPane(!isSearchPaneVisible);
    };

    const toggleSearchResults = () => {
        setSearchResults(!isSearchResultsVisible);
    };

    const toggleNewPinPopUp = () => {
        setNewPinVisibility(!isNewPinVisible);
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
                                    toggleInstructions={toggleInstructions}
                                    toggleSearchPane={toggleSearchPane}
                                    isSearchPaneVisible={isSearchPaneVisible}
                                    toggleSearchResults={toggleSearchResults}
                                    isSearchResultsVisible={
                                        isSearchResultsVisible
                                    }
                                    setSearchResults={setSearchResults}
                                    toggleNewPinPopUp={toggleNewPinPopUp}
                                    isNewPinVisible={isNewPinVisible}
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
            {Object.keys(userPin).length !== 0 && (
                <NewPin
                    userPin={userPin}
                    toggleNewPinPopUp={toggleNewPinPopUp}
                    isNewPinVisible={isNewPinVisible}
                />
            )}
            {popupCoord && popupCoord.length !== 0 && <Popup />}
            {isInfoBoxVisible && <Infobox toggleInfoBox={toggleInfoBox} />}
            {isInstructionsVisible && (
                <Instructions
                    toggleInstructions={toggleInstructions}
                    instructions={instructions}
                />
            )}
            <div
                className={
                    "search-pane" + (!isSearchPaneVisible ? "" : " visible")
                }
            >
                {isSearchPaneVisible && (
                    <SearchPane
                        toggleSearchPane={toggleSearchPane}
                        isSearchPaneVisible={isSearchPaneVisible}
                    />
                )}{" "}
            </div>
            {isSearchPaneVisible && <div className="overlay"></div>}
            <div
                className={
                    "search-results" +
                    (!isSearchResultsVisible ? "" : " search-visible")
                }
            >
                {isSearchResultsVisible && (
                    <SearchResults
                        toggleSearchResults={toggleSearchResults}
                        isSearchResultsVisible={isSearchResultsVisible}
                    />
                )}
            </div>
        </>
    );
}
