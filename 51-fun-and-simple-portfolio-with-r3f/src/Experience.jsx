import {
    Html,
    ContactShadows,
    Environment,
    Float,
    OrbitControls,
    PresentationControls,
    useGLTF,
    Text,
} from '@react-three/drei'

export default function Experience() {
    const computer = useGLTF('https://threejs-journey.com/resources/models/macbook_model.gltf')
    return (
        <>
            <color args={[0x241a1a]} attach="background"></color>

            {/* <OrbitControls makeDefault /> */}
            <Environment preset="sunset" />

            <Text
                font="./bangers-v20-latin-regular.woff"
                fontSize={1}
                position={[2, 0.75, 0.75]}
                rotation-y={-1.25}
            >
                BRUNO SIMON
            </Text>
            <PresentationControls
                global
                rotation={[0.13, 0.1, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-0.75, 0.25]}
                config={{ mass: 10, tension: 100 }}
                snap={{ mass: 10, tension: 100 }}
            >
                <Float>
                    <rectAreaLight
                        width={2.5}
                        height={1.65}
                        intensity={65}
                        color={'#ff6900'}
                        rotation={[-0.1, Math.PI, 0]}
                        position={[0, 0.55, -1.15]}
                    />
                    <primitive object={computer.scene} position-y={-1.2}>
                        <Html
                            wrapperClass="screen"
                            transform
                            distanceFactor={1.17}
                            position={[0, 1.56, -1.4]}
                            rotation-x={-0.256}
                        >
                            <iframe src="https://bruno-simon.com/html/"></iframe>
                        </Html>
                    </primitive>
                </Float>
            </PresentationControls>

            <ContactShadows position-y={-1.4} opacity={0.4} scale={10} blur={2.4} />
        </>
    )
}
