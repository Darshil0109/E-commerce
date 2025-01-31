// Sample order data (unchanged)
const orders = [
  {
    id: 1,
    customer: "John Doe",
    date: "2023-05-15",
    items: [
      { name: "Laptop", quantity: 1, price: 999.99 },
      { name: "Mouse", quantity: 2, price: 29.99 },
    ],
  },
  {
    id: 2,
    customer: "Jane Smith",
    date: "2023-05-14",
    items: [
      { name: "Smartphone", quantity: 1, price: 599.99 },
      { name: "Phone Case", quantity: 1, price: 19.99 },
      { name: "Screen Protector", quantity: 2, price: 9.99 },
    ],
  },
  {
    id: 3,
    customer: "Bob Johnson",
    date: "2023-05-13",
    items: [
      { name: "Headphones", quantity: 1, price: 149.99 },
      { name: "Bluetooth Speaker", quantity: 1, price: 79.99 },
    ],
  },
]

const Order = () => {
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Order #{order.id}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {order.customer} - {order.date}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-left sm:text-right">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg font-semibold text-gray-900">${calculateTotal(order.items)}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            Item
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

      {/* Footer */}
      <footer className="bg-white shadow mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2023 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Order

