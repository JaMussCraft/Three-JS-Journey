import { useAnimations, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect } from 'react'

export default function Fox(props) {
    const model = useGLTF('./Fox/glTF/Fox.gltf')
    console.log(model)
    const animations = useAnimations(model.animations, model.scene)
    const { animationName } = useControls({
        animationName: { options: animations.names }
    })
    useEffect(() =>
    {
        const action = animations.actions[animationName]
        action.fadeIn(1).play()
    
        return () =>
        {
            action.fadeOut(1).stop()
        }
    }, [ animationName ])

    return (
        <>
            <primitive {...props} object={model.scene} />
        </>
    )
}
