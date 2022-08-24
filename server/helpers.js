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
            },
        });
    });
    return geojsonData;
};
