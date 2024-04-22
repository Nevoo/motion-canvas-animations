import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


const threeScene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
directionalLight.position.z = 0.5;
directionalLight.position.x = 0;
directionalLight.position.y = 5;

threeScene.add(directionalLight);

// const light = new THREE.AmbientLight(0x888888); // soft white light
// threeScene.add(light);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);
let cameraModel : THREE.Group<THREE.Object3DEventMap>;

loader.load('/cam-final-smooth1-transformed.glb', function (gltf) {
    console.log('loaded');
    cameraModel = gltf.scene;
    cameraModel.rotateY(-Math.PI / 2);

    threeScene.add(cameraModel);
    
    // requestAnimationFrame(updateCameraModelPosition);
}, undefined,  (error) => {
    console.log('error');
    console.error(error);
});


const orbit = new THREE.Group();
const camera = new THREE.PerspectiveCamera();
camera.position.set(0, 0, 10);
camera.rotation.set(0, 0, 0);
orbit.add(camera);
threeScene.add(orbit);

let prevTime = Date.now();
let randomOffsetX = 0;
let randomOffsetY = 0;

function updateCameraModelPosition(time: number) {
    const timeDiff = time - prevTime;
    prevTime = time;
  
    const floatingFactor = 0.001; // Adjust this value to control the speed of floating
    const amplitudeX = 0.5; // Adjust the amplitude of the floating motion on the x-axis
    const amplitudeY = 0.3; // Adjust the amplitude of the floating motion on the y-axis
  
    const offsetX = Math.sin(time * floatingFactor) * amplitudeX + randomOffsetX;
    const offsetY = Math.cos(time * floatingFactor) * amplitudeY + randomOffsetY;
  
    // Update the position of the cameraModel
    cameraModel.position.x = offsetX * 0.3;
    cameraModel.position.y = offsetY * 0.3;
  
    // Update the random offsets slowly over time
    randomOffsetX += (Math.random() - 0.5) * 0.0001;
    randomOffsetY += (Math.random() - 0.5) * 0.0001;
  
    // Request the next animation frame
    requestAnimationFrame(updateCameraModelPosition);
  }
  

export {
    cameraModel,
    threeScene,
    camera,
    orbit
};