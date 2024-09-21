import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Shared/Loading';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [productImageOne, setProductImageOne] = useState('');
    const [productImageTwo, setProductImageTwo] = useState('');
    const [productImageThree, setProductImageThree] = useState('');
    const [accessLink, setAccessLink] = useState('');
    const [guideLine, setGuideLine] = useState('');

    const [productNameError, setProductNameError] = useState('');
    const [priceError, setPriceError] = useState('');

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/product/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setProductName(data.productName);
                setProductDescription(data.productDescription);
                setPrice(data.price);
                setFeaturedImage(data.featuredImage);
                setProductImageOne(data.productImageOne);
                setProductImageTwo(data.productImageTwo);
                setProductImageThree(data.productImageThree);
                setAccessLink(data.accessLink);
                setGuideLine(data.guideLine);
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
                toast.error('Failed to fetch product information');
            });
    }, [id]);

    const handleProductNameChange = (e) => {
        const value = e.target.value;
        setProductName(value);
        if (value.length > 45) {
            setProductNameError('Product name cannot exceed 45 characters');
        } else {
            setProductNameError('');
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        setPrice(value);
        if (value === '') {
            setPriceError('');
        } else if (value < 1 || value > 500) {
            setPriceError('Price must be between 1 and 500 USD.');
        } else {
            setPriceError('');
        }
    };

    const handleImageUpload = async (event, setImage) => {
        const file = event.target.files[0];
        if (!file) return;
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File size exceeds 2 MB. Please upload a smaller image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(
                'https://server.enjoywiki.com/image-server/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.file && data.file.url) {
                setImage(data.file.url);
                toast.success('Image uploaded successfully!');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (productNameError || priceError) {
            toast.error('Please fix the errors before submitting.');
            return;
        }

        const updatedProduct = {
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

        try {
            const response = await fetch(`https://server.enjoywiki.com/marketplace-server-main/product/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (response.ok) {
                toast.success('Product updated successfully');
                navigate('/seller/products');
                window.scrollTo(0, 0);
            } else {
                throw new Error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    if (!product) {
        return <div><LoadingSpinner></LoadingSpinner></div>;
    }

    return (
        <div className="container mt-5 mb-5">
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        value={productName}
                        onChange={handleProductNameChange}
                        required
                    />
                    {productNameError && <small className="text-danger">{productNameError}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        value={price}
                        onChange={handlePriceChange}
                        required
                    />
                    {priceError && <small className="text-danger">{priceError}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label">Product Description</label>
                    <ReactQuill
                        value={productDescription}
                        onChange={setProductDescription}
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['clean']
                            ],
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="featuredImage" className="form-label">Featured Image</label>
                    {featuredImage && <img src={featuredImage} alt="Featured" className="img-thumbnail mb-2" style={{maxWidth: '200px'}} />}
                    <input
                        type="file"
                        className="form-control"
                        id="featuredImage"
                        onChange={(e) => handleImageUpload(e, setFeaturedImage)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="productImageOne" className="form-label">Product Image One</label>
                    {productImageOne && <img src={productImageOne} alt="Product One" className="img-thumbnail mb-2" style={{maxWidth: '200px'}} />}
                    <input
                        type="file"
                        className="form-control"
                        id="productImageOne"
                        onChange={(e) => handleImageUpload(e, setProductImageOne)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="productImageTwo" className="form-label">Product Image Two</label>
                    {productImageTwo && <img src={productImageTwo} alt="Product Two" className="img-thumbnail mb-2" style={{maxWidth: '200px'}} />}
                    <input
                        type="file"
                        className="form-control"
                        id="productImageTwo"
                        onChange={(e) => handleImageUpload(e, setProductImageTwo)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="productImageThree" className="form-label">Product Image Three</label>
                    {productImageThree && <img src={productImageThree} alt="Product Three" className="img-thumbnail mb-2" style={{maxWidth: '200px'}} />}
                    <input
                        type="file"
                        className="form-control"
                        id="productImageThree"
                        onChange={(e) => handleImageUpload(e, setProductImageThree)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="accessLink" className="form-label">Access Link</label>
                    <input
                        type="text"
                        className="form-control"
                        id="accessLink"
                        value={accessLink}
                        onChange={(e) => setAccessLink(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="guideLine" className="form-label">Guide Line</label>
                    <textarea
                        className="form-control"
                        id="guideLine"
                        value={guideLine}
                        onChange={(e) => setGuideLine(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Update Product</button>
            </form>
        </div>
    );
};

export default EditProduct;