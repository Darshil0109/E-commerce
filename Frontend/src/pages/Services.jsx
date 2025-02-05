import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Services = () => {
  const services = [
    {
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep.",
      features: [
        "Free delivery on orders above $50",
        "2-3 day standard delivery",
        "Express shipping available",
        "Real-time order tracking"
      ]
    },
    {
      title: "Customer Support",
      description: "We're here to help you with any questions or concerns.",
      features: [
        "24/7 support available",
        "Live chat support",
        "Phone and email support",
        "Quick response time"
      ]
    },
    {
      title: "Easy Shopping",
      description: "Simple and secure shopping experience.",
      features: [
        "Easy product search",
        "Secure checkout",
        "Multiple payment options",
        "Save favorite items"
      ]
    },
    {
      title: "Returns & Refunds",
      description: "Hassle-free returns and quick refunds.",
      features: [
        "30-day return policy",
        "Free return shipping",
        "Easy refund process",
        "No questions asked"
      ]
    }
  ];

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">How We Serve You</h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
            Shop with confidence with our customer-first approach and reliable services.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-8 transition-shadow">
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </div>
  );
};

export default Services;