import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

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
 * Model Loader?
 */
const gltfLoader = new GLTFLoader()
let duck = null
gltfLoader.load('/models/Duck/glTF/Duck.gltf', function (gltf) {
  // duck =
  duck = gltf.scene.children[0]
  scene.add(gltf.scene)

  gltf.animations // Array<THREE.AnimationClip>
  gltf.scene // THREE.Group
  gltf.scenes // Array<THREE.Group>
  gltf.cameras // Array<THREE.Camera>
  gltf.asset // Object
})

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

// Duck

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster(new THREE.Vector3(-3, 0, 0), new THREE.Vector3(1, 0, 0))
// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', (event) => {
  if (currentIntersect) {
    currentIntersect.material.color.set('green')
    console.log(currentIntersect.material.color)
    console.log('clicking')
  }
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
 * Lights
 */
const ambientLights = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLights)

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

let currentIntersect = null

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Make objects move in wave-like motion
  object1.position.y = Math.sin(elapsedTime)
  object2.position.y = Math.sin(elapsedTime + Math.PI * 0.6)
  object3.position.y = Math.sin(elapsedTime + Math.PI * 1.3)

  /**
   * Raycaster
   */
  raycaster.setFromCamera(mouse, camera)

  // const rayOrigin = new THREE.Vector3(-3, 0, 0)
  // const rayDirection = new THREE.Vector3(1, 0, 0)
  // rayDirection.normalize()

  // raycaster.set(rayOrigin, rayDirection)
  // let objectToTest = []
  // if (duck !== null) {
  //   objectToTest = duck
  // }
  let intersect = []
  if (duck) {
    console.log
    intersect = raycaster.intersectObject(duck)
    duck.scale.x -= 0.01 * (duck.scale.x - 0.05)
    duck.scale.y -= 0.01 * (duck.scale.y - 0.05)
    duck.scale.z -= 0.01 * (duck.scale.z - 0.05)
  }

  if (intersect.length) {
    // intersect.object.scale.set(intersect.object.scale * 1.2)
    intersect[0].object.scale.x *= 1.001
    intersect[0].object.scale.y *= 1.001
    intersect[0].object.scale.z *= 1.001
  } 


  // for (const intersect of intersects) {
  //   intersect.object.material.color.set('#0000ff')
  //   if (!currentIntersect) {
  //     console.log('enter event')
  //   }
  //   currentIntersect = intersect.object
  // }

  // if (intersects.length === 0 && currentIntersect) {
  //   currentIntersect = null
  //   console.log('leave event')
  // }

  // // objectsToTest.forEach(object => {
  // //   intersects.forEach(intersects => {
  // //     if (object == intersects.object){
  // //       object.material.color.set('green')
  // //     } else {
  // //       object.material.color.set('red')

  // //     }
  // //   })
  // // })

  // console.log(intersects.length)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
