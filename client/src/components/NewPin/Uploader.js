import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAvailableBird } from "../../redux/birds-filter/slice";
import "../../stylesheets/Uploader.css";
import { addMarker } from "../../redux/user-markers/slice";

export default function Uploader({ toggleUploader, setView }) {
    const [imageFiles, setImageFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
    const [error, setError] = useState("");
    const imageMimeType = /image\/(png|jpg|jpeg|gif)/i;
    const dispatch = useDispatch();

    const prevImage = () => {
        imageIndex !== 0
            ? setImageIndex(imageIndex - 1)
            : setImageIndex(onImageSubmit.length - 1);
    };
    const nextImage = () => {
        imageIndex !== images.length - 1
            ? setImageIndex(imageIndex + 1)
            : setImageIndex(0);
    };

    const handleImageInput = (e) => {
        const { files } = e.target;
        const validImageFiles = [];
        // //file validation: check the file extension

        for (let file of files) {
            if (file.type.match(imageMimeType)) {
                validImageFiles.push(file);
            }
        }
        if (validImageFiles.length !== 0) {
            setImageFiles(validImageFiles);
            return;
        }
        setError("Please upload a valid image file");
    };

    //preview of the uploaded file
    useEffect(() => {
        let fileReaders = [];
        let images = [];
        let isCancel = false;
        if (imageFiles.length) {
            imageFiles.forEach((file) => {
                const fileReader = new FileReader();
                fileReaders.push(fileReader);
                fileReader.onload = (e) => {
                    let { result } = e.target;
                    if (result) {
                        images.push(result);
                    }
                    if (images.length === imageFiles.length && !isCancel) {
                        setImages(images);
                    }
                };
                fileReader.readAsDataURL(file);
            });
        }

        //if the read process is incomplete when the component rerenders or unmounts, abort
        return () => {
            isCancel = true;
            for (let fileReader of fileReaders) {
                if (fileReader.readyState === 1) {
                    fileReader.abort();
                }
            }
        };
    }, [imageFiles]);

    const onImageSubmit = (e) => {
        e.preventDefault();

        //image validation
        const validImageFiles = [];
        for (let image of imageFiles) {
            if (image.type.match(imageMimeType)) {
                validImageFiles.push(image);
            }
        }

        if (!validImageFiles.length) {
            setError("Please upload one or more images first");
            return;
        }
        // console.log("imagefiles inside submit", imageFiles);
        const formData = new FormData();
        validImageFiles.forEach((file) => formData.append("file", file));

        for (const pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }

        fetch("/api/upload-image", {
            method: "POST",
            body: formData,
        })
            .then((result) => result.json())
            .then((data) => {
                if (!data.success && data.message) {
                    setError(data.message);
                } else {
                    console.log("image added successfully, data is", data);
                    dispatch(
                        addMarker({
                            id: data.images[0].id,
                            sighting: data.images[0].sighting,
                            image_url: data.images.map(
                                (image) => image.image_url
                            ),
                        })
                    );
                    dispatch(
                        addAvailableBird({
                            [data.images[0].id]:
                                data.images[0].sighting.properties.comName,
                        })
                    );
                    toggleUploader();
                    setView(3);
                }
            });
    };

    return (
        <div id="uploader">
            {/* {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )} */}
            {error && <p className="error-uploader">{error}</p>}
            {/* {images.length > 0 && (
                <div id="preview-images">
                    {images.map((img, idx) => (
                        <img key={idx} id="bird-img" src={img} alt="preview" />
                    ))}
                </div>
            )} */}
            {images.length > 0 && (
                <div id="image-container">
                    {images.length > 1 ? (
                        <h4 id="image-container-arrow" onClick={prevImage}>
                            &lt;
                        </h4>
                    ) : (
                        <div></div>
                    )}
                    <img
                        key={imageIndex}
                        id="bird-img"
                        src={images[imageIndex]}
                        alt="preview"
                    />
                    {images.length > 1 ? (
                        <h4 id="image-container-arrow" onClick={nextImage}>
                            &gt;
                        </h4>
                    ) : (
                        <div></div>
                    )}
                </div>
            )}
            <form
                id="upload-image"
                onSubmit={onImageSubmit}
                method="post"
                action="/api/upload-image"
            >
                <input
                    type="file"
                    accept="image/*"
                    name="file"
                    onChange={handleImageInput}
                    multiple
                />
                {images.length > 0 && (
                    <input
                        type="submit"
                        id="submit-uploader"
                        value="Upload &amp; save"
                    ></input>
                )}
            </form>
        </div>
    );
}
