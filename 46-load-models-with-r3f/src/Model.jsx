import { Clone, useGLTF } from '@react-three/drei'

export default function Model() {
    const model = useGLTF('./FlightHelmet/glTF/FlightHelmet.gltf')

    return (
        <>
            <primitive object={model.scene} scale={4} />
        </>
    )
}
