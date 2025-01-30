
import { Facebook, Twitter, Instagram } from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-gray-800 text-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">EShop</h3>
            <p className="mb-4">shop for amazing products.</p>
            <div className="flex space-x-4">
              <Link to="/" className="hover:text-blue-400">
                <Facebook />
              </Link>
              <Link to="/" className="hover:text-blue-400">
                <Twitter />
              </Link>
              <Link to="/" className="hover:text-blue-400">
                <Instagram />
              </Link>
            </div>
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
                <Link to="/" className="hover:text-blue-400">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400">
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
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; 2025 EShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

