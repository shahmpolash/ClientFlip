import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Rating from 'react-rating';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import toast from 'react-hot-toast';


const BuyerReview = () => {
    const { id } = useParams();
    const [seller, setSeller] = useState({});
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [soldCount, setSoldCount] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const navigate = useNavigate();

    const [order, setOrders] = useState([]);
    const [user] = useAuthState(auth)

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/order/${id}`)
            .then((res) => res.json())
            .then((info) => setOrders(info));
    }, [id]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product-reviews`)
            .then((res) => res.json())
            .then((info) => setReviews(info));
    }, []);



    const handleRatingChange = (rating) => {
        setUserRating(rating);
    };

    const handleAddReview = (event) => {
        event.preventDefault();

        const productId = event.target.productId.value;
        const sellerId = event.target.sellerId.value;
        const sellerEmail = event.target.sellerEmail.value;
        const orderId = event.target.orderId.value;
        const clientId = event.target.clientId.value;
        const date = event.target.date.value;
        const reviewerName = event.target.reviewerName.value;
        const reviewerEmail = event.target.reviewerEmail.value;
        const reviewContent = event.target.review.value;

        const addReview = {
            productId,
            sellerId,
            sellerEmail,
            orderId,
            clientId,
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

                const orderId = id;
                updateProductReviewStatus(orderId);
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

    const updateProductReviewStatus = () => {
        const order = {
            productReview: "yes"
        };
        const url = `https://server.enjoywiki.com/marketplace-server-main/user-review/${id}`;
        fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(order),
        })
            .then((res) => res.json())
            .then((result) => {
                navigate('/buyer/dashboard');
            })
            .catch(error => {
                console.error('Error updating product review status:', error);
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
                const soldProducts = orders.filter(order => order.packageId === id);
                console.log("Sold products:", soldProducts);
                setSoldCount(soldProducts.length);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }, [id]);

    const [users, setUsers] = useState({});

    useEffect(() => {
        if (user?.email) {
            fetch(`https://server.enjoywiki.com/marketplace-server-main/users`)
                .then((res) => res.json())
                .then((info) => {
                    const loggedInUser = info.find(u => u.UserEmail === user?.email);
                    setUsers(loggedInUser);
                    console.log(loggedInUser)
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [user]);



    return (
        <>
            <section className="product-details pd-top-100 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="add-review">
                                <h5 className="title">Add Review</h5>
                                <form className="contact-form" onSubmit={handleAddReview}>
                                    <label>Select Rating:</label>
                                    <span className="ratting ml-3">
                                        <Rating
                                            initialRating={userRating}
                                            emptySymbol={<i className="far fa-star"></i>}
                                            fullSymbol={<i className="fas fa-star"></i>}
                                            onChange={handleRatingChange}
                                        />
                                    </span>
                                    <input
                                        hidden
                                        type="text"
                                        value={order.packageId}
                                        name="productId"
                                    />
                                    <input
                                        hidden
                                        type="text"
                                        value={order.sellerId}
                                        name="sellerId"
                                    />
                                    <input
                                        hidden
                                        type="text"
                                        value={order.sellerEmail}
                                        name="sellerEmail"
                                    />
                                   
                                    <input
                                        hidden
                                        type="text"
                                        value={users._id}
                                        name="clientId"
                                    />
                                    <input
                                        hidden
                                        type="text"
                                        value={id}
                                        name="orderId"
                                    />
                                    <input
                                        hidden
                                        type="text"
                                        name="date"
                                        value={currentDate}
                                    />
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="single-input-wrap">
                                                <input
                                                    required
                                                    readOnly
                                                    type="text"
                                                    className="single-input"
                                                    placeholder="Your Name"
                                                    defaultValue={users.userName}
                                                    name="reviewerName"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="single-input-wrap">
                                                <input
                                                    readOnly
                                                    hidden
                                                    required
                                                    type="text"
                                                    className="single-input"
                                                    placeholder="Your Email"
                                                    name='reviewerEmail'
                                                    defaultValue={user?.email}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="single-input-wrap">
                                                <textarea
                                                    required
                                                    className="single-input textarea"
                                                    placeholder="Your Review"
                                                    rows={4}
                                                    defaultValue={""}
                                                    name='review'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        reviews.filter(review => review.orderId === order._id && review.reviewerEmail === user?.email).length === 0 &&
                                        <button type='sumbit' className="btn btn-base">
                                            Submit Review
                                        </button>
                                    }
                                    {
                                        reviews.filter(review => review.orderId === order._id && review.reviewerEmail === user?.email).length === 1 &&
                                        <p className="btn btn-base">
                                            Already Reviewed
                                        </p>
                                    }

                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default BuyerReview;