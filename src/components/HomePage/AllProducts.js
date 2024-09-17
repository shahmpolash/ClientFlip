import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Shared/Pagination';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product-reviews`)
            .then((res) => res.json())
            .then((info) => {
                setReviews(info);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }, []);

    // Function to get the number of reviews for a specific product
    const getReviewCount = (productId) => {
        const productReviews = reviews.filter(review => review.productId === productId);
        return productReviews.length;
    };

    const getProductCount = (categoryName) => {
        return products.filter(product => product.category === categoryName).length;
    };

    const filteredProducts = products.filter(product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input change
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    return (
        <>
            <section className="blog-page-area pd-top-100 pd-bottom-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 order-lg-last">
                            <div className="all-item-section all-item-area-2">
                                <div className="row">
                                    {currentProducts.map(e =>
                                        <div className="all-isotope-item col-lg-6 col-sm-6" key={e._id}>
                                            <div className="thumb">
                                                <Link className="gallery-fancybox" to={`/product/${e._id}`}>
                                                    <img src={e.featuredImage} width={370} height={270} alt="images" />
                                                </Link>
                                                <Link className="btn btn-white" to={`/product/${e._id}`}>
                                                    More Details
                                                </Link>
                                            </div>
                                            <div className="item-details">
                                                <h4>
                                                    <Link to={`/product/${e._id}`}>{e.productName}</Link>
                                                </h4>
                                                <span className="ratting">
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />
                                                    <i className="fa fa-star" />

                                                    <span>({getReviewCount(e._id)})</span>
                                                </span>
                                                <Link to={`/buy/${e._id}`} className="author-details align-item-center">
                                                    <span className="mt-2">
                                                        <div className="isotope-filters item-isotope-btn text-lg-right">
                                                            <button className="button active ml-0">
                                                                Buy Now
                                                            </button>
                                                        </div>
                                                    </span>
                                                </Link>
                                                <span className="price bg-white float-right">${e.price}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {
                                products.length > productsPerPage && (
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                                )
                            }

                        </div>
                        <div className="col-lg-4 order-lg-first">
                            <div className="sidebar-area">
                                <div className="widget widget-search">
                                    <div className="single-search-inner">
                                        <input type="text" placeholder="Search here" value={searchTerm} onChange={handleSearchInputChange} />
                                        <button>
                                            <i className="la la-search" />
                                        </button>
                                    </div>
                                </div>
                                <div className="widget widget-category widget-border">
                                    <h5 className="widget-title">Category</h5>
                                    <ul>
                                        {categories.map(category => (
                                            <li key={category.slug}>
                                                <Link to={`/category/${category.slug}`}>{category.categoryName} ({products.filter(product => product.categorySlug === category.slug).length})</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AllProducts;
