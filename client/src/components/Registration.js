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
            <h1>Welcome</h1>
            <div className="container">
                {error && <p className="error">{error}</p>}
                <h4>Register to find and report bird sightings around you:</h4>
                <form
                    id="registration"
                    className="form-container"
                    onSubmit={onSubmit}
                    method="post"
                    action="/register"
                >
                    <label htmlFor="firstName">First name</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        onChange={onFormInputChange}
                        // className={
                        //     this.state.errors.firstName ? "errorfield" : ""
                        // }
                    ></input>
                    <label htmlFor="lastName">Last name</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        onChange={onFormInputChange}
                        // className={
                        //     this.state.errors.lastName ? "errorfield" : ""
                        // }
                    ></input>
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
                    <input type="submit" id="submit" value="Register"></input>
                </form>

                <p>
                    Already a member? <Link to="/login">Log in</Link>
                </p>
            </div>
        </>
    );
}
