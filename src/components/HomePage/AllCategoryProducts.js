import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Pagination from '../Shared/Pagination';
import CategoryFeatureProducts from './CategoryFeatureProducts';
import { Helmet } from 'react-helmet';

const AllCategoryProducts = () => {
    const { slug } = useParams();
    console.log('slug:', slug); // Debugging line to check the value of slug
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [reviews, setReviews] = useState([]);
    const [category, setCategory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(15);

    // Fetch category products based on slug
    useEffect(() => {
        if (slug) {
            fetch(`https://server.enjoywiki.com/marketplace-server-main/category?categorySlug=${slug}`)
                .then((res) => res.json())
                .then((info) => setCategoryProducts(info))
                .catch((error) => console.error('Error fetching category products:', error));
        }
    }, [slug]);

    // Fetch all products
    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/products`)
            .then((res) => res.json())
            .then((info) => setProducts(info.reverse()))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);
    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/category/${slug}`)
            .then((res) => res.json())
            .then((info) => setCategory(info));
    }, [slug]);


    // Fetch all categories
    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/categories`)
            .then((res) => res.json())
            .then((info) => {
                console.log('Fetched categories:', info); // Debugging line to check categories
                setCategories(info);
            })
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    // Fetch reviews
    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product-reviews`)
            .then((res) => res.json())
            .then((info) => setReviews(info))
            .catch((error) => console.error('Error fetching reviews:', error));
    }, []);

    // Function to count products for each category
    const getProductCount = (categoryName) => {
        return products.filter(product => product.category === categoryName).length;
    };

    // Filter products based on search term
    const filteredProducts = categoryProducts.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
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

    // Function to get the number of reviews for a specific product
    const getReviewCount = (productId) => {
        return reviews.filter((review) => review.productId === productId).length;
    };

    return (
       <>
        <Helmet>
                <title>{`FlipBundle.com - ${category.SEOTitle || 'Loading...'}`}</title>
                <meta name="description" content="Welcome to FlipBundle.com, your premier destination for bulk digital products." />
            </Helmet>
        <section className="blog-page-area pd-top-100 pd-bottom-100">
            <div className="container">

                <h4>{category.categoryName}</h4>
                <p>{category.categoryDetails}</p>
                <CategoryFeatureProducts></CategoryFeatureProducts>
                <div className="row mt-5">


                    <div className="col-lg-12 order-lg-last">
                        <div className="all-item-section all-item-area-2">
                            <div className="row">
                                {currentProducts.map(e =>
                                    <div className="all-isotope-item col-lg-4 col-sm-6" key={e._id}>
                                        <div className="thumb">
                                            <a href={`/product/${e._id}`} className="gallery-fancybox">
                                                <img src={e.featuredImage} width={370} height={270} alt="images" />
                                            </a>
                                            <a className="btn btn-white" href={`/product/${e._id}`}>
                                                More Details
                                            </a>
                                        </div>
                                        <div className="item-details">
                                            <h6>
                                                <a href={`/product/${e._id}`}>{e.productName}</a>
                                            </h6>
                                            <span className="ratting">
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <i className="fa fa-star" />
                                                <span>({getReviewCount(e._id)})</span>
                                            </span>
                                            <a href={`/buy/${e._id}`} className="author-details align-item-center">
                                                <span className="mt-2">
                                                    <div className="isotope-filters item-isotope-btn text-lg-right">
                                                        <button className="button active ml-0">
                                                            Buy Now ${e.price}
                                                        </button>
                                                    </div>
                                                </span>
                                            </a>

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {filteredProducts.length > productsPerPage && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                        )}
                    </div>

                </div>
            </div>
        </section>
       </>
    );
};

export default AllCategoryProducts;
