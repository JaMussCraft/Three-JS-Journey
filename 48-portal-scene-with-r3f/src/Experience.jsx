import { OrbitControls, useGLTF, useTexture, Center, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

export default function Experience() {
    const { clock } = useThree()

    const portal = useRef()

    const model = useGLTF('./model/portal.glb')
    const bakedTexture = useTexture('./model/baked.jpg')
    bakedTexture.flipY = false
    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
    const portalMaterial = new THREE.ShaderMaterial({
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
        uniforms: {
            uTime: { value: 100 },
            uColorStart : { value: new THREE.Color('black')},
            uColorEnd : { value: new THREE.Color('white')},
        },
    })
    const transparentMaterial = new THREE.MeshBasicMaterial({
        opacity: 0,
        transparent: true,
    })

    model.scene.children.forEach((child) => {
        if (child.name === 'poleLightA' || child.name === 'poleLightB') {
            child.material = new THREE.MeshBasicMaterial({ color: 0xffffe5 })
        } else if (child.name === 'portalLight') {
            child.material = transparentMaterial
        } else {
            child.material = bakedMaterial
        }
    })

    useFrame(() => {
        // portal.current.material.uniforms.uTime.value = clock.elapsedTime
        portalMaterial.uniforms.uTime.value = clock.elapsedTime
    })

    return (
        <>
            <OrbitControls makeDefault />
            <Center>
                <primitive object={model.scene}>
                    <meshBasicMaterial map={bakedTexture} />
                </primitive>
                <mesh
                    ref={portal}
                    geometry={model.nodes.portalLight.geometry}
                    position={model.nodes.portalLight.position}
                    rotation={model.nodes.portalLight.rotation}
                    material={portalMaterial}
                ></mesh>
            </Center>
            <Sparkles speed={0.2} size={4} scale={[4, 2, 4]} position-y={0.2} />
        </>
    )
}

useGLTF.preload('./model/portal.glb')
