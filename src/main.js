import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './style.css';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import gsap from 'gsap';
import LocomotiveScroll from 'locomotive-scroll';

let model;
const locomotiveScroll = new LocomotiveScroll();

// Create a scene
const scene = new THREE.Scene();
// Create a camera and position it
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

// Create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Add OrbitControls


// Load HDRI
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/royal_esplanade_1k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  // scene.background = texture;
});

// Load GLTF model
const loader = new GLTFLoader();
loader.load(
    '/DamagedHelmet.gltf', 
    function (gltf) {
        // The model has been loaded successfully
        model = gltf.scene;
        // You can scale, position or rotate the model if needed
        model.scale.set(0.5, 0.5, 0.5); // Scale down the model
        model.position.set(0, 0, 0); // Position the model
        scene.add(model);
    },
    function (xhr) {
        // This function is called while loading is progressing
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        // This function is called if there's an error loading the model
        console.error('An error happened', error);
    }
);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", (e)=>{
  if(model){
    model.rotation.y = (e.clientX / window.innerWidth - .5) * (Math.PI * .12);
    model.rotation.x = (e.clientY / window.innerHeight -.5) * (Math.PI * .12);
    gsap.to(model.rotation, {
      x: rotationY,
      y: rotationX,
      duration: 0.5,
      ease: "power2.Out"
    })
  }
})

// Set up post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.005; // Adjust the amount of RGB shift
composer.addPass(rgbShiftPass);

// Animation loop
function animate() {
  requestAnimationFrame(animate);



  // Render the scene with post-processing
  composer.render();
}

// Start the animation loop
animate();