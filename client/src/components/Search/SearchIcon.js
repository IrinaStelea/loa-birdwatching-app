import { useDispatch } from "react-redux";
import { resetSearchedBird } from "../../redux/searched-bird/slice";

export default function SearchIcon({ toggleSearchPane }) {
    const dispatch = useDispatch();

    return (
        <div
            className="search-icon"
            onClick={() => {
                toggleSearchPane();
                dispatch(resetSearchedBird());
            }}
        >
            <img
                id="search-icon"
                src="../../search_icon.png"
                alt="search icon"
            />
        </div>
    );
}
