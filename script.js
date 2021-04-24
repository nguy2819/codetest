import './css/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//Loader
const loader = new THREE.TextureLoader()
const circle = loader.load('pictures/ODC4U.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( 3.5, 1, 16, 100 );

const particleGeometry = new THREE.BufferGeometry;
const particleCnt = 2000;

const posArray = new Float32Array(particleCnt * 3);

for(let i=0; i < particleCnt * 3; i++){
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 24)
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))


// Materials

const material = new THREE.PointsMaterial( { size: 0.05} );

const particleMaterial = new THREE.PointsMaterial({
    size: 0.03,
    map: circle,
    transparent: true,
    color: '#6CF8FB',
    blending: THREE.AdditiveBlending
})

// Mesh
// const torus = new THREE.Mesh(geometry,material)
const torus = new THREE.Points(geometry, material);
const particlesMesh = new THREE.Points(particleGeometry, particleMaterial)
scene.add(torus, particlesMesh)


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 10
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'))

//Mouse
document.addEventListener('mousemove', animateParicles) 

let mouseY = 0
let mouseX = 0

function animateParicles(event){
    mouseY = event.clientY
    mouseX = event.clientX
}

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    torus.rotation.y = .5 * elapsedTime
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008)
    particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00008)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()