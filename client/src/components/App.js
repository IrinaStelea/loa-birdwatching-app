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

    const [startLng, setStartLng] = useState();
    const [startLat, setStartLat] = useState();
    const [didUserSetLocation, setDidUserSetLocation] = useState(false);
    const [APIdata, setAPIData] = useState(null);
    const [isInfoBoxVisible, setInfoBoxVisibility] = useState(false);
    const [isInstructionsVisible, setInstructionsVisibility] = useState(false);
    const [instructions, setInstructions] = useState("");
    const [isSearchPaneVisible, setPane] = useState(false);
    const [isSearchResultsVisible, setSearchResults] = useState(false);
    const [isNewPinVisible, setNewPinVisibility] = useState(false);

    function getLongAndLat() {
        return new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
    }

    //get position function
    const getPosition = async () => {
        try {
            if (navigator.geolocation) {
                const position = await getLongAndLat();
                setStartLng(position.coords.longitude);
                setStartLat(position.coords.latitude);
                setDidUserSetLocation(true);
            } else {
                setStartLng(13.39);
                setStartLat(52.52);
            }
        } catch (e) {
            console.log("error in getting location", e);
            setStartLng(13.39);
            setStartLat(52.52);
        }
    };

    useEffect(() => {
        getPosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //fetch api data stored in back-end
    useEffect(() => {
        if (!startLng || !startLat) return;
        //fetch the json with the recent sightings
        const fetchAPIData = async () => {
            const res = await fetch("/api/data.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lng: startLng, lat: startLat }),
            });
            const data = await res.json();
            // console.log("api data", data);
            setAPIData(data);
        };
        fetchAPIData();
    }, [startLng, startLat]);

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
                    <Route
                        exact
                        path="/"
                        element={
                            <div className="map">
                                <Map
                                    startLng={startLng}
                                    startLat={startLat}
                                    didUserSetLocation={didUserSetLocation}
                                    APIdata={APIdata}
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
