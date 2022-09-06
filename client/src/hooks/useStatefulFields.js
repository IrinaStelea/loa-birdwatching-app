import { useState } from "react";

//have stateful fields everywhere in our application
export default function useStatefulFields() {
    const [values, setValues] = useState({});
    const onChange = (e) => {
        setValues({
            ...values,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };
    //return the values and the onChange to be used externally
    return [values, onChange];
}
