export default function SearchIcon({ toggleSearchPane }) {
    return (
        <div className="search-icon">
            <img
                id="search-icon"
                src="../../search_icon.png"
                alt="search icon"
                onClick={toggleSearchPane}
            />
        </div>
    );
}
