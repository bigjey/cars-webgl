import {
  AmbientLight,
  BasicShadowMap,
  BoxBufferGeometry,
  Clock,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  OrthographicCamera,
  PlaneBufferGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import gsap from "gsap";

// import "./gyroscope";
import { Car } from "./car";

const CAMERA_OFFSET = new Vector3(-100, 200, 200);

const renderer = new WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas")!,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = BasicShadowMap;

const scene = new Scene();
const camera = new OrthographicCamera();

createLights(scene);

const plane = createPlane();
scene.add(plane);

const car = new Car();
scene.add(car.object);

addDecorations(scene);

const clock = new Clock();

window.requestAnimationFrame(function frame() {
  window.requestAnimationFrame(frame);

  const dt = clock.getDelta();

  car.update(dt);

  gsap.to(camera.position, {
    x: car.object.position.x + CAMERA_OFFSET.x,
    y: car.object.position.y + CAMERA_OFFSET.y,
    z: car.object.position.z + CAMERA_OFFSET.z,
    duration: 1,
  });

  renderer.render(scene, camera);
});

function updateCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  const height = 150;
  const width = height * aspect;

  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = height / -2;

  camera.updateProjectionMatrix();
}

updateCamera();

camera.position.set(-100, 200, 200);

camera.lookAt(0, 0, 0);

window.addEventListener("resize", function () {
  updateCamera();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function createPlane(): Mesh<PlaneBufferGeometry, MeshLambertMaterial> {
  const geometry = new PlaneBufferGeometry(1000, 1000);
  const material = new MeshLambertMaterial({
    color: 0x444444,
  });
  const mesh = new Mesh(geometry, material);

  mesh.rotateX(-Math.PI / 2);
  mesh.receiveShadow = true;

  return mesh;
}

function createLights(scene: Scene): void {
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(100, 300, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.camera.left = -1000;
  directionalLight.shadow.camera.right = 1000;
  directionalLight.shadow.camera.top = 1000;
  directionalLight.shadow.camera.bottom = -1000;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;

  // const helper = new CameraHelper(directionalLight.shadow.camera);
  // scene.add(helper);

  scene.add(directionalLight);
}

function addDecorations(scene: Scene): void {
  for (let i = 0; i < 100; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const z = (Math.random() - 0.5) * 1500;
    const r = Math.random() * Math.PI * 2;
    const size = 3 + Math.random() * 10;
    const cube = createBox(x, z, size);

    cube.rotation.y = r;

    scene.add(cube);
  }
}

function createBox(x: number, z: number, size: number): Object3D {
  const geometry = new BoxBufferGeometry(size, size, size);
  const material = new MeshLambertMaterial({
    color: 0xaaaaaa,
  });
  const cube = new Mesh(geometry, material);
  cube.castShadow = true;
  cube.position.set(x, size / 2, z);
  return cube;
}
