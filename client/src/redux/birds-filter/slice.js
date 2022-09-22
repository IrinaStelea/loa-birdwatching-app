export default function BirdsFilterReducer(availableBirds = [], action) {
    switch (action.type) {
        case "filter-birds/receive":
            return action.payload;
        case "filter-birds/add":
            return [...availableBirds, action.payload];
        case "filter-birds/delete":
            return availableBirds.filter(
                (bird) =>
                    Object.keys(bird)[0] !== Object.keys(action.payload)[0]
            );
        case "filter-birds/reset":
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

export function addAvailableBird(data) {
    return {
        type: "filter-birds/add",
        payload: data,
    };
}

export function deleteAvailableBird(data) {
    return {
        type: "filter-birds/delete",
        payload: data,
    };
}

export function resetAvailableBirds(data = []) {
    return {
        type: "filter-birds/reset",
        payload: data,
    };
}
