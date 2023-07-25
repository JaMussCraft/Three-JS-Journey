import * as THREE from 'three'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
  materialColor: '#ffeded',
}

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const gradientT = textureLoader.load('/textures/gradients/3.jpg')
gradientT.minFilter = THREE.NearestFilter
gradientT.magFilter = THREE.NearestFilter

/**
 * Objects
 */
const objectDistance = 4

const material = new THREE.MeshToonMaterial({ color: parameters.color, gradientMap: gradientT })
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

const sectionMeshes = [mesh1, mesh2, mesh3]

mesh1.position.y -= objectDistance * 0
mesh2.position.y -= objectDistance * 1
mesh3.position.y -= objectDistance * 2

// mesh1.position.x = -1
// mesh2.position.x = 0
// mesh3.position.x = 1

scene.add(mesh1, mesh2, mesh3)

/**
 * Lights
 */
const directionalL = new THREE.DirectionalLight('#ffffff', 1)
directionalL.position.set(1, 1, 0)
scene.add(directionalL)

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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.alpha = 1

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Animate Meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1
    mesh.rotation.y = elapsedTime * 0.2
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
