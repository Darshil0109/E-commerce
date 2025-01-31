import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";


const Order = () => {
  const navigate = useNavigate()
  const userLoading = useSelector((state) => state.userData.loading);
  const userData = useSelector((state) => state.userData.userData);
  const userError = useSelector((state) => state.userData.error);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const orderLoading = useSelector((state)=> state.products.loading);
  const orderData = useSelector((state)=>state.orders.orders);
  const orderError = useSelector((state)=>state.orders.error);
  const products = useSelector((state)=> state.products.products);
  useEffect(() => {
    if (userLoading) return; // Prevent execution while still fetching data
    if (!isLoggedIn && !userData && userError) {
      navigate("/login");
    }
  }, [userLoading, navigate, userData, userError, isLoggedIn]);
  
  
  return (
    orderError ? <p>{orderError}</p>:
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#101727] flex flex-col">
      {/* Header */}
      <header className="bg-[#25354b] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Orders History</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {!orderLoading && orderData.length > 0 && orderData.map((order) => (
            <div
              key={order._id}
              className="bg-[#1e2a3a] text-white shadow overflow-hidden sm:rounded-lg mb-8"
            >
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium ">
                    Order #{order._id}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-200">
                    {order.createdAt}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                  <p className="text-lg font-semibold text-green-400">
                    {order.status}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                  <p className="text-sm font-medium text-gray-200">Total</p>
                  <p className="text-lg font-semibold text-gray-100">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-500">
                      <thead className="bg-[#1e2a3a]">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider whitespace-nowrap"
                          >
                            Item
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider whitespace-nowrap"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider whitespace-nowrap"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider whitespace-nowrap"
                          >
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#1e2a3a] divide-y divide-gray-700">
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                              {products.find(product => product._id === item.productId).name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-2s00">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-2s00">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-2s00">
                              ${(item.quantity * item.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
    </>
  );
};

export default Order;
