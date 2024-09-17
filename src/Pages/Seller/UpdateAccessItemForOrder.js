import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import auth from "../../firebase.init";


const UpdateAccessItemForOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState([]);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/order/${id}`)
            .then((res) => res.json())
            .then((info) => setOrder(info));
    }, [id]);

    const handleUpdateAccessOrderLink = (event) => {
        event.preventDefault();
        const accessLink = event.target.accessLink.value;
        const guideLine = event.target.guideLine.value;
      
        const updateAccessLink = {
            accessLink,
            guideLine,
          
        };
    
        const url = `https://server.enjoywiki.com/marketplace-server-main/update-order-seller/${order._id}`;
        fetch(url, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updateAccessLink),
        })
          .then((res) => res.json())
          .then((result) => {
            alert("Updated");
            navigate('/seller/orders');
          });
      };

    return (
        <>
            <div className="blog-page-area pd-top-100 pd-bottom-100 mt-5 mb-5 align-items-center d-flex justify-content-center pt-2 pt-sm-5 pb-4 pb-sm-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-6 mt-5 mb-5">
                            <form onSubmit={handleUpdateAccessOrderLink}>
                                <fieldset className="message">
                                    <label className="mb-2">Product Access Link</label>
                                    <input  className="form-control"
                                        type='text' name='accessLink' defaultValue={order.accessLink}
                                    />
                                </fieldset> <br></br>
                                <fieldset className="message">
                                    <label className="mb-2">User GuideLine</label>
                                    <textarea  className="form-control"
                                        type='text' name='guideLine' defaultValue={order.guideLine}
                                    />
                                </fieldset>

                                <input  className="form-control" type='submit' value='Update Now'></input>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateAccessItemForOrder;