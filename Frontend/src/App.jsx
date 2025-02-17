import { lazy, Suspense, useEffect } from 'react';
import {Routes,Route} from 'react-router-dom'
const Home = lazy(()=>import('./Home'))
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Order = lazy(() => import('./Order'));
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderRequest, fetchProductsRequest, userAuthenticationRequest } from './store/Actions';
const SearchResult = lazy(() => import('./pages/SearchResult'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Payment = lazy(() => import('./pages/Payment'));
const Invoice = lazy(() => import('./pages/Invoice'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));


const App = () => {
  const userData = useSelector((state) => state.userData.userData);
  
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(userAuthenticationRequest());
    dispatch(fetchProductsRequest())
  }, [dispatch]);
  useEffect(()=>{
    if (userData?.id) {
      dispatch(fetchOrderRequest(userData.id))
    }
  },[dispatch,userData])
  
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>}>
      <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/admin" element={<AdminPanel />}></Route>
          <Route path="/admin/login" element={<AdminLogin />}></Route>
          <Route path="/invoice/:orderId" element={<Invoice />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/search/:productName" element={<SearchResult />}></Route>
          <Route path="/product/:productId" element={<ProductDetails />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/products" element={<Home />}></Route>
          <Route path="/services" element={<Services />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/orders" element={<Order />}></Route>
      </Routes>
      <ToastContainer />
      
    </Suspense>
  );
};

export default App;

