import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "../Button";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Input from "../Input";
import { LogOut } from "lucide-react";

// import { fetchOrderRequest } from "../store/Actions";

const Profile = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove the token from cookies
    Cookies.remove("token"); // Adjust 'token' if your cookie name is different
    // Navigate to the root URL
    toast.error("Logged Out", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate("/");
  };
  
  const [userInfo, setUserInfo] = useState([]);
  const [isprofileModalOpen,setIsprofileModalOpen] = useState(false)
  const userLoading = useSelector((state) => state.userData.loading);
  const userData = useSelector((state) => state.userData.userData);
  const userError = useSelector((state) => state.userData.error);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  
  // const orderLoading = useSelector((state)=>state.orders.loading);
  // const orderData = useSelector((state)=>state.orders.orders);
  // const orderError = useSelector((state)=>state.orders.error);
  // console.log("Ordeer ",orderData);
  
  
  
  useEffect(() => {
    if (userLoading) return; // Prevent execution while still fetching data
    if (!isLoggedIn && !userData && userError) {
      navigate("/login");
    }
  }, [userLoading, navigate, userData, userError,isLoggedIn]);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/info`
        );
        setUserInfo(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, []);
  const handleEditProfile = async(e) =>{
    e.preventDefault()
    const formData = new FormData(e.target);
    const phone = formData.get('phone')
    const street = formData.get('street')
    const city = formData.get('city')
    const state = formData.get('state')
    const country = formData.get('country')
    const postalCode = formData.get('postalCode')

    const tempuserData = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/info`,{
      userId:userData.id,
      phone:phone,
      street:street,
      city:city,
      state:state,
      country:country,
      postalCode:postalCode,
    })
    setUserInfo(tempuserData.data)
    setIsprofileModalOpen(false)
  }


  return (
    <>
      <Navbar />
      <Modal
        isOpen = {isprofileModalOpen}
        title = {"Edit Profile"}
        onClose = {()=>{setIsprofileModalOpen(false)}}
        >
          <form onSubmit={(e)=>{handleEditProfile(e)}} >
            <Input label="phone" placeholder="Enter Your Phone Number" type="Number" required>phone</Input>
            <Input label="street" placeholder="Enter Your Street Name">street</Input>
            <Input label="city" placeholder="Enter Your City Name">city</Input>
            <Input label="state" placeholder="Enter Your State Name">state</Input>
            <Input label="country" placeholder="Enter Your Country Name">country</Input>
            <Input label="postalCode" placeholder="Enter Your Postal Code ">postal code</Input>
            <Button type="submit">Save</Button>

          </form>
      </Modal>
      <div className="h-full mx-auto p-4 bg-[#101727] text-white">
        <h1 className="text-3xl font-bold mb-6 ">Profile</h1>
        {userLoading && <>Loading...</>}
        {userError && <>{userError}</>}
        {!userLoading && userError === "" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 mb-5">
              <div className="bg-[#1e2a3a] shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Personal Information
                </h2>
                <p>{userData?.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 mb-5">
              <div className="bg-[#1e2a3a] shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <p>
                  <strong>Email:</strong> {userData?.email}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {userInfo?.phone ? userInfo.phone : "Not Available"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 mb-5">
              <div className="bg-[#1e2a3a] shadow rounded-lg p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">
                  Address Information
                </h2>
                {userInfo?.street === "" &&
                userInfo?.city === "" &&
                userInfo?.state === "" &&
                userInfo?.country === "" &&
                userInfo?.postalCode === "" ? (
                  <p>Not Available</p>
                ) : (
                  <>
                    <p>
                      {userInfo?.street ? userInfo.street : "Not Available"},
                      {userInfo?.city ? userInfo.city : "Not Available"},
                    </p>
                    <p>
                    {userInfo?.state ? userInfo.state : "Not Available"},
                      {userInfo?.country ? userInfo.country : "Not Available"} -
                      {userInfo?.postalCode
                        ? userInfo.postalCode
                        : "Not Available"}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5 mb-5">
              <div className="bg-[#1e2a3a] shadow rounded-lg p-6 ">
                <h2 className="text-xl font-semibold mb-4">
                  Login Information
                </h2>
                <p>
                  <strong>Last Login:</strong>{" "}
                  {userInfo?.lastLogin ? userInfo.lastLogin : "Not Available"}
                </p>
              </div>
            </div>
          </>
        )}
        <div className="p-2 flex gap-8">
          <Button
            onClick={handleLogout}
            backgroundColor="#ff0000"
            className="h-16 w-32 "
          >
            <div className="flex gap-2">LogOut<LogOut/></div>
          </Button>
          <Button onClick={()=>{navigate('/orders')}} backgroundColor="" className="bg-green-700 h-16 w-32 mt-16">Check Orders</Button>
          <Button onClick={()=>{setIsprofileModalOpen(true)}}  className="h-16 w-32 mt-16">Edit Profile</Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
