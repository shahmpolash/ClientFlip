import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";

const ReceivedPayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seller, setSeller] = useState({});
    const [commissionRate, setCommissionRate] = useState(0);
    const [user] = useAuthState(auth);

    useEffect(() => {
        // Fetch order data
        const fetchOrder = async () => {
            try {
                const response = await fetch(`https://server.enjoywiki.com/marketplace-server-main/order/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order");
                }
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    useEffect(() => {
        // Fetch seller data
        const fetchSeller = async () => {
            try {
                if (order?.sellerEmail) {
                    const response = await fetch(`https://server.enjoywiki.com/marketplace-server-main/users?userEmail=${order.sellerEmail}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch seller");
                    }
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setSeller(data[0]);
                    }

                    // For testing purposes: sending an email to the seller
                    const sendMail = await fetch(`https://server.enjoywiki.com/marketplace-server-main/emails/seller?userEmail=${order.sellerEmail}`);
                    const sentMail = await sendMail.json();
                    if (!sentMail.accepted) {
                        console.log("Failed to send email to the seller");
                    }
                }
            } catch (error) {
                console.error("Error fetching seller:", error);
            }
        };

        fetchSeller();
    }, [order?.sellerEmail]);

    useEffect(() => {
        // Fetch commission rate
        const fetchCommissionRate = async () => {
            try {
                const response = await fetch(`https://server.enjoywiki.com/marketplace-server-main/commissions`);
                if (!response.ok) {
                    throw new Error("Failed to fetch commission");
                }
                const data = await response.json();
                setCommissionRate(data[0]?.commission || 0);
            } catch (error) {
                console.error("Error fetching commission:", error);
            }
        };

        fetchCommissionRate();
    }, []);

    useEffect(() => {
        // Update order data
        const updateOrderData = async () => {
            try {
                if (!order || !seller._id || loading) return;

                const orderPrice = parseFloat(order.packagePrice || 0);
                const commissionAmount = (orderPrice * commissionRate) / 100;

                const responseSeller = await fetch(`https://server.enjoywiki.com/marketplace-server-main/user/${seller._id}`);
                if (!responseSeller.ok) {
                    throw new Error("Failed to fetch seller data");
                }
                const sellerData = await responseSeller.json();
                if (!sellerData) {
                    throw new Error("Seller data not found");
                }

                const currentBalance = parseFloat(sellerData.currentBalance || 0);
                const updatedBalance = currentBalance + orderPrice - commissionAmount;
             

                // Update seller's balance first
                await fetch(`https://server.enjoywiki.com/marketplace-server-main/user-balance/${seller._id}`, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({ currentBalance: updatedBalance }),
                });

                // Then update order payment status
                const updateOrder = { paymentStatus: "Paid" };
                const response = await fetch(`https://server.enjoywiki.com/marketplace-server-main/payment-received/${id}`, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(updateOrder),
                });



                if (!response.ok) {
                    throw new Error("Failed to update order");
                }

                // For testing purposes: sending an email to the buyer
                const sendMail = await fetch(`https://server.enjoywiki.com/marketplace-server-main/emails/buyer?userEmail=${user?.email}`);
                const sentMail = await sendMail.json();
                if (!sentMail.accepted) {
                    console.log("Failed to send email to the buyer");
                }

                navigate("/buyer/orders");
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        updateOrderData();
    }, [order, seller, id, commissionRate, navigate, user?.email, loading]);

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="testimonials__main">
                        <div className="block-text">
                            <h4 className="heading">
                                We have received your payment. {order && order._id}. Redirect Shortly.....
                            </h4>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceivedPayment;
