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

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const userLoading = useSelector((state) => state.userData.loading);
  const userData = useSelector((state) => state.userData.userData);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const userError = useSelector((state) => state.userData.error);

  const error = useSelector((state) => state.products.error);
  const isLoading = useSelector((state) => state.products.loading);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // console.log(formData.get("productImage").files);
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const quantity = formData.get("quantity");
    const productImage = formData.get("productImage");

    dispatch(
      addProductsRequest({
        name,
        description,
        price,
        stock,
        quantity,
        productImage,
      })
    );
    setIsOpen(false);
  };
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
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        {userError ? (
          <p className="text-red-500">{error}</p>
        ) : !userLoading && !isLoading ? (
          <>
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={handleClick}
                className=" text-white px-4 py-2 rounded"
                backgroundColor="#000000"
              >
                Upload Product
              </Button>
            </div>

            <Modal
              isOpen={isOpen}
              title={"Upload Form"}
              onClose={() => setIsOpen(false)}
            >
              {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="name" placeholder="Enter Product Name">
                  Name
                </Input>{" "}
                <br />
                <Input
                  label="price"
                  placeholder="Enter Product Price"
                  type="Number"
                >
                  Price
                </Input>
                <br />
                <Input
                  label="description"
                  placeholder="Enter Product Description"
                >
                  Description
                </Input>
                <br />
                <Input
                  label="stock"
                  placeholder="Enter Product Stock"
                  type="Number"
                >
                  Stock
                </Input>
                <Input
                  label="productImage"
                  placeholder="Enter Product Image"
                  type="file"
                >
                  productImage
                </Input>
                <br />
                {/* <Input label="productImage" placeholder="Enter Product Image" type="file">Product Image</Input><br/> */}
                <Button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Upload
                </Button>
              </form>
            </Modal>

            {!isLoading && products.length > 0 ? (
              <div className="flex flex-wrap gap-2 mx-4">
                {products.map((product) => (
                  <div key={product._id} className="max-w-xs mx-auto">
                    <div className="group relative my-4 ">
                        <div className="relative aspect-square overflow-hidden mt-12">
                          <img
                            src={`${import.meta.env.VITE_API_URL}/${product.productImage}`}
                            alt={`${product.name}`}
                            width={600}
                            height={600}
                            className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <button
                              onClick={() => {
                                dispatch(
                                  addCartRequest({
                                    userId: userData.id,
                                    productId: product._id,
                                    quantity: 1,
                                    price: product.price,
                                  })
                                );
                              }}
                              className={`w-full text-white py-3 px-4 text-sm  transition-colors ${checkInCart(product._id) ? 'bg-gray-600' : 'bg-black hover:bg-gray-800'}`}
                              disabled = {checkInCart(product._id)}
                            >
                              {checkInCart(product._id) ? 'In The Cart' : 'Add to Cart'}
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
    </>
  );
};

export default Home;
