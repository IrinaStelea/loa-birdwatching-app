export default function UserDataReducer(userData = [], action) {
    if (action.type === "user-data/receive") {
        userData = action.payload;
    }

    if (action.type === "user-data/delete") {
        userData = userData.filter((marker) => marker.id !== action.payload);
    }

    if (action.type === "user-data/add") {
        userData = [...userData, action.payload];
    }

    return userData;
}

export function receiveUserData(data) {
    return {
        type: "user-data/receive",
        payload: data,
    };
}

export function addMarker(data) {
    return {
        type: "user-data/add",
        payload: data,
    };
}

export function deleteMarker(id) {
    return {
        type: "user-data/delete",
        payload: id,
    };
}
