import { useSelector, useDispatch } from "react-redux";
import { resetFoundBird } from "../../redux/found-bird/slice";
import "../../stylesheets/SearchPane.css";
export default function SearchResults({
    toggleSearchResults,
    isSearchResultsVisible,
}) {
    const dispatch = useDispatch();
    const foundBird = useSelector((state) => state.foundBird);
    return (
        <>
            <span
                className="close-search"
                onClick={() => {
                    toggleSearchResults();
                    dispatch(resetFoundBird());
                }}
            >
                X
            </span>
            <p id="search-results-info">
                {foundBird.name} was seen {foundBird.number}{" "}
                {foundBird.number === 1 ? "time" : "times"}
            </p>
        </>
    );
}
