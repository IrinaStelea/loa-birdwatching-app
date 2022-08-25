import { combineReducers } from "redux";
import NewUserMarkerReducer from "./new-user-marker/slice";
import BirdDataReducer from "./bird-data/slice";
import PopupReducer from "./popup/slice";

const rootReducer = combineReducers({
    pinCoordinates: NewUserMarkerReducer,
    birdData: BirdDataReducer,
    popupInfo: PopupReducer,
});

export default rootReducer;
