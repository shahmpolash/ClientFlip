import React, { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../firebase.init";
import { Link } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [logo, setLogo] = useState([]);

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
        } catch (error) {
            console.error("Error sending password reset email", error);
        }
    };

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/logo`)
            .then((res) => res.json())
            .then((info) => setLogo(info[0]));
    }, []);

    return (
        <>
            <div></div>

            <div
                className="blog-page-area pd-top-100 pd-bottom-100 mb-5"
                data-aos="fade-up"
                data-aos-duration={2000}
            >
                <div className="page-content">
                    <section className="bg-auth">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-12">
                                    <div
                                        className="card auth-box mb-15"
                                        style={{ background: "#0c0f2d" }}
                                    >
                                        <div className="row g-0">
                                            <div className="col-lg-6 text-center">
                                                <div className="card-body p-4">

                                                    <Link to="/">
                                                        <img src={logo.logo} alt="logo" />
                                                    </Link>

                                                    <div className="mt-5">
                                                        <img
                                                            width={250}
                                                            src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7966.jpg"
                                                            alt=""
                                                            className="img-fluid rounded"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <div className="auth-content card-body p-5 h-100 text-white">
                                                    <div className="w-100">
                                                        <div className="text-center mb-4">
                                                            <h4 className="text-white">Reset Password !</h4>
                                                        </div>

                                                        {resetSent ? (
                                                            <div className="text-center mb-4">
                                                                <h5 className="text-white">Password reset. Check your inbox!</h5>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    type="email"
                                                                    className="form-control mb-30"
                                                                    placeholder="Enter your email"
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                />


                                                                <div className="mt-2">
                                                                    <div className="isotope-filters item-isotope-btn text-lg-center">
                                                                        <button onClick={handleResetPassword} type="submit" className="button active">
                                                                            Send Reset Email
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </>
                                                        )}
                                                        <div className="mt-4 text-center">
                                                            <p className="mb-0">
                                                                Have an account ?{" "}
                                                                <Link
                                                                    to="/login"
                                                                    className="fw-medium text-white text-decoration-underline"
                                                                >
                                                                    {" "}
                                                                    Login Now{" "}
                                                                </Link>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
