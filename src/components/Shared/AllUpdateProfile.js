// import React from 'react';
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import auth from '../../firebase.init';


// const AllUpdateProfile = () => {
//     const navigate = useNavigate();
//     const [user, loading, error] = useAuthState(auth);
//     const [countries, setCountries] = useState([]);
//     const [selectedUserRole, setSelectedUserRole] = useState([]);
//     const [userProfile, setUserProfile] = useState([]);
//     const [selectedCountry, setSelectedCountry] = useState("");

//     const handleUpdate = event => {
//         event.preventDefault();

//         const freelancer = {
//             userName: event.target.userName.value,
//             UserEmail: event.target.UserEmail.value,
//             profileURL: event.target.profileURL.value,
//             country: event.target.country.value,
//             city: event.target.city.value,
//             address: event.target.address.value,
//             userRole: event.target.userRole.value,
//             currentBalance: event.target.currentBalance.value,
//         }
//         const url = `https://server.enjoywiki.com/marketplace-server-main/add-user`;
//         fetch(url, {
//             method: 'POST',
//             headers: {
//                 'content-type': 'application/json'
//             },
//             body: JSON.stringify(freelancer)
//         })
//             .then(res => res.json())
//             .then(result => {
//                 navigate('/');
//                 toast.success('Profile Updated successfully', {
//                     position: "top-right",
//                     autoClose: 5000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "light",
//                 });
//             })
//     }

//     useEffect(() => {
//         fetch("https://restcountries.com/v3.1/all")
//             .then((res) => res.json())
//             .then((data) => {
//                 const sortedCountries = data.sort((a, b) =>
//                     a.name.common.localeCompare(b.name.common)
//                 );

//                 setCountries(sortedCountries);
//             })
//             .catch((error) => {
//                 console.error("Error fetching country data: ", error);
//             });
//     }, []);


//     useEffect(() => {
//         fetch(`https://server.enjoywiki.com/marketplace-server-main/users?UserEmail=${user?.email}`)
//             .then(res => res.json())
//             .then(data => setUserProfile(data))
//     }, [])
//     return (
//         <>
//             {userProfile.length === 1 && userProfile[0].userRole !== "" && (
//                 <section className="pd-top-100 pd-bottom-100 bg-sky-blue">
//                     <div className="container">
//                         <div className='row justify-content-center'>
//                             <h2>You have already Updated Profile</h2>
//                         </div>
//                     </div>
//                 </section>
//             )}
//             {
//                 userProfile.length === 0 &&
//                 <section className="pd-top-100 pd-bottom-100 bg-sky-blue">
//                     <div className="container">
//                         <div className="row justify-content-center">
//                             <div className="col-xl-7 col-lg-10 text-center">
//                                 <div className="sign-in-area">
//                                     <form className="contact-form-wrap" onSubmit={handleUpdate}>
//                                         <input value="0" hidden type="number" name="currentBalance" />
//                                         <input value={user?.email} hidden type="nemailumber" name="UserEmail" />
//                                         <div className="single-input-wrap input-group">
//                                             <label htmlFor="inp-0">User Name</label>
//                                             <input
//                                                 id="inp-0"
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Enter your Name"
//                                                 name='userName'
//                                                 defaultValue={user?.displayName}
//                                             />
//                                         </div>
//                                         <div className="single-input-wrap input-group">
//                                             <label htmlFor="inp-2">Profile Picture URL</label>
//                                             <input
//                                                 id="inp-2"
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Profile Picture URL"
//                                                 name='profileURL'
//                                             />
//                                         </div>
//                                         <div className="single-input-wrap input-group">
//                                             <label htmlFor="inp-2">Select a country</label>
//                                             <select
//                                                 required
//                                                 className="form-control"
//                                                 name="country"
//                                                 value={selectedCountry}
//                                                 onChange={(e) => setSelectedCountry(e.target.value)}
//                                             >
//                                                 <option value="" disabled required>
//                                                     Select a country
//                                                 </option>
//                                                 {countries.map((country) => (
//                                                     <option key={country.cca3} value={country.name.common}>
//                                                         {country.name.common}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                         <div className="single-input-wrap input-group">
//                                             <label htmlFor="inp-2">Enter City Name</label>
//                                             <input
//                                                 id="inp-2"
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Enter City Name"
//                                                 name='city'
//                                             />
//                                         </div>
//                                         <div className="single-input-wrap input-group">
//                                             <label htmlFor="inp-2">Enter Address</label>
//                                             <input
//                                                 id="inp-2"
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Enter Address"
//                                                 name='address'
//                                             />
//                                         </div>
//                                         <div className="single-input-wrap input-group">
//                                             <label htmlFor="inp-2">Select Role</label>
//                                             <select
//                                                 required
//                                                 className="form-control"
//                                                 name="userRole"
//                                                 value={selectedUserRole}
//                                                 onChange={(e) => setSelectedUserRole(e.target.value)}
//                                             >
//                                                 <option value="" disabled>
//                                                     Select a role
//                                                 </option>
//                                                 <option value="Seller">
//                                                     Seller
//                                                 </option>
//                                                 <option value="Buyer">
//                                                     Buyer
//                                                 </option>

