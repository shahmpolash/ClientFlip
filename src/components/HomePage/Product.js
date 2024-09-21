import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../Shared/Loading';
import Rating from 'react-rating';
import ReactImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import Pagination from '../Shared/Pagination';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { Helmet } from 'react-helmet';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const Product = () => {
    const { id } = useParams();
    const [products, setProducts] = useState({});
    const [seller, setSeller] = useState({});
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [soldCount, setSoldCount] = useState(0);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product/${id}`)
            .then((res) => res.json())
            .then((info) => {
                setProducts(info);
                // Fetch seller information based on sellerEmail
                fetchSeller(info.sellerEmail);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setIsLoading(false);
            });
    }, [id]);

    const fetchSeller = (sellerEmail) => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/users`)
            .then((res) => res.json())
            .then((users) => {
                const sellerInfo = users.find(user => user.UserEmail === sellerEmail && user.userRole === 'Seller');
                if (sellerInfo) {
                    setSeller(sellerInfo);
                } else {
                    console.error('Seller not found');
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching seller:', error);
                setIsLoading(false);
            });
    };
    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product-reviews?productId=${id}`)
            .then((res) => res.json())
            .then((info) => {
                const filteredReviews = info.filter(review => review.productId === id);
                const reversedReviews = filteredReviews.reverse();
                setReviews(reversedReviews);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }, [id]);

    const [userOrders, setUserOrders] = useState([]);
    const [user] = useAuthState(auth)

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?customerEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => setUserOrders(info))
            .catch((error) => {
                console.error('Error fetching reviews:', error);
            });
    }, [user]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?customerEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => setUserOrders(info))
            .catch((error) => {
                console.error('Error fetching user orders:', error);
            });
    }, [user]);

    const hasPurchased = () => {
        return userOrders.some(order => order.packageId === products._id);
    };

    const handleRatingChange = (rating) => {
        setUserRating(rating);
    };
    const handleAddReview = (event) => {
        event.preventDefault();
        if (!hasPurchased()) {
            toast.error('You must purchase the product before leaving a review.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        const productId = event.target.productId.value;
        const date = event.target.date.value;
        const reviewerName = event.target.reviewerName.value;
        const reviewerEmail = event.target.reviewerEmail.value;
        const reviewContent = event.target.review.value;

        const addReview = {
            productId,
            date,
            reviewerEmail,
            reviewerName,
            review: reviewContent,
            rating: userRating
        };
        const url = `https://server.enjoywiki.com/marketplace-server-main/add-review`;
        fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(addReview),
        })
            .then((res) => res.json())
            .then((result) => {
                // Fetch updated reviews after successful review addition
                fetch(`https://server.enjoywiki.com/marketplace-server-main/product-reviews?productId=${id}`)
                    .then((res) => res.json())
                    .then((info) => {
                        // Update reviews state with the updated list of reviews
                        setReviews(info);
                        toast.success('Review Added successfully', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        event.target.reset();
                    })
                    .catch(error => {
                        console.error('Error fetching reviews:', error);
                        toast.error('Failed to fetch updated reviews', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    });
            })
            .catch(error => {
                console.error('Error adding review:', error);
                toast.error('Failed to add review', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
    };
    const currentDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    useEffect(() => {
        console.log("Fetching orders for product:", id);
        fetch(`https://server.enjoywiki.com/marketplace-server-main/orders`)
            .then((res) => res.json())
            .then((orders) => {
                console.log("Orders data:", orders);
                const soldProducts = orders.filter(order => order.packageId === id && order.paymentStatus === 'Paid');
                console.log("Sold products:", soldProducts);
                setSoldCount(soldProducts.length);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, [id]);
    // Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const current = reviews.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(reviews.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const [buyer, setBuyer] = useState([]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/users?UserEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => {
                console.log("User info:", info); // Log the data received from the API
                if (info && info.length > 0) {
                    setBuyer(info[0]);
                } else {
                    console.log("No user data found");
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [user]);
    const galleryItems = [
        {
            original: products.productImageOne,
            thumbnail: products.productImageOne,
        },
        {
            original: products.productImageTwo,
            thumbnail: products.productImageTwo,
        },
        {
            original: products.productImageThree,
            thumbnail: products.productImageThree,
        },
    ];

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <>
            <Helmet>
                <title>{`FlipBundle.com - ${products.productName || 'Loading...'}`}</title>
                <meta name="description" content="Welcome to FlipBundle.com, your premier destination for bulk digital products." />
            </Helmet>
            <section className="product-details pd-top-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="single-product-wrap">
                                <div className="thumb">

                                    {products.featuredImage ? (
                                        <img src={products.featuredImage} alt={products.productName} width={710} height={331} style={{ objectFit: 'contain' }} />
                                    ) : (
                                        <SkeletonTheme baseColor="#8200dd;" highlightColor="#49009b">
                                            <Skeleton width={710} height={331} style={{ objectFit: 'contain' }} />
                                        </SkeletonTheme>
                                    )}
                                    <Link className="btn btn-white btn-buy" to={`/buy/${products._id}`}>
                                        Buy Now
                                    </Link>
                                </div>
                                <div className="single-product-details">
                                    <h4>
                                        {products.productName ? (
                                            products.productName
                                        ) : (
                                            <SkeletonTheme baseColor="#8200dd;" highlightColor="#49009b">
                                                <Skeleton />
                                            </SkeletonTheme>
                                        )}
                                    </h4>
                                    Category:
                                    <Link className='ml-1' to={`/category/${products.categorySlug}`}>
                                        {products.category ? products.category : <SkeletonTheme baseColor="#8200dd;" highlightColor="#49009b">
                                            <Skeleton width={40} />
                                        </SkeletonTheme>}
                                    </Link>
                                    <div>
                                        Rating: <span className="rating">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <i key={index} className={`fa fa-star${index < averageRating ? ' checked' : ''}`} />
                                            ))}
                                           
                                            <span> {averageRating}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="product-tab">
                                <ul className="nav nav-pills">
                                    <li className="nav-item">
                                        <a
                                            className="nav-link active"
                                            data-toggle="pill"
                                            href="#pills-home"
                                        >
                                            Description
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            data-toggle="pill"
                                            href="#pills-profile"
                                        >
                                            Reviews {reviews.length > 0 ? `(${reviews.length})` : "(No Reviews Yet)"}
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade show active" id="pills-home">
                                        <p>
                                            <ReactImageGallery
                                                items={[
                                                    {
                                                        original: products.productImageOne,
                                                        thumbnail: products.productImageOne,
                                                    },
                                                    {
                                                        original: products.productImageTwo,
                                                        thumbnail: products.productImageTwo,
                                                    },
                                                    {
                                                        original: products.productImageThree,
                                                        thumbnail: products.productImageThree,
                                                    },
                                                ]}
                                                renderItem={(item) => (
                                                    <div style={{ height: '450px' }}>
                                                        <img
                                                            src={item.original}
                                                            alt={item.originalAlt || 'Image'}
                                                            style={{
                                                                height: '100%',
                                                                width: '100%',
                                                                objectFit: 'contain',
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />

                                            <div dangerouslySetInnerHTML={{ __html: products.productDescription }} />
                                        </p>
                                    </div>
                                    <div className="tab-pane fade" id="pills-profile">
                                        <h5 className="title">Reviews {reviews.length > 0 ? `(${reviews.length})` : "(No Review)"}</h5>
                                        {
                                            current.map(e =>
                                                <div className="single-review">

                                                    <h6 className="name">{e.reviewerName}</h6>
                                                    <span className="date">{e.date}</span>
                                                    <div>
                                                        <span className="ratting">
                                                            <Rating
                                                                readonly
                                                                initialRating={e.rating}
                                                                emptySymbol={<i className="far fa-star"></i>}
                                                                fullSymbol={<i className="fas fa-star"></i>}
                                                            />
                                                        </span>
                                                    </div>
                                                    <p>
                                                        {e.review}
                                                    </p>
                                                </div>
                                            )
                                        }
                                        {
                                            reviews.length > productsPerPage && (
                                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                                            )
                                        }
                                        <div className="add-review">
                                            {user ? (
                                                <>
                                                    {
                                                        userOrders.filter(order => order.customerEmail === user?.email && order.packageId === products._id).length === 1 &&
                                                        <div className="add-review">

                                                            {
                                                                reviews.filter(review => review.reviewerEmail === user?.email && review.productId === products._id).length === 0 &&
                                                                <Link to='/buyer/orders'> <h5>You can leave review your your dashboard</h5> </Link>
                                                            }
                                                        </div>
                                                    }</>
                                            ) : (
                                                <div className="login-message">
                                                    <p>Please <Link to="/login">login</Link> to review this product.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="sidebar-area">
                                <div className="widget widget-cart">
                                    <div className="widget-cart-inner text-center">
                                        <h3 className="price">$
                                            <SkeletonTheme baseColor="#8200dd;" highlightColor="#49009b">
                                                {products.price ? products.price : <Skeleton width={60} />}
                                            </SkeletonTheme> USD</h3>
                                        <span className="ratting">
                                            <hr></hr>
                                        </span>
                                        <ul>
                                            <li>
                                                <i className="fa fa-shopping-cart" />
                                                {soldCount} Sales
                                            </li>
                                            <li>
                                                <i className="fa fa-star" />
                                                {reviews.length > 0 ? `Reviews (${reviews.length})` : "No Review"}
                                            </li>

                                            <li>
                                                <i class="fa fa-list-alt" aria-hidden="true"></i>
                                                {products.category}
                                            </li>
                                        </ul>
                                        <Link to={`/buy/${products._id}`} className="btn btn-base">
                                            <i className="fa fa-shopping-cart" />
                                            {" "} Buy Now
                                        </Link>
                                    </div>
                                </div>
                                <div className="widget widget-client text-center">
                                    <div className="thumb">
                                        <a href={`/seller/${seller._id}`}>
                                            <img src={seller.profileURL} alt="Seller" className="rounded-circle" />
                                        </a>
                                    </div>
                                    <h4>
                                        <a href={`/seller/${seller._id}`}>
                                            {seller.userName}
                                        </a>
                                    </h4>
                                    <div className="widget widget-cart">
                                        <div className="widget-cart-inner text-center">
                                            <ul>

                                                <li>
                                                    <i className="fa fa-map-marker" />
                                                    {seller.country}
                                                </li>
                                                <li>
                                                    <i className="fa fa-check" />
                                                    {seller.userRole}
                                                </li>
                                            </ul>
                                            <a className="btn btn-base" href={`/seller/${seller._id}`}>
                                                <i className="fa fa-eye" />
                                                See Profile
                                            </a>
                                        </div>
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

export default Product;