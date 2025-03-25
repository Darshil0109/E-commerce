import { Canvas } from "@react-three/fiber"
import { useState } from "react";
import { Model } from "./Model";
import { OrbitControls } from "@react-three/drei";

const FeaturedProduct = () => {
    const [cursor,setCursor] = useState('grab');
    
  return (
    <div style={{ width: '100vw', height: '70vh', position:'relative' , overflowY:'auto' }}>
            <h2 className="absolute top-4 text-4xl font-bold text-gray-950 text-center w-full">Product of the month</h2>
          <Canvas gl={{alpha:true}} style={{ width: '100%', height: '100%',background:'transparent',cursor:cursor, overflowX:'hidden',overflowY:'auto' , maxWidth:window.innerWidth }} onMouseLeave={()=>setCursor('grab')} onMouseDown={()=>{setCursor('grabbing')}} 
  
            onMouseUp={()=>
              {
                setCursor('grab')
              }
            }
          >
            
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} />

            {/* 3D Model */}
              <Model />


            {/* Optional: Allows user to move the camera */}
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              minPolarAngle={Math.PI / 2} 
              maxPolarAngle={Math.PI / 2} 
              rotateSpeed={0.5}
            />
          </Canvas>
        </div>
  )
}

export default FeaturedProduct