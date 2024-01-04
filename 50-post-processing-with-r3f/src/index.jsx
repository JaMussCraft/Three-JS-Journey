import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { Leva } from 'leva'
import * as THREE from 'three'
import { useRef } from 'react'

const root = ReactDOM.createRoot(document.querySelector('#root'))
const backgroundColor = new THREE.Color(0x2e2e2e)

root.render(
    <>
        <Leva />
        <Canvas
        // style={{ background: 'lightblue' }}
            scene={{background: backgroundColor}}
            // scene-background={backgroundColor}
            gl={{ antialias: true }}
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [4, 2, 6],
            }}
        >
            <Experience />
        </Canvas>
    </>
)
