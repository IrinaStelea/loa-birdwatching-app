import "./Map.css";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useDispatch } from "react-redux";
import { addUserMarker } from "../redux/new-user-marker/slice.js";
import { openPopup } from "../redux/popup/slice.js";
import { receiveUserPopup } from "../redux/user-popup/slice.js";

mapboxgl.accessToken = `pk.eyJ1IjoiY2FwYXR1bGx1bWlpIiwiYSI6ImNsNzV4MW8xNTA1cTEzdm1pdmNyYzZib2IifQ.ij1zzeUFjHOcpPf4Wlc3Kw`;

export default function Map({ data, userLng = 13.39, userLat = 52.52 }) {
    // console.log("data in the map component", data);
    const dispatch = useDispatch();
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(userLng); //13.39
    const [lat, setLat] = useState(userLat); //52.52
    const [zoom, setZoom] = useState(11);
    const [markersLayerVisible, setMarkersLayer] = useState(false);
    const [markersButtonView, setMarkersButtonView] = useState(1);
    const [myMarkersLayerVisible, setMyMarkersLayer] = useState(false);
    const [myMarkersButtonView, setMyMarkersButtonView] = useState(1);
    const userData = useSelector((state) => state.userData);
    // console.log("user data in map component", userData);
    const [userMarkersLayer, setUserMarkersLayer] = useState();

    const popup = useSelector((state) => state.popupInfo);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [userLng, userLat],
            zoom: zoom,
        });
        //add marker for user location
        new mapboxgl.Marker().setLngLat([userLng, userLat]).addTo(map.current);

        //wait for map to be initialised
        if (!map.current) return;
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

        // cleanup function to remove map on unmount
        return () => map.current.remove();
    }, []);

    //click events for markers
    useEffect(() => {
        //add pop-up with info to each API marker
        map.current.on("click", "sightings", (e) => {
            e.clickOnLayer = true;
            e.clickOnFirstLayer = true;
            // get coordinates of click + bird info
            const coordinates = e.features[0].geometry.coordinates.slice();
            const comName = e.features[0].properties.comName;
            const sciName = e.features[0].properties.sciName;
            const date = e.features[0].properties.date;
            dispatch(openPopup({ coordinates, comName, sciName, date }));
            dispatch(receiveUserPopup(false));
        });

        //add pop-up with info to each existing user marker

        map.current.on("click", "user-sightings", (e) => {
            e.clickOnLayer = true;
            if (e.clickOnFirstLayer) {
                // console.log("preventing click on user layer");
                return;
            }

            // get coordinates of click + bird info
            const coordinates = e.features[0].geometry.coordinates.slice();
            const comName = e.features[0].properties.comName;
            const sciName = e.features[0].properties.sciName;
            const date = e.features[0].properties.date;
            const id = e.features[0].id;
            dispatch(openPopup({ coordinates, comName, sciName, date, id }));
            dispatch(receiveUserPopup(true));
            // // if map is zoomed out and multiple copies of the feature are visible, the popup appears over the copy being pointed to
            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            // }
        });

        //add new pin on user click
        map.current.on("click", function addMarker(e) {
            // console.log("e in click", e);
            if (e.clickOnLayer) {
                console.log("preventing click on basemap");
                return;
            }
            // console.log("click event on main map", e);
            // console.log("zoom on click", Math.max(zoom, 18));
            var coordinates = e.lngLat;
            // map.current.flyTo({
            //     center: coordinates,
            //     // zoom: Math.max(18, zoom),
            // });
            dispatch(addUserMarker(coordinates));
        });
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
            // console.log("e in zoom funtion", e);
            map.current.flyTo({
                center: e.lngLat,
                zoom: Math.max(18, zoom),
            });
        });
    }, [zoom]);

    const toggleMarkersLayer = () => {
        !markersLayerVisible
            ? map.current.setLayoutProperty("sightings", "visibility", "none")
            : map.current.setLayoutProperty(
                  "sightings",
                  "visibility",
                  "visible"
              );
        setMarkersLayer(!markersLayerVisible);
    };

    const toggleMyMarkersLayer = () => {
        !myMarkersLayerVisible
            ? map.current.setLayoutProperty(
                  "user-sightings",
                  "visibility",
                  "none"
              )
            : map.current.setLayoutProperty(
                  "user-sightings",
                  "visibility",
                  "visible"
              );
        setMyMarkersLayer(!myMarkersLayerVisible);
    };

    //user click on ALL BIRDS => show general bird data
    const showMarkers = (e) => {
        e.stopPropagation();

        // console.log("data geojson in app", data);

        map.current.addSource("sightings", {
            type: "geojson",
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
                "circle-color": "#353d60",
                "circle-stroke-color": "white",
            },
        });

        setMarkersButtonView(2);
    };

    // //user click on MY BIRDS => show user sightings
    const showMyMarkers = (e) => {
        e.stopPropagation();
        // console.log("data geojson in app", data);
        let userMarkers = userData.map((marker) => {
            return { ...marker.sighting, id: marker.id };
        });
        // console.log("user markers mapped", userMarkers);
        map.current.addSource("user-sightings", {
            type: "geojson",
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
        setUserMarkersLayer(map.current.getSource("user-sightings"));
        // console.log("user markers layer", userMarkersLayer);
        setMyMarkersButtonView(2);
    };

    useEffect(() => {
        if (
            typeof map.current.getLayer("selected-pin") !== "undefined" &&
            Object.keys(popup).length === 0
        ) {
            console.log("inside the double if");
            map.current.removeLayer("selected-pin");
            map.current.removeSource("selected-pin");
        }

        map.current.on("click", "user-sightings", (e) => {
            //highlight selected pin
            if (typeof map.current.getLayer("user-sightings") === "undefined") {
                return;
            }

            var features = map.current.queryRenderedFeatures(e.point, {
                layers: ["user-sightings"],
            });

            if (!features.length) {
                return;
            }
            if (typeof map.current.getLayer("selected-pin") !== "undefined") {
                console.log("inside the simple if");
                map.current.removeLayer("selected-pin");
                map.current.removeSource("selected-pin");
            }

            var feature = features[0];

            // console.log(feature.toJSON());
            map.current.addSource("selected-pin", {
                type: "geojson",
                data: feature.toJSON(),
            });
            map.current.addLayer({
                id: "selected-pin",
                type: "circle",
                source: "selected-pin",
                paint: {
                    "circle-radius": 10,
                    "circle-stroke-width": 2,
                    "circle-color": "green",
                    "circle-stroke-color": "white",
                },
            });
        });
    }, [popup]);

    useEffect(() => {
        if (userMarkersLayer === undefined) {
            // console.log(
            //     "inside the return in use effect for updating the map, userMarkersLayer",
            //     userMarkersLayer
            // );
            return;
        }
        let updatedUserMarkers = userData.map((marker) => {
            // console.log("inside updated user markers");
            return { ...marker.sighting, id: marker.id };
        });
        userMarkersLayer.setData({
            type: "FeatureCollection",
            features: updatedUserMarkers,
        });
    }, [userData]);

    return (
        <>
            <div>
                <div className="sidebar">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div ref={mapContainer} className="map-container" />
            </div>
            {markersButtonView === 1 && (
                <button id="show-birds" onClick={showMarkers}>
                    Birds around me
                </button>
            )}
            {markersButtonView === 2 && (
                <button id="show-birds" onClick={toggleMarkersLayer}>
                    Toggle app markers
                </button>
            )}
            {myMarkersButtonView === 1 && (
                <button id="my-sightings" onClick={showMyMarkers}>
                    My sightings
                </button>
            )}
            {myMarkersButtonView === 2 && (
                <button id="my-sightings" onClick={toggleMyMarkersLayer}>
                    Toggle my sightings
                </button>
            )}
        </>
    );
}

// Add geolocate control to the map
// map.current.addControl(
//     new mapboxgl.GeolocateControl({
//         positionOptions: {
//             enableHighAccuracy: true,
//         },
//         // When active the map will receive updates to the device's location as it changes.
//         trackUserLocation: true,
//         // Draw an arrow next to the location dot to indicate which direction the device is heading.
//         showUserHeading: true,
//     })
// );
