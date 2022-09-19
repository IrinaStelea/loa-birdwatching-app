import NewPinPopUp from "./NewPinPopUp";
import "../../stylesheets/NewPin.css";

export default function NewPin({
    userPin,
    toggleNewPinPopUp,
    isNewPinVisible,
}) {

    return (
        <>
            {isNewPinVisible && (
                <>
                    <NewPinPopUp
                        userPin={userPin}
                        toggleNewPinPopUp={toggleNewPinPopUp}
                    />
                </>
            )}
        </>
    );
}
