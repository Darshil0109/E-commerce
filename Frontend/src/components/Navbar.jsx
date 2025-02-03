import {
  UserRound,
  UserPen,
  Trash2,
  ShoppingBag,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import {
  addOrderRequest,
  deleteCartRequest,
  fetchOrderRequest,
  updateProductQuantity,
  } from "../store/Actions";
import { toast } from "react-toastify";

function Navbar() {
  const userData = useSelector((state) => state.userData.userData);
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
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
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
  let totalPrice = 0;
  const calculateTotal = (price) => {
    totalPrice += price;
  };
  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];
  const handleQuantityChange = (id,change)=>{
    dispatch(updateProductQuantity(id,change))
  }
  
  return (
    <>
      <nav className="py-6 px-6 border-b bg-white relative ">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-col">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              E-Shop
            </Link>
            <span className="text-sm text-gray-600"></span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm hover:text-gray-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            <Link
              to="/login"
              className={`${
                isLoggedIn ? "hidden" : ""
              } hover:text-gray-600 transition-colors`}
            >
              <UserRound />
            </Link>
            <Link
              to="/profile"
              className={`${
                isLoggedIn ? "" : "hidden"
              } hover:text-gray-600 transition-colors`}
            >
              <UserPen />
            </Link>
            <Link
              onClick={handleCartClick}
              className="hover:text-gray-600 transition-colors relative"
            >
              <ShoppingBag />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="p-6">
            <button
              className="absolute top-4 right-4"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="mt-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm hover:text-gray-600 transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </nav>
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cartLoading ? (
          <p className="text-center">Loading...</p>
        ) : cartError ? (
          <p className="text-red-500 text-center">
            Error Occurred: {cartError}
          </p>
        ) : cartData.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Your cart is empty
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100%-10rem)]">
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
                      <p className="text-gray-600">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          // onClick={() => updateQuantity(item.id, -1)}
                          className={`p-1 hover:bg-gray-100 rounded ${item.quantity <= 1? 'text-gray-400' : ''}`}
                          onClick={()=>handleQuantityChange(item._id,item.quantity - 1)}
                        >
                          <Minus
                            className="w-4 h-4"
                          />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          // onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={()=>handleQuantityChange(item._id,item.quantity + 1)}
                        >
                          <Plus
                            className="w-4 h-4"
                          />
                        </button>
                        <Button
                          className=" text-black px-3 py-1 rounded"
                          backgroundColor="transparent"
                          onClick={() => {
                            product.userId = userData.id;
                            dispatch(deleteCartRequest(product));
                          }}
                        >
                          <Trash2 className="text-gray-700"/>
                        </Button>
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
        )}

        <div className="flex justify-between mx-5 ">
              <h4>Total : </h4>
              <h4>$ {totalPrice.toFixed(2)}</h4>

            </div>
        <div className="w-full flex items-center px-8 align-center">
          <Button
            className="bg-black text-white w-full rounded"
            backgroundColor=""
            onClick={() => {
              if (cartData.length === 0) {
                toast.error("No Products in cart", {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } else {
                dispatch(
                  addOrderRequest({
                    userid: userData.id,
                    items: cartData,
                    price: totalPrice,
                  })
                );
                dispatch(fetchOrderRequest(userData.id));
              }
            }}
          >
            Order
          </Button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
