import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

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

// Axes Helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

/**
 * Lights
 */
// Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(5).step(0.01).name('ambient intensity')

// Directional
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// directionalLight.position.set(5, 5, 5)
console.log(directionalLight.position)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(5).step(0.01).name('directional intensity')

const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalHelper)

// Hemispheres
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
scene.add(hemisphereLight)
gui.add(hemisphereLight, 'intensity').min(0).max(5).step(0.01).name('hemisphere intensity')

const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1)
scene.add(hemisphereHelper)

// Point
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2,3,4)
scene.add(pointLight)
gui.add(pointLight, 'intensity').min(0).max(5).step(0.01).name('point intensity')

// Rect Area
const rectAreaLight = new THREE.RectAreaLight(0xf7f38f, 1)
rectAreaLight.position.set(0,0,5)
scene.add(rectAreaLight)
gui.add(rectAreaLight, 'intensity').min(0).max(5).step(0.01).name('rect intensity')

const rectAreaHelper = new RectAreaLightHelper( rectAreaLight );
scene.add(rectAreaHelper)

// Spot 
const spotLight = new THREE.SpotLight(0xffffff, 0.5, 5, Math.PI * 0.1, 0.25, 1)
spotLight.lookAt(new THREE.Vector3())
scene.add(spotLight)
gui.add(spotLight, 'penumbra').min(0).max(5).step(0.01).name('spot penumbra')


/**
 * Objects
*/
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5
spotLight.target = sphere

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
