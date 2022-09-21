import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import {
    addUserMarker,
    resetUserMarker,
} from "../redux/new-user-marker/slice.js";
import { openPopup } from "../redux/popup/slice.js";
import { receiveUserPopup } from "../redux/user-popup/slice.js";
import {
    receiveAvailableBirds,
    resetAvailableBirds,
} from "../redux/birds-filter/slice";
import { receiveFoundBird } from "../redux/found-bird/slice.js";
import { closePopup } from "../redux/popup/slice";
import Logout from "./Logout.js";
import SearchIcon from "./Search/SearchIcon.js";
import "../stylesheets/Map.css";

mapboxgl.accessToken = `pk.eyJ1IjoiY2FwYXR1bGx1bWlpIiwiYSI6ImNsNzV4MW8xNTA1cTEzdm1pdmNyYzZib2IifQ.ij1zzeUFjHOcpPf4Wlc3Kw`;

export default function Map({
    data,
    userLng = 13.39,
    userLat = 52.52,
    toggleInfoBox,
    toggleInstructions,
    toggleSearchPane,
    isSearchPaneVisible,
    toggleSearchResults,
    isSearchResultsVisible,
    toggleNewPinPopUp,
    isNewPinVisible,
    setSearchResults,
}) {
    const dispatch = useDispatch();
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(userLng); //13.39
    const [lat, setLat] = useState(userLat); //52.52
    const [zoom, setZoom] = useState(11);

    const [isMapReady, setMapReady] = useState(false);
    const [markersLayerVisible, setMarkersLayer] = useState(true);
    const [markersButtonView, setMarkersButtonView] = useState(2);
    const [userMarkersLayerVisible, setUserMarkersLayer] = useState(true);
    const [userMarkersButtonView, setUserMarkersButtonView] = useState(2);
    const [userCurrentMarkersLayer, setUserCurrentMarkersLayer] = useState();
    const newPin = useSelector((state) => state.pinCoordinates);
    const userData = useSelector((state) => state.userData);
    const popup = useSelector((state) => state.popupInfo);
    const searchedBird = useSelector((state) => state.searchedBird);

    //initialize map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [userLng, userLat],
            zoom: zoom,
        });

        //add geolocation
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                fitBoundsOptions: { maxZoom: 10 },
                positionOptions: {
                    enableHighAccuracy: true,
                },
                // track user location as it changes
                trackUserLocation: true,
                // arrow to indicate device direction
                showUserHeading: true,
            })
        );

        //add custom icon
        map.current.loadImage("../../newMarker.png", (error, image) => {
            if (error) throw error;

            if (!map.current.hasImage("new-marker"))
                map.current.addImage("new-marker", image);
        });

        // cleanup function to remove map on unmount
        return () => map.current.remove();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initAPILayer = () => {
        map.current.addSource("sightings", {
            type: "geojson",
            maxzoom: 24, //this provides more precision for the highlight/select overlay
            data: {
                type: "FeatureCollection",
                features: data,
            },
        });

        map.current.addLayer({
            id: "sightings",
            type: "circle",
            source: "sightings",
            paint: {
                "circle-radius": 12,
                "circle-stroke-width": 2,
                "circle-color": "#758bfd",
                "circle-stroke-color": "white",
            },
        });
        setMarkersButtonView(1);
    };

    const initUserLayer = () => {
        let userMarkers = userData.map((marker) => {
            return {
                ...marker.sighting,
                id: marker.id,
            };
        });

        map.current.addSource("user-sightings", {
            type: "geojson",
            maxzoom: 24,
            data: {
                type: "FeatureCollection",
                features: userMarkers,
            },
        });

        map.current.addLayer({
            id: "user-sightings",
            type: "circle",
            source: "user-sightings",
            paint: {
                "circle-radius": 12,
                "circle-stroke-width": 2,
                "circle-color": "#f5756a",
                "circle-stroke-color": "white",
            },
        });

        //store the layer in a variable to be able to add/remove user pins
        setUserCurrentMarkersLayer(map.current.getSource("user-sightings"));

        setUserMarkersButtonView(1);
    };

    //layer of API pins
    useEffect(() => {
        if (!map.current) return;
        map.current.once("load", () => {
            if (typeof map.current.getLayer("sightings") !== "undefined")
                return;
            if (data) {
                initAPILayer();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    //add layer of user pins
    useEffect(() => {
        if (!map.current) return;

        map.current.once("load", () => {
            if (typeof map.current.getLayer("user-sightings") !== "undefined")
                return;
            if (userData.length !== 0) {
                initUserLayer();
            }
            setMapReady(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    //toggle instructions to add pin in case there aren't any yet
    useEffect(() => {
        if (userData.length === 0 && isMapReady === true) {
            toggleInstructions("no sightings");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMapReady]);

    //map events
    useEffect(() => {
        //add pop-up with info to each API marker
        map.current.on("click", "sightings", (e) => {
            e.clickOnLayer = true;
            const id = e.features[0].id;
            const coordinates = e.features[0].geometry.coordinates;
            const { comName, sciName, date } = e.features[0].properties;
            dispatch(openPopup({ id, coordinates, comName, sciName, date }));
            dispatch(receiveUserPopup(false));
        });

        map.current.on("click", "user-sightings", (e) => {
            e.clickOnLayer = true;
            // console.log("click on user layer", e.features[0]);
            // get coordinates of click + bird info
            const coordinates = e.features[0].geometry.coordinates;

            const { comName, sciName, date, imageUrl, comment } =
                e.features[0].properties;
            const id = e.features[0].id;
            dispatch(
                openPopup({
                    coordinates,
                    comName,
                    sciName,
                    date,
                    id,
                    imageUrl,
                    comment,
                })
            );
            dispatch(receiveUserPopup(true));
        });

        //add new pin on user click
        map.current.on("click", function addMarker(e) {
            if (e.clickOnLayer) {
                // console.log("preventing click on basemap");
                return;
            }

            var coordinates = e.lngLat;

            if (typeof map.current.getLayer("new-pin") !== "undefined") {
                map.current.removeLayer("new-pin");
                map.current.removeSource("point");
            }

            map.current.addSource("point", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [coordinates.lng, coordinates.lat],
                            },
                        },
                    ],
                },
            });

            map.current.addLayer({
                id: "new-pin",
                type: "symbol",
                source: "point",
                layout: {
                    "icon-image": "new-marker",
                    "icon-size": 0.075,
                },
            });

            //close other popups if open
            dispatch(closePopup());
            //close search results if open
            setSearchResults(false);
            //dispatch coord for user marker
            dispatch(addUserMarker(coordinates));

            toggleNewPinPopUp();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //useeffect for clearing the new marker layer
    useEffect(() => {
        if (
            Object.keys(newPin).length === 0 &&
            typeof map.current.getLayer("new-pin") !== "undefined"
        ) {
            map.current.removeLayer("new-pin");
            map.current.removeSource("point");
        }
    }, [newPin]);

    //useeffect to populate the search filter
    useEffect(() => {
        if (isSearchPaneVisible) {
            //close other popups if open
            dispatch(closePopup());
            //close new pin popup if open
            if (isNewPinVisible) {
                toggleNewPinPopUp();
                dispatch(resetUserMarker());
            }

            if (
                typeof map.current.getLayer("sightings") === "undefined" &&
                typeof map.current.getLayer("user-sightings") === "undefined"
            )
                return;

            if (!markersLayerVisible && !userMarkersLayerVisible) {
                return;
            }

            let APIBirds = [];
            let userBirds = [];
            let allBirds = [];
            if (
                typeof map.current.getLayer("sightings") !== "undefined" &&
                markersLayerVisible
            ) {
                APIBirds = map.current.getSource("sightings")._data.features;
            }

            if (
                typeof map.current.getLayer("user-sightings") !== "undefined" &&
                userMarkersLayerVisible
            ) {
                userBirds =
                    map.current.getSource("user-sightings")._data.features;
            }

            allBirds = [...APIBirds, ...userBirds];

            let birdNames = allBirds.map((pin) => ({
                [pin.id]: pin.properties.comName,
            }));

            dispatch(receiveAvailableBirds(birdNames));
        } else {
            dispatch(resetAvailableBirds());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearchPaneVisible, markersLayerVisible, userMarkersLayerVisible]);

    //when clicking on the basemap to add a new marker, center on that point
    useEffect(() => {
        map.current.on("click", function flexibleZoom(e) {
            if (typeof map.current.getLayer("sightings") !== "undefined") {
                let features = map.current.queryRenderedFeatures(e.point, {
                    layers: ["sightings"],
                });
                if (features.length !== 0) {
                    return;
                }
            }

            if (typeof map.current.getLayer("user-sightings") !== "undefined") {
                let features = map.current.queryRenderedFeatures(e.point, {
                    layers: ["user-sightings"],
                });
                if (features.length !== 0) {
                    return;
                }
            }
            map.current.flyTo({
                center: e.lngLat,
            });

            map.current.fire("flystart");
        });
    }, []);

    const toggleMarkersLayer = () => {
        if (markersLayerVisible) {
            map.current.setLayoutProperty("sightings", "visibility", "none");
            setMarkersButtonView(2);
            //reset available birds for search
            dispatch(resetAvailableBirds());
        } else {
            map.current.setLayoutProperty("sightings", "visibility", "visible");
            setMarkersButtonView(1);
        }
        setMarkersLayer(!markersLayerVisible);
    };

    const toggleUserMarkersLayer = () => {
        if (userData.length === 0) {
            return;
        }

        if (userMarkersLayerVisible) {
            map.current.setLayoutProperty(
                "user-sightings",
                "visibility",
                "none"
            );
            setUserMarkersButtonView(2);
            //reset available birds for search
            dispatch(resetAvailableBirds());
        } else {
            map.current.setLayoutProperty(
                "user-sightings",
                "visibility",
                "visible"
            );
            setUserMarkersButtonView(1);
        }
        setUserMarkersLayer(!userMarkersLayerVisible);
    };

    //filter select
    useEffect(() => {
        if (!searchedBird) return;

        if (markersLayerVisible) {
            let searchedBirdAPISciName = map.current
                .getSource("sightings")
                ._data.features.find(
                    (bird) =>
                        bird.properties.comName.split("-").join(" ") ===
                        searchedBird
                )?.properties.sciName;

            if (searchedBirdAPISciName) {
                map.current.setFilter("sightings", [
                    "all",
                    ["==", "sciName", `${searchedBirdAPISciName}`],
                ]);
            } else {
                map.current.setFilter("sightings", [
                    "all",
                    ["==", "comName", `${searchedBird}`],
                ]);
            }
        }
        if (
            typeof map.current.getLayer("user-sightings") !== "undefined" &&
            userMarkersLayerVisible
        ) {
            let searchedBirdUserSciName = map.current
                .getSource("user-sightings")
                ._data.features.find(
                    (bird) =>
                        bird.properties.comName.split("-").join(" ") ===
                        searchedBird
                )?.properties.sciName;

            map.current.setFilter("user-sightings", [
                "all",
                ["==", "sciName", `${searchedBirdUserSciName}`],
            ]);
        }

        let foundPins = [];
        if (markersLayerVisible) {
            foundPins = foundPins.concat(
                map.current
                    .getSource("sightings")
                    ._data.features.filter(
                        (bird) =>
                            bird.properties.comName.split("-").join(" ") ===
                            searchedBird
                    )
            );
        }

        if (
            typeof map.current.getLayer("user-sightings") !== "undefined" &&
            userMarkersLayerVisible
        )
            foundPins = foundPins.concat(
                map.current
                    .getSource("user-sightings")
                    ._data.features.filter(
                        (bird) =>
                            bird.properties.comName.split("-").join(" ") ===
                            searchedBird
                    )
            );

        if (foundPins.length === 0) {
            return;
        } else if (foundPins.length === 1) {
            map.current.flyTo({
                center: foundPins[0].geometry.coordinates,
            });
            dispatch(
                receiveFoundBird({
                    name: searchedBird,
                    number: foundPins.length,
                })
            );
            toggleSearchResults();
        } else {
            let minLng = Math.min(
                ...foundPins.map((p) => p.geometry.coordinates[0])
            );
            let maxLng = Math.max(
                ...foundPins.map((p) => p.geometry.coordinates[0])
            );
            let minLat = Math.min(
                ...foundPins.map((p) => p.geometry.coordinates[1])
            );
            let maxLat = Math.max(
                ...foundPins.map((p) => p.geometry.coordinates[1])
            );
            map.current.fitBounds(
                [
                    [minLng, minLat], // southwestern corner of the bounds
                    [maxLng, maxLat], // northeastern corner of the bounds
                ],
                {
                    padding: {
                        top: 60,
                        right: 60,
                        bottom: 150,
                        left: 60,
                    },
                }
            );

            dispatch(
                receiveFoundBird({
                    name: searchedBird,
                    number: foundPins.length,
                })
            );
            toggleSearchResults();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchedBird]);

    //useeffect to clear the search highlights
    useEffect(() => {
        if (isSearchResultsVisible) return;
        if (typeof map.current.getLayer("sightings") === "undefined") return;
        map.current.setFilter("sightings", null);
        if (typeof map.current.getLayer("user-sightings") !== "undefined") {
            map.current.setFilter("user-sightings", null);
        }
    }, [isSearchResultsVisible]);

    //highlights for user pins
    useEffect(() => {
        //remove layer of highlights if the popup is closed
        if (
            typeof map.current.getLayer("selected-pin") !== "undefined" &&
            Object.keys(popup).length === 0
        ) {
            map.current.removeLayer("selected-pin");
            map.current.removeSource("selected-pin");
        }

        map.current.on("click", (e) => {
            //highlight selected pin
            if (
                typeof map.current.getLayer("sightings") === "undefined" &&
                typeof map.current.getLayer("user-sightings") === "undefined"
            ) {
                return;
            }

            var features =
                typeof map.current.getLayer("user-sightings") === "undefined"
                    ? map.current.queryRenderedFeatures(e.point, {
                          layers: ["sightings"],
                      })
                    : map.current.queryRenderedFeatures(e.point, {
                          layers: ["user-sightings", "sightings"],
                      });

            if (!features.length) {
                return;
            }
            if (typeof map.current.getLayer("selected-pin") !== "undefined") {
                map.current.removeLayer("selected-pin");
                map.current.removeSource("selected-pin");
            }

            var feature = features[0];

            map.current.addSource("selected-pin", {
                type: "geojson",
                maxzoom: 24,
                data: feature.toJSON(),
            });
            map.current.addLayer({
                id: "selected-pin",
                type: "circle",
                source: "selected-pin",
                paint: {
                    "circle-radius": 12,
                    "circle-stroke-width": 2,
                    "circle-color": "#353d60",
                    "circle-stroke-color": "white",
                },
            });
        });
    }, [popup]);

    //update layer of user pins based on userData
    useEffect(() => {
        if (!map.current) return;

        if (
            userData.length === 0 &&
            typeof map.current.getLayer("user-sightings") !== "undefined"
        ) {
            map.current.removeLayer("user-sightings");
            map.current.removeSource("user-sightings");
            setUserMarkersButtonView(2);
        }

        if (
            map.current.loaded() &&
            userData.length !== 0 &&
            typeof map.current.getLayer("user-sightings") === "undefined"
        ) {
            initUserLayer();
        }

        if (userCurrentMarkersLayer === undefined) {
            return;
        } else {
            let updatedUserMarkers = userData.map((marker) => {
                return {
                    ...marker.sighting,
                    id: marker.id,
                    properties: {
                        ...marker.sighting.properties,
                        imageUrl: marker.image_url,
                    },
                };
            });
            userCurrentMarkersLayer.setData({
                type: "FeatureCollection",
                features: updatedUserMarkers,
            });

            //toggle user markers layers if invisible
            if (!userMarkersLayerVisible) {
                map.current.setLayoutProperty(
                    "user-sightings",
                    "visibility",
                    "visible"
                );
                setUserMarkersButtonView(1);
                setUserMarkersLayer(!userMarkersLayerVisible);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    return (
        <>
            <div className="button-container-top">
                <div className="top-icon">
                    <img
                        src="../../Loa-logo_icon.png"
                        alt="Loa logo"
                        onClick={toggleInfoBox}
                    />
                </div>
                <Logout />

                {/* <div
                    id="geolocate"
                >
                    <img src="../../location.png" alt="location icon" />
                </div> */}
            </div>
            <div>
                {/* <div className="sidebar">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div> */}

                <div ref={mapContainer} className="map-container" />
            </div>
            <div className="button-container-bottom">
                <button
                    id={
                        markersButtonView === 1
                            ? "show-birds-visible"
                            : "show-birds"
                    }
                    onClick={toggleMarkersLayer}
                >
                    All birds
                </button>
                {userData.length === 0 && (
                    <button
                        id="my-sightings"
                        onClick={() => toggleInstructions("no sightings")}
                    >
                        My birds
                    </button>
                )}
                {userData.length !== 0 && (
                    <button
                        id={
                            userMarkersButtonView === 1
                                ? "my-sightings-visible"
                                : "my-sightings"
                        }
                        onClick={toggleUserMarkersLayer}
                    >
                        My birds
                    </button>
                )}

                <SearchIcon toggleSearchPane={toggleSearchPane} />
            </div>
        </>
    );
}

//fetch to eBird API
// React.useEffect(() => {
//     fetch("/api")
//         .then((res) => res.json())
//         .then((data) => setData(data.message));
//     let myHeaders = new Headers();
//     myHeaders.append("X-eBirdApiToken", "roeouv9euh7o");

//     let requestOptions = {
//         method: "GET",
//         headers: myHeaders,
//         redirect: "follow",
//     };
//     let lat = 52.50;
//     let lng = 13.41;
//     //query param "back" sets the time frame (up to 30 days)
//     //query param "dist" sets the range (up to 50 km)
//     (async () => {
//         const response = await fetch(
//             `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&back=30&dist=50`,
//             requestOptions
//         );
//         const data = await response.json();
//         console.log("data from fetch", data);
//         setData(data);
//     })();
// }, []);
