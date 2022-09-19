export default function Instructions({ toggleInstructions, instructions }) {
    return (
        <>
            <div className="popup">
                <h4 id="close" onClick={toggleInstructions}>
                    x
                </h4>
                <div className="info-popup">
                    <p>{instructions}</p>
                </div>
            </div>
            <div className="overlay" onClick={toggleInstructions}></div>
        </>
    );
}
