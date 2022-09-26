import { useDispatch } from "react-redux";
import { useState } from "react";
import { deleteAvailableBird } from "../../redux/birds-filter/slice";
import { deleteMarker } from "../../redux/user-markers/slice";

export default function DeleteUserMarker({ info, togglePopUp, setError }) {
    const dispatch = useDispatch();

    const [confirmation, setConfirmation] = useState(false);

    const deleteUserMarker = () => {
        const id = info.id;

        fetch("/api/delete-user-marker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.message) {
                    dispatch(deleteMarker(id));
                    dispatch(deleteAvailableBird({ [info.id]: info.comName }));
                    togglePopUp();
                } else {
                    setError(data.error);
                    setConfirmation(false);
                }
            })
            .catch((err) => {
                console.log("error in deleting user marker", err);
                setError("Something went wrong, please try again");
                setConfirmation(false);
            });
    };

    return (
        <>
            {!confirmation && (
                <p id="delete" onClick={() => setConfirmation(true)}>
                    Delete this sighting
                </p>
            )}
            {confirmation && (
                <>
                    <p id="confirm">
                        Are you sure? This will also delete any images you
                        uploaded
                    </p>
                    <p id="delete" onClick={deleteUserMarker}>
                        Yes, delete
                    </p>
                    <p id="delete" onClick={() => setConfirmation(false)}>
                        Cancel
                    </p>
                </>
            )}
        </>
    );
}
