export default function NewUserMarkerReducer(pinCoordinates = {}, action) {
    switch (action.type) {
        case "new-marker/receive":
            console.log("coordinates in main reducer", action.payload);
            return action.payload;
        case "new-marker/reset":
            console.log("reset coordinates in main reducer", action.payload);
            return {};
        default:
            return pinCoordinates;
    }
}

export function addUserMarker(coordinates) {
    return {
        type: "new-marker/receive",
        payload: coordinates,
    };
}

export function resetUserMarker(coordinates = null) {
    return {
        type: "new-marker/reset",
        payload: coordinates,
    };
}
