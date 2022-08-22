//handle the submit button; pass the url and the values of the form as parameters

import { useState } from "react";

export default function useAuthSubmit(url, values) {
    const [error, setError] = useState("");
    const onSubmit = (e) => {
        e.preventDefault();
        console.log("url of fetch", url, "values of fetch", values);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (!data.success && data.message) {
                    setError(data.message);
                } else {
                    window.location.assign("/");
                }
            })
            .catch((err) => {
                console.log(err);
                setError("trouble reaching the server");
            });
    };

    //we want to return the error and the function onSubmit (when the outer code wants to trigger this hook it calls on Submit)
    return [error, onSubmit];
}

//and in registration
//delete onformSubmit
// import useAuthSubmit from ...
// const [values, onFormInputChange]=
// const [error, onFormSubmit] = useAuthSubmit("/register", values);
//then comes the reutrn

//same in login
