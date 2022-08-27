import useStatefulFields from "../hooks/useStatefulFields.js";
import useAuthSubmit from "../hooks/useAuthSubmit.js";
import { Link } from "react-router-dom";
import "./App.css";

export default function Login() {
    const [values, onFormInputChange] = useStatefulFields();
    const [error, onFormSubmit] = useAuthSubmit("/login.json", values);

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
                {error && <p className="error">{error}</p>}
                <h2>Login to start using Loa:</h2>
                <form
                    className="form-container"
                    id="login"
                    onSubmit={onFormSubmit}
                    method="post"
                    action="/login"
                >
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={onFormInputChange}
                        // className={
                        //     this.state.errors.email ? "errorfield" : ""
                        // }
                    ></input>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Min 6 characters"
                        onChange={onFormInputChange}
                        // className={
                        //     this.state.errors.password ? "errorfield" : ""
                        // }
                    ></input>
                    <input type="submit" id="submit" value="Login"></input>
                </form>
                <p id="footnote">
                    No login yet? <Link to="/">Register</Link>
                </p>
            </div>
        </>
    );
}
