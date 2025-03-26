import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Input from "../Input";
import { ChevronDown, LogOut, Mail, Phone } from "lucide-react";
import { userAuthenticationRequest } from "../store/Actions";

// import { fetchOrderRequest } from "../store/Actions";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async() => {
    // Remove the token from cookies
    await axios.post(`${import.meta.env.VITE_API_URL}/remove-cookie`,{cookieName : 'token'}, { withCredentials: true });
    navigate("/");
    dispatch(userAuthenticationRequest())
    // Navigate to the root URL
    toast.error("Logged Out", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  
  const [userInfo, setUserInfo] = useState([]);
  const [isprofileModalOpen,setIsprofileModalOpen] = useState(false)
  const userLoading = useSelector((state) => state.userData.loading);
  const userData = useSelector((state) => state.userData.userData);
  const userError = useSelector((state) => state.userData.error);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const orderLoading = useSelector((state)=> state.products.loading);
  const orderData = useSelector((state)=>state.orders.orders);
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
          `${import.meta.env.VITE_API_URL}/api/users/info`, { withCredentials: true }
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
    }, { withCredentials: true })
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
      <div className="h-full mx-auto p-4">
        {userLoading && <>Loading...</>}
        {userError && <>{userError}</>}
        {!userLoading && userError === "" && (
          <>
          <div className="flex flex-col sm:flex-row justify-between mx-5 sm:gap-4">
            <div className="gap-6 mt-5 mb-5 sm:w-[30%]">
              <div className="bg-gray-50 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Personal Information
                </h2>
                <p >{userData?.name}</p>
                <p className="flex gap-1 items-center"><Mail className="h-4 w-4"/>{userData?.email}</p>
                <p  className="flex gap-1 items-center"><Phone className="h-4 w-4"/>{userInfo?.phone ? userInfo.phone : "Not Available"}</p>
              </div>
            </div>
            
            <div className="gap-6 sm:mt-5 mb-5 sm:w-[70%]">
              <div className="bg-gray-50 shadow rounded-lg p-6 lg:col-span-2">
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
              <div className="gap-6 mt-5 mb-5">
                <div className="bg-gray-50 shadow rounded-lg p-6 ">
                  <h2 className="text-xl font-semibold mb-4">
                    Login Information
                  </h2>
                  <p>
                    <strong>Last Login:</strong>{" "}
                    {userInfo?.lastLogin ? userInfo.lastLogin : "Not Available"}
                  </p>
                </div>
              </div>
              <div className="gap-6 mt-5 mb-5">
                <div className="bg-gray-50 shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Order History</h2>
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                            Order id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Order Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Total Price
                        </th>
                    </tr>
                      </thead>
                      <tbody>
                        {
                        (!orderLoading && orderData.length === 0 )? <tr><td colSpan={3}>No order available</td></tr> : 
                          !orderLoading && orderData.sort((a,b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,3).map(item => {
                            return(<tr key={item._id} className="odd:bg-white even:bg-gray-50 border-b  border-gray-200">
                              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                #{item._id}
                              </th>
                              <th className="px-6 py-4">
                                  {item.status}
                              </th>
                              <th className="px-6 py-4">
                                  {item.totalPrice.toFixed(2)}
                              </th>
                            </tr>)
                          })
                        }
                        <tr className="h-12 cursor-pointer w-full text-gray-700 font-semibold text-center"><td colSpan={3}><Link to={'/orders'} className="flex items-center justify-center gap-2">View More <ChevronDown/></Link></td></tr>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            <div className="p-2 flex gap-8">
              <Button
                onClick={handleLogout}
                backgroundColor="#ff0000"
                className="h-16 w-32 "
              >
                <div className="flex gap-2 text-white">LogOut<LogOut/></div>
              </Button>
              <Button onClick={()=>{setIsprofileModalOpen(true)}} backgroundColor="#0f0f0f" className="text-white h-16 w-32 mt-16">Edit Profile</Button>
            </div>
          </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
