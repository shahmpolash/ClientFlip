import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import auth from "../../firebase.init";
import { useNavigate } from "react-router-dom";
import './SellerAddProduct.css';

const SellerAddProduct = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/categories`)
            .then((res) => res.json())
            .then((info) => setCategories(info.reverse()));
    }, [user]);

    const [productDescription, setProductDescription] = useState("");
    const [productName, setProductName] = useState("");
    const [productNameError, setProductNameError] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState([]);
    const [price, setPrice] = useState("");
    const [priceError, setPriceError] = useState("");


    const [featuredImage, setFeaturedImage] = useState("");
    const [productImageOne, setProductImageOne] = useState("");
    const [productImageTwo, setProductImageTwo] = useState("");
    const [productImageThree, setProductImageThree] = useState("");

    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
        ],
    };
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


    const handleProductNameChange = (event) => {
        const value = event.target.value;
        setProductName(value);
        setCharCount(value.length);

        if (value.length > 45) {
            setProductNameError("Product name cannot exceed 45 characters.");
        } else {
            setProductNameError("");
        }
    };

    const handleImageUpload = async (event, setImage) => {
        const file = event.target.files[0];
        if (!file) return;
        const maxSize = 2 * 1024 * 1024; // 2 MB
        if (file.size > maxSize) {
            toast.error("File size exceeds 2 MB. Please upload a smaller image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("https://server.enjoywiki.com/image-server/upload", {
                method: "POST",
                body: formData,
            });

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

    const handleTagInputKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const newTag = event.target.value.trim();
            if (newTag && !tags.includes(newTag) && tags.length < 5) {
                setTags([...tags, newTag]);
                event.target.value = "";
            }
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleCreate = (event) => {
        event.preventDefault();
        if (productName.length > 45) {
            setProductNameError("Product name cannot exceed 45 characters.");
            return;
        }
        const price = parseFloat(event.target.price.value);
        if (isNaN(price) || price < 1 || price > 500) {
            toast.error("Price must be between 1 and 500 USD.");
            return;
        }
        if (priceError) {
            toast.error(priceError);
            return;
        }


        setIsSubmitting(true);

        const productStatus = event.target.productStatus.value;
        const sellerEmail = event.target.sellerEmail.value;

        const selectedCategorySlug = event.target.category.value;
        const selectedCategory = categories.find(category => category.slug === selectedCategorySlug);
        const categoryName = selectedCategory?.categoryName;
        const accessLink = event.target.accessLink.value;
        const guideLine = event.target.guideLine.value;

        const add = {
            productStatus,
            sellerEmail,
            productName,
            price: parseFloat(price),
            category: categoryName,
            categorySlug: selectedCategorySlug,
            productDescription,
            featuredImage,
            productImageOne,
            productImageTwo,
            productImageThree,
            accessLink,
            guideLine,
            tags, // Tags are passed here
        };

        const url = `https://server.enjoywiki.com/marketplace-server-main/add-product`;
        fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(add),
        })
            .then((res) => res.json())
            .then((result) => {
                toast.success("Added Successfully");
                event.target.reset();
                setTags([]);
                navigate('/seller/products');
            })
            .catch((error) => {
                console.error('Error creating service:', error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <div className="main-content m-5">
                <div className="page-content">

                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body container">

                                        <form className="comment-form container add-product" onSubmit={handleCreate}>
                                            <input
                                                hidden
                                                type="text"
                                                value="Approved"
                                                name="productStatus"
                                            />
                                            <div className="fadeInUp style-2 text-center">
                                                <div className="main-title"><h5>Add Product</h5></div>
                                            </div>
                                            <div className="columns gap20">

                                                <div className="mb-5">
                                                    <input
                                                        hidden
                                                        type="text"
                                                        value={user?.email}
                                                        name="sellerEmail"
                                                    />
                                                    <fieldset className="email">
                                                        <label className="mb-2">Item Name (Eg: 70+ Premium WordPress Themes) {productNameError && <p className="error text-danger">{productNameError}</p>}
                                                            <p>Character count: {charCount}/45</p></label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="Item Name"
                                                            className="form-control"
                                                            name="productName"
                                                            value={productName}
                                                            onChange={handleProductNameChange}
                                                        />
                                                    </fieldset>
                                                    <fieldset className="message">
                                                        <label className="mb-2">Price- (in USD)</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            inputMode="numeric"
                                                            name="price"
                                                            placeholder="Item Price"
                                                            className="form-control"
                                                            min="1"
                                                            max="500" // Set maximum price to 500
                                                            step="0.01" // Allows for decimal values
                                                            value={price}
                                                            onChange={handlePriceChange}
                                                        />
                                                        {priceError && <p className="error text-danger">{priceError}</p>}
                                                    </fieldset>



                                                    <fieldset className="message">
                                                        <label className="mb-2">Category</label>
                                                        <select name="category" className="form-control " required>
                                                            <option value="">Select a category</option>
                                                            {categories.map((category) => (
                                                                <option key={category._id} value={category.slug}>
                                                                    {category.categoryName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </fieldset>
                                                    <fieldset className="message">
                                                        <label className="mb-2">Product Description</label>
                                                        <ReactQuill
                                                            id={`productDescription-new`}
                                                            onChange={(value) => setProductDescription(value)}
                                                            placeholder="Product Description"
                                                            className="form-control text-area-sec"
                                                            modules={quillModules}
                                                            name="productDescription"
                                                        />
                                                    </fieldset>
                                                </div>



                                                <fieldset className="message mt-5">
                                                    <label className="mb-2">Featured Image (Upload an image file) Image size: 960x540</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="form-control"
                                                        onChange={(e) => handleImageUpload(e, setFeaturedImage)}
                                                    />
                                                    {featuredImage && <p>Uploaded Image: <img src={featuredImage} height={100} width={100} alt="product images" /></p>}
                                                </fieldset>
                                                <fieldset className="message">
                                                    <label className="mb-2">Product Image One (Upload an image file)</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="form-control"
                                                        onChange={(e) => handleImageUpload(e, setProductImageOne)}
                                                    />
                                                    {productImageOne && <p>Uploaded Image: <img src={productImageOne} height={100} width={100} alt="product images" /></p>}
                                                </fieldset>
                                                <fieldset className="message">
                                                    <label className="mb-2">Product Image Two (Upload an image file)</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="form-control"
                                                        onChange={(e) => handleImageUpload(e, setProductImageTwo)}
                                                    />
                                                    {productImageTwo && <p>Uploaded Image: <img src={productImageTwo} height={100} width={100} alt="product images" /></p>}
                                                </fieldset>
                                                <fieldset className="message">
                                                    <label className="mb-2">Product Image Three (Upload an image file)</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="form-control"
                                                        onChange={(e) => handleImageUpload(e, setProductImageThree)}
                                                    />
                                                    {productImageThree && <p>Uploaded Image: <img src={productImageThree} height={100} width={100} alt="product images" /></p>}
                                                </fieldset>

                                                <fieldset className="message">
                                                    <label className="mb-2">Access Link</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Access Link"
                                                        className="form-control"
                                                        name="accessLink"
                                                    />
                                                </fieldset>

                                                <fieldset className="message">
                                                    <label className="mb-2">Guide Line</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Guide Line"
                                                        className="form-control"
                                                        name="guideLine"
                                                    />
                                                </fieldset>


                                                <fieldset className="message">
                                                    <label className="">Tags (Add max 5 tags by pressing Enter. Tags help buyers find your product in search results.)</label>

                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        placeholder="Enter a tag and press Enter"
                                                        onKeyDown={handleTagInputKeyDown}
                                                    />
                                                    <div className="tags-list">
                                                        {tags.map((tag, index) => (
                                                            <span key={index} className="tag mb-5">
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleTagRemove(tag)}
                                                                    className="remove-tag"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>

                                                </fieldset>



                                                <div className="form-group text-center">
                                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                        {isSubmitting ? "Submitting..." : "Add Product"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>

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

export default SellerAddProduct;
