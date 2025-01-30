
function HeroSection() {
    return (
      <div className="relative bg-gray-900 text-white">
        <img
          src="/banner.jpg"
          alt="Hero Banner"
          className="w-full h-[60vh] object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Welcome to EShop</h1>
          <p className="text-xl md:text-2xl mb-8 text-center">Discover amazing products at unbeatable prices</p>
        </div>
      </div>
    )
  }
  
  export default HeroSection
  
  