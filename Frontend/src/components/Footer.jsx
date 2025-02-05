import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="w-full bg-white text-black 2xl:border-t mb-4">
      <div className="container mx-auto px-4 2xl:px-0 ">
        <div className="flex flex-wrap justify-between border-t 2xl:border-hidden border-gray-700 pt-8 2xl:w-full">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">EShop</h3>
            <p className="mb-4">shop for amazing products.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-400">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="mb-2">123-ABC complex,Ahmedabad</p>
            <p className="mb-2">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="2xl:border-hidden border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; 2025 EShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

