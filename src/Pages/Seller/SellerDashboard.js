import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const SellerDashboard = () => {

    const [orders, setOrders] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [user] = useAuthState(auth)



    useEffect(() => {
        if (user) {
            fetch(`https://server.enjoywiki.com/marketplace-server-main/orders?sellerEmail=${user?.email}`)
                .then((res) => res.json())
                .then((info) => {
                    setOrders(info.reverse());
                })
                .catch((error) => {
                    console.error("Error fetching orders: ", error);
                });
        }
    }, [user]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/users?userEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => setUserInfo(info[0]));
    }, [user]);

    const paidOrders = orders.filter(order => order.paymentStatus === 'Paid');
    const totalSalesAmount = paidOrders.reduce((total, order) => {
        const flipbundleCharge = parseFloat(order.packagePrice) * 0.8; // Apply 20% discount
        return total + flipbundleCharge;
      }, 0).toFixed(2);

    const currentBalanceNumber = parseFloat(userInfo.currentBalance);
    const formattedBalance = isNaN(currentBalanceNumber) ? '0.00' : currentBalanceNumber.toFixed(2);

    return (
        <section className="blog-page-area pd-top-100 pd-bottom-100">
            <div className="container">
            <div class="address-inner d-flex justify-content-center">
                <h4>Welcome, {userInfo.userName}</h4>                   
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/mobile-app-d6c0d.appspot.com/o/images%2F7892379.png?alt=media&token=647b536e-3947-4ddc-bf64-cac1342e9f35" alt="img" />
                                </div>
                                <h3 className="mb-3">
                                    <span className="counter_value badge bg-soft-primary text-primary fw-bold font-size-26 mb-0">
                                        ${formattedBalance}
                                    </span>
                                </h3>
                                <h4>Current Balance</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/mobile-app-d6c0d.appspot.com/o/images%2F11786683.png?alt=media&token=87354dd4-9f67-490b-b486-e9ebca7647a6" alt="img" />
                                </div>
                                <h3 className="mb-3">
                                    <span className="counter_value badge bg-soft-primary text-primary fw-bold font-size-26 mb-0">
                                        ${totalSalesAmount}
                                    </span>
                                </h3>
                                <h4>Total Earning</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/mobile-app-d6c0d.appspot.com/o/images%2F5901074.png?alt=media&token=0e77fe6d-7ed2-47dc-a251-10a0b02fef40" alt="img" />
                                </div>
                                <h3 className="mb-3">
                                    <span className="counter_value badge bg-soft-primary text-primary fw-bold font-size-26 mb-0">
                                        {orders.length === 1 ? (
                                            "1 item order"
                                        ) : (
                                            orders.length > 0 ? (
                                                `${orders.filter(order => order.paymentStatus === 'Paid').length} Items Sold`
                                            ) : (
                                                <Skeleton height={50} />
                                            )
                                        )}
                                    </span>
                                </h3>
                                <div className="isotope-filters item-isotope-btn">
                                    <button className="button active">
                                        <Link to="/seller/orders">Total Orders</Link>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/mobile-app-d6c0d.appspot.com/o/images%2F4070660.png?alt=media&token=d33ee695-560e-4265-9f55-d65ba748c4fe" alt="img" />
                                </div>
                                <div className="isotope-filters item-isotope-btn">
                                    <button className="button active">
                                        <Link to="/seller/withdraw">Withdraw Balance</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/mobile-app-d6c0d.appspot.com/o/images%2Fshopping-cart-with-electronic-commerce-icons_24877-50277.avif?alt=media&token=34f008a5-d753-43b2-975a-24aba0716f4c" alt="img" />
                                </div>
                                <div className="isotope-filters item-isotope-btn">
                                    <button className="button active">
                                        <Link to="/seller/products">Products</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="sidebar-area">
                            <div className="widget widget-client text-center">
                                <div className="thumb">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/mobile-app-d6c0d.appspot.com/o/images%2F11430276.png?alt=media&token=f457f78a-68e1-449e-89e2-25ccac531b74" alt="img" />
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

export default SellerDashboard;