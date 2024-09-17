import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateBuyerProfile = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const defaultImageURL = "https://raw.githubusercontent.com/Shah-Limon/em-list/master/images-dash/profile.jpg";

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/users?userEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => {
                setAllUsers(info.reverse());
                setFilteredUsers(info);
            });
    }, [user]);

    const handleEditCustomer = async (event, id, index) => {
        event.preventDefault();
        const userName = event.target.userName.value;
        const aboutMe = event.target.aboutMe.value;
        const address = event.target.address.value;
        const city = event.target.city.value;
        const country = event.target.country.value;
        let profileURL = defaultImageURL;

        if (imageFile) {
            try {
                const formData = new FormData();
                formData.append("image", imageFile);

                const response = await fetch("https://server.enjoywiki.com/image-server/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.file && data.file.url) {
                    profileURL = data.file.url;
                    toast.success("Image uploaded successfully!");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload image.");
                return;
            }
        } else if (event.target.profileURL.value) {
            profileURL = event.target.profileURL.value;
        }

        const edit = {
            userName,
            profileURL,
            aboutMe,
            address,
            city,
            country,
        };

        const url = `https://server.enjoywiki.com/marketplace-server-main/update-user-profile/${id}`;
        fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(edit),
        })
            .then((res) => res.json())
            .then((result) => {
                toast.success("User Updated Successfully!");
                event.target.reset();
                const modal = document.querySelector(`#exampleModal${index}`);
                if (modal) {
                    modal.classList.remove("show");
                }
                const link = document.createElement('a');
                link.href = "/";
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                navigate('/', { replace: true });  // Navigate to home page
                window.location.reload();  // Reload the home page

                fetch(`https://server.enjoywiki.com/marketplace-server-main/users?userEmail=${user?.email}`)
                    .then((res) => res.json())
                    .then((info) => {
                        setAllUsers(info);
                        setFilteredUsers(info);
                    });
            });
    };

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/Shah-Limon/canva-related-new/main/country.json")
            .then((res) => res.json())
            .then((data) => {
                const sortedCountries = data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sortedCountries);
            })
            .catch((error) => {
                console.error("Error fetching country data: ", error);
            });
    }, []);

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];

        // Check if a file is selected
        if (!selectedFile) return;

        // Set the maximum file size limit (2 MB)
        const MAX_FILE_SIZE = 1 * 1024 * 1024; // 2 MB in bytes

        // Check if the file size exceeds the maximum limit
        if (selectedFile.size > MAX_FILE_SIZE) {
            toast.error("File size exceeds 1 MB. Please upload a smaller image.");
            return;
        }

        setImageFile(selectedFile);

        const previewURL = URL.createObjectURL(selectedFile);
        setImagePreview(previewURL);
    };


    return (
        <>
            <div className="blog-page-area pd-top-100 pd-bottom-100 container">
                <div className="page-content">
                    <div className="container-fluid">
                        {allUsers === null ? (
                            <tr>
                                <td colSpan="4">Loading...</td>
                            </tr>
                        ) : (
                            filteredUsers.map((e, index) => (
                                <form
                                    key={e._id}
                                    className="comment-form"
                                    onSubmit={(event) => handleEditCustomer(event, e._id, index)}
                                >
                                    <div className="fadeInUp style-2 text-center">
                                        <div className="main-title">
                                            <h3>Edit User Info</h3>
                                        </div>
                                    </div>
                                    <div className="columns gap20">
                                        <fieldset className="email">
                                            <label className="mt-2">User Name</label>
                                            <input
                                                type="text"
                                                placeholder="User Name"
                                                className="form-control"
                                                name="userName"
                                                defaultValue={e.userName}
                                            />
                                        </fieldset>
                                        <fieldset className="email">
                                            <label className="mt-2">User Image</label>
                                            <div className="col-sm">
                                                <label className="mt-1">Upload Image</label>
                                                <div className="form-group mb-3">
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                                {imagePreview && (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        style={{ maxWidth: "100px" }}
                                                    />
                                                )}
                                                {!imageFile && !imagePreview && e.profileURL && (
                                                    <img
                                                        src={e.profileURL}
                                                        alt="Stored"
                                                        style={{ maxWidth: "100px" }}
                                                    />
                                                )}
                                                {!imageFile && !imagePreview && !e.profileURL && (
                                                    <img
                                                        src={defaultImageURL}
                                                        alt="Default"
                                                        style={{ maxWidth: "100px" }}
                                                    />
                                                )}
                                                <input
                                                    type="hidden"
                                                    name="profileURL"
                                                    defaultValue={e.profileURL || defaultImageURL}
                                                />
                                            </div>
                                        </fieldset>

                                        <fieldset className="email">
                                            <label className="mt-2">About Me</label>
                                            <textarea
                                                type="text"
                                                placeholder="About Me"
                                                className="form-control"
                                                name="aboutMe"
                                                defaultValue={e.aboutMe}
                                            />
                                        </fieldset>
                                        <fieldset className="email">
                                            <label className="mt-2">Address</label>
                                            <input
                                                type="text"
                                                placeholder="Address"
                                                className="form-control"
                                                name="address"
                                                defaultValue={e.address}
                                            />
                                        </fieldset>

                                        <fieldset className="email">
                                            <label className="mt-2">City</label>
                                            <input
                                                type="text"
                                                placeholder="City"
                                                className="form-control"
                                                name="city"
                                                defaultValue={e.city}
                                            />
                                        </fieldset>
                                        <fieldset className="email">
                                            <label className="mt-2">Country</label>
                                            <select
                                                className="form-control"
                                                name="country"
                                                defaultValue={e.country ? e.country : "Select Country"}
                                            >
                                                <option disabled>Select Country</option>
                                                {countries.map((country) => (
                                                    <option key={country.code} value={country.name}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </fieldset>
                                    </div>
                                    <div className="text-center">
                                        <button className="btn btn-success waves-effect waves-light m-5" type="submit">
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateBuyerProfile;
