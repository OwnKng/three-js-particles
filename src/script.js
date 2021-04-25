import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//_ Get canvas html element
const canvas = document.querySelector("canvas.webgl")

//_ Set Dimensions
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//_ Create a scene
const scene = new THREE.Scene()

//_ Add a points
const particles = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
  positions[i] = (Math.random() - 0.5) * 10
}

particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))

//_ Add material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: "#43c5df",
})

// _ Add mesh
const particlesMesh = new THREE.Points(particles, particlesMaterial)
scene.add(particlesMesh)

// _ Add Text
const fontLoader = new THREE.FontLoader()

const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
let text = null

//* Title
fontLoader.load("/fonts/Saira_Regular.json", (font) => {
  const textGeometry = new THREE.TextBufferGeometry("OWEN KING", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 2,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelSegments: 5,
  })

  textGeometry.center()

  text = new THREE.Mesh(textGeometry, textMaterial)

  scene.add(text)
})

//_ Add Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.001,
  1000
)

camera.position.set(0, -0.5, 2)
if (sizes.width < 400) camera.position.z = 5

scene.add(camera)

//_ Add renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor("#151B26", 1)

//_ Add resize events
window.addEventListener("resize", () => {
  //* Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //* Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  //* Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//_ Add controls
const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener("mousemove", (event) => {
  cursor.y = event.clientY / sizes.height - 0.5
})

window.addEventListener("touchmove", (event) => {
  cursor.y = event.touches[0].clientY / sizes.height - 0.5
})

const clock = new THREE.Clock()

//_ Add frame function
const frame = () => {
  //* Update controls
  camera.position.y = cursor.y
  camera.position.x = cursor.y * -1

  if (text !== null) camera.lookAt(text.position)

  //* Animate the particles
  const elapsedTime = clock.getElapsedTime()
  particlesMesh.position.z = Math.sin(elapsedTime)
  particlesMesh.position.x = Math.cos(elapsedTime)
  particlesMesh.position.y = Math.cos(elapsedTime)

  //* Animate the text
  camera.rotation.z = Math.cos(elapsedTime) / 4

  //* Renderer
  renderer.render(scene, camera)

  window.requestAnimationFrame(frame)
}

frame()
