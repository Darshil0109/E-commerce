import { Link } from 'react-router-dom'; // Assuming you're using react-router
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Our Story
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Founded in 2025, I started with a simple idea: to create an 
                  online shopping experience that is seamless, enjoyable, and 
                  accessible to everyone. What began as a small team of passionate 
                  individuals has grown into a thriving e-commerce platform 
                  serving millions worldwide.
                </p>
              </div>
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img 
                  src="https://picsum.photos/600/400" 
                  alt="Our team working"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className=" py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To empower people to discover and purchase quality products through 
              innovative technology, exceptional customer service, and a 
              commitment to sustainability.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-1 gap-8 ">
              {[2].map((item) => (
                <div key={item} className="text-center">
                  <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ">
                    <img 
                      src={`https://picsum.photos/200/200?random=${item}`} 
                      alt={`Team member ${item}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Darshil patel
                  </h3>
                  <p className="text-gray-600 mb-4">Founder</p>
                  <div className="flex justify-center space-x-4">
                    <a href="#linkedin" className="text-blue-600 hover:text-blue-800">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        {/* LinkedIn icon */}
                      </svg>
                    </a>
                    <a href="#twitter" className="text-blue-400 hover:text-blue-600">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        {/* Twitter icon */}
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Customer First</h3>
                <p className="text-gray-600">
                  We prioritize customer satisfaction in every decision we make, 
                  ensuring a seamless shopping experience.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Sustainability</h3>
                <p className="text-gray-600">
                  Committed to eco-friendly practices and partnering with 
                  sustainable brands.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-gray-600">
                  Continuously improving our platform to stay ahead in 
                  e-commerce technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Shop?</h2>
            <p className="mb-8 text-lg">Discover our curated collection of products</p>
            <Link 
              to="/products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg 
              font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </section>
      </div>
      <Footer/>
    </div>
  );
};

export default About;