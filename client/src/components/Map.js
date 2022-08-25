import "./Map.css";
import { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useDispatch } from "react-redux";
import {
    addUserMarker,
    resetUserMarker,
} from "../redux/new-user-marker/slice.js";
// import Popup from "./Popup/Popup.js";
import { openPopup } from "../redux/popup/slice.js";

mapboxgl.accessToken = `pk.eyJ1IjoiY2FwYXR1bGx1bWlpIiwiYSI6ImNsNzV4MW8xNTA1cTEzdm1pdmNyYzZib2IifQ.ij1zzeUFjHOcpPf4Wlc3Kw`;

export default function Map({
    data,
    userData,
    userLng = 13.39,
    userLat = 52.52,
}) {
    // console.log("data in the map component", data);
    const dispatch = useDispatch();
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(userLng); //13.39
    const [lat, setLat] = useState(userLat); //52.52
    const [zoom, setZoom] = useState(11);
    const [myPin, setPin] = useState();
    const [markersLayerVisible, setMarkersLayer] = useState(false);
    const [markersButtonView, setMarkersButtonView] = useState(1);
    const [myMarkersLayerVisible, setMyMarkersLayer] = useState(false);
    const [myMarkersButtonView, setMyMarkersButtonView] = useState(1);
    // const [birdImg, setBirdImage] = useState();

    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }));

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

    //user adds own markers
    useEffect(() => {
        //add pop-up with info to each API marker
        map.current.on("click", "sightings", (e) => {
            e.clickOnLayer = true;
            // get coordinates of click + bird info
            const coordinates = e.features[0].geometry.coordinates.slice();
            const comName = e.features[0].properties.comName;
            const sciName = e.features[0].properties.sciName;
            const date = e.features[0].properties.date;
            dispatch(openPopup({ coordinates, comName, sciName, date }));
            // const birdImg = birdData.find(
            //     (bird) => bird.sciName === e.features[0].properties.sciName
            // );

            // (async () => {
            //     const image = await fetch(`/api/birddata/${sciName}`).then(
            //         (resp) => resp.json()
            //     );
            //     // .then((res) => {
            //     //     console.log("response fetch bird data", res);
            //     //     setBirdImage(res.image);
            //     // });
            //     setBirdImage(image.image);
            // })();

            // const popupNode = document.createElement("div");
            // ReactDOM.render(
            //     <Popup
            //         comName={e.features[0].properties.comName}
            //         sciName={e.features[0].properties.sciName}
            //         date={e.features[0].properties.date}
            //     />,
            //     popupNode
            // );
            // popUpRef.current
            //     .setLngLat(coordinates)
            //     .setDOMContent(popupNode)
            //     .addTo(map.current);

            //fetch bird image
            // fetch(`/api/birddata/${sciName}`)
            //     .then((res) => res.json())
            //     .then((response) => {
            //         // console.log("response from server, bird data", birdData);
            //         console.log("response fetch bird data", response);
            //         setBirdImage(response.image);
            //     });

            // if map is zoomed out and multiple copies of the feature are visible, the popup appears over the copy being pointed to
            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            // }
            // console.log("bird img after click", birdImg);
            // //set marker

            // new mapboxgl.Popup({ offset: 25 })
            //     .setLngLat(coordinates)
            //     .setHTML(
            //         `<h2>${comName}</h2><p>${sciName}</p><img id="bird-thumbnail" src=${birdImg} /><p>Spotted on ${date
            //             .slice(0, 10)
            //             .split("-")
            //             .reverse()
            //             .join("-")} at ${date.slice(11, 19)}</p>`
            //     )
            //     .addTo(map.current);
        });

        //add pop-up with info to each existing user marker
        map.current.on("click", "user-sightings", (e) => {
            e.clickOnLayer = true;
            // get coordinates of click + bird info
            const coordinates = e.features[0].geometry.coordinates.slice();
            const comName = e.features[0].properties.comName;
            const sciName = e.features[0].properties.sciName;
            const date = e.features[0].properties.date;
            dispatch(openPopup({ coordinates, comName, sciName, date }));
            // // if map is zoomed out and multiple copies of the feature are visible, the popup appears over the copy being pointed to
            // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            // }

            // //set marker
            // new mapboxgl.Popup({ offset: 25 })
            //     .setLngLat(coordinates)
            //     .setHTML(
            //         `<h2>${comName}</h2><p>${sciName}</p><p>Spotted by you on ${date
            //             .slice(0, 10)
            //             .split("-")
            //             .reverse()
            //             .join("-")} at ${date.slice(11, 17)}</p>`
            //     )
            //     .addTo(map.current);
        });

        //add new pin on user click
        map.current.on("click", function addMarker(e) {
            console.log("e in click", e);
            if (e.clickOnLayer) {
                console.log("preventing click on basemap");
                return;
            }
            console.log("click event on main map", e);
            console.log("zoom on click", Math.max(zoom, 18));
            var coordinates = e.lngLat;
            map.current.flyTo({
                center: coordinates,
                zoom: Math.max(18, zoom),
            });
            dispatch(addUserMarker(coordinates));
            // const userMarker =
            // new mapboxgl.Marker()
            //     .setLngLat(coordinates)
            //     .addTo(map.current)
            //     .on("click", (e) => e.target.remove());

            // //pop-up new pin
            // setTimeout(() => {
            //     new mapboxgl.Popup({ offset: 25 })
            //         .setLngLat(coordinates)
            //         .setHTML(`<h3>Add a new bird sighting</h3>`)
            //         .addTo(map.current);
            // }, 1500);
        });
    }, []);
    // });

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
                "circle-radius": 8,
                "circle-stroke-width": 2,
                "circle-color": "green",
                "circle-stroke-color": "white",
            },
        });
        setMarkersButtonView(2);
    };

    // //user click on map -> new marker
    const showMyMarkers = (e) => {
        e.stopPropagation();
        // console.log("data geojson in app", data);

        map.current.addSource("user-sightings", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: userData,
            },
        });

        map.current.addLayer({
            id: "user-sightings",
            type: "circle",
            source: "user-sightings",
            paint: {
                "circle-radius": 8,
                "circle-stroke-width": 2,
                "circle-color": "red",
                "circle-stroke-color": "white",
            },
        });

        setMyMarkersButtonView(2);
        // var layers = map.current.getStyle().layers;
        // var layer = layers.filter((layer) => layer.id === "user-sightings");
        // console.log("map layers", layer);

        // layer.addData()
    };

    // const userMarkers = map.current.getSource("user-sightings");
    // userMarkers.setData({
    //     type: "FeatureCollection",
    //     features: [
    //         {
    //             type: "Feature",
    //             geometry: {
    //                 type: "Point",
    //                 coordinates: [13.36054, 52.516399],
    //             },
    //             properties: {
    //                 comName: "Great Spotted Woodpecker",
    //                 sciName: "Dendrocopos major",
    //             },
    //         },
    //     ],
    // });

    // useEffect(() => {

    //     // Ensure that if the map is zoomed out such that multiple
    //     // copies of the feature are visible, the popup appears
    //     // over the copy being pointed to.
    //     //     while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
    //     //         coordinates[0] +=
    //     //             event.lngLat.lng > coordinates[0] ? 360 : -360;
    //     //     }
    //     //     var popup = new mapboxgl.Popup({ offset: 35 })
    //     //         .setLngLat(coordinates)
    //     //         .setHTML("MapBox Coordinate<br/>" + coordinates)
    //     //         .addTo(map);
    //     // });
    // });

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
