export default function UserDataReducer(userData = [], action) {
    if (action.type === "user-data/receive") {
        userData = action.payload;
        console.log("user data in main reducer", userData);
    }

    if (action.type === "user-data/delete") {
        userData = userData.filter((marker) => marker.id !== action.payload);
        // console.log("inside delete user marker in main reducer");
    }

    if (action.type === "user-data/add") {
        userData = [...userData, action.payload];
        console.log("adding user data in main reducer", userData);
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
