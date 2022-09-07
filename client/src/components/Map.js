import { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { addUserMarker } from "../redux/new-user-marker/slice.js";
import { openPopup } from "../redux/popup/slice.js";
import { receiveUserPopup } from "../redux/user-popup/slice.js";
import { receiveAvailableBirds } from "../redux/birds-filter/slice";
import { resetAvailableBirds } from "../redux/birds-filter/slice";
import { closePopup } from "../redux/popup/slice";
import Logout from "./Logout.js";
import { DatalistInput, useComboboxControls } from "react-datalist-input";
import "../stylesheets/Map.css";

mapboxgl.accessToken = `pk.eyJ1IjoiY2FwYXR1bGx1bWlpIiwiYSI6ImNsNzV4MW8xNTA1cTEzdm1pdmNyYzZib2IifQ.ij1zzeUFjHOcpPf4Wlc3Kw`;

export default function Map({ data, userLng = 13.39, userLat = 52.52 }) {
    const dispatch = useDispatch();
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(userLng); //13.39
    const [lat, setLat] = useState(userLat); //52.52
    const [zoom, setZoom] = useState(11);

    const [markersLayerVisible, setMarkersLayer] = useState(true);
    const [markersButtonView, setMarkersButtonView] = useState(1);
    const [userMarkersLayerVisible, setUserMarkersLayer] = useState(true);
    const [userMarkersButtonView, setUserMarkersButtonView] = useState(1);
    const [userCurrentMarkersLayer, setUserCurrentMarkersLayer] = useState();
    const [searchedBird, setSearchedBird] = useState(null);
    const { value, setValue } = useComboboxControls({
        initialValue: "",
    });

    const userData = useSelector((state) => state.userData);

    //define the list of birds in the search box
    const searchableBirds = useSelector(
        (state) =>
            state.availableBirds &&
            state.availableBirds.map((bird) =>
                bird[Object.keys(bird)].split("-").join(" ")
            )
    );

    let uniqueSearchableBirds = [...new Set(searchableBirds)]
        .sort()
        .map((bird, idx) => ({
            id: idx,
            value: bird,
        }));

    const popup = useSelector((state) => state.popupInfo);

    //initialize map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [userLng, userLat],
            zoom: zoom,
        });

        //wait for map to be initialised
        if (!map.current) return;
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
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
                "circle-radius": 10,
                "circle-stroke-width": 2,
                "circle-color": "#758bfd",
                "circle-stroke-color": "white",
            },
        });
    };

    const initUserLayer = () => {
        let userMarkers = userData.map((marker) => {
            return { ...marker.sighting, id: marker.id };
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
                "circle-radius": 10,
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
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

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

            // get coordinates of click + bird info
            const coordinates = e.features[0].geometry.coordinates;
            const { comName, sciName, date } = e.features[0].properties;
            const id = e.features[0].id;
            dispatch(openPopup({ coordinates, comName, sciName, date, id }));
            dispatch(receiveUserPopup(true));
        });

        //add new pin on user click
        map.current.on("click", function addMarker(e) {
            if (e.clickOnLayer) {
                // console.log("preventing click on basemap");
                return;
            }
            var coordinates = e.lngLat;
            //close other popups if open
            dispatch(closePopup());
            //dispatch coord for user marker
            dispatch(addUserMarker(coordinates));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let flying = false;
        map.current.on("flystart", () => {
            console.log("inside fly start");
            flying = true;
        });

        map.current.on("flyend", () => {
            flying = false;
        });

        map.current.on("movestart", (e) => {
            if (flying) {
                return;
            }
            dispatch(resetAvailableBirds());
            console.log("inside move start");
            setValue("");
        });
        map.current.on("moveend", (e) => {
            if (flying) {
                map.current.fire("flyend");
            }
            if (
                typeof map.current.getLayer("sightings") === "undefined" &&
                typeof map.current.getLayer("user-sightings") === "undefined"
            ) {
                return;
            }

            let allPins = map.current.queryRenderedFeatures({
                layers: ["user-sightings", "sightings"],
            });

            let birdNames = allPins.map((pin) => ({
                [pin.id]: pin.properties.comName,
            }));

            dispatch(receiveAvailableBirds(birdNames));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //when clicking on the basemap, zoom in to 18 or more
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
                zoom: 22,
            });

            map.current.fire("flystart");
        });
    }, []);

    const toggleMarkersLayer = () => {
        if (markersLayerVisible) {
            map.current.setLayoutProperty("sightings", "visibility", "none");
            setMarkersButtonView(2);
        } else {
            map.current.setLayoutProperty("sightings", "visibility", "visible");
            setMarkersButtonView(1);
        }
        setMarkersLayer(!markersLayerVisible);
    };

    const toggleUserMarkersLayer = () => {
        if (userMarkersLayerVisible) {
            map.current.setLayoutProperty(
                "user-sightings",
                "visibility",
                "none"
            );
            setUserMarkersButtonView(2);
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

    //on select function for the filter
    const onSelect = useCallback((sel) => {
        console.log("inside on select", sel);
        setValue(sel.value);
        setSearchedBird(sel.value);
        var features = map.current.queryRenderedFeatures({
            layers: ["user-sightings", "sightings"],
        });
        if (!features.length) {
            return;
        }

        let selection = features.filter(
            (bird) => bird.properties.comName.split("-").join(" ") === sel.value
        );

        if (typeof map.current.getLayer("search-results") !== "undefined") {
            map.current.removeLayer("search-results");
            map.current.removeSource("search-results");
        }

        map.current.addSource("search-results", {
            type: "geojson",
            maxzoom: 24,
            data: {
                type: "FeatureCollection",
                features: selection,
            },
        });
        map.current.addLayer({
            id: "search-results",
            type: "circle",
            source: "search-results",
            paint: {
                "circle-radius": 10,
                "circle-stroke-width": 2,
                "circle-color": "green",
                "circle-stroke-color": "white",
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //delete search highlight in case user deletes that pin
    useEffect(() => {
        if (typeof map.current.getLayer("search-results") === "undefined") {
            return;
        }
        var oldFeatures = map.current.queryRenderedFeatures({
            layers: ["search-results"],
        });

        let updatedFeatures = oldFeatures.filter(
            (feature) => feature.id !== popup.id
        );

        map.current.getSource("search-results").setData({
            type: "FeatureCollection",
            features: updatedFeatures,
        });
    }, [popup]);

    const resetSearch = () => {
        if (typeof map.current.getLayer("search-results") !== "undefined") {
            map.current.removeLayer("search-results");
            map.current.removeSource("search-results");
            setValue("");
        }
    };

    //highlights for user pins
    useEffect(() => {
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
                typeof map.current.getLayer("user-sightings") === "undefined" ||
                typeof map.current.getLayer("sightings") === "undefined"
            ) {
                return;
            }

            var features = map.current.queryRenderedFeatures(e.point, {
                layers: ["user-sightings", "sightings"],
            });

            if (!features.length) {
                return;
            }
            if (typeof map.current.getLayer("selected-pin") !== "undefined") {
                // console.log("inside the simple if");
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
                    "circle-radius": 10,
                    "circle-stroke-width": 2,
                    "circle-color": "#353d60",
                    "circle-stroke-color": "white",
                },
            });
        });
    }, [popup]);

    useEffect(() => {
        if (userCurrentMarkersLayer === undefined) {
            return;
        }
        let updatedUserMarkers = userData.map((marker) => {
            return { ...marker.sighting, id: marker.id };
        });
        userCurrentMarkersLayer.setData({
            type: "FeatureCollection",
            features: updatedUserMarkers,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    return (
        <>
            <div className="button-container-top">
                <div className="top-icon">
                    <img src="../../Loa-logo_icon.png" alt="Loa logo" />
                </div>
                <div id="filter">
                    <DatalistInput
                        placeholder="Search for a bird"
                        showLabel={false}
                        value={value}
                        items={uniqueSearchableBirds}
                        onSelect={onSelect}
                    />
                </div>
                {searchedBird && (
                    <span className="close-top" onClick={resetSearch}>
                        X
                    </span>
                )}
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
                    All obs.
                </button>
                <button
                    id={
                        userMarkersButtonView === 1
                            ? "my-sightings-visible"
                            : "my-sightings"
                    }
                    onClick={toggleUserMarkersLayer}
                >
                    My obs.
                </button>

                <Logout />
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
