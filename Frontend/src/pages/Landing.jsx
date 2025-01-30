import { useSelector } from "react-redux"
import About from "../components/About"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import Navbar from "../components/Navbar"

const Landing = () => {
  const isLoggedIn = useSelector((state)=> state.userData.isLoggedIn);
    return (
    <div>
        <Navbar isLoggedIn={isLoggedIn}/>
        <HeroSection/>
        <About/>
        <Footer/>
    </div>
  )
}

export default Landing