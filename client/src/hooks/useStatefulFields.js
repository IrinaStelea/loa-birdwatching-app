import { useState } from "react";

export default function useStatefulFields() {
    const [values, setValues] = useState({});
    const onChange = (e) => {
        setValues({
            ...values,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };
    //return the values and the onChange to be used in registration & login
    return [values, onChange];
}
