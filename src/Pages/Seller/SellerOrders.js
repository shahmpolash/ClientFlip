import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import Loading from "../../components/Shared/Loading";
import Pagination from "../../components/Shared/Pagination";
import toast from "react-hot-toast";

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedDateFilter, setSelectedDateFilter] = useState("all");
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState("all");
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(auth);

    // Function to fetch orders from server
    const fetchOrders = () => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?sellerEmail=${user?.email}`)
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

    // Function to filter orders based on selected filters
    const filterOrders = () => {
        const currentDate = new Date();

        return orders.filter((order) => {
            const orderDate = new Date(order.orderDate);
            const isOrderWithinDateFilter =
                selectedDateFilter === "all" ||
                (selectedDateFilter === "thisMonth" &&
                    orderDate.getMonth() === currentDate.getMonth()) ||
                (selectedDateFilter === "last7Days" &&
                    orderDate >= currentDate.setDate(currentDate.getDate() - 7)) ||
                (selectedDateFilter === "previousMonth" &&
                    orderDate >=
                    new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                        1
                    ) &&
                    orderDate <=
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)) ||
                (selectedDateFilter === "custom" &&
                    orderDate >= customStartDate &&
                    orderDate <= customEndDate);

            const isOrderMatchingStatus =
                selectedOrderStatus === "all" ||
                order.orderStatus === selectedOrderStatus;

            const isOrderMatchingPaymentStatus =
                selectedPaymentStatus === "all" ||
                order.paymentStatus === selectedPaymentStatus;

            return isOrderWithinDateFilter && isOrderMatchingStatus && isOrderMatchingPaymentStatus;
        });
    };
    // Filter orders based on selected filters
    const filteredOrders = filterOrders();
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditNote = (event, id, index) => {
        event.preventDefault();
        const noteAddedBySeller = event.target.noteAddedBySeller.value;
        const sellerAddedNote = event.target.sellerAddedNote.value;

        const edit = {
            noteAddedBySeller,
            sellerAddedNote
        };

        const url = `https://server.enjoywiki.com/marketplace-server-main/update-note-seller/${id}`;
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
                fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?sellerEmail=${user?.email}`)
                    .then((res) => res.json())
                    .then((info) => {
                        setOrders(info.reverse());
                    });
            })
    };

    return (
        <>
            <div className="main-content m-5">
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
                                            <div>
                                                <div className="row">
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
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-centered border table-nowrap mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Name</th>
                                                            <th>Product Name</th>
                                                            <th>Amount</th>
                                                            <th>Details</th>
                                                            <th>Your Note</th>
                                                            <th>Buyer's Note</th>
                                                            <th>Update Order</th>
                                                            <th>Fee (20%)</th>
                                                        </tr>
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
                                                                    <div className="d-flex">
                                                                        <div>
                                                                           
                                                                                <p className="text-dark">
                                                                                    {order.customerName}
                                                                                </p>
                                                                           
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <a href={`/product/${order.packageId}`} target="_blank" rel="noreferrer" className="text-dark mb-1 font-size-14">
                                                                        {order.packageName}
                                                                    </a>
                                                                </td>
                                                                <td>
                                                                    <h6 className="mb-1 font-size-13">
                                                                        ${order.packagePrice} USD
                                                                    </h6>
                                                                    <p className="text-success text-uppercase mb-0 font-size-11">
                                                                        <i className="mdi mdi-circle-medium" />
                                                                        {order.paymentStatus}
                                                                    </p>
                                                                </td>
                                                                <td >
                                                                    <div className="isotope-filters item-isotope-btn">
                                                                        <button className="btn btn-outline-secondary btn-sm edit" data-toggle="modal" data-target={`#exampleModalorder${index}`}>
                                                                            <i class="fas fa-eye"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div class="modal fade" id={`exampleModalorder${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                        <div class="modal-dialog modal-lg modal-dialog-centered">
                                                                            <div class="modal-content">
                                                                                <div class="modal-header">
                                                                                    <h5 class="modal-title" id="exampleModalLabel">Orders Information</h5>
                                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <table class="table table-hover mb-0">
                                                                                        <thead> <tr><th>-</th> <th>-</th> </tr> </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>Order Id</td>
                                                                                                <td>{order.orderId}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Order Date</td>
                                                                                                <td>{order.orderDate}</td>
                                                                                            </tr>

                                                                                            <tr>
                                                                                                <td>Product Name</td>
                                                                                                <td>{order.packageName}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Price</td>
                                                                                                <td>${order.packagePrice}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Payment Status</td>
                                                                                                <td>{order.paymentStatus}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Customer Name</td>
                                                                                                <td>{order.customerName}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Customer Note</td>
                                                                                                <td>{order.customerNote}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Access Link:</td>
                                                                                                <td>{order.accessLink}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Guide Line:</td>
                                                                                                <td>{order.guideLine}</td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
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
                                                                                            type="text"
                                                                                            hidden
                                                                                            placeholder="User Name"
                                                                                            className="form-control"
                                                                                            name="noteAddedBySeller"
                                                                                            value={user?.email}
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
                                                                                                    name="sellerAddedNote"
                                                                                                    rows={5}
                                                                                                    defaultValue={order.sellerAddedNote}
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
                                                                            <button className="btn btn-outline-secondary btn-sm edit" disabled title="Disable" >
                                                                                <img src="https://cdn-icons-png.freepik.com/512/7934/7934573.png" height={20} width={20} alt="note" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div class="modal fade" id={`exampleModalorderSellerNote${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                        <div class="modal-dialog modal-lg modal-dialog-centered">
                                                                            <div class="modal-content">
                                                                                <div class="modal-header">
                                                                                    <h5 class="modal-title" id="exampleModalLabel">View Buyer Note</h5>
                                                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <table class="table table-hover mb-0">
                                                                                        <thead> <tr><th>-</th> <th>-</th> </tr> </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>Buyer Name</td>
                                                                                                <td>{order.noteAddedByBuyer ? order.noteAddedByBuyer : 'Buyer not added note yet'}</td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td>Buyer Note</td>
                                                                                                <td>{order.buyerAddedNote ? order.buyerAddedNote : 'Buyer not added note yet'}</td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                   {order.paymentStatus === 'Paid' ? <Link className="btn btn-primary" to={`/seller/update-order/${order._id}`}>Update</Link>
                                                                   :
                                                                   <></>
                                                                    }
                                                                </td>
                                                                <td>
                                                                   {order.paymentStatus === 'Paid' ? <p className="text-danger"> - ${order.packagePrice * 0.2} USD</p>
                                                                   :
                                                                   <></>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-3 d-flex justify-content-end">
                                                {filteredOrders.length > itemsPerPage && (
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
                                                        onPageChange={handlePageChange}
                                                    />
                                                )}
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

export default SellerOrders;
