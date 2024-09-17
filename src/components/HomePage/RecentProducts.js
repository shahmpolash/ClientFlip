import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import { shuffle } from 'lodash';

const RecentProducts = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://server.enjoywiki.com/marketplace-server-main/products');
      const info = await res.json();
      setProducts(info.reverse());
      const uniqueCategories = [...new Set(info.map((item) => item.category))];
      setCategories(shuffle(uniqueCategories));
      setTimeout(() => setLoading(false), 1000);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    fetch('https://server.enjoywiki.com/marketplace-server-main/product-reviews')
      .then((res) => res.json())
      .then((info) => setReviews(info))
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }, []);

  const getReviewCount = (productId) => {
    const productReviews = reviews.filter((review) => review.productId === productId);
    return productReviews.length;
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {
        loading ?
        <div className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
        <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      
          :
          <>{categories.map((category) => {
            const categorySlug = products.find((product) => product.category === category)?.categorySlug;
            const categoryProducts = shuffle(filteredProducts.filter((product) => product.category === category));

            if (categoryProducts.length === 0) {
              return null;
            }

            return (
              <section key={category} className="all-item-area mt-5">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="section-title">
                        <h6>{category}</h6>
                      </div>
                    </div>
                    <div className="col-lg-8 mt-2">
                      <div className="isotope-filters item-isotope-btn text-lg-right">
                        <button className="button active ml-0">
                          <a href={`/category/${categorySlug}`}>All Items</a>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="all-item-section all-item-area-2">
                    <div className="row">
                      {categoryProducts.slice(0, 6).map((product) => (
                        <div key={product._id} className="all-isotope-item col-lg-4 col-md-6 col-sm-12">
                          <div className="thumb">
                            <a className="gallery-fancybox" href={`/product/${product._id}`}>
                              {loading ? (
                                <SkeletonTheme baseColor="#8200dd;" highlightColor="#49009b">
                                  <Skeleton width={370} height={270} style={{ objectFit: 'contain' }} />
                                </SkeletonTheme>
                              ) : (
                                <img src={product.featuredImage} alt={product.productName} width={370} height={270} style={{ objectFit: 'contain' }} />
                              )}
                            </a>
                            <a href={`/product/${product._id}`} className="btn btn-white">
                              More Details
                            </a>
                          </div>
                          <div className="item-details">
                            <h6>
                              <a href={`/product/${product._id}`}>{loading ? <Skeleton width={100} /> : product.productName}</a>
                            </h6>
                            <span className="ratting">
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <i className="fa fa-star" />
                              <span>({getReviewCount(product._id)})</span>
                            </span>
                            <p>
                              <a href={`/category/${product.categorySlug}`}>Category: {loading ? <Skeleton width={60} /> : product.category}</a>
                            </p>
                            <div className="author-details d-flex justify-content-center">
                              <span className="">
                                <div className="isotope-filters item-isotope-btn text-lg-right">
                                  <button className="button active ml-0 buy">
                                    <a href={`/buy/${product._id}`}>Buy Now ${product.price} USD</a>
                                  </button>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}</>
      }

    </>
  );
};

export default RecentProducts;
