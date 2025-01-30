import { ShoppingCart, X, UserRound,UserPen } from "lucide-react";
import { Link } from "react-router-dom";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import { deleteCartRequest, userAuthenticationRequest } from "../store/Actions";

function Navbar() {
  const userData = useSelector((state) => state.user.users);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartLoading = useSelector((state) => state.cart.loading);
  const cartData = useSelector((state) => state.cart.cart);
  const cartError = useSelector((state) => state.cart.error);
  
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const handleCartClick = () => {
    setIsCartOpen(true);
  };
   const isLoggedIn = useSelector((state)=> state.userData.isLoggedIn);
    useEffect(() => {
      dispatch(userAuthenticationRequest());
    }, [dispatch]);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const getProducts = async () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "GET",
      })
        .then(async (response) => {
          const tempProducts = await response.json();
          setProducts(tempProducts);
        })
        .catch(async (e) => {
          console.log(e);
        });
    };
    getProducts();
  }, [apiUrl]);
  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            EShop
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Products
            </Link>
            <Link
              to="/services"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center">
            <div className="mr-4 relative">
              <Link
                to="/login"
                className={`${isLoggedIn ? 'hidden' :''} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400`}
              >
                <UserRound />
              </Link>
            </div>
            <div className="mr-4 relative">
              <Link
                to="/profile"
                className={`${isLoggedIn ? '' :'hidden'} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400`}
              >
                <UserPen />
              </Link>
            </div>
            <div className="mr-4 relative">
              <ShoppingCart
                onClick={handleCartClick}
                className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600"
              />
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              {!isSidebarOpen ? (
                <svg
                  className="w-6 h-6 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <X size={24} className="text-white" />
              )}
            </button>
            <div
              className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-10 text-white transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out shadow-lg`}
            >
              <button
                className="absolute top-4 right-4 p-2"
                onClick={() => setIsSidebarOpen(false)}
              ></button>
              <nav className="mt-16 space-y-4 p-4 flex flex-col gap-5 ml-10">
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Products
                </Link>
                <Link
                  to="/services"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
                <Link
                  to="/profile"
                  className={`${isLoggedIn ? "" : 'hidden'} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400`}
                >
                  Profile
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </nav>
      <Modal
        isOpen={isCartOpen}
        title={"Cart"}
        onClose={() => setIsCartOpen(false)}
      >
        <div className="space-y-4">
          {cartLoading ? (
            <p className="text-center">Loading...</p>
          ) : cartError ? (
            <p className="text-red-500 text-center">
              Error Occurred: {cartError}
            </p>
          ) : (
            cartData?.map((item, index) => {
              let product = products.find(
                (productItem) => productItem._id === item.productId
              );
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{product?.name}</p>
                    <p className="text-gray-600">{product?.description}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p className="text-green-500">${product?.price}</p>
                  </div>

                  <Button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                      product.userId = userData.userId;
                      dispatch(deleteCartRequest(product));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </Modal>
    </>
  );
}


export default Navbar;
