import { useThree, extend } from '@react-three/fiber'
import {
    CameraControls,
    Html,
    OrbitControls,
    PivotControls,
    TransformControls,
    Text,
    MeshReflectorMaterial,
    MeshRefractionMaterial,
} from '@react-three/drei'
import { useRef } from 'react'
import { Mesh } from 'three'

export default function Experience() {
    const cube = useRef()
    const floor = useRef()
    const sphere = useRef()

    return (
        <>
            {/* <CameraControls smoothTime={3}/> */}
            <OrbitControls makeDefault />

            <directionalLight position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh ref={sphere} position-x={-2}>
                <sphereGeometry />
                {/* <meshStandardMaterial color="orange" /> */}
                {/* <MeshRefractionMaterial /> */}
                <Html
                    position={[1, 1, 1]}
                    wrapperClass="label"
                    distanceFactor={7}
                    occlude={[cube, sphere]}
                >
                    My Sphere
                </Html>
            </mesh>

            <PivotControls anchor={[0, 10, 0]} depthTest={false}>
                <mesh ref={cube} position-x={2} scale={1.5}>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </PivotControls>

            <mesh ref={floor} position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                {/* <meshStandardMaterial color="greenyellow" /> */}
                <MeshReflectorMaterial />
            </mesh>

            <Text position={[0, 2, 0]} font="./bangers-v20-latin-regular.woff">
                Hello World!
            </Text>
        </>
    )
}
