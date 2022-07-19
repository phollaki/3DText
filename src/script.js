import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
// console.log(typefaceFont)
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
 * Textures
 */
 const textureLoader = new THREE.TextureLoader()
 const donutTexture = textureLoader.load('/textures/matcaps/1.png')
const textTexture = textureLoader.load('/textures/matcaps/1.png')
/**
 * Font
 */
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font)=>{
    const textGeometry = new TextGeometry(
        'Hello Three.js',
        {
            font:font,
            size:0.5,
            height:0.4,
            curveSegments:3,
            bevelEnabled: true,
            bevelSize:0.03,
            bevelOffset:0,
            bevelThickness: 0.03,
            bevelSegments: 4,
        }
    )
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x * 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.y * 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z * 0.03) * 0.5
    // )
    textGeometry.center()
    const textMaterial = new THREE.MeshMatcapMaterial({matcap:textTexture})
    // textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry,textMaterial)
    scene.add(text)

    // console.time('donuts')
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const donutMaterial = new THREE.MeshMatcapMaterial({matcap:donutTexture})

    for (let i = 0; i < 80; i++) {
        const donut = new THREE.Mesh(donutGeometry,donutMaterial)
        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        donut.rotation.y = (Math.random() - 0.5) * 10
        donut.rotation.x = (Math.random() - 0.5) * 10

        const random = Math.random()
        donut.scale.set(random,random,random)
        // donut.scale.x = random
        // donut.scale.y = random
        // donut.scale.z = random

        scene.add(donut)
    }
    // console.timeEnd('donuts')
})

/**
 * Axes
 */
const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)


/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 1
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()