import { useSelector } from "react-redux";
import { useState } from "react";

export default function Images({ fullUserDataforPopup, popup }) {
    const [imageIndex, setImageIndex] = useState(0);
    const userImages = fullUserDataforPopup[0]?.image_url;
    const selBird = useSelector(
        (state) =>
            state.birdData &&
            state.birdData.filter((bird) => bird.sciName === popup.sciName)
    );

    const prevImage = () => {
        imageIndex !== 0
            ? setImageIndex(imageIndex - 1)
            : setImageIndex(userImages.length - 1);
    };
    const nextImage = () => {
        imageIndex !== userImages.length - 1
            ? setImageIndex(imageIndex + 1)
            : setImageIndex(0);
    };

    return (
        <div className="pin-images">
            {userImages && userImages[0] ? (
                <div id="image-container">
                    {userImages.length > 1 ? (
                        <h4 id="image-container-arrow" onClick={prevImage}>
                            &lt;
                        </h4>
                    ) : (
                        <div></div>
                    )}
                    <img
                        key={imageIndex}
                        id="bird-thumbnail"
                        src={userImages[imageIndex]}
                        alt={popup.comName}
                    />
                    {userImages.length > 1 ? (
                        <h4 id="image-container-arrow" onClick={nextImage}>
                            &gt;
                        </h4>
                    ) : (
                        <div></div>
                    )}
                </div>
            ) : (
                <img
                    id="bird-thumbnail"
                    src={
                        selBird.length !== 0
                            ? selBird[0].image
                            : "../../default_pic.png"
                    }
                    alt={popup.comName}
                />
            )}
            {selBird.length !== 0 && (
                <a href={selBird[0].url} target="_blank" rel="noreferrer">
                    <img
                        id="info-icon"
                        src="../../info_icon_pink.png"
                        alt="info icon"
                    />
                </a>
            )}
        </div>
    );
}
