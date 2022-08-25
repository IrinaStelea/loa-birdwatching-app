export default function BirdDataReducer(birdData = [], action) {
    if (action.type === "bird-data/receive") {
        //set the friends on the global state based on the payload
        birdData = action.payload;
        console.log("bird data in main reducer", birdData);
    }

    return birdData;
}

//action for other friends (when visiting other profile pages)
export function receiveBirdData(data) {
    return {
        type: "bird-data/receive",
        payload: data,
    };
}
