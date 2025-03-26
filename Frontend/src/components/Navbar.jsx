import {
  UserRound,
  UserPen,
  Trash2,
  ShoppingBag,
  Minus,
  Plus,
  X,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import {
  deleteCartRequest,
  updateProductQuantity,
  } from "../store/Actions";
import { toast } from "react-toastify";

function Navbar() {
  const [isSearchVisible, setIsSearchVisible] = useState(window.innerWidth >= 640 ? true : false)
  const userData = useSelector((state) => state.userData.userData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartLoading = useSelector((state) => state.cart.loading);
  const cartData = useSelector((state) => state.cart.cart);
  const cartError = useSelector((state) => state.cart.error);
  const dispatch = useDispatch();
  const products = useSelector((state)=>state.products.products);
  const handleCartClick = () => {
    setIsCartOpen(true);
  };
  
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
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
  const searchRef = useRef(null)
  const searchRefMobile = useRef(null)
  const [searchString,setSearchString] = useState('')
  const [searchResult,setSearchResult] = useState([])
  const navigate = useNavigate()
  const searchProducts = (name) =>{
    let uniqueProductNames = new Set();
    let uniqueSearchResult = []
    let result = []
    if (name === ""){
      setSearchResult(result)
    }
    else{
      result = products.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
      result.forEach(obj => {
        const name = obj.name;
        if(!uniqueProductNames.has(name)){
          uniqueProductNames.add(name);
          uniqueSearchResult.push(obj)
        }
      })
    }
    setSearchResult(uniqueSearchResult)
  }
  window.addEventListener('resize',()=>{
    if (window.innerWidth < 640 && isSearchVisible){
      setIsSearchVisible(false)
    }
    else if(window.innerWidth >= 640 && !isSearchVisible){
      setIsSearchVisible(true)
    }
  })
  const [isSearchFocused,setIsSearchFocused] = useState(false)
  
  return (
    <>
      <nav className="px-6 border-b bg-white relative ">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-col">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <img src="logo.png" alt="E-Shop" className="h-24 w-24" />
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
            <div className="relative flex items-center">
              <div
                className={`${isSearchVisible ? "hidden sm:flex w-32 md:w-40 " : "w-0"} overflow-hidden transition-all duration-300 ease-in-out`}
              >
                <input
                  onChange={(e)=>{
                    setSearchString(e.target.value)
                    searchProducts(e.target.value)}}
                  onKeyDown={(e)=>{
                    if (e.key === 'Enter'){
                      navigate(`/search/${searchString}`)
                      if (window.innerWidth < 640){
                        setIsSearchVisible(false)
                        searchRefMobile.current.blur()  //remove focus on element
                      }
                      else{
                        searchRef.current.blur()
                      }
                    }
                  }}
                  type="text"
                  ref={searchRef}
                  onFocus={()=>setIsSearchFocused(true)}
                  onBlur = {()=>setIsSearchFocused(false)}
                  value={searchString}
                  placeholder="Search..."
                  className="bg-transparent text-black px-2 py-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <button onClick={()=>{
                if (isSearchVisible && searchString!== '') {
                  navigate(`/search/${searchString}`)
                  if (window.innerWidth < 640){
                    setIsSearchVisible(false)
                    setIsSearchFocused(false)
                    searchRefMobile.current.blur() // remove focus from input
                  }
                  else{
                    searchRef.current.blur() // remove focus from input
                  }
                }
                else{
                  if (window.innerWidth >= 640) {
                    searchRef.current.focus()
                  }
                  else {
                    setIsSearchFocused(true)
                    searchRefMobile.current.focus()
                  }
                  setIsSearchVisible(true)
                }
              }} className="text-black" aria-label="Toggle search">
                <Search className="h-6 w-6" />
              </button>
            </div>
            
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
              <div className={`${(cartData.length === 0) ? 'hidden' : 'inline-flex'} absolute items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900`}>{cartData.length}</div>
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
        className={`${isSearchVisible ? "flex sm:hidden w-full bg-white h-16 md:w-40 translate-y-0" : "-translate-y-12 z-[-10]"} absolute overflow-hidden transition-all duration-300 ease-out z-10`}
      >
        <input
          onChange={(e)=>
            {
              setSearchString(e.target.value)
              searchProducts(e.target.value)
            }
          }
          type="text"
          ref={searchRefMobile}
          value={searchString}
          placeholder="Search..."
          className="sm:hidden bg-transparent text-black px-5 sm:px-2 py-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
        />
      </div>
      <div className={`${isSearchFocused ? "flex" : "hidden"} ${searchResult.length === 0 ? "hidden" : ''} absolute top-32 left-0 right-0 w-full sm:w-96 sm:top-20 sm:left-[50%] z-10 sm:right-10 bg-white shadow-lg rounded-lg p-4 mx-auto`}>
          <ul className="mt-2 w-full flex flex-col">
            {searchResult.map((result, index) => (
              <Link to={`/search/${result.name}`} onClick={()=>setIsSearchVisible(false)} key={index} className="py-1 w-full hover:bg-gray-100 cursor-pointer px-4 sm:px-2">{result.name}</Link>
            ))}
          </ul>
        </div>
      <div
        className={`flex flex-col min-h-screen fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 ">
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
          <div className="p-4 text-center text-gray-500 flex-grow">
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
                          className={`p-1 hover:bg-gray-100 rounded ${product.stock ===0 || item.quantity <= 1? 'text-gray-400' : ''}`}
                          onClick={()=>{product.stock !==0 && item.quantity === 1 ? '': handleQuantityChange(item._id,item.quantity - 1)}}
                        >
                          <Minus
                            className="w-4 h-4"
                          />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          // onClick={() => updateQuantity(item.id, 1)}
                          className={`p-1 hover:bg-gray-100 rounded ${product.stock ===0 || item.quantity >= product.stock ? 'text-gray-400' : ''} `}
                          onClick={()=>{product.stock !==0 && item.quantity >= product.stock ? '' :  handleQuantityChange(item._id,item.quantity + 1)}}
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
              }
              else {
                navigate('/payment')
                setIsCartOpen(false)
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
