export default function Logout() {
    const logout = () => {
        fetch("/logout")
            .then((response) => response.json())
            .then(() => {
                //redirect to login
                window.history.pushState("", "", "/");
                window.location.reload();
            })
            .catch((err) => {
                console.log("logout error", err);
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
