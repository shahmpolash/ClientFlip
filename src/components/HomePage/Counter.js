import React from 'react';

const Counter = () => {
    return (
        <>
            <section
                className="fun-fact-area text-center pd-top-100"
                style={{ background: "url(assets/img/fact/bg.png)" }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-3 col-sm-6">
                            <div className="single-fact-wrap">
                                <div className="thumb">
                                    <img src="assets/img/fact/icon1.png" alt="img" />
                                </div>
                                <h2 className="text-white">1200+</h2>
                                <p className="fact-title">Happy Clients</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="single-fact-wrap style-2">
                                <div className="thumb">
                                    <img src="assets/img/fact/icon2.png" alt="img" />
                                </div>
                                <h2 className="text-white">200+</h2>
                                <p className="fact-title">Premium Products</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="single-fact-wrap style-3">
                                <div className="thumb">
                                    <img src="assets/img/fact/icon3.png" alt="img" />
                                </div>
                                <h2 className="text-white">100+</h2>
                                <p className="fact-title">Total Sellers</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="single-fact-wrap style-4">
                                <div className="thumb">
                                    <img src="assets/img/fact/icon4.png" alt="img" />
                                </div>
                                <h2 className="text-white">2500+</h2>
                                <p className="fact-title">Item Sold</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Counter;