//                                             </select>

//                                         </div>
//                                         <button type="submit" className="btn btn-base w-100">Update</button>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             }

//         </>
//     );
// };

// export default AllUpdateProfile;

import React from 'react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../../firebase.init';

const AllUpdateProfile = () => {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [countries, setCountries] = useState([]);
    const [selectedUserRole, setSelectedUserRole] = useState("");
    const [userProfile, setUserProfile] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");

    const handleUpdate = event => {
        event.preventDefault();

        const freelancer = {
            userName: event.target.userName.value,
            UserEmail: event.target.UserEmail.value,
            profileURL: event.target.profileURL.value,
            country: event.target.country.value,
            city: event.target.city.value,
            address: event.target.address.value,
            userRole: event.target.userRole.value,
            currentBalance: event.target.currentBalance.value,
        }
        const url = `https://server.enjoywiki.com/marketplace-server-main/add-user`;
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(freelancer)
        })
            .then(res => res.json())
            .then(result => {
                
                toast.success('Profile Updated successfully', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                navigate('/');
            })
    }

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then((res) => res.json())
            .then((data) => {
                const sortedCountries = data.sort((a, b) =>
                    a.name.common.localeCompare(b.name.common)
                );

                setCountries(sortedCountries);
            })
            .catch((error) => {
                console.error("Error fetching country data: ", error);
            });
    }, []);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/users?UserEmail=${user?.email}`)
            .then(res => res.json())
            .then(data => setUserProfile(data))
    }, [user?.email])

    return (
        <>
            {(userProfile.length === 0 || userProfile.every(profile => !profile.userRole)) && (
                <section className="pd-top-100 pd-bottom-100 bg-sky-blue">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-7 col-lg-10 text-center">
                                <div className="sign-in-area">
                                    <form className="contact-form-wrap" onSubmit={handleUpdate}>
                                        <input value="0" hidden type="number" name="currentBalance" />
                                        <input value={user?.email} hidden type="email" name="UserEmail" />
                                        <div className="single-input-wrap input-group">
                                            <label htmlFor="inp-0">User Name</label>
                                            <input
                                                id="inp-0"
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter your Name"
                                                name='userName'
                                                defaultValue={user?.displayName}
                                            />
                                        </div>
                                        <div className="single-input-wrap input-group">
                                            <label htmlFor="inp-2">Profile Picture URL</label>
                                            <input
                                                id="inp-2"
                                                type="text"
                                                className="form-control"
                                                placeholder="Profile Picture URL"
                                                name='profileURL'
                                            />
                                        </div>
                                        <div className="single-input-wrap input-group">
                                            <label htmlFor="inp-2">Select a country</label>
                                            <select
                                                required
                                                className="form-control"
                                                name="country"
                                                value={selectedCountry}
                                                onChange={(e) => setSelectedCountry(e.target.value)}
                                            >
                                                <option value="" disabled required>
                                                    Select a country
                                                </option>
                                                {countries.map((country) => (
                                                    <option key={country.cca3} value={country.name.common}>
                                                        {country.name.common}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="single-input-wrap input-group">
                                            <label htmlFor="inp-2">Enter City Name</label>
                                            <input
                                                id="inp-2"
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter City Name"
                                                name='city'
                                            />
                                        </div>
                                        <div className="single-input-wrap input-group">
                                            <label htmlFor="inp-2">Enter Address</label>
                                            <input
                                                id="inp-2"
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Address"
                                                name='address'
                                            />
                                        </div>
                                        <div className="single-input-wrap input-group">
                                            <label htmlFor="inp-2">Select Role</label>
                                            <select
                                                required
                                                className="form-control"
                                                name="userRole"
                                                value={selectedUserRole}
                                                onChange={(e) => setSelectedUserRole(e.target.value)}
                                            >
                                                <option value="" disabled>
                                                    Select a role
                                                </option>
                                                <option value="Seller">
                                                    Seller
                                                </option>
                                                <option value="Buyer">
                                                    Buyer
                                                </option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-base w-100">Update</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {userProfile.length === 1 && userProfile[0].userRole !== "" && (
                <section className="pd-top-100 pd-bottom-100 bg-sky-blue">
                    <div className="container">
                        <div className='row justify-content-center'>
                            <h2>You have already Updated Profile</h2>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default AllUpdateProfile;
