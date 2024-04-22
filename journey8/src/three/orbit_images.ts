import * as THREE from 'three';

const threeScene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.z = -5;
directionalLight.position.x = 0;
directionalLight.position.y = 1;
// directionalLight.shadow.camera.top = 1000;
// directionalLight.shadow.camera.bottom = -1000;
// directionalLight.shadow.camera.left = -1000;
// directionalLight.shadow.camera.right = 1000;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 1000;
directionalLight.castShadow = true;


// const helper = new THREE.DirectionalLightHelper(directionalLight, 3);
// threeScene.add(new THREE.CameraHelper(directionalLight.shadow.camera))

threeScene.add(directionalLight);

const orbit = new THREE.Group();
const camera = new THREE.PerspectiveCamera();
camera.position.set(0, 2, 10);
camera.rotation.set(-0.2, 0, 0);
orbit.add(camera);
threeScene.add(orbit);

const planeGeometry = new THREE.BoxGeometry(1, 1, 0.1, 8, 8);
const planeMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});

const planes : THREE.Mesh[] = Array.from({length: 5}, (_, i) => {
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.castShadow = true;
    // plane.rotation.set(0,0,0);
    return plane;
});

const planeGroup = new THREE.Group();
planeGroup.add(...planes);

planeGroup.rotation.set(0, Math.PI / 2, 0);

threeScene.add(planeGroup);

export {
    threeScene,
    camera,
    orbit,
    planes,
    planeGroup,
};