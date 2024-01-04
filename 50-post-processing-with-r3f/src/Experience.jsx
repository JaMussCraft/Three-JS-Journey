import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import {
    EffectComposer,
    Pixelation,
    Autofocus,
    GodRays,
    Vignette,
    ToneMapping,
    Bloom,
    DepthOfField,
} from '@react-three/postprocessing'
import { useRef } from 'react'
import { BlendFunction } from 'postprocessing'
import { useControls } from 'leva'
import Drunk from './Drunk.jsx'
import { useFrame, useThree } from '@react-three/fiber'

export default function Experience() {
    const cube = useRef()
    const sun = useRef()
    const drunk = useRef()

    const { blendFunctions, frequency, amplitude } = useControls({
        blendFunctions: { options: BlendFunction },
        frequency: 20,
        amplitude: 0.1
    })

    const { clock } = useThree()

    // useFrame(() => {
    //     drunk.current.elapsedTime = clock.elapsedTime
    //     // console.log(drunk.current.elapsedTime)
    // })

    return (
        <>
            {/* <color args={['lightblue']} attach="background" /> */}
            <EffectComposer disableNormalPass>
                {/* <Pixelation granularity={5}/> */}
                {/* <GodRays sunRef={sun}/> */}
                {/* <Vignette
                    eskil={false}
                    offset={0.5}
                    darkness={0.5}
                    blendFunction={blendFunctions}
                /> */}
                {/* <Bloom luminanceThreshold={1.1} mipmapBlur={true} /> */}
                {/* <DepthOfField 
                    focusDistance={0.025}
                    focalLength={0.025}
                    bokehScale={1}
                /> */}
                <Drunk ref={drunk} frequency={frequency} amplitude={amplitude} />
                <ToneMapping />
            </EffectComposer>

            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight
                ref={sun}
                castShadow
                position={[1, 2, 3]}
                intensity={4.5}
                transparent
                depthWrite={false}
            />
            <ambientLight intensity={1.5} />

            <mesh castShadow position-x={-2}>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>

            <mesh ref={cube} castShadow position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial color="purple" />
            </mesh>

            <mesh receiveShadow position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </>
    )
}
