import { ChevronDown, ChevronRight, ChevronUp, Home, Minus, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addCartRequest } from "../store/Actions";

const ProductDetails = () => {
  const [isExtended, setIsExtended] = useState(false);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const productsLoading = useSelector((state) => state.products.loading);
  const products = useSelector((state) => state.products.products);
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.userData.userData);
  const cartData = useSelector((state) => state.cart.cart);
  const checkInCart = (id) => {
    const item = cartData.filter((cartItem) => cartItem.productId === id);
    return item.length > 0 ? true : false;
  };
  useEffect(() => {
    if (productsLoading) {
      return;
    }
    const tempProduct = products.filter(
      (productItem) => productItem._id === productId
    );

    if (tempProduct.length === 1) {
      setProduct(tempProduct);
    }
  }, [products, productId, productsLoading]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {productsLoading || product.length !== 1 ? (
        <>Loading...</>
      ) : (
        <div className="w-full h-full flex-grow">
          <nav
            className="flex ml-8 sm:mx-16 md:mx-20 lg:mx-25 xl:mx-35 2xl:mx-40 mt-10"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse flex-wrap">
              {/* Home */}
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <Home className="w-4 h-4 me-2.5" />
                  Home
                </Link>
              </li>
              {/* Projects */}
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1 rtl:rotate-180" />
                  <Link
                    to="/Products"
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2"
                  >
                    Products
                  </Link>
                </div>
              </li>

              {/* Flowbite (Current Page) */}
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1 rtl:rotate-180" />
                  <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
                    #{productId}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="sm:mx-16 md:mx-20 lg:mx-40 mt-10 mb-20 flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-16 lg:gap-32 items-center sm:items-start">
            <img
              src={`${import.meta.env.VITE_API_URL}/${product[0].productImage}`}
              alt=""
              className="h-full w-full max-w-[320px] max-h-[320px]"
            />
            <div className="mx-2 w-full px-8">
              <h1 className="text-3xl font-semibold">{product[0].name}</h1>
              <p className="font-light mt-5 ">
                {isExtended || product[0].description.length < 200
                  ? product[0].description + " "
                  : product[0].description.slice(0, 200) + "... "}
                <button
                  className="text-blue-900 font-medium cursor-pointer"
                  onClick={() => setIsExtended(!isExtended)}
                >
                  {product[0].description.length < 200
                    ? ""
                    : isExtended
                    ? <p className="flex items-center border-hidden">read less <ChevronUp className="h-5 w-5"/></p>  
                    : <p className="flex items-center border-hidden">read more <ChevronDown className="h-5 w-5"/></p>}
                  
                </button>
              </p>
              <div className="flex gap-4 my-8 ">Price : $ {product[0].price}</div>
              <div className="flex gap-4 my-8 ">
                Quantity
                <div className="flex gap-4">
                  <Minus
                    className={`cursor-pointer ${quantity <= 0 ? 'text-gray-400' : ''}`}
                    onClick={() => {
                      if (quantity > 0 && !checkInCart(product[0]._id)) {
                        setQuantity(quantity - 1)
                      }
                    }}
                  />{" "}
                  {quantity}{" "}
                  <Plus
                    className="cursor-pointer"
                    onClick={() => {
                      if (!checkInCart(product[0]._id)) {
                        setQuantity(quantity + 1)
                      }
                    }}
                  />
                </div>
              </div>
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
                  } else if(quantity === 0){
                    toast.warn("Please Select Quantity", {
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
                    setQuantity(0)
                    dispatch(
                      addCartRequest({
                        userId: userData.id,
                        productId: product[0]._id,
                        quantity: quantity,
                        price: product[0].price,
                      })
                    );
                  }
                }}
                className={`w-full xl:w-2/3 2xl:w-1/5 text-white py-3 px-4 text-sm rounded-sm ${
                  checkInCart(product[0]._id)
                    ? "bg-gray-600"
                    : "bg-black hover:bg-gray-800"
                }`}
                disabled={checkInCart(product[0]._id)}
              >
                {checkInCart(product[0]._id) ? "In The Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetails;
