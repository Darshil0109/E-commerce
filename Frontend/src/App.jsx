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


const App = () => {
  return (
    <>
      <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/products" element={<Home />}></Route>
          <Route path="/services" element={<Services />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
      </Routes>
      <ToastContainer />
      
    </>
  );
};

export default App;
