import React from "react";
// import logo from "../logo.svg";
import "./App.css";
import Map from "./Map.js";

function App() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        //fetch the json with the recent sightings
        fetch("/api/data.json")
            .then((res) => res.json())
            .then((data) => {
                // console.log("response from server, data", data);
                setData(data);
            });
    }, []);

    //fetch to eBird API
    // React.useEffect(() => {
    //     let myHeaders = new Headers();
    //     myHeaders.append("X-eBirdApiToken", "roeouv9euh7o");

    //     let requestOptions = {
    //         method: "GET",
    //         headers: myHeaders,
    //         redirect: "follow",
    //     };
    //     let lat = 52.62;
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

    return (
        <>
            <div className="map">
                <Map data={data} />
            </div>
        </>
    );
}

export default App;
