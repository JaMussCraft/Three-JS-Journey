import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleT = textureLoader.load('/textures/particles/2.png')

/**
 * Test cube
 */
// const geometry = new THREE.SphereGeometry(1, 32, 32)
// const material = new THREE.PointsMaterial({
//     size: 0.02,
//     sizeAttenuation: true
// })
// const particles = new THREE.Points(geometry, material)
// scene.add(particles)

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array( 1000 * 3 );
const colors = new Float32Array( 1000 * 3 );


for (let i = 0; i < 1000  * 3; i++) {
    vertices[i] = (Math.random() - 0.5) * 2

    colors[i] = Math.random()
}


const positions = new Float32Array( vertices );

geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

const material = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    // color: 'red',
    alphaMap: particleT,
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: 0.001,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,

})
const particles = new THREE.Points(geometry, material)
scene.add(particles)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    for (let i = 0; i < 1000 * 3; i+=3) {
        // geometry.attributes.position.array[i] = Math.sin(elapsedTime) * Math.random()
        geometry.attributes.position.array[i+1] = Math.sin(elapsedTime - geometry.attributes.position.array[i]) * 2
        // geometry.attributes.position.array[i+2] = Math.sin(elapsedTime) * Math.random()
        
    }
    geometry.attributes.position.needsUpdate = true


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()