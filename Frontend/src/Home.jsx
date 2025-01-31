/* eslint-disable no-unused-vars */
import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addCartRequest,
  deleteCartRequest,
  userAuthenticationRequest,
} from "./store/Actions";
import Navbar from "./components/Navbar";

const Home = () => {
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();
  const userLoading = useSelector((state) => state.userData.loading);
  const userData = useSelector((state) => state.userData.userData);
  const isLoggedIn = useSelector((state)=> state.userData.isLoggedIn);
  const userError = useSelector((state) => state.userData.error);
  

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const getProducts = async () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "GET",
      })
        .then(async (response) => {
          const tempProducts = await response.json();
          setProducts(tempProducts);

          setIsLoading(false);
          setError("");
        })
        .catch(async (e) => {
          setError(e.message);
        });
    };
    getProducts();
  }, [apiUrl]);

  useEffect(()=>{
    dispatch(userAuthenticationRequest())
  },[dispatch])
  const handleClick = () => {
    setIsOpen(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // console.log(formData.get("productImage").files);
    
    fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        // productImage:formData.get("productImage"),
      }),
    })
      .then(async (response) => {
        const tempResponse = await response.json();
        setProducts(prevProducts => [...prevProducts, tempResponse.product]);
      })
      .catch(async (e) => {
        setError(e.message);
      });

    setIsOpen(false);
  };
  // useEffect(()=>{
  //   console.log(products);
    
  // },[products])
  return (<>
    <Navbar/>
    <div className="container mx-auto p-4 bg-[#101727]">
      {userError ? (
        <p className="text-red-500">{error}</p>
      ) : !userLoading && !isLoading ? (
        <>
          <div className="flex justify-center gap-4 mb-6">
            <Button onClick={handleClick} className="bg-green-500 text-white px-4 py-2 rounded">
              Upload Product
            </Button>
          </div>

          

          <Modal isOpen={isOpen} title={"Upload Form"} onClose={() => setIsOpen(false)}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="name" placeholder="Enter Product Name">Name</Input> <br/>
              <Input label="price" placeholder="Enter Product Price" type="Number">Price</Input><br/>
              <Input label="description" placeholder="Enter Product Description">Description</Input><br/>
              <Input label="stock" placeholder="Enter Product Stock" type="Number">Stock</Input><br/>
              {/* <Input label="productImage" placeholder="Enter Product Image" type="file">Product Image</Input><br/> */}
              <Button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Upload
              </Button>
            </form>
          </Modal>

          {!isLoading && products.length > 0 ? (
            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="p-4 border rounded-lg shadow-lg bg-[#1e2a3a] text-white">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p >{product.description}</p>
                  <p >Stock: {product.stock}</p>
                  <p className="font-semibold">${product.price}</p>
                  <Button
                    onClick={() => {
                      dispatch(
                        
                        addCartRequest({
                          userId: userData.id,
                          productId: product._id,
                          quantity: 1,
                          price:product.price,
                        })
                      );
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Add to Cart
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">Product ID: {product._id}</p>
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
