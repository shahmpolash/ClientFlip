import React from 'react';

const Testimonials = () => {
    return (
        <>
            <section className="testimonial-area text-center pd-top-90 pd-bottom-70">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="section-title text-center">
                                <h2>Thousands Of Happy Customers!</h2>
                                <p>
                                Join thousands of happy customers who trust us for high-quality digital products. Enjoy a seamless shopping experience, secure checkout, and instant downloads!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="testimonial-slider owl-carousel owl-theme">
                                <div className="item">
                                    <div className="testimonial-wrap">
                                        <div className="icon">
                                            <img src="/assets/img/testimonial/quote.png" alt="img" />
                                        </div>
                                        <p>
                                        I found the perfect web template for my business. The purchase process was smooth, and the instant download feature was fantastic!
                                        </p>
                                        <div className="thumb">
                                            <img src="https://i.postimg.cc/k4zTKsRK/Sopiya.jpg" alt="img" />
                                        </div>
                                        <h5 className="name">Emily R</h5>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="testimonial-wrap">
                                        <div className="icon">
                                            <img src="/assets/img/testimonial/quote.png" alt="img" />
                                        </div>
                                        <p>
                                        This marketplace is a treasure trove of high-quality digital products. I’ve bought multiple items, and each one has exceeded my expectations.
                                        </p>
                                        <div className="thumb">
                                            <img src="https://i.postimg.cc/MKy9fy6f/Jhon.jpg" alt="img" />
                                        </div>
                                        <h5 className="name">John M</h5>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="testimonial-wrap">
                                        <div className="icon">
                                            <img src="/assets/img/testimonial/quote.png" alt="img" />
                                        </div>
                                        <p>
                                        The variety of Canva templates available is impressive. I was able to find exactly what I needed and downloaded it instantly.
                                        </p>
                                        <div className="thumb">
                                            <img src="https://i.postimg.cc/6qZY0ZCS/Emily.jpg" alt="img" />
                                        </div>
                                        <h5 className="name">Sophia L</h5>
                                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Testimonials;