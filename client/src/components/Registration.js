import useStatefulFields from "../hooks/useStatefulFields.js";
import useAuthSubmit from "../hooks/useAuthSubmit.js";
import { Link } from "react-router-dom";
import "../stylesheets/App.css";

export default function Registration() {
    const [values, onFormInputChange] = useStatefulFields();
    const [serverError, errors, onSubmit] = useAuthSubmit(
        "/api/register",
        ["firstName", "lastName", "email", "password"],
        values
    );

    return (
        <>
            <div className="container">
                <a href="/">
                    <img
                        id="logo"
                        src="../../Loa-logo_transparent.png"
                        alt="Loa logo"
                    />
                </a>
                {serverError && <p className="error">{serverError}</p>}
                {Object.keys(errors).length !== 0 && (
                    <p className="error">Please complete all fields</p>
                )}
                <h2>Register to start using Loa:</h2>
                <form
                    // always add an id to match the label otherwise clicking on the label won't work
                    id="registration"
                    className="form-container"
                    onSubmit={onSubmit}
                    method="post"
                    action="/register"
                >
                    <div className="form-entry">
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder=" "
                            onChange={onFormInputChange}
                            className={errors.firstName ? "errorfield" : ""}
                        ></input>
                        <label htmlFor="firstName">First name</label>
                    </div>
                    <div className="form-entry">
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder=" "
                            onChange={onFormInputChange}
                            className={errors.lastName ? "errorfield" : ""}
                        ></input>
                        <label htmlFor="lastName">Last name</label>
                    </div>
                    <div className="form-entry">
                        <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder=" "
                            onChange={onFormInputChange}
                            className={errors.email ? "errorfield" : ""}
                        ></input>
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-entry">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder=" "
                            onChange={onFormInputChange}
                            className={errors.password ? "errorfield" : ""}
                        ></input>
                        <label htmlFor="password">Password</label>
                    </div>
                    <input type="submit" id="submit" value="Register"></input>
                </form>

                <p id="footnote">
                    Already a member? <Link to="/login">Log in</Link>
                </p>
            </div>
        </>
    );
}
