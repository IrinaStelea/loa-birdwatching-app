import useStatefulFields from "../hooks/useStatefulFields.js";
import useAuthSubmit from "../hooks/useAuthSubmit.js";
import { Link } from "react-router-dom";
import "../stylesheets/App.css";

export default function Login() {
    const [values, onFormInputChange] = useStatefulFields();
    const [serverError, errors, onFormSubmit] = useAuthSubmit(
        "/login.json",
        ["email", "password"],
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
                    <p className="error">{errors.message}</p>
                )}
                <h2>Login to start using Loa:</h2>
                <form
                    className="form-container"
                    id="login"
                    onSubmit={onFormSubmit}
                    method="post"
                    action="/login"
                >
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
                    <input type="submit" id="submit" value="Login"></input>
                </form>
                <p id="footnote">
                    No login yet? <Link to="/register">Register</Link>
                </p>
            </div>
        </>
    );
}
