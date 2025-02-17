import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import { useEffect, useRef, useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addOrderRequest, fetchOrderRequest, fetchProductsRequest } from "../store/Actions";
import { toast } from "react-toastify";
const Payment = () => {
    const [isFormVisible,setIsFormVisible] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const products = useSelector((state)=>state.products.products);
    const productsLoading = useSelector((state)=>state.products.loading);
    // console.log("products",products);
    const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
    const userDataLoading = useSelector((state) => state.userData.loading);
    const userData = useSelector((state) => state.userData.userData);
    const userError = useSelector((state) => state.userData.error);
    const [userInfo,setUserInfo] = useState([])
    const cartDataLoading = useSelector((state) => state.cart.loading);
    const cartData = useSelector((state) => state.cart.cart);
    let totalPrice = 0;
    const calculateTotal = (price) => {
        totalPrice += price ;
    };
    const handleSubmit = (e) =>{
        e.preventDefault()
        const formData = new FormData(e.target);
        const payment_type = formData.get('payment_type')
        if (payment_type === 'card'){
            const name = formData.get('ownerName');
            const cardNum = formData.get('cardNumber');
            const expiry = formData.get('expiry');
            const cvv = formData.get('cvv');
            if (name && cardNum && expiry && cvv){
                dispatch(
                    addOrderRequest({
                    userid: userData.id,
                    items: cartData,
                    price: totalPrice + (totalPrice * 0.18) + (totalPrice * 0.1) - (0.05 * totalPrice),
                    createdAt : new Date().toISOString(),
                    paymentType : 'card-payment',
                    })
                );
                dispatch(fetchOrderRequest(userData.id));
                navigate('/orders')
            }
            else{
                toast.error("Payment Failed", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            }
            
            
        }
        else if (payment_type === 'cash') {
            dispatch(
                addOrderRequest({
                userid: userData.id,
                items: cartData,
                price: totalPrice + (totalPrice * 0.18) + (totalPrice * 0.1) - (0.05 * totalPrice),
                createdAt : new Date().toISOString(),
                paymentType : 'cash on Delivery'
                })
            );
            navigate('/orders')
            dispatch(fetchProductsRequest())
            dispatch(fetchOrderRequest(userData.id));
            return
        }        
    }
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
      const hasToastedEmptyCart = useRef(false);
    useEffect(()=>{
        console.log(cartData);
        
        const timeout = setTimeout(()=>{
            if(!cartDataLoading && cartData.length===0 && !hasToastedEmptyCart.current){
                console.log(cartData.length,cartData);
                toast.error("No Product available to pay", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                navigate('/')
                hasToastedEmptyCart.current = true
            }
        },100)
        return () => clearTimeout(timeout);
        
    },[cartDataLoading,cartData,navigate])
  return (
    (!isLoggedIn || userError)? <div> 400 Bad Gateway</div> 
    :
    productsLoading && userDataLoading ? <></> :
    <div>
      <div className="px-6 md:px-16 mt-10 flex flex-col gap-5 min-h-screen">
        <div className="flex flex-col-reverse lg:flex-row w-full mb-10 min-h-3/4 justify-between">
          <div className="bg-white h-full w-full lg:w-[60%] px-2 md:px-10">
            <div className="flex justify-between w-full items-center ">
              <div className="flex flex-col items-center w-1/5">
                <p className="h-4 lg:h-6"></p>
                <span className="inline-flex items-center justify-center w-8 h-8 lg:w-10  lg:h-10 text-md font-semibold text-white bg-black rounded-full">
                  1
                </span>
                <span className="text-xs font-medium text-start sm:text-center">
                  order
                </span>
              </div>
              <div
                className="bg-black  h-1 rounded-full"
                style={{ width: "50%" }}
              ></div>
              <div className="flex flex-col items-center w-1/5">
                <p className="h-4 lg:h-6"></p>
                <span className="inline-flex items-center justify-center w-8 h-8 lg:w-10  lg:h-10 text-md font-semibold text-white bg-black rounded-full">
                  2
                </span>
                <span className="text-xs font-medium text-center">Payment</span>
              </div>
              <div
                className="bg-gray-200  h-1 rounded-full"
                style={{ width: "50%" }}
              ></div>
              <div className="flex flex-col items-center w-1/5">
                <p className="h-4 lg:h-6"></p>
                <span className="inline-flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 text-md font-semibold text-white bg-gray-300 rounded-full">
                  3
                </span>
                <span className="text-xs font-medium text-end">Success</span>
              </div>
            </div>
            <div className="mt-10">
            {cartData.map((item) => {
              let product = products.find(
                (productItem) => productItem._id === item.productId
              );
              return (
                <div key={item._id}>
                  <div className="p-4 border-b flex items-center gap-4">
                    <img
                      src={
                        import.meta.env.VITE_API_URL +
                        "/" +
                        product?.productImage
                      }
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product?.name}</h3>
                      <p className="text-gray-600">Rate : ${item.price}</p>
                      <p className="text-gray-600">Amount : ${item.price * item.quantity}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold" >Quantity</span><span className="w-8 text-center"> {item.quantity}</span>
                        {calculateTotal(product?.price * item?.quantity)}
                        <p className="hidden">
                          {(item.price = product?.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
          </div>
            <form onSubmit={handleSubmit} method="post">
              <div>
                <h1 className="text-3xl font-extrabold mt-16 text-gray-900 ">
                  Address Details
                </h1>
                <div className="flex mt-4 gap-4 bg-gray-100 p-6">
                  <input type="radio" name="address" id="address" required/>
                  <label htmlFor="address" className="cursor-pointer">
                    <div className="w-full">
                      <h1 className="text-md font-semibold">
                        {userData.name}
                      </h1>
                      <p>
                        {userInfo.street}, {userInfo.city}, {userInfo.state}, {userInfo.country}, {userInfo.postalCode}
                      </p>
                      <p>
                        {userInfo.phone}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold mt-16 text-gray-900 ">
                Payment Methods
              </h1>
              <div className="flex gap-8 flex-wrap">
                <div className="flex mt-5">
                  <input type="radio" name="payment_type" id="card" value='card'  onClick={() => {setIsFormVisible(true)}} defaultChecked required />
                  <label
                    htmlFor="card"
                    className="ml-4 flex gap-2 cursor-pointer"
                  >
                    <img
                      src="visa.webp"
                      className="w-12"
                      alt="card1"
                    />
                    <img
                      src="american-express.webp"
                      className="w-12"
                      alt="card2"
                    />
                    <img
                      src="master.webp"
                      className="w-12"
                      alt="card3"
                    />
                  </label>
                </div>
                <div className="flex mt-5">
                  <input type="radio" name="payment_type" id="cash" value='cash' onClick={() =>  {setIsFormVisible(false)}} required />
                  <label
                    htmlFor="cash"
                    className="ml-4 flex gap-2 cursor-pointer items-center"
                  >
                    Cash on Delivery
                    <img
                      width="32"
                      height="32"
                      src="free-shipping.png"
                      alt="free-shipping"
                    />
                  </label>
                </div>
              </div>
              {isFormVisible ? <div className="mt-8 ">
                <input
                  type="text"
                  name="ownerName"
                  id="ownerName"
                  className="h-16 w-full lg:w-2/3 px-4 border-b-2 border-b-gray-200 outline-none focus:border-b-black"
                  placeholder={`Card Holder's Name`}
                  required
                />
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 ml-3 mt-2 absolute "
                    viewBox="0 0 291.764 291.764"
                  >
                    <path
                      fill="#2394bc"
                      d="m119.259 100.23-14.643 91.122h23.405l14.634-91.122h-23.396zm70.598 37.118c-8.179-4.039-13.193-6.765-13.193-10.896.1-3.756 4.24-7.604 13.485-7.604 7.604-.191 13.193 1.596 17.433 3.374l2.124.948 3.182-19.065c-4.623-1.787-11.953-3.756-21.007-3.756-23.113 0-39.388 12.017-39.489 29.204-.191 12.683 11.652 19.721 20.515 23.943 9.054 4.331 12.136 7.139 12.136 10.987-.1 5.908-7.321 8.634-14.059 8.634-9.336 0-14.351-1.404-21.964-4.696l-3.082-1.404-3.273 19.813c5.498 2.444 15.609 4.595 26.104 4.705 24.563 0 40.546-11.835 40.747-30.152.08-10.048-6.165-17.744-19.659-24.035zm83.034-36.836h-18.108c-5.58 0-9.82 1.605-12.236 7.331l-34.766 83.509h24.563l6.765-18.08h27.481l3.51 18.153h21.664l-18.873-90.913zm-26.97 54.514c.474.046 9.428-29.514 9.428-29.514l7.13 29.514h-16.558zM85.059 100.23l-22.931 61.909-2.498-12.209c-4.24-14.087-17.533-29.395-32.368-36.999l20.998 78.33h24.764l36.799-91.021H85.059v-.01z"
                      data-original="#2394bc"
                    ></path>
                    <path
                      fill="#efc75e"
                      d="M51.916 111.982c-1.787-6.948-7.486-11.634-15.226-11.734H.374L0 101.934c28.329 6.984 52.107 28.474 59.821 48.688l-7.905-38.64z"
                      data-original="#efc75e"
                    ></path>
                  </svg>
                  <input
                    type="Number"
                    name="cardNumber"
                    id="cardNumber"
                    className="h-16 w-full lg:w-2/3 px-4 border-b-2 border-b-gray-200 outline-none focus:border-b-black pl-20"
                    placeholder={`Card Number`}
                    required
                  />
                </div>
                <div className="flex w-full lg:w-2/3 justify-between">
                  <input
                    type="Number"
                    name="expiry"
                    id="expiry"
                    className="h-16 w-13/27 px-4 border-b-2 border-b-gray-200 outline-none focus:border-b-black"
                    placeholder={`Exp.`}
                    required
                  />
                  <input
                    type="Number"
                    name="cvv"
                    id="cvv"
                    className="h-16 w-13/27 px-4 border-b-2 border-b-gray-200 outline-none focus:border-b-black"
                    placeholder={`CVV`}
                    required
                  />
                </div>
              </div>
              :
              <div></div>}
                <div className="mt-8 flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="terms"
                    id="terms"
                    className="w-4 h-4 cursor-pointer"
                    required
                  />
                  <label
                    className="flex flex-wrap items-center text-gray-700"
                    htmlFor="terms"
                  >
                    <span className="break-words">
                      I have accepted the
                      <Link to="" className="text-blue-500 ">
                        {" "}
                        terms and conditions
                      </Link>
                      .
                    </span>
                  </label>
                </div>
              <div className="mt-8 flex sm:gap-4 flex-col-reverse sm:flex-row">
                <Button
                  onClick={() => navigate(-1)}
                  backgroundColor="#e5e7eb"
                  className="text-black w-full sm:w-1/4"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  backgroundColor="#0f0f0f"
                  className="text-white w-full sm:w-1/4"
                >
                  Pay
                </Button>
              </div>
            </form>
          </div>
          <div className="bg-gray-100 h-full w-full lg:w-[35%] px-8 py-10 flex flex-col rounded-lg">
            <h1 className="text-4xl font-extrabold text-gray-900 ">Order</h1>
            
            <div>
              <p className="float-left mt-4">Sub Total </p>
              <p className="float-right mt-4">$ {totalPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="float-left mt-4">Shipping </p>
              <p className="float-right mt-4">$ {(totalPrice * 0.1).toFixed(2)}</p>
            </div>
            <div>
              <p className="float-left mt-4">GST (18%) </p>
              <p className="float-right mt-4">$ {(totalPrice * 0.18).toFixed(2)}</p>
            </div>
            <div>
              <p className="float-left mt-4 text-green-500 font-semibold">Discount</p>
              <p className="float-right mt-4 text-green-500 font-semibold">- $ {(totalPrice * 0.05).toFixed(2)}</p>
            </div>
            <hr className="my-4" />
            <div>
              <p className="float-left font-semibold">Total</p>
              <p className="float-right font-semibold">$ {(totalPrice + (0.18 * totalPrice) + (0.1 * totalPrice) - (0.05 * totalPrice)).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
