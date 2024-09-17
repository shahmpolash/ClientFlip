import React, { useEffect } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import auth from "../firebase.init";
import Loading from "../components/Shared/Loading";

// Define custom error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This user has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup closed by user.';
    default:
      return 'Incorrect Credentials. Please try again.';
  }
};

const Login = () => {
  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [userMail] = useAuthState(auth);

  let signInError;

  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (userMail) {
      navigate(from, { replace: true });
    }
  }, [userMail, from, navigate]);

  const onSubmit = (data) => {
    signInWithEmailAndPassword(data.email, data.password);
  };

  if (loading || gLoading) {
    return <Loading></Loading>;
  }

  if (error || gError) {
    const errorCode = error?.code || gError?.code;
    const errorMessage = getErrorMessage(errorCode);
    signInError = (
      <p className="text-red-500 text-center">
        <small>{errorMessage}</small>
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
                <h2>Sign in to your account</h2>
                <form className="contact-form-wrap" onSubmit={handleSubmit(onSubmit)}>
                  <div className="single-input-wrap input-group">
                    <label htmlFor="inp-1">Email address</label>
                    <input
                      id="inp-1"
                      type="text"
                      className="form-control"
                      placeholder="Enter your email address"
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

                    <label htmlFor="inp-1">
                      {errors.email && (
                        <div className="text-danger">{errors.email.message}</div>
                      )}
                    </label>
                  </div>

                  <div className="single-input-wrap input-group">
                    <label htmlFor="inp-2">Password</label>
                    <input
                      id="inp-2"
                      type="password"
                      className="form-control"
                      placeholder="Enter your email password"
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
                    <label htmlFor="inp-2">
                      {errors.password && (
                        <div className="text-danger">{errors.password.message}</div>
                      )}
                    </label>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-sm-6 col-12 text-sm-right text-left">
                      <Link className="forget-pass" to="/reset">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  {signInError && <div className="text-danger">{signInError}</div>}
                  <button className="btn btn-base w-100">Sign In</button>
                  <p>
                    Have you didn't any account? <Link to="/register">Sign Up</Link>
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

export default Login;
