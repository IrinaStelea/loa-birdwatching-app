import { Link } from "react-router-dom";

export default function Logout() {
    const logout = () => {
        fetch("/logout")
            .then((response) => response.json())
            .then((data) => {
                console.log("data after logout", data);
                //redirect to login
                window.location.assign("/login");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            {" "}
            <div id="logout" onClick={logout}>
                <img src="../../logout.png" alt="logout icon" />
            </div>
        </>
    );
}
