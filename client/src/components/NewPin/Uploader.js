import { useEffect, useState } from "react";
import "../../stylesheets/Uploader.css";

export default function Uploader({ toggleUploader, setView }) {
    const [imageFiles, setImageFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");

    const handleImageInput = (e) => {
        const { files } = e.target;
        const validImageFiles = [];
        // //file validation: check the file extension
        const imageMimeType = /image\/(png|jpg|jpeg|gif)/i;
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
        // const imageMimeType = /image\/(png|jpg|jpeg|gif)/i;

        // if (!file) {
        //     setError("Please upload an image first");
        //     return;
        // }
        // if (!file.type.match(imageMimeType)) {
        //     setError("Please upload a valid image file");
        //     return;
        // }

        const formData = new FormData();
        for (let file of imageFiles) {
            formData.append("file", file);
        }
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
        return;
        fetch("/api/upload-image", {
            method: "post",
            body: formData,
        })
            .then((result) => result.json())
            .then((data) => {
                console.log("response from upload image fetch", data);
                if (!data.success && data.message) {
                    setError(data.message);
                } else {
                    console.log("image added successfully");
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
            {images.length > 0 && (
                <>
                    {images.map((img, idx) => (
                        <img key={idx} id="bird-img" src={img} alt="preview" />
                    ))}
                </>
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
                    name="files"
                    onChange={handleImageInput}
                    multiple
                />
                <input
                    type="submit"
                    id="submit-uploader"
                    value="Upload"
                ></input>
            </form>
        </div>
    );
}
