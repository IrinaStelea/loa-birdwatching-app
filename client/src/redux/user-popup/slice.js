export default function IsUserPopupReducer(userPopup = false, action) {
    if (action.type === "user-popup/open") {
        userPopup = action.payload;
    }

    return userPopup;
}

export function receiveUserPopup(userPopup) {
    return {
        type: "user-popup/open",
        payload: userPopup,
    };
}
