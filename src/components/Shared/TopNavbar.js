import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import auth from "../../firebase.init";
import BreadcumArea from "./BreadcumArea";

const TopNavbar = () => {
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
 <div className="bg-white d-flex justify-cintent-center mt-5">
    <div>
        Logo
    </div>
    <div>
        Login
    </div>
 </div>
  );
};

export default TopNavbar;
