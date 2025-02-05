import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addCartRequest } from "../store/Actions";

const SearchResult = () => {
  const { productName } = useParams();
  const products = useSelector((state) => state.products.products);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.userData);
  const cartData = useSelector((state) => state.cart.cart);
  const checkInCart = (id) => {
    const item = cartData.filter((cartItem) => cartItem.productId === id);
    return item.length > 0 ? true : false;
  };
  let searchResults = products.filter((item) =>
    item.name.toLowerCase().includes(productName.toLowerCase())
  );
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex items-center ml-10 flex-grow">
        <div className="mt-5 ml-3 font-light text-xl flex items-center gap-2 flex-wrap ">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-2xl">
              {searchResults.length}
            </h2>
            <div>{`${(searchResults.length === 0 || searchResults.length === 1) ? 'Result':'Results'}`} Found for:{" "}</div>
          </div>
          <p className="font-semibold text-2xl">{`"${productName}"`}</p>
        </div>
      </div>
      {searchResults.length === 0 ? <div className="flex justify-center w-full m-[7%] overflow-y-auto"></div>
       : <div></div>}
      <div className={`flex flex-wrap gap-4 justify-center mb-10`}>
        {searchResults.map((product) => (
          <div key={product._id} className="max-w-xs mx-auto ">
            <div className="max-w-xs mx-auto">
              <div className="group relative my-4 ">
                <div className="relative aspect-square overflow-hidden mt-12 cursor-pointer">
                  <img
                    onClick={()=>navigate(`/product/${product._id}`)}
                    src={`${import.meta.env.VITE_API_URL}/${
                      product.productImage
                    }`}
                    alt={`${product.name}`}
                    width={600}
                    height={600}
                    className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-300"
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
                        } else {
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
                      className={`w-full text-white py-3 px-4 text-sm  transition-colors cursor-pointer ${
                        checkInCart(product._id)
                          ? "bg-gray-600"
                          : "bg-black hover:bg-gray-800"
                      }`}
                      disabled={checkInCart(product._id)}
                    >
                      {checkInCart(product._id) ? "In The Cart" : "Add to Cart"}
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
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResult;
