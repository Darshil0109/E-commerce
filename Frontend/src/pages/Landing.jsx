import About from "../components/About"
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
        <About/>
        <Footer/>
    </div>
  )
}

export default Landing