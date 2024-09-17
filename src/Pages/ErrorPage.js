import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <>
            <section class="error-page-area pd-top-100 pd-bottom-100">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-8 col-md-10">
                            <div class="error-inner text-center">
                                <img src="/assets/img/404.png" alt="img" />
                                <h2>Oops!</h2>
                                <p>There’s nothing here, but if you feel this is an error please let us know <br /> <span>let us know </span></p>
                                <Link to="/" class="btn btn-base">Go Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default ErrorPage;