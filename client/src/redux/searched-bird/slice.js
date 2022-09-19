export default function SearchedBirdReducer(searchedBird = null, action) {
    if (action.type === "searched-bird/receive") {
        searchedBird = action.payload;
    }
    if (action.type === "searched-bird/reset") {
        searchedBird = action.payload;
    }

    return searchedBird;
}

export function receiveSearchedBird(searchedBird) {
    return {
        type: "searched-bird/receive",
        payload: searchedBird,
    };
}

export function resetSearchedBird(searchedBird = null) {
    return {
        type: "searched-bird/reset",
        payload: searchedBird,
    };
}
