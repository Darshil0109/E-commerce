import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Home,
  Minus,
  Plus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addCartRequest } from "../store/Actions";
import axios from "axios";

const ProductDetails = () => {
  const [isExtended, setIsExtended] = useState(false);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const productsLoading = useSelector((state) => state.products.loading);
  const products = useSelector((state) => state.products.products);
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.userData);
  const cartData = useSelector((state) => state.cart.cart);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewData = {
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}/reviews`,
        reviewData
      );
      // console.log(response.data.review);
      setReviews([response.data.review]);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setRating(0);
      setComment("");
    } catch (error) {
      if (error.response.data.message === 'Product already reviewed by You') {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      else if (error.response.data.message === 'Access denied. No token provided.') {
        toast.error("Login Required!!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      console.log(error.response.data.message);
    }
  };
  const checkInCart = (id) => {
    const item = cartData.filter((cartItem) => cartItem.productId === id);
    return item.length > 0 ? true : false;
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (productsLoading) {
        return;
      }
      const tempProduct = products.filter(
        (productItem) => productItem._id === productId
      );
      setReviews(tempProduct[0].reviews);
      if (tempProduct.length === 1) {
        setProduct(tempProduct);
      }
    }, 100);
    return () => clearTimeout(timeout);
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
                  {product[0].description.length < 200 ? (
                    ""
                  ) : isExtended ? (
                    <p className="flex items-center border-hidden">
                      read less <ChevronUp className="h-5 w-5" />
                    </p>
                  ) : (
                    <p className="flex items-center border-hidden">
                      read more <ChevronDown className="h-5 w-5" />
                    </p>
                  )}
                </button>
              </p>
              <div className="flex gap-4 my-8 ">
                Price : $ {product[0].price}
              </div>
              <div className="flex gap-4 my-8 ">
                Quantity
                <div className="flex gap-4">
                  <Minus
                    className={`cursor-pointer ${
                      quantity <= 0 ? "text-gray-400" : ""
                    }`}
                    onClick={() => {
                      if (quantity > 0 && !checkInCart(product[0]._id)) {
                        setQuantity(quantity - 1);
                      }
                    }}
                  />{" "}
                  {quantity}{" "}
                  <Plus
                    className="cursor-pointer"
                    onClick={() => {
                      if (!checkInCart(product[0]._id)) {
                        setQuantity(quantity + 1);
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
                  } else if (quantity === 0) {
                    toast.warn("Please Select Quantity", {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  } else {
                    setQuantity(0);
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
          <div className="text-4xl  font-extrabold text-gray-900 flex justify-center">
            Our Product Reviews
          </div>
          <div className="divide-y divide-gray-300">
            {reviews?.map((review, index) => {
              return (
                <div key={index} className=" my-10  py-8 px-16">
                  <div className="font-bold">
                    {[1, 2, 3, 4, 5].map((num) => {
                      return (
                        <i
                          key={num}
                          className={`fas fa-solid fa-star text-xl ${
                            num <= review.rating
                              ? "text-[#FFD43B]"
                              : "text-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between my-4">
                    <h1 className="font-semibold text-indigo-700">
                      {review.name}
                    </h1>
                    <h1 className="text-gray-400">
                      {new Date(review.createdAt).toLocaleString("default", {
                        month: "short",
                      })}{" "}
                      {String(new Date(review.createdAt).getDate()).padStart(
                        2,
                        "0"
                      )}
                      , {new Date(review.createdAt).getFullYear()}
                    </h1>
                  </div>
                  <h1 className="text-gray-400">{review.comment}</h1>
                </div>
              );
            })}
          </div>
          <div className="max-w-md mx-auto mt-5 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Leave a Review</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rating
                </label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="">Select Rating...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetails;
