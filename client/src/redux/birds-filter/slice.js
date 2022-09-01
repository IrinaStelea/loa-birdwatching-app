export default function BirdsFilterReducer(availableBirds = [], action) {
    switch (action.type) {
        case "filter-birds/receive":
            // console.log("available birds in main reducer", action.payload);
            return action.payload;
        case "filter-birds/reset":
            // console.log("available birds reset", action.payload);
            return [];

        default:
            return availableBirds;
    }
}

export function receiveAvailableBirds(data) {
    return {
        type: "filter-birds/receive",
        payload: data,
    };
}

export function resetAvailableBirds(data = []) {
    return {
        type: "filter-birds/reset",
        payload: data,
    };
}
