import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import auth from "../../firebase.init";
import Pagination from "../../components/Shared/Pagination";
import { Link } from "react-router-dom";
import Loading from "../../components/Shared/Loading";

const SellerProducts = () => {
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
    const [price, setPrice] = useState("");
    const [priceError, setPriceError] = useState("");

    const handlePriceChange = (event) => {
        const value = event.target.value;
        setPrice(value);

        if (value === "") {
            // If input is empty, clear the error message
            setPriceError("");
        } else if (value < 1 || value > 500) {
            setPriceError("Price must be between 1 and 500 USD.");
        } else {
            setPriceError("");
        }
    };

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
        // Check file size (2 MB = 4 * 1024 * 1024 bytes)
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
    const handleDeleteProduct = (id) => {
        console.log("Deleting product with id:", id);
        fetch(`https://server.enjoywiki.com/marketplace-server-main/delete-product/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to delete product");
                }
                return res.json();
            })
            .then(() => {
                fetch(`https://server.enjoywiki.com/marketplace-server-main/products?sellerEmail=${user?.email}`)
                    .then((res) => res.json())
                    .then((info) => setProducts(info.reverse()));
                toast.success("Product deleted successfully");
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                toast.error("Error deleting product");
            });
    };

    const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

    const handlePaymentStatusChange = (event) => {
        setPaymentStatusFilter(event.target.value);
    };

    const filteredProducts =
        paymentStatusFilter === "all"
            ? products
            : products.filter(
                (product) => product.paymentStatus === paymentStatusFilter
            );

    return (
        <>
            <div className="main-content m-5" style={{ minHeight: '100vh' }}>
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="col-sm-6 col-md-4 col-xl-3">
                            <div className="my-4 text-center">
                                <Link
                                    to="/seller/add-product"
                                    type="button"
                                    className="btn btn-primary m-3 mt-5"
                                >
                                    <i className="mdi mdi-plus me-2"></i>Add
                                    Product
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">
                                            Products List
                                        </h4>
                                        <div className="table-responsive">
                                            <table className="table table-editable table-nowrap align-middle table-edits">
                                                <thead>
                                                    <tr>
                                                        <th>Product Name</th>
                                                        <th>Total Sales</th>
                                                        <th>Price</th>
                                                        <th>Category</th>
                                                        <th>Edit</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products === null ? (
                                                        <tr>
                                                            <td colSpan="4">
                                                                <Loading></Loading>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        currentService.map(
                                                            (e, index) => (
                                                                <tr key={e._id}>
                                                                    <td>
                                                                        <a
                                                                            href={`/product/${e._id}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-dark mb-1 font-size-15"
                                                                        >
                                                                            {
                                                                                e.productName
                                                                            }
                                                                        </a>
                                                                    </td>
                                                                    <td data-field="age">
                                                                        {orders.filter(order => order.packageId === e._id && order.paymentStatus === 'Paid').length}
                                                                    </td>
                                                                    <td data-field="age">
                                                                        $
                                                                        {
                                                                            e.price
                                                                        }{" "}
                                                                        USD
                                                                    </td>

                                                                    <td data-field="age">
                                                                        {
                                                                            e.category
                                                                        }
                                                                    </td>
                                                                    <td data-field="age">
                                                                        <Link to={`/seller/edit-product/${e._id}`} className="btn btn-primary btn-sm">
                                                                            Edit
                                                                        </Link>
                                                                    </td>

                                                                    
                                                                </tr>
                                                            )
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                            <div className="pagination-container">
                                                {products.length > itemsPerPage && (
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={Math.ceil(products.length / itemsPerPage)}
                                                        onPageChange={handlePageChange}
                                                    />
                                                )}
                                            </div>
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

export default SellerProducts;