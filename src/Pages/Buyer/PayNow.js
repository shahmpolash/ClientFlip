import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useParams } from "react-router-dom";
import auth from "../../firebase.init";


const PayNow = () => {
    const { id } = useParams();
    const [order, setOrder] = useState([]);
    const [paypal, setPaypal] = useState([]);
    const [user] = useAuthState(auth);
    const currentDomain = window.location.origin;

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/order/${id}`)
            .then((res) => res.json())
            .then((info) => setOrder(info));
    }, [id]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/payments`)
            .then((res) => res.json())
            .then((info) => setPaypal(info));
    }, []);

    return (
        <>
            <div className="blog-page-area pd-top-100 pd-bottom-100  align-items-center d-flex justify-content-center pt-2 pt-sm-5 pb-4 pb-sm-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-6">
                            <div className="card">
                                <div className="card-body p-0 text-center">
                                    <div className="p-xl-5 p-3">
                                        <div className="mx-auto mb-5">
                                            <h6 className="sub-heading">
                                                <span>Pay Now</span>
                                            </h6>
                                            <h6 className="heading">
                                                Item Name: {order.packageName}
                                                <span className="arlo_tm_animation_text_word" /> <br />
                                                <h5 className="mb-15">Price: {order.packagePrice}$</h5>
                                            </h6>
                                        </div>
                                        <div className="authentication-form isotope-filters item-isotope-btn">
                                           

                                            <form
                                                action="https://www.paypal.com/cgi-bin/webscr"
                                                method="post"
                                                target="_top"
                                            >
                                                {paypal.map((e) => (
                                                    <input name="business" hidden value={e.email} />
                                                ))}
                                                <input type="hidden" name="item_number" value="1" />
                                                <input hidden name="amount" value={order.packagePrice} />

                                                <input type="hidden" name="no_shipping" value="1" />
                                                <input type="hidden" name="currency_code" value="USD" />
                                                <input
                                                    type="hidden"
                                                    name="notify_url"
                                                    value="http://sitename/paypal-payment-gateway-integration-in-php/notify.php"
                                                />
                                                <input
                                                    type="hidden"
                                                    name="cancel_return"
                                                    value={`${currentDomain}/cancelled-payment/${order._id}`}
                                                    // value={`${currentDomain}/received-payment/${order._id}/${order.paymentId}`}
                                                />
                                                <input
                                                    type="hidden"
                                                    name="return"
                                                    value={`${currentDomain}/received-payment/${order._id}/${order.paymentId}`}
                                                    // value={`${currentDomain}/cancelled-payment/${order._id}`}
                                                />
                                                <input type="hidden" name="cmd" value="_xclick" />
                                                <input
                                                    type="submit"
                                                    name="pay_now"
                                                    id="pay_now"
                                                    className="paypay--btn button active "
                                                    value="Pay Now"
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </div>{" "}
                            </div>
                        </div>{" "}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayNow;