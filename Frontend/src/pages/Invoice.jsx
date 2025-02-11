import axios from "axios";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const Invoice = () => {
  const {orderId} = useParams();
  const navigate = useNavigate();
  const orderLoading = useSelector((state)=> state.products.loading);
  const orderData = useSelector((state)=>state.orders.orders);
  const orderError = useSelector((state)=>state.orders.error);
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);
  const userDataLoading = useSelector((state) => state.userData.loading);
  const userData = useSelector((state) => state.userData.userData);
  const userError = useSelector((state) => state.userData.error);
  const products = useSelector((state)=>state.products.products);
  const productsLoading = useSelector((state)=>state.products.loading);
  const productsError = useSelector((state)=>state.products.error);
  const [userInfo,setUserInfo] = useState([])
  const [order,setOrder] = useState([])
  let totalPrice = 0;
  const calculateTotal = (price) =>{
    totalPrice += price
  }
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      if (!orderLoading && orderData.length === 0 && orderError === '') {
        toast.error("No Order Found", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              });
        navigate('/')
      }
      else if (orderError){
        console.log('orderError' , orderError);
      }
      else if (orderData && orderData.length !== 0){
        const tempOrder = orderData.filter(orderItem => orderItem._id === orderId)
        if (tempOrder.length === 0) {
          toast.error("No Order of This Order id", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate('/orders')
        }
        setOrder(tempOrder[0])
      }
    },100)
    return () => clearTimeout(timeout)
  },[orderLoading,orderData,orderError,navigate,orderId])

  useEffect(()=>{
    const timeout = setTimeout(()=>{
      if (!productsLoading && products.length === 0 && productsError === '') {
        toast.error("Unable to fetch products", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              });
        navigate('/orders')
      }
      else if (productsError){
        console.log('productsError' , productsError);
      }
    },100)
    return () => clearTimeout(timeout)
  },[products,productsLoading,productsError,navigate])

  
  useEffect(()=>{
    const timeout = setTimeout(async()=>{
      if (!isLoggedIn) {
        toast.error("Please Log in", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/login')
      }
      else if (!userDataLoading && userData.length === 0 && userError === '') {
        toast.error("Error,Try again Later", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        navigate('/orders')
      }
      else if (userError !== '') {
        console.log('userError',userError);
      }
      else if (userData.length !== 0) {
        try {
          const data = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/info`, { withCredentials: true }
          );
          setUserInfo(data.data);
        } catch (error) {
          console.log(error);
        }
      }
    },100)
    return ()=>clearTimeout(timeout)
  },[isLoggedIn,userDataLoading,userData,userError,navigate])
  
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Header
    doc.setFontSize(18);
    doc.text('Invoice', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Invoice : #${order._id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString('default', { month: 'short' })} ${String(new Date(order.createdAt).getDate()).padStart(2,'0')}, ${new Date(order.createdAt).getFullYear()} , ${new Date(order.createdAt).toLocaleTimeString()}`, 14, 36);
  
    doc.setFont('helvetica', 'bold');
    doc.text('E-Shop Limited', 195, 20, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text('123 ABC Complex', 195, 26, { align: 'right' });
    doc.text('Ahmedabad, Gujarat, 380026', 195, 32, { align: 'right' });
    doc.text('Email: info@eshop.com', 195, 38, { align: 'right' });
    
    // Billed To Section
    
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', 14, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${userData.name}`, 14, 56);
    doc.text(`${userInfo.street}`, 14, 62);
    doc.text(`${userInfo.city},${userInfo.state},${userInfo.country} - ${userInfo.postalCode},`, 14, 68);
  
    // Payment Type
    doc.text(`Payment Type: ${order.paymentType}`, 14, 80);
  
    // Table Data
    const tableColumn = ['Product', 'Quantity', 'Unit Price', 'Total'];
    const tableRows = []; // ['Service A', '2', '$50', '$100'],
    
    
    order.items.forEach(item=>{
      let product = products.filter(product => product._id === item.productId)
      tableRows.push([`${product[0].name}`,`${item.quantity}`,`${item.price}`,`${item.price * item.quantity}`])
    })
  
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      styles: { halign: 'left', cellPadding: 4, textColor: [40, 40, 40] },
      headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255], fontStyle: 'bold' }, // Indigo header
      alternateRowStyles: { fillColor: [240, 240, 255] }, // Light indigo background for alternate rows
      tableLineColor: [200, 200, 200], // Light gray borders
      tableLineWidth: 0.5,
    });
  
    // Totals aligned to the right
    const finalY = doc.lastAutoTable.finalY + 10;

    if (finalY + 30 > doc.internal.pageSize.height - 20) {
      doc.addPage();  // Add new page if not enough space
    }

    const totals = [
      { label: 'Subtotal:', amount: (totalPrice).toFixed(2) },
      { label: 'Shipping Charges:', amount: `${(totalPrice * 0.1).toFixed(2)}` },
      { label: 'Tax (18%):', amount: `${(totalPrice * 0.18).toFixed(2)}` },
      { label: 'Discount:', amount: `-${(totalPrice * 0.05).toFixed(2)}` },
      { label: 'Grand Total:', amount: `${(totalPrice + (totalPrice * 0.18) + (totalPrice * 0.1) - (totalPrice * 0.05)).toFixed(2)}`, bold: true },
    ];
  
    totals.forEach((item, index) => {
      doc.setFontSize(item.bold ? 14 : 12);
      doc.setFont(undefined, item.bold ? 'bold' : 'normal');
      doc.text(item.label, 130, finalY + index * 8);
      doc.text(item.amount, 195, finalY + index * 8, { align: 'right' });
    });
  
    // Footer
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Thank you for your business!', 105, finalY + 50, { align: 'center' });
  
    doc.save(`invoice_${order._id}.pdf`);
  };
  return (
    (!orderLoading && !productsLoading && !userDataLoading && isLoggedIn && orderData.length > 0 && products.length > 0 && userData) ?  
    <div className="p-5" id="invoice-content">
      <div
        id="invoice"
        className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-5">
          <div>
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p>
              Invoice : # {order._id}
              <br />
              Date: {new Date(order.createdAt).toLocaleString('default', { month: 'short' })} {String(new Date(order.createdAt).getDate()).padStart(2,'0')}, {new Date(order.createdAt).getFullYear()} , {new Date(order.createdAt).toLocaleTimeString()}
            </p>  
          </div>
          <div className="text-right">
            <p className="font-bold">E-shop Limited</p>
            <p>
              123 ABC Complex
              <br />
              Ahmedabad, Gujarat, 380023
              <br />
              Email: info@eshop.com
            </p>
          </div>
        </div>
        <div className="mb-5">
          <p className="font-bold">Billed To:</p>
          <p>
            {userData?.name}
            <br />
            {userInfo?.street}
            <br />
            {userInfo?.city},{userInfo?.state},{userInfo?.country},{userInfo?.postalCode}
          </p>
        </div>
        <p className="font-bold mb-3">
          Payment Type: <span className="font-normal">{order?.paymentType}</span>
        </p>

        <table className="w-full border-collapse border border-gray-300 mb-5">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 p-2 text-left">Quantity</th>
              <th className="border border-gray-300 p-2 text-left">
                Unit Price
              </th>
              <th className="border border-gray-300 p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {!orderLoading && order?.items?.length > 0 ? order?.items?.map(item =>{
              let product = products?.filter((tempProduct)=>{
                return tempProduct._id === item.productId
              })
              {calculateTotal(product[0].price * item.quantity)}
              return(<tr key={item._id}>
                <td className="border border-gray-300 p-2">{product[0]?.name}</td>
                <td className="border border-gray-300 p-2">{item?.quantity}</td>
                <td className="border border-gray-300 p-2">${item?.price}</td>
                <td className="border border-gray-300 p-2">${item?.price * item?.quantity}</td>
              </tr>);
            }): <tr></tr>}
          </tbody>
        </table>

        <div className="text-right space-y-1 mb-5">
          <p>Subtotal: ${(totalPrice).toFixed(2)}</p>
          <p>Shipping Charges: ${(totalPrice * 0.1).toFixed(2)}</p>
          <p>Tax (18%): ${(totalPrice * 0.18).toFixed(2)}</p>
          <p>Discount: -${(totalPrice * 0.05).toFixed(2)}</p>
          <p className="font-bold text-lg">Grand Total: ${(totalPrice + (totalPrice * 0.1) + (totalPrice * 0.18) - (totalPrice * 0.05)).toFixed(2)}</p>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Thank you for the Shopping!</p>
        </div>

        <div className="text-center mt-5 flex justify-center gap-5">
          <button
            onClick={()=>{navigate(-1)}}
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={generatePDF}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-950 cursor-pointer"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div> 
    :
    <></>
  );
};

export default Invoice;
