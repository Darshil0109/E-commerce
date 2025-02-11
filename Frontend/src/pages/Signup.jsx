import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { userAuthenticationRequest } from "../store/Actions";

axios.defaults.withCredentials = true; 
const Signup = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isTermAccepted,setIsTermAccepted] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleSignup = async(e) =>{
        e.preventDefault()
        const formData = new FormData(e.target)
        
        if (formData.get('password') !== formData.get('confirmPassword')){
            toast.error('Password and Confirm Password Should be same', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return 
        }
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`,{
            name :formData.get('name'),
            email : formData.get('email'),
            password : formData.get('password')
          }, { withCredentials: true })

        if (response.data.token){
            toast.success('Signup Successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            dispatch(userAuthenticationRequest());
            navigate('/profile')
        }

        

    }
  return (
    <div><div className="min-h-screen flex items-center bg-gray-50 justify-center ">
    <div className="p-8 rounded-lg shadow-md w-96 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center ">Sign Up</h2>
      <form onSubmit={handleSignup} method="POST">
        <div className="mb-4 ">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4 ">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6 relative ">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        <div className="flex items-center mb-6 text-white">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            onChange = {()=>setIsTermAccepted(!isTermAccepted)}
            className="h-4 w-4 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="text-black ml-2 block text-sm ">
            I agree to the{" "}
            <Link to="#" className="text-[#850ee6] hover:underline">
              Terms and Conditions
            </Link>
          </label>
        </div>
        <button
            disabled={!isTermAccepted}
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm ">
        Already have an account?{" "}
        <Link to="/login" className="text-[#850ee6] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  </div></div>
  )
}

export default Signup