export default function PopupReducer(popup = {}, action) {
    switch (action.type) {
        case "popup/receive":
            // console.log("popup info in main reducer", action.payload);
            return action.payload;
        case "popup/close":
            // console.log("reset info in main reducer", action.payload);
            return {};
        default:
            return popup;
    }
}

export function openPopup(info) {
    return {
        type: "popup/receive",
        payload: info,
    };
}

export function closePopup(info = null) {
    return {
        type: "popup/close",
        payload: info,
    };
}
