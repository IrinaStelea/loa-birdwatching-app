export default function BirdDataReducer(birdData = [], action) {
    if (action.type === "bird-data/receive") {
        birdData = action.payload;
    }

    return birdData;
}

export function receiveBirdData(data) {
    return {
        type: "bird-data/receive",
        payload: data,
    };
}
