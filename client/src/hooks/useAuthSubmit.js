import { useState } from "react";

export default function useAuthSubmit(url, fieldsArray, values) {
    const [serverError, setServerError] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let errorFields = {};
        for (let field of fieldsArray) {
            if (!values[field]) {
                errorFields[field] = "Please complete all fields";
            }
        }

        if (Object.keys(errorFields).length !== 0) {
            setErrors(errorFields);
            setServerError("");
            return true;
        } else {
            return false;
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            return;
        }

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                if (!data.success && data.message) {
                    setErrors({});
                    setServerError(data.message);
                } else {
                    window.location.assign("/");
                }
            })
            .catch((err) => {
                console.log(err);
                setErrors({});
                setServerError("Trouble reaching the server");
            });
    };

    //we want to return the error and the function onSubmit (when the outer code wants to trigger this hook it calls on Submit)
    return [serverError, errors, onSubmit];
}
