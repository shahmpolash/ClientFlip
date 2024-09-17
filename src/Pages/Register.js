import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
   

    return (
        <>
            <section className="pd-top-100 pd-bottom-100 bg-sky-blue">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-7 col-lg-10 text-center mt-5 mb-5">
                            <div className="sign-in-area mt-5 mb-5">
                                
                                  <Link to='/register-seller' className="btn btn-base w-100">Register as a Seller</Link>
                                  <li class="dropdown-divider"></li>
                                  <Link to='/register-buyer' className="btn btn-base w-100">Register as a buyer</Link>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Register;
