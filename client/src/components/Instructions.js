export default function Instructions({ toggleInstructions }) {
    return (
        <>
            <div className="popup">
                <h4 id="close" onClick={toggleInstructions}>
                    x
                </h4>
                <div className="info-popup">
                    <p>
                        It looks like you don't have any bird sightings yet.
                        Click/tap on the map to add a new pin.
                    </p>
                </div>
            </div>
        </>
    );
}
