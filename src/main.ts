import {
  AmbientLight,
  BasicShadowMap,
  BoxBufferGeometry,
  CameraHelper,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Object3D,
  OrthographicCamera,
  PCFShadowMap,
  PCFSoftShadowMap,
  PlaneBufferGeometry,
  Scene,
  WebGLRenderer,
} from "three";

const renderer = new WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas")!,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = BasicShadowMap;

const scene = new Scene();
const camera = createCamera();

createLights(scene);

const plane = createPlane();
scene.add(plane);

const car = createCar();
scene.add(car);

const keys: Record<string, boolean> = {};
window.addEventListener("keydown", function (e) {
  keys[e.code] = true;
});
window.addEventListener("keyup", function (e) {
  keys[e.code] = false;
});

window.requestAnimationFrame(function frame() {
  window.requestAnimationFrame(frame);

  let turn = 0;

  if (keys["KeyA"]) {
    turn = 1;
  } else if (keys["KeyD"]) {
    turn = -1;
  }

  let move = 0;

  if (keys["KeyW"]) {
    move = 1;
  } else if (keys["KeyS"]) {
    move = -1;
  }

  if (move != 0) {
    if (turn != 0) {
      car.rotateY(turn * 0.05);
    }
    car.translateZ(move * 1);
  }

  renderer.render(scene, camera);
});

function createCamera(): OrthographicCamera {
  const aspect = window.innerWidth / window.innerHeight;
  const width = 100;
  const height = width / aspect;

  const camera = new OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2
  );

  camera.position.set(-100, 200, 200);

  camera.lookAt(0, 0, 0);

  return camera;
}

function createCar(): Object3D {
  const car = new Group();

  const frontWheelGeometry = new BoxBufferGeometry(10.6, 4, 4);
  const frontWheelMaterial = new MeshPhongMaterial({
    color: 0x333333,
  });
  const frontWheel = new Mesh(frontWheelGeometry, frontWheelMaterial);
  frontWheel.position.z = 5.5;

  const backWheelGeometry = new BoxBufferGeometry(10.6, 4, 4);
  const backWheelMaterial = new MeshPhongMaterial({
    color: 0x333333,
  });
  const backWheel = new Mesh(backWheelGeometry, backWheelMaterial);
  backWheel.position.z = -5.5;

  const bodyGeometry = new BoxBufferGeometry(10, 5, 20);
  const bodyMaterial = new MeshPhongMaterial({
    color: 0x22aa44,
  });
  const body = new Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 2;
  body.castShadow = true;

  const roofGeometry = new BoxBufferGeometry(8, 5, 10);
  const roofMaterial = new MeshPhongMaterial({
    color: 0xffffff,
  });
  const roof = new Mesh(roofGeometry, roofMaterial);
  roof.position.y = 7;
  roof.position.z = -1;

  car.add(frontWheel);
  car.add(backWheel);
  car.add(body);
  car.add(roof);

  car.position.y = 2;

  return car;
}

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
  directionalLight.shadow.mapSize.width = 1024; // default
  directionalLight.shadow.mapSize.height = 1024; // default
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500; // default

  // const helper = new CameraHelper(directionalLight.shadow.camera);
  // scene.add(helper);

  scene.add(directionalLight);
}
