import { useEffect, useMemo, useRef } from 'react'
import { DoubleSide } from 'three'
export default function CustomObject() {
    const geometry = useRef()

    useEffect(() =>
    {
        geometry.current.computeVertexNormals()

    }, [])


    const verticesCount = 10 * 3 // # of triangles times 3 vertices each
    
    const position = useMemo(() => 
    {
        const position = new Float32Array(verticesCount * 3)
    
        for (let i = 0; i < verticesCount; i++) {
            position[i * 3 + 0] = (Math.random() - 0.5) * 5
            position[i * 3 + 1] = (Math.random() - 0.5) * 5
            position[i * 3 + 2] = (Math.random() - 0.5) * 5
        }
        
        return position
    }, [])


    return (
        <mesh>
            <bufferGeometry ref={geometry}>
                <bufferAttribute 
                attach="attributes-position"
                count={verticesCount}
                itemSize={3}
                array={position}
                />
            </bufferGeometry>
            <meshStandardMaterial color="red" side={DoubleSide}/>
        </mesh>
    )
}
