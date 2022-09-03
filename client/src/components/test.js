let data = [
    {
        type: "Feature",
        geometry: { type: "Point", coordinates: [52.514701, 13.3614924] },
        properties: {
            comName: "Rock Pigeon",
            sciName: "Columba livia",
            date: "2022-08-29 10:02",
        },
    },
    {
        type: "Feature",
        geometry: { type: "Point", coordinates: [52.514701, 13.3614924] },
        properties: {
            comName: "Rock Pigeon",
            sciName: "Columba livia",
            date: "2022-08-29 10:02",
        },
    },
];

data.map((entry) => ({
    ...entry,
    geometry: {
        ...entry.geometry,
        coordinates: entry.geometry.coordinates.map(
            (nb) =>
                nb +
                ((Math.random() > 0.5 ? 0.001 : -0.009) + Math.random() * 0.008)
        ),
    },
}));

console.log(data);
