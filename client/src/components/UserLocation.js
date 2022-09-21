import "../stylesheets/LocationPane.css";

export default function UserLocation({
    toggleLocationPopup,
    setStartLng,
    setStartLat,
    setDidUserSetLocation,
}) {
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setStartLng(position.coords.longitude);
                setStartLat(position.coords.latitude);
                setDidUserSetLocation(true);
            });
        } else {
            setStartLng(13.39);
            setStartLat(52.52);
        }

        toggleLocationPopup();
    };

    return (
        <>
            <h4>Allow this app to get your current location?</h4>
            <p id="save-dark" onClick={getUserLocation}>
                Yes, use my location
            </p>
            <p id="save-dark" onClick={toggleLocationPopup}>
                No, use default location &#40;Berlin&#41;
            </p>
        </>
    );
}
