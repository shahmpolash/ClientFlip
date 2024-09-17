import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/Shared/Loading';

const BuyerDashboard = () => {
    const [userInfo, setUserInfo] = useState([]);
    const [orders, setOrders] = useState([]);
    const [user] = useAuthState(auth)
    
    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/users`)
            .then((res) => res.json())
            .then((info) => setUserInfo(info));
    }, [user]);

    useEffect(() => {
        if (user) {
            fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?userEmail=${user.email}`)
                .then((res) => res.json())
                .then((info) => {
                    setOrders(info.reverse());
                })
                .catch((error) => {
                    console.error("Error fetching orders: ", error);
                });
        }
    }, [user]);

    const paidOrders = orders.filter(order => order.paymentStatus === 'Paid');
    const totalSalesAmount = paidOrders.reduce((total, order) => total + parseFloat(order.packagePrice), 0).toFixed(2);

    if (!user) {
        return <><LoadingSpinner></LoadingSpinner></>;
    }
    return (
        <section className="blog-page-area pd-top-100 pd-bottom-100">
            <div className="container">
                <div class="address-inner d-flex justify-content-center">
                <h4>Welcome, {userInfo.map(e => e.UserEmail === user?.email && e.userName)}</h4>                   
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://cdn-icons-png.freepik.com/512/7892/7892379.png" alt="img" />
                                </div>
                                <h3 className="mb-3">
                                    <span className="counter_value badge bg-soft-primary text-primary fw-bold font-size-26 mb-0">
                                        ${totalSalesAmount}
                                    </span>
                                </h3>
                                <h4>Total Expenses</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://cdn-icons-png.freepik.com/512/5901/5901074.png" alt="img" />
                                </div>
                                <h3 className="mb-3">
                                    <span className="counter_value badge bg-soft-primary text-primary fw-bold font-size-26 mb-0">
                                        {orders.length}
                                    </span>
                                </h3>
                                <div className="isotope-filters item-isotope-btn">
                                    <button className="button active">
                                        <Link to="/buyer/orders">Total Orders</Link>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://cdn-icons-png.freepik.com/512/4070/4070660.png" alt="img" />
                                </div>

                                <div className="isotope-filters item-isotope-btn">
                                    <button className="button active">
                                        <Link to="/buyer/pending-payment">Pending Payments</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://cdn-icons-png.freepik.com/512/2268/2268705.png" alt="img" />
                                </div>
                                <div className="isotope-filters item-isotope-btn">
                                    <button className="button active">
                                        <Link to="/buyer/support">Support</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://cdn-icons-png.freepik.com/512/11430/11430276.png" alt="img" />
                                </div>
                                <div className="isotope-filters item-isotope-btn">
                                    <button className="button active">
                                        <Link to="/update-profile">Update Profile</Link>
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BuyerDashboard;