//function to clean first and last name

module.exports.cleanString = (string) => {
    return string
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((item) => item[0].toUpperCase() + item.slice(1).toLowerCase())
        .join(" ");
};

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

module.exports.randomizeIdenticalCoordinates = (data) => {
    //look for identical lat & long and store them in an object as key-value pairs
    let coordObj = {};
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

module.exports.mergeIdenticalSightings = (data) => {
    const temp = data.reduce((a, b) => {
        const found = a.find((e) => e.id == b.id && e.sighting && b.sighting);
        return (
            found
                ? found.image_url.push(b.image_url)
                : a.push({ ...b, image_url: [b.image_url] }),
            a
        );
    }, []);
    return temp;
};
