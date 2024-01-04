import { MeshDistortMaterial, OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import {
    BallCollider,
    CuboidCollider,
    CylinderCollider,
    Physics,
    RigidBody,
} from '@react-three/rapier'
import { useRef, useState } from 'react'
import { Euler, Quaternion, QuaternionKeyframeTrack, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'

export default function Experience() {
    const sphereRigidBody = useRef()
    const sphereRigidBodyTwo = useRef()
    const bladeRigidBody = useRef()

    const [audio, setAudio] = useState(() => {
        new Audio('./hit.mp3')
    })

    const collision = () => {
        sphereRigidBody.current.applyImpulse(new Vector3(10, 0, 0))
        sphereRigidBodyTwo.current.applyImpulse(new Vector3(-10, 0, 0))
        // cubeRigidBody.current.applyTorqueImpulse(new Vector3(0,10,0))

        // console.log(cubeRigidBody.current)
    }

    const hamburgerModel = useGLTF('./hamburger.glb')

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const eulerRotation = new Euler(0, time * 6, 0)
        const quaRotation = new Quaternion()
        quaRotation.setFromEuler(eulerRotation)
        bladeRigidBody.current.setNextKinematicRotation(quaRotation)
        bladeRigidBody.current.setNextKinematicTranslation({
            x: Math.sin(time) * 2,
            y: -0.8,
            z: Math.cos(time) * 2,
        })
    })

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug>
                <RigidBody density={1} ref={sphereRigidBody} colliders="ball">
                    <mesh castShadow position={[-2, 5, 0]} scale={1}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody ref={sphereRigidBodyTwo} colliders="ball">
                    <mesh onClick={collision} castShadow position={[2, 5, 0]} scale={1}>
                        <sphereGeometry />
                        <meshStandardMaterial color="orange" />
                    </mesh>
                </RigidBody>

                <RigidBody
                    type="kinematicPosition"
                    position-y={-0.75}
                    friction={0}
                    ref={bladeRigidBody}
                >
                    <mesh castShadow>
                        <boxGeometry args={[3, 0.5, 0.5]} />
                        <meshStandardMaterial color="red" />
                    </mesh>
                </RigidBody>

                <RigidBody type="fixed">
                    <mesh receiveShadow position-y={-1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color="greenyellow" />
                    </mesh>
                </RigidBody>

                <RigidBody colliders={false}>
                    <CylinderCollider args={[0.25, 1]}/>
                    <primitive scale={0.2} object={hamburgerModel.scene}></primitive>
                </RigidBody>
            </Physics>
        </>
    )
}
