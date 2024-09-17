import React, { useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { shuffle } from 'lodash';

const HomePageFeatureProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://server.enjoywiki.com/marketplace-server-main/products');
                const info = await res.json();

                // Shuffle products after reversing
                const shuffledProducts = shuffle(info.reverse());
                setProducts(shuffledProducts);

                // Extract unique categories and shuffle them
                const uniqueCategories = [...new Set(info.map((item) => item.category))];
                setCategories(shuffle(uniqueCategories));

                setTimeout(() => setLoading(false), 1000);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
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

    return (
        <div>
            <section className="all-item-area">
                <div className="container">
                    <div className="all-item-section all-item-area-2">
                        <div className="isotope-filters item-isotope-btn text-lg-right">
                            <button className="button active mt-3">
                                <p className='text-white'>Feature Products</p>
                            </button>
                        </div>
                        <div className="row">
                            {products.map(product => product.homePageFeature === "Yes" && 
                                <div key={product._id} className="col-lg-2 col-md-4 col-sm-6 col-6 feature-bg rounded-3 feature-item">
                                    <div className="thumb d-flex justify-content-center">
                                        <a className="gallery-fancybox" href={`/product/${product._id}`}>
                                            {loading ? (
                                                <SkeletonTheme baseColor="#8200dd;" highlightColor="#49009b">
                                                    <Skeleton width={150} height={150} style={{ objectFit: 'contain' }} />
                                                </SkeletonTheme>
                                            ) : (
                                                <img src={product.featuredImage} alt={product.productName} width={150} height={150} style={{ objectFit: 'contain' }} />
                                            )}
                                        </a>
                                    </div>
                                    <div className='feature-title'>
                                        <p>
                                            <a href={`/product/${product._id}`}>{loading ? <Skeleton width={100} /> : product.productName}</a>
                                        </p>
                                        <span className="ratting">
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <i className="fa fa-star" />
                                            <span>({getReviewCount(product._id)})</span>
                                        </span>
                                        <div className="author-details d-flex justify-content-center">
                                            <span className="">
                                                <div className="isotope-filters item-isotope-btn text-lg-right">
                                                    <button className="button active ml-0 buy feature-btn">
                                                        <a href={`/buy/${product._id}`}>${product.price} USD</a>
                                                    </button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePageFeatureProducts;
