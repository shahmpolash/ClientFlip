import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import Loading from "../../components/Shared/Loading";
import Pagination from "../../components/Shared/Pagination";
import toast from "react-hot-toast";

const BuyerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState("all");
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(auth);
    const ordersPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const fetchOrders = () => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?userEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => {
                setOrders(info.reverse());
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [selectedOrderStatus, selectedPaymentStatus, orders]);

    const filterOrders = () => {
        let filtered = orders.filter((order) => {
            if (
                (selectedOrderStatus === "all" || order.status === selectedOrderStatus) &&
                (selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus)
            ) {
                return true;
            }
            return false;
        });
        setFilteredOrders(filtered);
    };

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product-reviews`)
            .then((res) => res.json())
            .then((info) => setReviews(info));
    }, []);


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * ordersPerPage;
    const indexOfFirstItem = indexOfLastItem - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handleEditNote = (event, id, index) => {
        event.preventDefault();
        const buyerAddedNote = event.target.buyerAddedNote.value;
        const noteAddedByBuyer = event.target.noteAddedByBuyer.value;

        const edit = {
            noteAddedByBuyer,
            buyerAddedNote
        };

        const url = `https://server.enjoywiki.com/marketplace-server-main/update-note-buyer/${id}`;
        fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(edit),
        })
            .then((res) => res.json())
            .then((result) => {
                toast.success('Note Updated Successfully!');
                event.target.reset();
                const modal = document.querySelector(`#exampleModal${index}`);
                if (modal) {
                    modal.classList.remove('show');
                }
                // Fetch the updated data after successful edit
                fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?userEmail=${user?.email}`)
                    .then((res) => res.json())
                    .then((info) => {
                        setOrders(info.reverse());
                    });
            })
    };
    return (
        <>
            <div className="blog-page-area pd-top-100 pd-bottom-100">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                {loading ? (
                                    <Loading />
                                ) : (
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title mb-4">Recent Orders</h4>
                                            <div className="mb-3">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <label className="mt-3">Filter by Payment Status</label>
                                                        <select
                                                            className="form-control form-control-sm"
                                                            value={selectedPaymentStatus}
                                                            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                                        >
                                                            <option value="all">All Payments</option>
                                                            <option value="Paid">Paid</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                            <option value="Refunded">Refunded</option>
                                                        </select>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-centered border table-nowrap mb-0">
                                                    <td>Date</td>
                                                    <td>Order ID</td>
                                                    <td>Product Name</td>
                                                    <td>Review & Rating</td>
                                                    <td>Status</td>
                                                    <td>-</td>
                                                    <th>Your Note</th>
                                                    <th>Seller's Note</th>

                                                    <thead className="table-light">
                                                        {/* Your table header content */}
                                                    </thead>
                                                    <tbody>
                                                        {currentOrders.map((order, index) => (
                                                            <tr key={order._id}>
                                                                <td>
                                                                    <p className="text-muted mb-0 font-size-11">
                                                                        {order.orderDate}
                                                                    </p>
                                                                </td>
                                                                <td>
                                                                    <p className="text-muted mb-0 font-size-11">
                                                                        {order.orderId}
                                                                    </p>
                                                                </td>
                                                                
                                                                <td>
                                                                    <h6 className="mb-1 font-size-13">
                                                                        <Link to={`/product/${order.packageId}`} target="_blank" rel="noreferrer" className="text-dark mb-1 font-size-14">
                                                                            {order.packageName}
                                                                        </Link>
                                                                    </h6>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        order.paymentStatus === 'Paid' ?
                                                                            <h6 className="mb-1 font-size-13">
                                                                                {
                                                                                    reviews.filter(review => review.reviewerEmail === user?.email && review.orderId === order._id).length === 0 &&
                                                                                    <Link to={`/review/${order._id}`} className="text-dark mb-1 font-size-14">
                                                                                        Write a review
                                                                                    </Link>
                                                                                }
                                                                                {
                                                                                    reviews.filter(review => review.orderId === order._id && review.reviewerEmail === user?.email).length === 1 &&
                                                                                    <Link to='#' className="text-dark mb-1 font-size-14">
                                                                                        Already Reviewed
                                                                                    </Link>
                                                                                }
                                                                            </h6>
                                                                            :
                                                                            <p>First Complete Payment</p>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <h6 className="mb-1 font-size-13">
                                                                        ${order.packagePrice} USD
                                                                    </h6>
                                                                    <p className="text-danger text-uppercase mb-0 font-size-11">
                                                                        <i className="mdi mdi-circle-medium" />
                                                                        {order.paymentStatus === "pending" && <>Pending</>
                                                                        }
                                                                        {order.paymentStatus === "Paid" && <>Paid</>
                                                                        }
                                                                        {order.paymentStatus === "Cancelled" && <>Cancelled </>
                                                                        }
                                                                    </p>
                                                                </td>
                                                                <td>
                                                                    <h6 className="mb-1 font-size-13">
                                                                        {order.paymentStatus === "pending" ? (
                                                                            <div className="isotope-filters item-isotope-btn">
                                                                                <button className="button active btn-sm">
                                                                                    <Link to={`/pay-now/${order._id}`}>Pay With PayPal</Link>
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                {order.paymentStatus === "Cancelled" &&
                                                                                    <div className="isotope-filters item-isotope-btn">
                                                                                        <button className="button active btn-sm">
                                                                                            <Link to={`/pay-now/${order._id}`}>Pay With PayPal</Link>
                                                                                        </button>
                                                                                    </div>
                                                                                }
                                                                                {order.paymentStatus === "Paid" &&
                                                                                    <div className="isotope-filters item-isotope-btn">
                                                                                        <button type="button" className="button active btn-sm" data-toggle="modal" data-target={`#exampleModal${index}`}>
                                                                                            View
                                                                                        </button>
                                                                                    </div>
                                                                                }

                                                                            </>
                                                                        )}
                                                                        <div class="modal fade" id={`exampleModal${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                            <div class="modal-dialog modal-lg">
                                                                                <div class="modal-content">
                                                                                    <div class="modal-header">
                                                                                        <h5 class="modal-title" id="exampleModalLabel">View Infomation</h5>
                                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                            <span aria-hidden="true">&times;</span>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="modal-body">
                                                                                        <table class="table table-hover mb-0">
                                                                                            <thead> <tr><th>-</th> <th>-</th> </tr> </thead>
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td>Item Name</td>
                                                                                                    <td>{order.packageName}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>Price</td>
                                                                                                    <td>${order.packagePrice}</td>
                                                                                                </tr>

                                                                                                <tr>
                                                                                                    <td>Access Link</td>
                                                                                                    {order.paymentStatus === "Paid" ? (
                                                                                                        <td><a href={order.accessLink} target="_blank" rel="noopener noreferrer">{order.accessLink}</a></td>
                                                                                                    ) : (
                                                                                                        <td>Show when payment is Paid.</td>
                                                                                                    )}
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td>Guide Line</td>
                                                                                                    {order.paymentStatus === "Paid" ? (
                                                                                                        <td>{order.guideLine}</td>
                                                                                                    ) : (
                                                                                                        <td>Show when payment is Paid.</td>
                                                                                                    )}
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                    <div class="modal-footer">
                                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </h6>
                                                                </td>
                                                                <td >
                                                                    <div className="isotope-filters item-isotope-btn">
                                                                        {order.paymentStatus === 'Paid' ? (
                                                                            <button className="btn btn-outline-secondary btn-sm edit" data-toggle="modal" data-target={`#exampleModalorderAddnote${index}`}>
                                                                                <img src="https://cdn-icons-png.freepik.com/512/3075/3075908.png" height={20} width={20} alt="note" />
                                                                            </button>
                                                                        ) : (
                                                                            <button className="btn btn-outline-secondary btn-sm edit" disabled title="Disable">
                                                                                <img src="https://cdn-icons-png.freepik.com/512/3075/3075908.png" height={20} width={20} alt="note" />
                                                                            </button>
                                                                        )}


                                                                    </div>
                                                                    <div class="modal fade" id={`exampleModalorderAddnote${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                        <div class="modal-dialog modal-lg modal-dialog-centered">
                                                                            <div class="modal-content">
                                                                                <div class="modal-header">
                                                                                    <h5 class="modal-title" id="exampleModalLabel">Add or Edit Note</h5>
                                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <form className="comment-form" onSubmit={(event) => handleEditNote(event, order._id, index)}>
                                                                                        <input
                                                                                            hidden
                                                                                            type="text"
                                                                                            name="noteAddedByBuyer"
                                                                                            defaultValue={order.customerName}
                                                                                        />
                                                                                        <div className="fadeInUp style-2 text-center">
                                                                                            <div className="main-title"><h3>Add/Edit Note</h3></div>
                                                                                        </div>
                                                                                        <div className="columns  gap20">
                                                                                            <fieldset className="email">
                                                                                                <label className="mb-2">Note Description</label>
                                                                                                <textarea
                                                                                                    type="text"
                                                                                                    placeholder="Note Description"
                                                                                                    className="form-control"
                                                                                                    name="buyerAddedNote"
                                                                                                    rows={5}
                                                                                                    defaultValue={order.buyerAddedNote}
                                                                                                />
                                                                                            </fieldset>
                                                                                        </div>
                                                                                        <div className="text-center">
                                                                                            <button className="btn btn-success waves-effect waves-light mt-5" type="submit">
                                                                                                Add/Update
                                                                                            </button>
                                                                                        </div>
                                                                                    </form>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td >
                                                                    <div className="isotope-filters item-isotope-btn">

                                                                    {order.paymentStatus === 'Paid' ? (
                                                                            <button className="btn btn-outline-secondary btn-sm edit" data-toggle="modal" data-target={`#exampleModalorderSellerNote${index}`}>
                                                                                <img src="https://cdn-icons-png.freepik.com/512/7934/7934573.png" height={20} width={20} alt="note" />
                                                                            </button>
                                                                        ) : (
                                                                            <button className="btn btn-outline-secondary btn-sm edit" disabled title="Disable">
                                                                                <img src="https://cdn-icons-png.freepik.com/512/7934/7934573.png" height={20} width={20} alt="note" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div class="modal fade" id={`exampleModalorderSellerNote${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                        <div class="modal-dialog modal-lg modal-dialog-centered">
                                                                            <div class="modal-content">
                                                                                <div class="modal-header">
                                                                                    <h5 class="modal-title" id="exampleModalLabel">View Seller Note</h5>
                                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <table class="table table-hover mb-0">
                                                                                        <thead> <tr><th>-</th> <th>-</th> </tr> </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>Seller Note</td>
                                                                                                <td>{order.sellerAddedNote ? order.sellerAddedNote : 'Seller not added note yet'}</td>
                                                                                            </tr>

                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-3 d-flex justify-content-end">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={Math.ceil(filteredOrders.length / ordersPerPage)}
                                                    onPageChange={handlePageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyerOrders;
