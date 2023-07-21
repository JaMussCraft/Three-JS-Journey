import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1.5)
pointLight.position.set(3, 3, 3)
scene.add(pointLight)

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
const cubeTextureLoader = new THREE.CubeTextureLoader()
const ambientOcclusionT = tLoader.load('/textures/door/ambientOcclusion.jpg')
const colorT = tLoader.load('/textures/door/color.jpg')
const heightT = tLoader.load('/textures/door/height.jpg')
const metalnessT = tLoader.load('/textures/door/metalness.jpg')
const normalT = tLoader.load('/textures/door/normal.jpg')
const roughnessT = tLoader.load('/textures/door/roughness.jpg')
const alphaT = tLoader.load('/textures/door/alpha.jpg')

//gradients
const gradientT = tLoader.load('/textures/gradients/3.jpg')
gradientT.magFilter = THREE.NearestFilter
gradientT.minFilter = THREE.NearestFilter
gradientT.generateMipmaps = false

// matcaps
const matcapT = tLoader.load('/textures/matcaps/3.png')

// environment
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
])

scene.background = new THREE.CubeTextureLoader()
  .setPath('/textures/environmentMaps/0/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])

/**
 * Objects
 */
// const material = new THREE.MeshStandardMaterial()
// material.gradientMap = gradientT
// material.map = colorT
// material.aoMap = ambientOcclusionT
// material.aoMapIntensity = 10
// material.displacementMap = heightT
// material.displacementScale = 0.1
// material.metalnessMap = metalnessT
// material.roughnessMap = roughnessT
// material.normalMap = normalT
// material.normalScale.set(100,100)
// material.alphaMap = alphaT
// material.transparent = true

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.7
// material.roughness = 0.2
// material.envMap = environmentMapTexture

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
const plane = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 100, 100, 100), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(2, 1), material)
scene.add(sphere, plane, torus)

sphere.position.set(-4, 0, 0)

torus.position.set(4, 0, 0)

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
 * Debug GUI
 */
const gui = new GUI()
gui.add(material, 'roughness').min(0).max(1).step(0.01)
gui.add(material, 'metalness').min(0).max(1).step(0.01)

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
