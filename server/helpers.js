//function to clean first and last name of user
module.exports.cleanString = (string) => {
    return string
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase())
        .join(" ");
};

//function to convert data from API into geoJson for populating the map
module.exports.convertToGeojson = (data) => {
    var geojsonData = [];
    data.forEach(function (d, idx) {
        geojsonData.push({
            id: idx,
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [d.lng, d.lat],
            },
            properties: {
                comName: d.comName,
                sciName: d.sciName,
                date: d.obsDt,
            },
        });
    });
    return geojsonData;
};

//function to slightly offset identical coordinates so they can be added as separate points to the map (Mapbox does not work well with clusters)
module.exports.randomizeIdenticalCoordinates = (data) => {
    let coordObj = {};
    //look for identical lat & long and store them in an temporary object as key-value pairs
    data = data.map(function (entry) {
        if (
            Object.keys(coordObj).includes(`${entry.lat}`) &&
            coordObj[entry.lat] === entry.lng
        ) {
            return {
                ...entry,
                lat:
                    entry.lat +
                    (Math.random() > 0.5 ? 0.0001 : -0.0001) +
                    Math.random() * 0.00008,
                lng:
                    entry.lng +
                    (Math.random() > 0.5 ? 0.0001 : -0.0001) +
                    Math.random() * 0.00003,
            };
        } else {
            coordObj[entry.lat] = entry.lng;
            return { ...entry };
        }
    });

    return data;
};

//the same sighting can have multiple pictures in the image table, merge those images into an array
module.exports.mergeIdenticalSightings = (data) => {
    const temp = data.reduce((a, b) => {
        const found = a.find((e) => e.id == b.id);
        return (
            found
                ? found.image_url.push(b.image_url)
                : a.push({ ...b, image_url: [b.image_url] }),
            a
        );
    }, []);
    return temp;
};
