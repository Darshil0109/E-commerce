/* eslint-disable no-unused-vars */
import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addCartRequest,
  addProductsRequest,
  deleteCartRequest,
  userAuthenticationRequest,
} from "./store/Actions";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./components/Footer";

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const userLoading = useSelector((state) => state.userData.loading);
  const userData = useSelector((state) => state.userData.userData);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const userError = useSelector((state) => state.userData.error);

  const error = useSelector((state) => state.products.error);
  const isLoading = useSelector((state) => state.products.loading);
  
  

  
  // useEffect(()=>{
  //   console.log(products);

  // },[products])
  const cartData = useSelector((state) => state.cart.cart);
  const cartLoading = useSelector((state) => state.cart.loading);

  const checkInCart = (id) =>{
    const item = cartData.filter(cartItem => cartItem.productId === id)
    return item.length > 0 ? true : false
  }
  
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow">
        {
          userError && <p className="text-red-500">{error}</p>}
        {(!userLoading && !isLoading) ? (
          <>
            

            

            {!isLoading && products.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {products.map((product) => (
                  <div key={product._id} className="max-w-xs mx-auto ">
                    <div className="group relative my-4 ">
                        <div className="relative aspect-square overflow-hidden mt-12">
                          <img
                             onClick={()=>navigate(`/product/${product._id}`)}
                            src={`${import.meta.env.VITE_API_URL}/${product.productImage}`}
                            alt={`${product.name}`}
                            width={600}
                            height={600}
                            loading="lazy"
                            className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-300  cursor-pointer"
                          />
                          <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <button
                              onClick={() => {
                                if (!isLoggedIn) {
                                  toast.error("Please Login to Add to Cart", {
                                    position: "top-center",
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                  // navigate('/login')
                                }
                                else if (product.stock === 0) {
                                  toast.warn("Product out of Stock", {
                                    position: "top-center",
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                }
                                else{
                                  dispatch(
                                    addCartRequest({
                                      userId: userData.id,
                                      productId: product._id,
                                      quantity: 1,
                                      price: product.price,
                                    })
                                  );
                                }
                              }}
                              className={`w-full text-white py-3 px-4 text-sm  transition-colors cursor-pointer ${checkInCart(product._id) ? 'bg-gray-600' : 'bg-black hover:bg-gray-800'}`}
                              disabled = {checkInCart(product._id)}
                            >
                              {checkInCart(product._id) ? 'In The Cart' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 text-center">
                          <h3 className="text-sm font-bold">{product.name}</h3>
                          <p className="text-sm text-gray-600 font-semibold">
                            ${product.price}
                          </p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No Products Available</p>
            )}
          </>
        ) : (
          <p className="text-center">Loading....</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
