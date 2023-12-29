import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Stats from 'stats.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

// FPS monitor
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new GUI({
  width: 400,
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()
const bakedTexture = textureLoader.load('cameraBaked.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
// const portalMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
const portalMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  uniforms: {
    uTime: { value: 0 },
  },
})

const lampLightMaterial = new THREE.MeshBasicMaterial({ color: 0xe3df64 })

/**
 * Model
 */
gltfLoader.load('portal.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.traverse((child) => {

    if (child.name === 'Circle') {
      child.material = portalMaterial
    } else if (child.name === 'Cube014' || child.name === 'Cube010') {
      child.material = lampLightMaterial
    } else {
      child.material = bakedMaterial
    }
  })
  scene.add(gltf.scene)
})

/**
 * Fireflies
 */
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++)
{
  positionArray[i * 3 + 0] = Math.random() * 4 - 2
  positionArray[i * 3 + 1] = Math.random() * 2
  positionArray[i * 3 + 2] = Math.random() * 4 - 2

  scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1))


// const firefliesMaterial = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true })
const firefliesMaterial = new THREE.ShaderMaterial({
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  uniforms: {
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2)},
    uSize: { value: 150 },
    uTime: { value: 0 },
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(10).max(500).step(0.5).name('firefliesSize')


const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

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
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = 0xc1ecbb
renderer.setClearColor(debugObject.clearColor)
gui.addColor(debugObject, 'clearColor')
.onChange(() => {
     renderer.setClearColor(debugObject.clearColor)
   })

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  firefliesMaterial.uniforms.uTime.value = elapsedTime
  portalMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)

  stats.end()
}

tick()
