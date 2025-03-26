import { lazy, useEffect, useState } from "react";

import { CSVLink } from 'react-csv';
// import { Users, ShoppingBag, BarChart2 } from 'lucide-react';
import axios from "axios";
const Navbar = lazy(() => import("../components/Navbar"));
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Legend,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addProductsRequest } from "../store/Actions";
import Modal from "../Modal";
import Input from "../Input";

const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
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
    if (productImage.type !== "image/png") {
      toast.error("Only .png Files are allowed", {
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
    }
  };
  //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();
  //   const menuItems = [
  //     { icon: <BarChart2 size={20} />, label: 'Dashboard' },
  //     { icon: <Users size={20} />, label: 'Users' },
  //     { icon: <ShoppingBag size={20} />, label: 'Products' },
  //   ];
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  // console.log(adminData);
  
  const csvheaders = [
    {label: 'Product Id', key: '_id'},
    {label: 'Product Name', key: 'name'},
    {label: 'Product Description', key: 'description'},
    {label: 'Product Price', key: 'price'},
    {label: 'Product Ratings', key: 'rating'},
    {label: 'Product Reviews', key: 'reviews'},
    {label: 'Product Stock', key: 'stock'},
  ]
  useEffect(() => {
    const getAdminData = async () => {
      console.log(isAdminLogin);
      
      if (!isAdminLogin) {
        navigate("/admin/login");
      } else {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/data`
          );
          setAdminData(response.data);
        } catch (error) {
          console.log("error occured", error.message);
        }
      }
    };
    const timeout = setTimeout(() => {
      getAdminData();
    }, 900);
    return () => clearTimeout(timeout);
  }, [isAdminLogin, navigate]);
  useEffect(() => {
    const getAdminLoginData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-cookies`, {
        withCredentials: true,
      });
      
      const adminToken = response.data?.adminToken
      console.log(response);
      
      console.log(adminToken);
      
      if (
        adminToken
      ) {
        
        setIsAdminLogin(true);
        console.log("isAdminLogin True");
      }
    }
    getAdminLoginData();
  }, []);
  //colors for pie chart
  const COLORS = [
    "#9966FF",
    "#fc9143",
    "#ff5db6",
    "#FFBB28",
    "#4BC0C0",
    "#90be6d",
  ];

  return adminData ? (
    <div className="flex h-screen bg-gray-50">

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
            step="0.01"
          >
            Price
          </Input>
          <br />
          <Input label="description" placeholder="Enter Product Description">
            Description
          </Input>
          <br />
          <Input label="stock" placeholder="Enter Product Stock" type="Number">
            Stock
          </Input>
          <Input
            label="productImage"
            placeholder="Enter Product Image"
            type="file"
          >
            Product Image (only .png)
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
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        {/* <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center flex-1">
              <div className="relative w-96">
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
              </button>
            </div>
          </div>
        </header> */}
        <Navbar />
        {/* Main Content Area */}
        <main className="p-8 overflow-auto h-[calc(100vh-88px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stats Cards */}
            {[
              { title: "Total Users", value: adminData.totalUsers },
              { title: "Revenue", value: adminData.totalRevenue.toFixed(2) },
              { title: "Orders", value: adminData.totalOrders },
              { title: "Products", value: adminData.totalProducts },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </h3>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-3xl font-semibold">
                    {stat.title === "Revenue" ? "$ " : ""}
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <h1 className="text-4xl my-16 text-center text-gray-900 font-bold">Statistics</h1>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full my-12 gap-6">
            {/* Bar Chart */}
            <div className="w-full lg:w-1/2 h-64 md:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminData.lastFiveDaysOrders}>
                  <XAxis dataKey="date" />
                  <YAxis dataKey="noOfOrders" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="noOfOrders"
                    fill="#008bd1"
                    barSize={20}
                    name="Number of Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-64 md:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={adminData.stockData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    fill="#8884d8"
                    label
                  >
                    {adminData.stockData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
              Add New User
            </button>
            <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
              Generate Report
            </button>
          </div> */}

          


          <div className="flex justify-center gap-4 mb-6">
            <Button className=" text-white px-4 py-2 rounded"
              backgroundColor="#000000">
              <CSVLink
                    data={adminData?.outofstockproducts}
                    headers={csvheaders}
                    filename="out_of_stock_products.csv"
                >
                  Out of Stock Products
                </CSVLink>
            </Button>
            <Button
              onClick={() => {
                handleClick();
              }}
              className=" text-white px-4 py-2 rounded"
              backgroundColor="#000000"
            >
              Upload Product
            </Button>
          </div>
        </main>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AdminPanel;
