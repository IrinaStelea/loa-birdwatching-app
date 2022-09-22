export default function PopupReducer(popup = {}, action) {
    switch (action.type) {
        case "popup/receive":
            return action.payload;
        case "popup/close":
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
