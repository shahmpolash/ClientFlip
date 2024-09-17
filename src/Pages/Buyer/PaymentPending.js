import React, { useEffect, useState } from "react";
import Pagination from "../../components/Shared/Pagination";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { Link } from "react-router-dom";

const PaymentPending = () => {
    const [orders, setOrders] = useState([]);
    const [user] = useAuthState(auth)

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?userEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => setOrders(info.reverse()));
    }, [user]);

    // Filter orders with paymentStatus === "Pending"
    const pendingPayment = orders.filter(
        (order) => order.paymentStatus === "pending"
    );

    //pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentService = pendingPayment.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    return (
        <>
            <div className="blog-page-area pd-top-100 pd-bottom-100">
                <div className="page-content">
                    <div className="container-fluid">
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="card-title">Pending Pending</h4>

                                        <div class="table-responsive">
                                            <table class="table table-editable table-nowrap align-middle table-edits">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {orders === null ? (
                                                        <tr>
                                                            <td colSpan="4">Loading...</td>
                                                        </tr>
                                                    ) : currentService.map((e, index) => (
                                                        <tr key={e._id}>
                                                            
                                                            <td data-field="packageName">{e.packageName}</td>
                                                            <td data-field="packagePrice">${e.packagePrice}</td>
                                                            <td>
                                                                <div>
                                                                  
                                                                    <div className="isotope-filters item-isotope-btn">
                                                                        <button className="btn">
                                                                            <Link to={`/pay-now/${e._id}`}>Pay With PayPal</Link>
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(pendingPayment.length / itemsPerPage)}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPending;
