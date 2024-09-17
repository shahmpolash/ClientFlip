import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import auth from "../../firebase.init";
import BreadcumArea from "./BreadcumArea";

const NavBar = () => {
  const [logo, setLogo] = useState({});
  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState([]);

  const handleSignout = () => {
    signOut(auth);
  };

  useEffect(() => {
    fetch(`https://server.enjoywiki.com/marketplace-server-main/logo`)
      .then((res) => res.json())
      .then((info) => setLogo(info[0]));
  }, []);

  useEffect(() => {
    fetch(`https://server.enjoywiki.com/marketplace-server-main/user-data?UserEmail=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setUserInfo(data));
  }, [user?.email]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`https://server.enjoywiki.com/marketplace-server-main/products`)
      .then((res) => res.json())
      .then((info) => setProducts(info.reverse()));
  }, []);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`https://server.enjoywiki.com/marketplace-server-main/categories`)
      .then((res) => res.json())
      .then((info) => setCategories(info));
  }, []);
  const uniqueCategories = [
    ...new Set(categories.map((category) => JSON.stringify(category))),
  ].map((item) => JSON.parse(item));

  const [hideUserDashLink, setHideUserDashLink] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setHideUserDashLink(window.innerWidth >= 992);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const defaultProfileImage =
    "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg";
  const [openSubMenus, setOpenSubMenus] = useState({
    Graphic: false,
    Website: false,
    Database: false,
    Email: false,
  });

  const handleMenuClick = (categorySlug) => {
    const updatedSubMenus = { ...openSubMenus };

    for (const c in updatedSubMenus) {
      if (c !== categorySlug) {
        updatedSubMenus[c] = false;
      } else {
        updatedSubMenus[c] = !updatedSubMenus[c];
      }
    }
    setOpenSubMenus(updatedSubMenus);
  };
  useEffect(() => {
    fetch(`https://server.enjoywiki.com/marketplace-server-main/categories`)
      .then((res) => res.json())
      .then((info) => setCategories(info));
  }, []);
  const isSubMenuOpen = (categorySlug) => {
    return openSubMenus[categorySlug] || false;
  };

  return (
    <>
   
      <div>
       
        <div className="body-overlay" id="body-overlay navbar-top" />
        <div className="dkt-sitebar-menu">
          <div className="dkt-sitebar-menu">
            <Link className="dkt-sitebar-close" to="#">
              <i className="fa fa-times" />
            </Link>
            <div className="dkt-details-inner">
              <div className="logo">
                <Link to="/">
                  <img src={logo.logo} alt="logo" />
                </Link>
              </div>

            </div>

          </div>
        </div>

        <div className="navbar-area">
          <nav className="navbar navbar-expand-lg">
            <div className="container nav-container">
              <div className="responsive-mobile-menu">
                <button
                  className="menu toggle-btn d-block d-lg-none"
                  data-target="#dkt_main_menu"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="icon-left" />
                  <span className="icon-right" />
                </button>
              </div>

              <div>
                <div className="logo">
                  <a className="main-logo-h1" href="/">
                    <img src={logo.logo} alt="" />
                  </a>
                </div>
              </div>


              <div className="collapse navbar-collapse" id="dkt_main_menu">
                <ul className="navbar-nav menu-open">
                  <li className="menu-item-has-children current-menu-item">
                    <Link
                      to="#"
                      className="menu-link"
                      onClick={() => handleMenuClick("Graphic")}
                      style={{ display: "flex", width: "100%" }}
                    >
                      <span className="menu-text">{"Graphic"}</span>
                      <span className="menu-icon">
                        {isSubMenuOpen("Graphic") ? "-" : "+"}
                      </span>
                    </Link>
                    <ul className="sub-menu">
                      {uniqueCategories.map(
                        (category) =>
                          category.mainCategory === "Graphic" && (
                            <li key={category.slug}>
                              <a href={`/category/${category.slug}`}>
                                {category.categoryName}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
              
                  <li className="menu-item-has-children current-menu-item">
                    <Link
                      to="#"
                      className="menu-link"
                      onClick={() => handleMenuClick("Template")}
                      style={{ display: "flex", width: "100%" }}
                    >
                      <span className="menu-text">{"Template"}</span>
                      <span className="menu-icon">
                        {isSubMenuOpen("Template") ? "-" : "+"}
                      </span>
                    </Link>
                    <ul className="sub-menu">
                      {uniqueCategories.map(
                        (category) =>
                          category.mainCategory === "Template" && (
                            <li key={category.slug}>
                              <a href={`/category/${category.slug}`}>
                                {category.categoryName}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </li>

                  <li
                    className="menu-item-has-children current-menu-item"
                    onClick={() => handleMenuClick("Database")}
                  >
                    <Link
                      to="#"
                      className="menu-link"
                      style={{ display: "flex", width: "100%" }}
                    >
                      <span className="menu-text">{"Database"}</span>
                      <span className="menu-icon">
                        {isSubMenuOpen("Database") ? "-" : "+"}
                      </span>
                    </Link>

                    <ul className="sub-menu">
                      {uniqueCategories.map(
                        (category) =>
                          category.mainCategory === "Database" && (
                            <li key={category.slug}>
                              <a href={`/category/${category.slug}`}>
                                {category.categoryName}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
                  <li
                    className="menu-item-has-children current-menu-item"
                    onClick={() => handleMenuClick("Website")}
                  >
                    <Link
                      to="#"
                      className="menu-link"
                      style={{ display: "flex", width: "100%" }}
                    >
                      <span className="menu-text">{"Website"}</span>
                      <span className="menu-icon">
                        {isSubMenuOpen("Website") ? "-" : "+"}
                      </span>
                    </Link>
                    <ul className="sub-menu">
                      {uniqueCategories.map(
                        (category) =>
                          category.mainCategory === "Website" && (
                            <li key={category.slug}>
                              <a href={`/category/${category.slug}`}>
                                {category.categoryName}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
                  <li
                    className="menu-item-has-children current-menu-item"
                    onClick={() => handleMenuClick("eBook")}
                  >
                    <Link
                      to="#"
                      className="menu-link"
                      style={{ display: "flex", width: "100%" }}
                    >
                      <span className="menu-text">{"eBook"}</span>
                      <span className="menu-icon">
                        {isSubMenuOpen("eBook") ? "-" : "+"}
                      </span>
                    </Link>
                    <ul className="sub-menu">
                      {uniqueCategories.map(
                        (category) =>
                          category.mainCategory === "eBook" && (
                            <li key={category.slug}>
                              <a href={`/category/${category.slug}`}>
                                {category.categoryName}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
                  <li
                    className="menu-item-has-children current-menu-item"
                    onClick={() => handleMenuClick("Stock Photos")}
                  >
                    <Link
                      to="#"
                      className="menu-link"
                      style={{ display: "flex", width: "100%" }}
                    >
                      <span className="menu-text">{"Photos"}</span>
                      <span className="menu-icon">
                        {isSubMenuOpen("Stock Photos") ? "-" : "+"}
                      </span>
                    </Link>
                    <ul className="sub-menu">
                      {uniqueCategories.map(
                        (category) =>
                          category.mainCategory === "StockPhotos" && (
                            <li key={category.slug}>
                              <a href={`/category/${category.slug}`}>
                                {category.categoryName}
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
                  <li
                    className="menu-item-has-children current-menu-item"
                    onClick={() => handleMenuClick("Software")}
                  >
                    <Link
                      to="#"
                      className="menu-link"
                      style={{ display: "flex", width: "100%" }}
                    >
                      <span className="menu-text">{"Software"}</span>
                      <span className="menu-icon">
                        {isSubMenuOpen("Software") ? "-" : "+"}
                      </span>
                    </Link>
                    <ul className="sub-menu">
                      {uniqueCategories.map(
                        (category) =>
                          category.mainCategory === "Software" && (
                            <li key={category.slug}>
                              <a href={`/category/${category.slug}`}>
                                {category.categoryName} 
                              </a>
                            </li>
                          )
                      )}
                    </ul>
                  </li>

                  {!hideUserDashLink && (
                    <div>
                      {user && user.email && userInfo.length > 0 ? (
                        <>
                          <li className="userDashLink">
                            {userInfo.map((profile) => {
                              if (profile.UserEmail === user.email) {
                                return (
                                  <>
                                    {profile.userRole === "Seller" && (
                                      <a
                                        href="/seller/dashboard"
                                        className="dashboard-link"
                                      >
                                        <span>Seller Dashboard</span>
                                      </a>
                                    )}
                                    {profile.userRole === "Buyer" && (
                                      <a
                                        href="/buyer/dashboard"
                                        className="dashboard-link"
                                      >
                                        <span>Dashboard</span>
                                      </a>
                                    )}
                                    {profile.userRole === "Admin" && (
                                      <a
                                        href="http://localhost:3001/admin/dashboard"
                                        className="dashboard-link"
                                      >
                                        <span>Dashboard</span>
                                      </a>
                                    )}
                                  </>
                                );
                              }
                              return null;
                            })}
                          </li>
                          <li className="userDashLink" onClick={handleSignout}>
                            <Link
                              to="#"
                              className="menu-link"
                              style={{ display: "flex", width: "100%" }}
                            >
                              <span className="menu-text">{"Logout"}</span>
                            </Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="userDashLink">
                            <a href="/login" className="dashboard-link">
                              <span>Login Now</span>
                            </a>
                          </li>
                          <li className="userDashLink">
                            {
                              user ?
                                <>  {userInfo.map((profile) => {
                                  if (profile.UserEmail === user?.email) {
                                    return (
                                      <>
                                        {profile.userRole === "Buyer" ? (
                                          <></>
                                        ) : (
                                          <li className="menu-bar">
                                            <a href="/sell-now">Sell Now</a>
                                          </li>
                                        )}
                                      </>
                                    );
                                  }
                                  return null;
                                })}</>

                                :
                                <li className="menu-bar">
                                  <a href="/sell-now">Sell Now</a>
                                </li>
                            }
                          </li>
                        </>
                      )}
                    </div>

                  )}
                </ul>
              </div>
            </div>


            <div className="nav-right-part nav-right-part-desktop">

              <ul className="mr-5">
                <li>
                  {user ? (
                    <>
                      <div className="dropdown">
                        <button
                          className="dropdown-toggle custom-dropdown-btn"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {userInfo
                            .filter(
                              (profile) => profile.UserEmail === user.email
                            )
                            .map((profile) => (
                              <img
                                src={
                                  profile.profileURL
                                    ? profile.profileURL
                                    : defaultProfileImage
                                }
                                width={40}
                                height={40}
                                alt="img"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />
                            ))}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {user && user.email && userInfo.length > 0 && (
                            <>
                              {userInfo.map((profile) => {
                                if (profile.UserEmail === user?.email) {
                                  return (
                                    < >
                                      {profile.userRole === "Seller" && (
                                        <a
                                          className="dropdown-item text-black"
                                          href="/seller/dashboard"
                                          style={{ color: "black" }}
                                        >
                                          Dashboard
                                        </a>

                                      )}
                                      {profile.userRole === "Buyer" && (
                                        <a
                                          className="dropdown-item text-black"
                                          href="/buyer/dashboard"
                                          style={{ color: "black" }}
                                        >
                                          <span>Dashboard</span>
                                        </a>
                                      )}
                                      {profile.userRole === "Admin" && (
                                        <a
                                          className="dropdown-item text-black"
                                          target="_blank"
                                          rel="noreferrer"
                                          href="http://localhost:3001/admin/dashboard"
                                          style={{ color: "black" }}
                                        >
                                          <span>Admin Dashboard</span>
                                        </a>
                                      )}
                                    </>
                                  );
                                }
                                return null;
                              })}
                            </>
                          )}
                          <div
                            className="dropdown-item"
                            onClick={handleSignout}
                            style={{ color: "black", cursor: "pointer" }}
                          >
                            Logout
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="">
                      <a href="/login">
                        <span>Login</span>
                      </a> /
                      <a href="/register">
                        <span>Signup</span>
                      </a>
                    </div>
                  )}
                </li>

                {
                  user ?
                    <>  {userInfo.map((profile) => {
                      if (profile.UserEmail === user?.email) {
                        return (
                          <>
                            {profile.userRole === "Buyer" ? (
                              <></>
                            ) : (
                              <li className="menu-bar">
                                <a href="/sell-now">Sell Now</a>
                              </li>
                            )}
                          </>
                        );
                      }
                      return null;
                    })}</>

                    :
                    <li className="menu-bar">
                      <a href="/sell-now">Sell Now</a>
                    </li>
                }
              </ul>
            </div>

          </nav>
          
        </div>

      </div>

      <BreadcumArea></BreadcumArea>
    </>
  );
};

export default NavBar;
