import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import auth from "../../firebase.init";
import Pagination from "../../components/Shared/Pagination";
import { Link, useParams } from "react-router-dom";
import Loading from "../../components/Shared/Loading";

const SellerProductUpdate = () => {
    const [products, setProducts] = useState([]);
    const [user] = useAuthState(auth);
    const [productName, setProductName] = useState("");
    const [productNameError, setProductNameError] = useState("");
    const [productDescription, setProductDescription] = useState("");

    const [featuredImage, setFeaturedImage] = useState("");
    const [productImageOne, setProductImageOne] = useState("");
    const [productImageTwo, setProductImageTwo] = useState("");
    const [productImageThree, setProductImageThree] = useState("");
    const [categories, SetCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [e, productUpdate] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product/${id}`)
            .then((res) => res.json())
            .then((info) => productUpdate(info));
    }, [id]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/products?sellerEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => setProducts(info.reverse()));
    }, [user?.email]);


    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/categories`)
            .then((res) => res.json())
            .then((info) => SetCategories(info.reverse()));
    }, [user]);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/orders`)
            .then((res) => res.json())
            .then((info) => setOrders(info));
    }, []);

    const fetchProductDescription = (productId) => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product/${productId}`)
            .then((res) => res.json())
            .then((data) => {
                setProductDescription(data.productDescription);
                setFeaturedImage(data.featuredImage);
                setProductImageOne(data.productImageOne);
                setProductImageTwo(data.productImageTwo);
                setProductImageThree(data.productImageThree);
            })
            .catch((error) => {
                console.error("Error fetching product description:", error);
            });
    };

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/products?sellerEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => {
                setProducts(info.reverse());
                if (info.length > 0) {
                    fetchProductDescription(info[0]._id);
                }
            });
    }, [user?.email]);

    // Quill modules and formats
    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
        ],
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentService = products.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleProductNameChange = (e) => {
        const value = e.target.value;
        if (value.length > 45) {
            setProductNameError("Product name cannot exceed 45 characters");
        } else {
            setProductNameError("");
        }
        setProductName(value);
    };

    const handleEditService = (event, id) => {
        event.preventDefault();
        if (productNameError) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        const productName = event.target.productName.value;
        const price = event.target.price.value;

        const accessLink = event.target.accessLink.value;
        const guideLine = event.target.guideLine.value;

        const edit = {
            productName,
            productDescription,
            price,
            featuredImage,
            productImageOne,
            productImageTwo,
            productImageThree,
            accessLink,
            guideLine,
        };

        const url = `https://server.enjoywiki.com/marketplace-server-main/product/${id}`;
        fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(edit),
        })
            .then((res) => res.json())
            .then((result) => {
                toast.success("Updated Successfully");
                event.target.reset();
                const modal = document.querySelector(`.colorModal${id}`);
                if (modal) {
                    modal.classList.remove("show");
                }
                fetch(`https://server.enjoywiki.com/marketplace-server-main/products?sellerEmail=${user?.email}`)
                    .then((res) => res.json())
                    .then((info) => setProducts(info.reverse()));
            })
            .catch((error) => {
                console.error("Error creating service:", error);
            });
    };

    const handleImageUpload = async (event, setImage) => {
        const file = event.target.files[0];
        if (!file) return;
      
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File size exceeds 2 MB. Please upload a smaller image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(
                "https://server.enjoywiki.com/image-server/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.file && data.file.url) {
                setImage(data.file.url);
                toast.success("Image uploaded successfully!");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
        }
    };
 
 

    return (
        <>
            <div className="main-content m-5">
                <div className="page-content">
                    <div className="container-fluid">
                     
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">
                                            Products List
                                        </h4>
                                        <div className="table-responsive">
                                            <form
                                                onSubmit={(
                                                    event
                                                ) =>
                                                    handleEditService(
                                                        event,
                                                        e._id
                                                    )
                                                }
                                            >
                                                <div className="row mb-3">
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="productName"
                                                            className="form-label"
                                                        >
                                                            Product Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="productName"
                                                            defaultValue={
                                                                e.productName
                                                            }
                                                            onChange={
                                                                handleProductNameChange
                                                            }
                                                        />
                                                        {productNameError && (
                                                            <small className="text-danger">
                                                                {
                                                                    productNameError
                                                                }
                                                            </small>
                                                        )}
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="price"
                                                            className="form-label"
                                                        >
                                                            Price
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="price"
                                                            defaultValue={
                                                                e.price
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="productDescription"
                                                        className="form-label"
                                                    >
                                                        Product
                                                        Description
                                                    </label>
                                                    <ReactQuill
                                                      
                                                        defaultValue={e.productDescription}
                                                        onChange={(value) => setProductDescription(value)}
                                                        placeholder="Product Description"
                                                        className="form-control"
                                                        modules={quillModules}
                                                        name="productDescription"
                                                    />
                                                </div>



                                                <div className="row mb-3">
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="featuredImage"
                                                            className="form-label"
                                                        >
                                                            Featured
                                                            Image
                                                        </label>
                                                        <div className="mb-3">
                                                            
                                                                <img
                                                                    src={
                                                                        e.featuredImage
                                                                    }
                                                                    alt="Featured"
                                                                    className="img-fluid mb-2"
                                                                    width={200} accept="image/*"
                                                                    height={100}
                                                                />
                                                           
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="form-control"
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleImageUpload(
                                                                        event,
                                                                        setFeaturedImage
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="productImageOne"
                                                            className="form-label"
                                                        >
                                                            Product
                                                            Image
                                                            One
                                                            {e.productImageOne}
                                                        </label>
                                                        <div className="mb-3">
                                                            {e.productImageOne && (
                                                                <img
                                                                    src={
                                                                        e.productImageOne
                                                                    }
                                                                    alt="Product One"
                                                                    className="img-fluid mb-2"
                                                                    width={200}

                                                                    height={100}
                                                                />
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="form-control"
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleImageUpload(
                                                                        event,
                                                                        setProductImageOne
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="productImageTwo"
                                                            className="form-label"
                                                        >
                                                            Product
                                                            Image
                                                            Two
                                                        </label>
                                                        <div className="mb-3">
                                                            {productImageTwo && (
                                                                <img
                                                                    src={
                                                                        productImageTwo
                                                                    }
                                                                    alt="Product Two"
                                                                    className="img-fluid mb-2"
                                                                    width={200} accept="image/*"
                                                                    height={100}
                                                                />
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="form-control"
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleImageUpload(
                                                                        event,
                                                                        setProductImageTwo
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="productImageThree"
                                                            className="form-label"
                                                        >
                                                            Product
                                                            Image
                                                            Three
                                                        </label>
                                                        <div className="mb-3">
                                                            {productImageThree && (
                                                                <img
                                                                    src={
                                                                        productImageThree
                                                                    }
                                                                    alt="Product Three"
                                                                    className="img-fluid mb-2"
                                                                    width={200} accept="image/*"
                                                                    height={100}
                                                                />
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="form-control"
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    handleImageUpload(
                                                                        event,
                                                                        setProductImageThree
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="accessLink"
                                                            className="form-label"
                                                        >
                                                            Access
                                                            Link
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="accessLink"
                                                            defaultValue={
                                                                e.accessLink
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <label
                                                            htmlFor="guideLine"
                                                            className="form-label"
                                                        >
                                                            Guide
                                                            Line
                                                        </label>
                                                        <textarea
                                                            type="text"
                                                            className="form-control"
                                                            name="guideLine"
                                                            defaultValue={
                                                                e.guideLine
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                    >
                                                        Save
                                                        changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
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

export default SellerProductUpdate;
