import { useState } from "react";

export default function useAuthSubmit(url, fieldsArray, values) {
    const [serverError, setServerError] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let errorFields = {};
        for (let field of fieldsArray) {
            if (!values[field]) {
                errorFields[field] = true;
                errorFields.message = "Please complete all fields \n";
            }
        }

        //client-side validation for email and password
        if (values.email !== undefined) {
            let lastAtPos = values.email.lastIndexOf("@");
            let lastDotPos = values.email.lastIndexOf(".");

            if (
                !(
                    lastAtPos < lastDotPos &&
                    lastAtPos > 0 &&
                    values.email.indexOf("@@") === -1 &&
                    lastDotPos > 2 &&
                    values.email.length - lastDotPos > 2
                )
            ) {
                errorFields.email = true;
                errorFields.message
                    ? (errorFields.message += "Please provide a valid email \n")
                    : (errorFields.message = "Please provide a valid email \n");
            }
        }

        if (values.password !== undefined && values.password.length < 6) {
            errorFields.password = true;
            errorFields.message
                ? (errorFields.message +=
                      "Password must be 6 or more characters \n")
                : (errorFields.message =
                      "Password must be 6 or more characters \n");
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

    //return the errors and onSubmit to be used in registration & login
    return [serverError, errors, onSubmit];
}
