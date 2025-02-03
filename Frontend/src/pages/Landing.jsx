import About from "../components/About"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import Navbar from "../components/Navbar"

const Landing = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <About/>
        <Footer/>
    </div>
  )
}

export default Landing