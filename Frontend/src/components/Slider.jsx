import './Slider.css'
const Slider = () => {
  return (
    <div>
        <div>
            <p className='text-4xl font-extrabold mb-16 text-gray-950 text-center'>Featured Partners</p>
        </div>
        <div className="slider mb-10"
            style={{"--width": "100px",
                "--height": "50px",
                "--quantity": "8",
            }}
        >
            <div className="list">
                <div className="item" style={{"--position" : "1"}}><img src="Canon_logo.png" alt="" /></div>
                <div className="item" style={{"--position" : "2"}}><img src="Amazon.png" alt="" /></div>
                <div className="item" style={{"--position" : "3"}}><img src="Adidas.png" alt="" /></div>
                <div className="item" style={{"--position" : "4"}}><img src="Nike.png" alt="" /></div>
                <div className="item" style={{"--position" : "5"}}><img src="logo1.png" alt="" /></div>
                <div className="item" style={{"--position" : "6"}}><img src="logo2.png" alt="" /></div>
                <div className="item" style={{"--position" : "7"}}><img src="logo3.png" alt="" /></div>
                <div className="item" style={{"--position" : "8"}}><img src="logo4.png" alt="" /></div>

            </div>
        </div>
        <div>
            <p className='text-4xl font-extrabold mt-16 mb-32 text-gray-950 text-center'>Featured Products</p>
        </div>
        <div className="slider my-16" 
        style={{"--width": "200px",
            "--height": "200px",
            "--quantity": "6",
        }}
        >
            <div className="list flex gap-2">
                <div className="items" style={{"--position": "1"}}><img src="uploads/Earbuds.png" alt="" /></div>
                <div className="items" style={{"--position": "2"}}><img src="uploads/Headphone.png" alt="" /></div>
                <div className="items" style={{"--position": "3"}}><img src="uploads/Keyboard.png" alt="" /></div>
                <div className="items" style={{"--position": "4"}}><img src="uploads/Monitor.png" alt="" /></div>
                <div className="items" style={{"--position": "5"}}><img src="uploads/Speaker.png" alt="" /></div>
                <div className="items" style={{"--position": "6"}}><img src="uploads/Headphone2.png" alt="" /></div>
               
            </div>
        </div>
    </div>
  )
}

export default Slider