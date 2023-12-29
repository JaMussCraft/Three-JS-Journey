import { OrbitControls, Text } from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import Model from './Model'
import { Suspense } from 'react'
import Fox from './Fox'

export default function Experience() {
    const { perfOn } = useControls({
        perfOn: false,
    })

    return (
        <>
            {perfOn ? <Perf position="top-left" /> : null}

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <Suspense fallback={<Text>Loading...</Text>}>
                <Model />
                <Fox position-x={2} scale={0.05}/>
            </Suspense>
        </>
    )
}
