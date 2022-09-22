import React from "react";
import ReactDOM from "react-dom/client";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducer.js";
import * as immutableState from "redux-immutable-state-invariant";
import reportWebVitals from "./reportWebVitals";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./components/App";
import Welcome from "./components/Welcome";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css"; //map's own stylesheet

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

const root = ReactDOM.createRoot(document.getElementById("root"));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            root.render(<Welcome />);
        } else {
            root.render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
        }
    });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
