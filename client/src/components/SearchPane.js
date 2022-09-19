import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { receiveSearchedBird } from "../redux/searched-bird/slice";
import { DatalistInput, useComboboxControls } from "react-datalist-input";
import "../stylesheets/SearchPane.css";

export default function SearchPane({ toggleSearchPane, isSearchPaneVisible }) {
    const dispatch = useDispatch();
    const [searchedBird, setSearchedBird] = useState(null);
    const { value, setValue } = useComboboxControls({
        initialValue: "",
    });

    //define the list of birds in the search box
    const searchableBirds = useSelector(
        (state) =>
            state.availableBirds &&
            state.availableBirds.map((bird) =>
                bird[Object.keys(bird)].split("-").join(" ")
            )
    );

    let uniqueSearchableBirds = [...new Set(searchableBirds)]
        .sort()
        .map((bird, idx) => ({
            id: idx,
            value: bird,
        }));

    //on select function for the filter
    const onSelect = (sel) => {
        setValue(sel.value);
        setSearchedBird(sel.value);
        dispatch(receiveSearchedBird(sel.value));
        toggleSearchPane();
    };

    const resetSearch = () => {
        setValue("");
    };

    return (
        <>
            <span className="close-search" onClick={toggleSearchPane}>
                X
            </span>
            <h4>Search the map for a bird</h4>
            <div id="filter">
                <DatalistInput
                    placeholder="Start typing a bird name"
                    showLabel={false}
                    value={value}
                    items={uniqueSearchableBirds}
                    onSelect={onSelect}
                />
            </div>
        </>
    );
}
