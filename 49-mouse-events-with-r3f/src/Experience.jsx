import { useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Experience() {
    const cube = useRef()
    const sphere = useRef()

    const hamburger = useGLTF('./hamburger.glb')

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2
    })

    const eventHandler = (event) => {
        if (event.object === event.eventObject)
            cube.current.material.color = new THREE.Color(
                Math.random(),
                Math.random(),
                Math.random()
            )
    }

    return (
        <>
            <OrbitControls makeDefault />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh ref={sphere} position-x={-2} onClick={(event) => event.stopPropagation()}
            onPointerEnter={(event) => event.stopPropagation()}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh
                ref={cube}
                position-x={2}
                scale={1.5}
                onClick={eventHandler}
                onPointerEnter={() => {
                    document.body.style.cursor = 'pointer'
                }}
                onPointerLeave={() => {
                    document.body.style.cursor = 'default'
                }}
            >
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <primitive
                object={hamburger.scene}
                scale={0.25}
                position-y={0.5}
                onClick={(event) => {
                    event.stopPropagation()
                    console.log('burger hit!')
                }}
            ></primitive>
        </>
    )
}
