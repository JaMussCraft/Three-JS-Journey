import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Textures
 */

// door
const tLoader = new THREE.TextureLoader()
const ambientOcclusionT = tLoader.load('/textures/door/ambientOcclusion.jpg')
const colorT = tLoader.load('/textures/door/color.jpg')
const heightT = tLoader.load('/textures/door/height.jpg')
const metalnessT = tLoader.load('/textures/door/metalness.jpg')
const normalT = tLoader.load('/textures/door/normal.jpg')
const roughnessT = tLoader.load('/textures/door/roughness.jpg')

//gradients
const gradientT = tLoader.load('/textures/gradients/3.jpg')

// matcaps
const matcapT = tLoader.load('/textures/matcaps/1.png')

/**
 * Objects
 */
const material = new THREE.MeshNormalMaterial({ map: colorT })
// material.side = THREE.DoubleSide

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(2, 1), material)
scene.add(sphere, plane, torus)

plane.position.set(-4,0,0)

torus.position.set(4,0,0)


window.addEventListener('resize', () => {
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Rotate
  sphere.rotation.y = elapsedTime * 0.1
  plane.rotation.y = elapsedTime * 0.1
  torus.rotation.y = elapsedTime * 0.1
  
  sphere.rotation.x = elapsedTime * 0.15
  plane.rotation.x = elapsedTime * 0.15
  torus.rotation.x = elapsedTime * 0.15

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
