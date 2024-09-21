import './App.css';
import { Routes, Route } from "react-router-dom";
import NavBar from './components/Shared/NavBar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Footer from './components/Shared/Footer/Footer';
import RequireAuth from './components/Shared/RequireAuth';
import AllProducts from './components/HomePage/AllProducts';
import Product from './components/HomePage/Product';
import SellerProfile from './components/HomePage/SellerProfile';
import AllCategoryProducts from './components/HomePage/AllCategoryProducts';
import Package from './components/HomePage/Package';
import UpdateProfile from './components/HomePage/UpdateProfile';
import BuyerAuth from './components/Shared/BuyerAuth';
import BuyerDashboard from './Pages/Buyer/BuyerDashboard';
import PaymentPending from './Pages/Buyer/PaymentPending';
import SupportMessage from './Pages/Buyer/SupportMessage';
import { Toaster } from 'react-hot-toast';
import PayNow from './Pages/Buyer/PayNow';
import BuyerOrders from './Pages/Buyer/BuyerOrders';
import CancelledPayment from './components/Shared/Payments/CancelledPayment';
import ReceivedPayment from './components/Shared/Payments/ReceivedPayment';
import UpdateBuyerProfile from './Pages/Buyer/UpdateBuyerProfile';
import ResetPassword from './Pages/ResetPassword';
import AllUpdateProfile from './components/Shared/AllUpdateProfile';
import BuyerReview from './Pages/Buyer/BuyerReview';
import SellerDashboard from './Pages/Seller/SellerDashboard';
import SellerAuth from './Pages/Seller/SellerAuth';
import SellerWithdraw from './Pages/Seller/SellerWithdraw';
import SellerOrders from './Pages/Seller/SellerOrders';
import SellerProducts from './Pages/Seller/SellerProducts';
import Contact from './components/HomePage/Contact';
import SellerAddProduct from './Pages/Seller/SellerAddProduct';
import SellNow from './Pages/SellNow';
import About from './Pages/About';
import TermsAndCondition from './Pages/TermsAndCondition';
import ErrorPage from './Pages/ErrorPage';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import RefundPolicy from './Pages/RefundPolicy';
import TopNavbar from './components/Shared/TopNavbar';
import SearchProducts from './components/HomePage/SearchProducts';
import UpdateAccessItemForOrder from './Pages/Seller/UpdateAccessItemForOrder';
import RegisterAsSeller from './Pages/RegisterAsSeller';
import RegisterAsBuyer from './Pages/RegisterAsBuyer';
import SellerProductUpdate from './Pages/Seller/SellerProductUpdate';
import EditProduct from './Pages/Seller/EditProduct';


function App() {
  return (
    <div>
      <Toaster />
  
      <NavBar></NavBar>
      <Routes>
       
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/search' element={<SearchProducts></SearchProducts>}></Route>
        <Route path='*' element={<ErrorPage></ErrorPage>}></Route>
        <Route path='/contact' element={<Contact></Contact>}></Route>
        <Route path='/sell-now' element={<SellNow></SellNow>}></Route>
        <Route path='/about' element={<About></About>}></Route>
        <Route path='/terms' element={<TermsAndCondition></TermsAndCondition>}></Route>
        <Route path='/privacy' element={<PrivacyPolicy></PrivacyPolicy>}></Route>
        <Route path='/refundpolicy' element={<RefundPolicy></RefundPolicy>}></Route>

        <Route path='/product/:id' element={<Product></Product>}></Route>
        <Route path='/seller/:id' element={<SellerProfile></SellerProfile>}></Route>
        <Route path='/category/:slug' element={<AllCategoryProducts></AllCategoryProducts>}></Route>
        <Route path="/buy/:id" element={<RequireAuth><Package></Package></RequireAuth>}></Route>

        <Route path="/update-profile" element={<RequireAuth><UpdateBuyerProfile></UpdateBuyerProfile></RequireAuth>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/register-seller' element={<RegisterAsSeller></RegisterAsSeller>}></Route>
        <Route path='/register-buyer' element={<RegisterAsBuyer></RegisterAsBuyer>}></Route>
        <Route path='/reset' element={<ResetPassword></ResetPassword>}></Route>


        {/* buyer */}
        <Route path="/buyer/dashboard" element={<RequireAuth><BuyerAuth><BuyerDashboard></BuyerDashboard></BuyerAuth></RequireAuth>}></Route>
        <Route path="/buyer/pending-payment" element={<RequireAuth><BuyerAuth><PaymentPending></PaymentPending></BuyerAuth></RequireAuth>}></Route>
        <Route path="/buyer/support" element={<RequireAuth><BuyerAuth><SupportMessage></SupportMessage></BuyerAuth></RequireAuth>}></Route>
        <Route path="/pay-now/:id" element={<RequireAuth><BuyerAuth><PayNow></PayNow></BuyerAuth></RequireAuth>}></Route>
        <Route path="/review/:id" element={<RequireAuth><BuyerAuth><BuyerReview></BuyerReview></BuyerAuth></RequireAuth>}></Route>

        <Route path="/buyer/orders" element={<RequireAuth><BuyerAuth><BuyerOrders></BuyerOrders></BuyerAuth></RequireAuth>}></Route>
        <Route path="/cancelled-payment/:id" element={<RequireAuth><CancelledPayment></CancelledPayment></RequireAuth>}></Route>
        {/* <Route path="/received-payment/:id" element={<RequireAuth><ReceivedPayment></ReceivedPayment></RequireAuth>}></Route> */}
        <Route path="/received-payment/:id/:paymentId" element={<RequireAuth><ReceivedPayment /></RequireAuth>} />



        {/* Seller */}
        <Route path="/seller/dashboard" element={<RequireAuth><SellerAuth><SellerDashboard></SellerDashboard></SellerAuth></RequireAuth>}></Route>
        <Route path="/seller/withdraw" element={<RequireAuth><SellerAuth><SellerWithdraw></SellerWithdraw></SellerAuth></RequireAuth>}></Route>
        <Route path="/seller/orders" element={<RequireAuth><SellerAuth><SellerOrders></SellerOrders></SellerAuth></RequireAuth>}></Route>
        <Route path="/seller/update-order/:id" element={<RequireAuth><SellerAuth><UpdateAccessItemForOrder></UpdateAccessItemForOrder></SellerAuth></RequireAuth>}></Route>
        <Route path="/seller/products" element={<RequireAuth><SellerAuth><SellerProducts></SellerProducts></SellerAuth></RequireAuth>}></Route>
        <Route path="/seller/edit-product/:id" element={<RequireAuth><SellerAuth><EditProduct></EditProduct></SellerAuth></RequireAuth>}></Route>
        <Route path="/seller/add-product" element={<RequireAuth><SellerAuth><SellerAddProduct></SellerAddProduct></SellerAuth></RequireAuth>}></Route>


      </Routes>


      <Footer></Footer>
    </div>
  );
}

export default App;
