import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const parameters = {
  count: 10000,
  size: 0.01,
  innerColor: '#ff6030',
  outerColor: '#1b3984',
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.02,
  randomnessPower: 3,
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// /**
//  * Test cube
//  */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * Helper functions
 */
const hex2rgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // return {r, g, b} 
  return { r, g, b };
}


/**
 * Galaxy
 */
let geometry
let material
let particles

const generateGalaxy = () => {
  // Remove preexisting galaxy
  if (particles) {
    geometry.dispose()
    material.dispose()
    scene.remove(particles)
  }

  // geometry
  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  const innerColor = new THREE.Color(parameters.innerColor)
  const outerColor = new THREE.Color(parameters.outerColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const radius = Math.pow(Math.random(), parameters.randomnessPower) * parameters.radius
    const branchIndex = i % parameters.branches
    const branchAngle = (2 * Math.PI) / parameters.branches

    const randomX =
      (Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness + 5) *
      (Math.random() < 0.5 ? 1 : -1) 
    const randomY =
      (Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness + 5) *
      (Math.random() < 0.5 ? 1 : -1)
    const randomZ =
      (Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness + 5) *
      (Math.random() < 0.5 ? 1 : -1)

    positions[i3] =
      Math.sin(branchIndex * branchAngle - parameters.spin * radius) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] =
      Math.cos(branchIndex * branchAngle - parameters.spin * radius) * radius + randomZ

    const mixedColor = innerColor.clone()
    mixedColor.lerp(outerColor, radius/parameters.radius)
    if(i< 10){
      console.log(mixedColor.r)
    }
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

generateGalaxy()

gui.add(parameters, 'count').min(0).max(10000).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'innerColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outerColor').onFinishChange(generateGalaxy)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

  // Update Galaxy on change

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
