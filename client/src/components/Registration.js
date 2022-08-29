// import { useState, useEffect } from "react";
import useStatefulFields from "../hooks/useStatefulFields.js";
import useAuthSubmit from "../hooks/useAuthSubmit.js";
import "./App.css";
import { Link } from "react-router-dom";

export default function Registration() {
    const [values, onFormInputChange] = useStatefulFields();
    const [error, onSubmit] = useAuthSubmit("/api/register", values);

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
                <h2>Register to start using Loa:</h2>
                <form
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
                            placeholder=" "
                            onChange={onFormInputChange}
                            // className={
                            //     this.state.errors.firstName ? "errorfield" : ""
                            // }
                        ></input>
                        <label htmlFor="firstName">First name</label>
                    </div>
                    <div className="form-entry">
                        <input
                            type="text"
                            name="lastName"
                            placeholder=" "
                            onChange={onFormInputChange}
                            // className={
                            //     this.state.errors.lastName ? "errorfield" : ""
                            // }
                        ></input>
                        <label htmlFor="lastName">Last name</label>
                    </div>
                    <div className="form-entry">
                        <input
                            type="email"
                            name="email"
                            placeholder=" "
                            onChange={onFormInputChange}
                            // className={
                            //     this.state.errors.email ? "errorfield" : ""
                            // }
                        ></input>
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-entry">
                        <input
                            type="password"
                            name="password"
                            placeholder=" "
                            onChange={onFormInputChange}
                            // className={
                            //     this.state.errors.password ? "errorfield" : ""
                            // }
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
