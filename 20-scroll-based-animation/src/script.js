import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

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
  particleMaterial.color.set(parameters.materialColor)
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

const material = new THREE.MeshToonMaterial({ gradientMap: gradientT })
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

const sectionMeshes = [mesh1, mesh2, mesh3]

mesh1.position.y -= objectDistance * 0
mesh2.position.y -= objectDistance * 1
mesh3.position.y -= objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

// mesh1.position.x = -1
// mesh2.position.x = 0
// mesh3.position.x = 1

scene.add(mesh1, mesh2, mesh3)

/**
 * Particles
 */
const count = 200
const radius = 10 // radius for the particles as a whole
const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
  const i3 = i * 3

  positions[i3] = (Math.random() - 0.5) * radius
  positions[i3 + 1] = (Math.random() - 0.7) * objectDistance * 5
  positions[i3 + 2] = -Math.random() * radius
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

const particleMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

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

// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

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

let scrollY = window.scrollY
let currentSection = 0

const cursor = {
  x: 0,
  y: 0,
}

addEventListener('mousemove', (e) => {
  // normalize the values
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
})

function spin(mesh) {
  console.log('spin')
  gsap.to(mesh.rotation, {
    duration: 1.5,
    ease: 'power2.inOut',
    x: '+=3',
    y: '+=3',
  })
}

addEventListener('scroll', () => {
  scrollY = window.scrollY

  const section = Math.round(scrollY / sizes.height)

  if (section != currentSection) {
    // change section
    currentSection = section

    // spin the new section
    spin(sectionMeshes[currentSection])
  }
})

let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Animate Meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.2
  }

  // Animate Camera
  cameraGroup.position.y = (-scrollY / sizes.height) * objectDistance

  camera.position.x += (cursor.x * 0.5 - camera.position.x) * deltaTime * 1.5
  camera.position.y += (-cursor.y * 0.5 - camera.position.y) * deltaTime * 1.5

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
