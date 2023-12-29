import { useFrame, useThree } from '@react-three/fiber'
import {
    AccumulativeShadows,
    BakeShadows,
    ContactShadows,
    Environment,
    OrbitControls,
    OrthographicCamera,
    RandomizedLight,
    SoftShadows,
    useHelper,
} from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { Perf } from 'r3f-perf'
import { BoxHelper, DirectionalLightHelper } from 'three'
import * as THREE from 'three'
import { Leva, useControls } from 'leva'

export default function Experience() {
    const { scene, clock } = useThree()
    const controls = useControls({
        position: { x: 0.5, y: -0.99, z: 0 },
        scale: 10,
        resolution: 512,
        far: 5,
        color: '#326d39',
        opacity: 0.8,
        blur: 0.5,
    })

    const cube = useRef()
    const directionalLight = useRef()
    const randomizedLight = useRef()
    const redPlane = useRef()
    // const shadowCamera = useRef()
    // const orthographicCamera = useRef()
    useHelper(directionalLight, THREE.DirectionalLightHelper)
    // useHelper(orthographicCamera, THREE.CameraHelper)
    const shadowCamera = useRef()

    
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        // const shadowCameraHelper = new THREE.CameraHelper(directionalLight.current.shadow.camera)
        // scene.add(shadowCameraHelper)
        // console.log('updated', elapsedTime)
        // this.forceUpdate()
    }, [])
    useHelper(shadowCamera, THREE.CameraHelper)

    useFrame((state, delta) => {
        cube.current.rotation.y += delta * 0.2
        setElapsedTime(clock.elapsedTime)
    })
    
    const test = () => {
        console.log('hello')
    }

    return (
        <>
            {/* <OrthographicCamera top={2} bottom={-2} left={-2} right={2} ref={orthographicCamera}/> */}
            {/* <BakeShadows /> */}
            {/* <SoftShadows/> */}

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            {/* <directionalLight
                shadow-mapSize={[1024, 1024]}
                // castShadow
                ref={directionalLight}
                position={[1, 2, 3]}
                intensity={4.5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                onAfterRender={test()}
            /> */}
            {/* <ambientLight intensity={1.5} /> */}
            {/* <AccumulativeShadows 
            color='#316d39'
            opacity={0.8}
            position={[0, -0.99, 0]}>
                <RandomizedLight
                    amount={8}
                    radius={1}
                    ambient={0.5}
                    intensity={3}
                    position={[1, 2, 3]}
                    bias={0.001}
                />
            </AccumulativeShadows> */}
            {/* <ContactShadows
                position={[controls.position.x, controls.position.y, controls.position.z]}
                scale={controls.scale}
                resolution={controls.resolution}
                far={controls.far}
                color={controls.color}
                opacity={controls.opacity}
                blur={controls.blur}
            /> */}

            <Environment background>
                <mesh ref={redPlane} position-z={-5} scale={10}>
                    <planeGeometry />
                    <meshBasicMaterial color={[1,0,0]}/>
                </mesh>
            </Environment>
            <mesh castShadow position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial
                    color="lightgrey"
                    envMapIntensity={10}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            <mesh castShadow ref={cube} position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>

            <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    )
}
