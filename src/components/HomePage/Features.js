import React from "react";
import './Feature.css';

const Features = () => {
  return (
    <>
      <section
        className="about-area text-center pd-top-100 pd-bottom-70"
        style={{ background: "url(assets/img/about/bg.png)" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-sm-6">
              <div className="single-about-wrap">
                <div className="thumb step">
                  <img src="https://i.postimg.cc/MKdG54dy/Brows-Products.png" alt="img" />
                </div>
                <h5>
                  <a href="#">Browse Products</a>
                </h5>
                <p>
                Explore a wide range of digital products.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-about-wrap">
                <div className="thumb step">
                  <img src="https://i.postimg.cc/5NN4Xgbj/Review-Details.png" alt="img" />
                </div>
                <h5>
                  <a href="#">Review Details</a>
                </h5>
                <p>
                Check the features and specifications of the item.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-about-wrap">
                <div className="thumb step">
                  <img src="https://i.postimg.cc/NjKQ40yc/CheckOut.png" alt="img" />
                </div>
                <h5>
                  <a href="#">Secure Checkout</a>
                </h5>
                <p>
                Check the features and specifications of the item.
                </p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-about-wrap">
                <div className="thumb step">
                  <img src="https://i.postimg.cc/hGxgk3bZ/DownLoad.png" alt="img" />
                </div>
                <h5>
                  <a href="#">Download Instantly</a>
                </h5>
                <p>
                Get instant access to your digital products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
