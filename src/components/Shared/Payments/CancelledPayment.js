import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import auth from "../../../firebase.init";
import Loading from "../Loading";


const CancelledPayment = () => {
    const { id } = useParams();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    
    
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const updatePaymentStatus = async () => {
            try {
                const updateOrder = { paymentStatus: "Cancelled" };
                const url = `https://server.enjoywiki.com/marketplace-server-main/payment-cancelled/${id}`;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(updateOrder),
                });

                if (response.ok) {
                    setLoading(false);
                    setTimeout(() => {
                       // formRef.current.submit();
                        navigate("/buyer/orders?paymentStatus=Cancelled",
                        );
                    }, 1500);
                } else {
                    console.error("Payment update failed.");
                    setLoading(false);
                }
            } catch (error) {
                console.error("An error occurred:", error);
                setLoading(false);
            }
        };

        updatePaymentStatus();
    }, [id, navigate]);

    return (
        <div>
            
            <div style={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
            >
                {loading ? (
                    <div>
                        <Loading></Loading>
                    </div>
                ) : (


                    <div className="blog-page-area pd-top-100 pd-bottom-100 section-padding pb-0 h-100">
                        <div className="container">
                            <div className="row text-center ">
                                <div className="col-lg-12">
                                    <div className="contact__page-form">
                                        <section className="testimonials s2">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="testimonials__main">
                                                            <div className="block-text center">
                                                                <h4 className="heading">
                                                                    You have cancelled the payment. please try to pay again
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default CancelledPayment;

/**
 * const formRef = useRef(null);
 * <form
                    ref={formRef}
                    id="cancelPaymentForm"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <input type="text" hidden name="paymentStatus" value="Cancelled" />
                    <input type="submit" hidden value="Cancel Payment Now" />
                </form>
 */