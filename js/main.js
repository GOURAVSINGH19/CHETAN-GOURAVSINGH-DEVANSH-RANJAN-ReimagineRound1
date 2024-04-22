//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// gui
// import datGui from 'https://cdn.skypack.dev/dat.gui';

const canvas = document.querySelector(".canvas");

//Create a Three.JS Scene
const scene = new THREE.Scene();
// const gui = new datGui.GUI();

// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('./static/textures/particles/4.png')

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = "cola_can";
//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();
//Load the file
loader.load(`models/${objToRender}/scene.gltf`, function (gltf) {
  //If the file is loaded, add it to the scene
  object = gltf.scene;
  object.position.set(0, -0.2, 0);
  object.rotation.set(-0.3, 0, -0.1);
  object.scale.set(2, 2, 2);
  object.castShadow = true;
  scene.add(object);

  gsap.from(object.position, {
    duration: 1,
    y: 0,
    onComplete: () => {
      gsap.from({ y: 100, ease: "power2.inOut", opacity: 0 });
    },
  });
});

//Create a particles
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;
const position = new Float32Array(count * 3);
const Colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 10;
  Colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(position, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(Colors, 3));

const particlesMaterial = new THREE.PointsMaterial();
// particlesMaterial.map = texture
particlesMaterial.size = 0.04;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = THREE.VertexColors;
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

//Add lights to the scene, so we can actually see the 3D model

const ambientLight = new THREE.AmbientLight("white", 8);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight(0xffffff, 5, 100, 0.2, 0.3);
spotlight.position.set(-2, 1, 0);
spotlight.castShadow = true;
scene.add(spotlight);

const directionalLight = new THREE.DirectionalLight("white", 5);
directionalLight.position.set(2, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);
// gui.add(directionalLight,'intensity').min(.01).max(5)

const pointLight = new THREE.PointLight("white", 5, 100, 1);
pointLight.position.set(-0.2, -1.2, 0);
pointLight.rotation.set(0, -1, -0.2);
scene.add(pointLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  5,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.set(-10, 3, 6);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.enableZoom = false;
control.minDistance = 2;
control.maxDistance = 20;
control.minPolerAngle = 0.5;
control.maxPolerAngle = 1.5;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  // alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("black")
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  control.update();



  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
