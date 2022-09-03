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
                date: d.obsDt,
            },
        });
    });
    return geojsonData;
};

module.exports.randomizeIdenticalCoordinates = (data) => {
    let latArray = [];
    let lngArray = [];

    data = data.map(function (entry) {
        if (latArray.includes(entry.lat) && lngArray.includes(entry.lng)) {
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
            latArray.push(entry.lat);
            lngArray.push(entry.lng);
            return { ...entry };
        }
    });

    return data;
};
