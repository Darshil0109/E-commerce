import About from "../components/About"
import FeaturedProduct from "../components/FeaturedProduct"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import Navbar from "../components/Navbar"
import Slider from "../components/Slider"

const Landing = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <Slider/>
        <FeaturedProduct/>
        <About/>
        <Footer/>
    </div>
  )
}

export default Landing