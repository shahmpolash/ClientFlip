import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`https://server.enjoywiki.com/marketplace-server-main/products`)
      .then((res) => res.json())
      .then((info) => setProducts(info.reverse()));
  }, []);

  useEffect(() => {
    fetch(`https://server.enjoywiki.com/marketplace-server-main/categories`)
      .then((res) => res.json())
      .then((info) => setCategories(info));
  }, []);

  const getProductCount = (categoryName) => {
    return products.filter((product) => product.category === categoryName).length;
  };

  const uniqueCategories = [...new Set(categories.map(category => JSON.stringify(category)))].map(item => JSON.parse(item));

  // Function to shuffle the array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle categories and get the first 10
  const shuffledCategories = shuffleArray([...uniqueCategories]);

  return (
    <>
      <footer className="footer-area pd-top-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget widget widget_contact">
                <h4 className="widget-title">Contact Us</h4>
                <div className="media">
                  <div className="thumb">
                    <img src="/assets/img/footer/1.png" alt="img" />
                  </div>
                  <div className="media-body">
                    <p>Anson Road #09-20, International Plaza</p>
                    <p>Singapore 079903</p>
                  </div>
                </div>
                <div className="media">
                  <div className="thumb mt-0">
                    <img src="/assets/img/footer/2.png" alt="img" />
                  </div>
                  <div className="media-body">
                    <p className="m-0">support@flipbundle.com</p>
                  </div>
                </div>
                <ul className="social-area">
                  <li>
                    <a href="https://www.facebook.com/FlipBundleFB">
                      <i className="fab fa-facebook-f" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-youtube" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget widget widget_nav_menu">
                <h4 className="widget-title">Useful link</h4>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/about">About</a>
                  </li>
                  <li>
                    <a href="/contact">Contact</a>
                  </li>
                  <li>
                    <a href="/terms">Term & Condition</a>
                  </li>
                  <li>
                    <a href="/privacy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/refundpolicy">Refund Policy</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <div className="footer-widget widget widget_products">
                <h4 className="widget-title">Category</h4>
                <ul>
                  {shuffledCategories.slice(0, 10).map(category => (
                    <li key={category.categorySlug}>
                      <Link to={`/category/${category.slug}`}>{category.categoryName}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-3 offset-lg-1 col-md-6">
              <div className="footer-widget widget widget_news">
                <h4 className="widget-title">Latest News</h4>
                <div className="widget-news-wrap">
                  <div className="date">New Feature Alert</div>
                  <p>Introducing Advanced Search to Easily Find Bulk Digital Assets!</p>
                </div>
                <div className="widget-news-wrap">
                  <div className="date">Marketplace Expansion</div>
                  <p>Now Supporting Bulk Business Leads and Email Lists!</p>
                </div>
                <div className="widget-news-wrap">
                  <div className="date">Seller Spotlight</div>
                  <p>Meet Our Top Sellers and Explore Their Best-Selling Bulk Templates and Databases!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Footer bottom*/}
        <div className="container">
          <div className="copyright-area">
            <div className="row">
              <div className="col-lg-6 align-self-center">
                <p>©2024 Copy Right FlipBundle.com. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
