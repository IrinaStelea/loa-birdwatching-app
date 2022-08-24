import "./Map.css";
import { useRef, useState, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = `pk.eyJ1IjoiY2FwYXR1bGx1bWlpIiwiYSI6ImNsNzV4MW8xNTA1cTEzdm1pdmNyYzZib2IifQ.ij1zzeUFjHOcpPf4Wlc3Kw`;

export default function Map({ data, userLng = 13.39, userLat = 52.52 }) {
    // console.log("data in the map component", data);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(userLng); //13.39
    const [lat, setLat] = useState(userLat); //52.52
    const [zoom, setZoom] = useState(11);
    const [click, setClick] = useState(false);

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

        map.current.on("click", function addMarker(e) {
            console.log("click event on main map", e);

            if (e.clickOnLayer !== undefined) {
                console.log("prevent basemap click", e.clickOnLayer);
                return;
            }
            var coordinates = e.lngLat;
            console.log("Lng:", coordinates.lng, "Lat:", coordinates.lat);

            // const userMarker =
            new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);
        });

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

    const showMarkers = (e) => {
        e.stopPropagation();

        // convert data to geojson
        var geojsonData = [];
        function updateMap(data) {
            data.forEach(function (d) {
                geojsonData.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [d.lng, d.lat],
                    },
                    properties: {
                        comName: d.comName,
                        sciName: d.sciName,
                    },
                });
            });
        }

        updateMap(data);
        console.log("data geosjon", geojsonData);

        map.current.addSource("sightings", {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: geojsonData,
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

        //add pop-up with info to each marker
        map.current.on("click", "sightings", (e) => {
            //stop propagation to avoid clash with the click event from the user
            // e.originalEvent.preventDefault();
            // var coordClick = e.lngLat;
            // console.log(
            //     "Lng:",
            //     coordClick.lng,
            //     "Lat:",
            //     coordClick.lat,
            //     "id",
            //     e.id
            // );
            e.clickOnLayer = true;

            // console.log("state of click", click);
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const comName = e.features[0].properties.comName;
            const sciName = e.features[0].properties.sciName;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup({ offset: 25 })
                .setLngLat(coordinates)
                .setHTML(`<h2>${comName}</h2><p>${sciName}</p>`)
                .addTo(map.current);
        });
    };

    //set map to a new state when user moves it
    // useEffect(() => {});

    // //user click on map -> new marker
    // const showMyMarkers = () => {
    //     let geojsonUser = {};
    //     map.current.addSource("user-sightings", {
    //         type: "geojson",
    //         data: {
    //             type: "FeatureCollection",
    //             features: geojsonUser,
    //         },
    //     });

    //     map.current.addLayer({
    //         id: "user-sightings",
    //         type: "circle",
    //         source: "user-sightings",
    //         paint: {
    //             "circle-radius": 8,
    //             "circle-stroke-width": 2,
    //             "circle-color": "red",
    //             "circle-stroke-color": "white",
    //         },
    //     });
    // };

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
            <button id="show-birds" onClick={showMarkers}>
                Birds around me
            </button>
            <button
                id="my-sightings"
                // onClick={showMyMarkers}
            >
                My sightings
            </button>
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
