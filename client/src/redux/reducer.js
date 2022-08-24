import { combineReducers } from "redux";
import NewUserMarkerReducer from "./new-user-marker/slice";

const rootReducer = combineReducers({
    pinCoordinates: NewUserMarkerReducer,
});

export default rootReducer;
