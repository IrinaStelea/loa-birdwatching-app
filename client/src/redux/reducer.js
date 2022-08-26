import { combineReducers } from "redux";
import NewUserMarkerReducer from "./new-user-marker/slice";
import BirdDataReducer from "./bird-data/slice";
import PopupReducer from "./popup/slice";
import IsUserPopupReducer from "./user-popup/slice";
import UserDataReducer from "./user-markers/slice";

const rootReducer = combineReducers({
    pinCoordinates: NewUserMarkerReducer,
    birdData: BirdDataReducer,
    userData: UserDataReducer,
    popupInfo: PopupReducer,
    isUserPopup: IsUserPopupReducer,
});

export default rootReducer;
