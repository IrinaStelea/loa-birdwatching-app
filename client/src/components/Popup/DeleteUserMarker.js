import { useDispatch } from "react-redux";
import { deleteMarker } from "../../redux/user-markers/slice";
import { useState } from "react";
import { deleteAvailableBird } from "../../redux/birds-filter/slice";
export default function DeleteUserMarker({ info, togglePopUp }) {
    const dispatch = useDispatch();
    const [confirmation, setConfirmation] = useState(false);

    const deleteUserMarker = () => {
        const id = info.id;
        console.log("info in delete", info);
        fetch("/api/delete-user-marker", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("response from delete", data);
                dispatch(deleteMarker(id));
                dispatch(deleteAvailableBird({ [info.id]: info.comName }));
                togglePopUp();
            })
            .catch((err) => {
                console.log("error in deleting user marker", err);
            });
    };

    // console.log("info in delete user marker", info);
    return (
        <>
            <p id="delete" onClick={() => setConfirmation(true)}>
                Delete this sighting
            </p>
            {confirmation && (
                <>
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
