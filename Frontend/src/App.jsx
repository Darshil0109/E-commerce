import {Routes,Route} from 'react-router-dom'
import Home from "./Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Order from './Order';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchOrderRequest, fetchProductsRequest, userAuthenticationRequest } from './store/Actions';
import SearchResult from './pages/SearchResult';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';



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
    <>
      <Routes>
          <Route path="/" element={<Landing />}></Route>
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
      
    </>
  );
};

export default App;
