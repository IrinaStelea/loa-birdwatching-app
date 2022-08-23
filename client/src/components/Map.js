import "./Map.css";
import { useRef, useState, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = `pk.eyJ1IjoiY2FwYXR1bGx1bWlpIiwiYSI6ImNsNzV4MW8xNTA1cTEzdm1pdmNyYzZib2IifQ.ij1zzeUFjHOcpPf4Wlc3Kw`;

export default function Map({ data }) {
    // console.log("data in the map component", data);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(13.41);
    const [lat, setLat] = useState(52.62);
    const [zoom, setZoom] = useState(11);

    const showMarkers = (e) => {
        e.stopPropagation();
        //add bird data to the map
        data.forEach(({ comName, sciName, lat, lng }) => {
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h2>${comName}</h2><p>${sciName}</p>`
            );
            const marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map.current);
        });
    };

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [lng, lat],
            zoom: zoom,
        });

        // Add geolocate control to the map
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
            })
        );
    });

    //set map to a new state when user moves it
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    //user click on map -> new marker
    useEffect(() => {
        map.current.on("click", function addMarker(event) {
            var coordinates = event.lngLat;
            console.log(
                "Lng:",
                coordinates.lng,
                "Lat:",
                coordinates.lat,
                "id",
                event.id
            );

            const userMarker = new mapboxgl.Marker()
                .setLngLat(coordinates)
                .addTo(map.current);
        });
        // marker.setLngLat(coordinates).addTo(map);
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        //     while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        //         coordinates[0] +=
        //             event.lngLat.lng > coordinates[0] ? 360 : -360;
        //     }
        //     var popup = new mapboxgl.Popup({ offset: 35 })
        //         .setLngLat(coordinates)
        //         .setHTML("MapBox Coordinate<br/>" + coordinates)
        //         .addTo(map);
        // });
    });

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
        </>
    );
}
