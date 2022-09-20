export default function FoundBirdReducer(foundBird = null, action) {
    if (action.type === "found-bird/receive") {
        foundBird = action.payload;
        // console.log("foundBird: 	", foundBird);
    }
    if (action.type === "found-bird/reset") {
        foundBird = action.payload;
    }

    return foundBird;
}

export function receiveFoundBird(foundBird) {
    return {
        type: "found-bird/receive",
        payload: foundBird,
    };
}

export function resetFoundBird(foundBird = null) {
    return {
        type: "found-bird/reset",
        payload: foundBird,
    };
}
