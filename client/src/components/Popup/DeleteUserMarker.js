import { useDispatch } from "react-redux";
import { deleteMarker } from "../../redux/user-markers/slice";
export default function DeleteUserMarker({ info, togglePopUp }) {
    const dispatch = useDispatch();
    const deleteUserMarker = () => {
        const id = info.id;
        // console.log("id in delete user marker", id);
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
                togglePopUp();
            })
            .catch((err) => {
                console.log("error in deleting user marker", err);
            });
    };

    // console.log("info in delete user marker", info);
    return (
        <input
            type="submit"
            id="delete"
            value="Delete"
            onClick={deleteUserMarker}
        ></input>
    );
}
