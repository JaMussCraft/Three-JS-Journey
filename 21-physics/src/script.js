import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON, { Vec3 } from 'cannon'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {
  createSphere: () => {
    createSphere(0.5, { x: 0, y: 0, z: 0 })
  },
  createBox: () => {
    createBox(0.5, { x: 0, y: 0, z: 0 })
  },
  reset: () => {
    objects.forEach(({mesh, body}) => {
      body.removeEventListener('collide', playHitSound)
      world.removeBody(body)
      scene.remove(mesh)
      
    })

    objects.splice(0, objects.length)
  },
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
const objects = []

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

function playHitSound(event) {
  const impactStrength = event.contact.getImpactVelocityAlongNormal()
  console.log(impactStrength)

  if (impactStrength > 1) {
    hitSound.currentTime = 0 // set the playbar to the beginning
    hitSound.play()
  }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png',
])

/**
 * Physics
 */

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

// Materials for bodies
const defaultMaterial = new CANNON.Material('concrete')

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 3,
  restitution: 1,
})
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial
world.allowSleep = true
world.broadphase = new CANNON.SAPBroadphase(world)

// Sphere Body
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   // material: defaultMaterial,
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)

// Floor Body
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
// floorBody.material = defaultMaterial
floorBody.addShape(floorShape)
world.addBody(floorBody)

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
// gsap.to(floor.rotation, {
//   duration: 10,
//   x: '+=3'
// })
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
// camera.position.set(-3, 3, 3)
camera.position.set(6, 6, 6)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
function createSphere(radius, position) {
  // THREE JS Mesh
  const sphereGeometry = new THREE.SphereGeometry(radius, 20, 20)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  })
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh.castShadow = true
  sphereMesh.position.copy(position)
  scene.add(sphereMesh)

  // CANNON Body
  const sphereShape = new CANNON.Sphere(radius)
  const sphereBody = new CANNON.Body({
    mass: 1,
    shape: sphereShape,
    position,
    material: defaultMaterial,
  })
  sphereBody.addEventListener('collide', playHitSound)
  world.addBody(sphereBody)

  objects.push({
    mesh: sphereMesh,
    body: sphereBody,
  })
}
// createSphere(0.5, { x: 0, y: 1, z: 0 })

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
})

function createBox(width, position) {
  // THREE JS Mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.castShadow = true
  mesh.scale.set(width, width, width)
  mesh.position.copy(position)
  scene.add(mesh)

  // CANNON Body
  const shape = new CANNON.Box(new Vec3(width / 2, width / 2, width / 2))
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
    position,
    material: defaultMaterial,
  })
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  objects.push({
    mesh: mesh,
    body: body,
  })
}

/**
 * Animate
 */
const clock = new THREE.Clock()

let oldElapsedTime = 0


const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  /**
   * PHYSICS WORLD
   */

  // apply weak wind to sphereBody
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

  // update physics world
  world.step(1 / 60, deltaTime, 3)

  // Sync THREE JS world with Physics world
  // Update objects
  objects.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position)
    // console.log(mesh.position.y)
    mesh.quaternion.copy(body.quaternion)
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
