import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const threeScene = new THREE.Scene();

const planeGeometry = new THREE.PlaneGeometry(1, 1, 8);
const material = new THREE.MeshPhongMaterial({color: 0x4444444});
const planeMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.position.set(-1, 1, 0);
threeScene.add(plane);

const materialO = new THREE.MeshLambertMaterial({
  color: 0xFFFFFF,
  opacity: 1,
  transparent: true,
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.z = 20;
directionalLight.position.x = -20;
directionalLight.position.y = 20;
threeScene.add(directionalLight);

const light = new THREE.AmbientLight(0x888888); // soft white light
threeScene.add(light);

const arrowSize = 2;
function makeArrow(description: string): [THREE.Group, THREE.MeshBasicMaterial] {
  const arrowMaterial = new THREE.MeshBasicMaterial({color: 0xff6470});
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.2, 32),
    arrowMaterial,
  );
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, arrowSize, 32),
    arrowMaterial,
  );
  cone.position.setY(arrowSize + 0.1);
  cylinder.position.setY(arrowSize / 2);

  const arrow = new THREE.Group();
  arrow.add(cone, cylinder);

  buildText(description, arrow);

  return [arrow, arrowMaterial];
}

function buildText(text: string, arrow: THREE.Group): THREE.Mesh {
  const loader = new FontLoader();
  let textMesh: THREE.Mesh;
  loader.load('/fonts/Gilroy/Gilroy.json', (font) => {
    const geometry = new TextGeometry(text, {
      font: font,
      size: 0.5,
      height: 0.01,
      curveSegments: 12,
      bevelEnabled: false,
    });

    textMesh = new THREE.Mesh(geometry, materialO);
    threeScene.add(textMesh);

    textMesh.position.setY(arrowSize);
    textMesh.position.setX(0.5);
    textMesh.position.setZ(-0.5);

    arrow.add(textMesh);
  });

  return textMesh;
}

const [arrowA, arrowMaterialA] = makeArrow('Y');
const [arrowB, arrowMaterialB] = makeArrow('Z');
const [arrowC, arrowMaterialC] = makeArrow('X');

arrowA.rotation.set(Math.PI / 2, 0, 0);
arrowA.position.setY(0);
arrowA.scale.setScalar(0);

arrowB.rotation.set(Math.PI / 2, 0, 0);
arrowB.position.setX(0);
arrowB.scale.setScalar(0);

arrowC.rotation.set(Math.PI / 2, 0, 0);
arrowC.position.setY(0);
arrowC.scale.setScalar(0);


const arrows = new THREE.Group();
// arrows.add(arrowA, arrowB, arrowC);
threeScene.add(arrows, arrowA, arrowB, arrowC);

const orbit = new THREE.Group();
const camera = new THREE.PerspectiveCamera();
camera.position.set(0, 2, 10);
camera.rotation.set(-0.2, 0, 0);
orbit.add(camera);
threeScene.add(orbit);
// camera.lookAt(new THREE.Vector3(0, 0, 0));

export {
  threeScene,
  camera,
  arrows,
  orbit,
  arrowA,
  arrowB,
  arrowC,
  arrowMaterialA,
  arrowMaterialB,
  arrowMaterialC,
  plane,
};
