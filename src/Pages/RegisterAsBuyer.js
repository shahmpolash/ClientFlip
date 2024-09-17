import React, { useState } from "react";
import {
    useCreateUserWithEmailAndPassword,
    useSignInWithGoogle,
    useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import auth from "../firebase.init";
import Loading from "../components/Shared/Loading";

const RegisterAsBuyer = () => {
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
    const [updateProfile, updating, updateError] = useUpdateProfile(auth);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(""); // State for user role

    let signInError;

    // Function to map Firebase error codes to custom messages
    const getErrorMessage = (error) => {
        if (!error) return "";
        switch (error.code) {
            case "auth/email-already-in-use":
                return "This email is already registered. Please use a different email.";
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/weak-password":
                return "Your password is too weak. Please enter a stronger password.";
            case "auth/user-disabled":
                return "This user has been disabled. Please contact support.";
            case "auth/user-not-found":
                return "No user found with this email.";
            case "auth/wrong-password":
                return "Incorrect password. Please try again.";
            default:
                return "An unexpected error occurred. Please try again later.";
        }
    };

    const onSubmit = async (data) => {
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(data.email, data.password);

            if (userCredential) {
                // Update user profile with display name
                await updateProfile({ displayName: data.name });

                // Send user data to backend
                const response = await fetch('https://server.enjoywiki.com/marketplace-server-main/add-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: data.name,
                        UserEmail: data.email,
                        userRole: data.userRole, // Include user role in the request
                        currentBalance: 0
                    }),
                });

                if (response.ok) {
                    console.log('User data saved successfully');
                    navigate('/update-profile');
                } else {
                    console.error('Failed to save user data to the database');
                }
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    };

    if (loading || gLoading || updating) {
        return <Loading />;
    }
    if (error || gError || updateError) {
        signInError = (
            <p className="text-danger text-center">
                {getErrorMessage(error || gError || updateError)}
            </p>
        );
    }

    return (
        <>
            <section className="pd-top-100 pd-bottom-100 bg-sky-blue">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-7 col-lg-10 text-center">
                            <div className="sign-in-area">
                                <h2>Sign up as a buyer</h2>
                                <p>Join as a buyer to access a vast selection of bulk digital assets on our marketplace. Discover diverse products and resources, all curated to meet your needs. Enhance your projects with high-quality digital solutions and save time</p>
                                <form className="contact-form-wrap" onSubmit={handleSubmit(onSubmit)} >
                                    <div className="single-input-wrap input-group">
                                        <label htmlFor="username">Your Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder="Enter Your Name"
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: "Name is Required",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.name && (
                                        <div className="text-danger">{errors.name.message}</div>
                                    )}
                                    <div className="single-input-wrap input-group">
                                        <label htmlFor="useremail">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="useremail"
                                            placeholder="Enter email"
                                            {...register("email", {
                                                required: {
                                                    value: true,
                                                    message: "Email is Required",
                                                },
                                                pattern: {
                                                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                                    message: "Provide a valid Email",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="text-danger">{errors.email.message}</div>
                                    )}
                                    <div className="single-input-wrap input-group">
                                        <label htmlFor="userpassword">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="userpassword"
                                            placeholder="Enter password"
                                            {...register("password", {
                                                required: {
                                                    value: true,
                                                    message: "Password is Required",
                                                },
                                                minLength: {
                                                    value: 6,
                                                    message: "Must be 6 characters or longer",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.password && (
                                        <div className="text-danger">{errors.password.message}</div>
                                    )}
                                     <input
                                        type='hidden'
                                        value='Buyer'
                                        {...register("userRole")}
                                    />
                                {signInError && <div className="text-danger">{signInError}</div>}
                                    <button className="btn btn-base w-100">Sign Up</button>
                                    <p>
                                        Already Have an account? <Link to="/login">Sign In</Link>
                                    </p>
                                </form>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegisterAsBuyer;
