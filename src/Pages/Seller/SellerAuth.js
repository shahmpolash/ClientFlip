import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { Link } from "react-router-dom";
import Loading from "../../components/Shared/Loading";

const SellerAuth = ({ children }) => {
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [user] = useAuthState(auth);
    
    useEffect(() => {
        if (user) {
            fetch(`https://server.enjoywiki.com/marketplace-server-main/users?UserEmail=${user?.email}`)
                .then((res) => res.json())
                .then((info) => {
                    setUserInfo(info);
                    setLoading(false); // Set loading to false after data is fetched
                });
        }
    }, [user]);

    if (loading) {
        return <div><Loading></Loading></div>; // Render loader while loading
    }

    const isAdminOrManager = userInfo.some((u) => {
        return user?.email === u.UserEmail && u.userRole === "Seller";
    });

    return isAdminOrManager ? (
        children
    ) : (
        <>
            <div className="home-btn d-none d-sm-block">
                <Link to="/" />
            </div>
            <div className="account-pages my-5 pt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card">
                                <div className="card-body">
                                    <div className="text-center mt-4">
                                        <div className="mb-3">
                                            <Link to="/" className="">
                                                <img
                                                    src="assets/images/logo-dark.png"
                                                    alt=""
                                                    height={22}
                                                    className="auth-logo logo-dark mx-auto"
                                                />
                                                <img
                                                    src="assets/images/logo-light.png"
                                                    alt=""
                                                    height={22}
                                                    className="auth-logo logo-light mx-auto"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-size-18 text-muted mt-2 text-center mb-4">
                                            Not Authorized
                                        </h4>
                                        <div className="alert alert-info" role="alert">
                                            You can't access this page; this route is only accessible for Seller.
                                        </div>
                                        <form className="form-horizontal">
                                            <div className="mb-3 row mt-4">
                                                <div className="col-12 text-end">
                                                    <Link
                                                        to="/"
                                                        className="btn btn-primary w-100 waves-effect waves-light"
                                                    >
                                                        Go to Home
                                                    </Link>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerAuth;
