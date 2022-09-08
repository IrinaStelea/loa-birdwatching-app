import { useEffect, useState } from "react";
import "../../stylesheets/Uploader.css";

export default function Uploader({ toggleUploader, setView }) {
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [error, setError] = useState("");

    const handleImageInput = (e) => {
        const file = e.target.files[0];
        // do file validation here
        // //file validation: check the file extension
        const imageMimeType = /image\/(png|jpg|jpeg|gif)/i;
        if (!file.type.match(imageMimeType)) {
            setError("Please upload a valid image file");
            return;
        }
        setFile(file);
    };

    //preview of the uploaded file
    useEffect(() => {
        let fileReader = false;
        let isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result);
                }
            };
            fileReader.readAsDataURL(file);
        }
        //if the read process is incomplete when the component rerenders or unmounts, abort
        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        };
    }, [file]);

    const onImageSubmit = (e) => {
        e.preventDefault();

        //image validation
        const imageMimeType = /image\/(png|jpg|jpeg|gif)/i;

        if (!file) {
            setError("Please upload an image first");
            return;
        }
        if (!file.type.match(imageMimeType)) {
            setError("Please upload a valid image file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

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
            {fileDataURL && (
                <img id="bird-img" src={fileDataURL} alt="preview" />
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
