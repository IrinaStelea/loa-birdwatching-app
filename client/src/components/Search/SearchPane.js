import { useSelector, useDispatch } from "react-redux";
import { DatalistInput, useComboboxControls } from "react-datalist-input";
import { receiveSearchedBird } from "../../redux/searched-bird/slice";
import "../../stylesheets/SearchPane.css";

export default function SearchPane({ toggleSearchPane, isSearchPaneVisible }) {
    const dispatch = useDispatch();

    const { value, setValue } = useComboboxControls({
        initialValue: "",
    });

    //define the list of birds in the search box, dropping hyphens
    const searchableBirds = useSelector(
        (state) =>
            state.availableBirds &&
            state.availableBirds.map((bird) =>
                bird[Object.keys(bird)].split("-").join(" ")
            )
    );

    //avoid duplicates in bird search
    let uniqueSearchableBirds = [...new Set(searchableBirds)]
        .sort()
        .map((bird, idx) => ({
            id: idx,
            value: bird,
        }));

    //onSelect function for the search filter
    const onSelect = (sel) => {
        //disable focus on the text input (for soft keyboard mobile)
        const dataListInput = document.querySelector(
            ".react-datalist-input__textbox"
        );
        dataListInput.blur();

        setValue(sel.value);

        //on mobile, wait for soft keyboard to close so that map re-centers
        setTimeout(() => {
            dispatch(receiveSearchedBird(sel.value));
            toggleSearchPane();
        }, 500);
    };

    return (
        <>
            <p id="cancel-search" onClick={toggleSearchPane}>
                Cancel
            </p>
            {searchableBirds.length === 0 && (
                <p>
                    Turn on at least one of the sightings layers to be able to
                    search.
                </p>
            )}
            {searchableBirds.length !== 0 && (
                <>
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
            )}
        </>
    );
}
