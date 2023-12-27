import { extend, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CustomObject from './CustomObject.jsx'
import { Vector3 } from 'three'

extend({ OrbitControls })

export default function Experience() {
    const { camera, gl } = useThree()

    const cube = useRef()
    const objectsGroup = useRef()

    useFrame((state, deltaTime) => {

        // cube.current.rotation.y += deltaTime
        objectsGroup.current.rotation.y += deltaTime

        // state.camera.rotateOnWorldAxis(new Vector3(0, 1, 0), deltaTime)
        state.camera.position.x = Math.sin(state.clock.elapsedTime) * 6
        state.camera.position.z = Math.cos(state.clock.elapsedTime) * 6
        state.camera.lookAt(0, 0, 0)
    })

    return (
        <>
            <orbitControls args={[camera, gl.domElement]} />

            <directionalLight position={[1, 2, 3]} intensity={5} />
            <ambientLight intensity={0.2} />

            <group ref={objectsGroup}>
                <mesh scale={3} position-x={2} ref={cube}>
                    <boxGeometry />
                    <meshStandardMaterial color="purple" />
                </mesh>

                <mesh position-x={-2}>
                    <sphereGeometry />
                    <meshStandardMaterial color="navy" />
                </mesh>
            </group>

            <mesh rotation-x={-Math.PI / 2} position-y={-2} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="green" />
            </mesh>

            <CustomObject />
        </>
    )
}
