import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SearchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('https://server.enjoywiki.com/marketplace-server-main/products');
      const info = await res.json();
      setProducts(info.reverse());
      setTimeout(() => setLoading(false), 1000);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const lowerCaseQuery = query.toLowerCase();
    return (
      product.productName.toLowerCase().includes(lowerCaseQuery) ||
      (Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
    );
  });

  return (
    <div className="search-results all-item-area mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h3>Search Results for "{query}"</h3>
            </div>
          </div>
        </div>
        <div className="all-item-section all-item-area-2">
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
                    </span>
                    <p>
                      <a href={`/category/${product.categorySlug}`}>Category: {loading ? <Skeleton width={60} /> : product.category}</a>
                    </p>
                    <div className="author-details d-flex justify-content-center">
                      <span>
                        <div className="isotope-filters item-isotope-btn text-lg-right">
                          <button className="button active ml-0 buy">
                            <a href={`/buy/${product._id}`}>Buy Now ${product.price} USD</a>
                          </button>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <h4>No products found matching your search query.</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
