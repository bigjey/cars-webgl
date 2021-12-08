import {
  Audio,
  AudioListener,
  AmbientLight,
  AudioLoader,
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

// import "./gyroscope";
import { Car } from "./car";

const scoreEl = document.getElementById("score") as HTMLDivElement;
const startEl = document.getElementById("start") as HTMLDivElement;

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

const listener = new AudioListener();
camera.add(listener);

// create a global audio source

// load a sound and set it as the Audio object's buffer
const audioLoader = new AudioLoader();
const files = ["Fluffing-a-Duck.mp3", "pickupCoin.wav"];
const sounds = await Promise.all<Audio>(
  files.map(
    (file) =>
      new Promise((resolve, reject) => {
        audioLoader.load(
          file,
          function (buffer) {
            const sound = new Audio(listener);
            sound.setBuffer(buffer);
            sound.setVolume(0.1);
            resolve(sound);
          },
          function () {},
          function (err) {
            reject(err);
          }
        );
      })
  )
)
  .then((sounds) => {
    startEl.innerText = "Start";

    startEl.addEventListener("click", function () {
      this.remove();
      frame();
      sounds[0].play();
    });

    return sounds;
  })
  .catch((e) => {
    startEl.innerText = e.toString();
  });

createLights(scene);

const plane = createPlane();
scene.add(plane);

const car = new Car();
scene.add(car.object);

addDecorations(scene);

const collectibles = addCollectibles(scene);

const clock = new Clock();

let score = 0;

function frame() {
  window.requestAnimationFrame(frame);

  const dt = clock.getDelta();

  car.update(dt);

  for (const c of collectibles) {
    if (!c.visible) {
      continue;
    }

    const d =
      Math.pow(c.position.x - car.object.position.x, 2) +
      Math.pow(c.position.y - car.object.position.y, 2) +
      Math.pow(c.position.z - car.object.position.z, 2);

    if (d < 10 * 10) {
      scene.remove(c);
      score++;
      c.visible = false;
      scoreEl.innerText = score.toString();
      if (sounds[1].isPlaying) {
        sounds[1].stop();
      }
      sounds[1].play(0);
    }
  }

  camera.position.set(
    car.object.position.x + CAMERA_OFFSET.x,
    car.object.position.y + CAMERA_OFFSET.y,
    car.object.position.z + CAMERA_OFFSET.z
  );

  // gsap.to(camera.position, {
  //   x: car.object.position.x + CAMERA_OFFSET.x,
  //   y: car.object.position.y + CAMERA_OFFSET.y,
  //   z: car.object.position.z + CAMERA_OFFSET.z,
  //   duration: 1,
  // });

  plane.position.set(car.object.position.x, 0, car.object.position.z);

  renderer.render(scene, camera);
}

let cameraHeight = 150;

function updateCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  const width = cameraHeight * aspect;

  camera.left = width / -2;
  camera.right = width / 2;
  camera.top = cameraHeight / 2;
  camera.bottom = cameraHeight / -2;

  camera.updateProjectionMatrix();
}

updateCamera();

camera.position.set(-100, 200, 200);

camera.lookAt(0, 0, 0);

window.addEventListener("resize", function () {
  updateCamera();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("wheel", function (e: WheelEvent) {
  cameraHeight = Math.max(50, cameraHeight + Math.sign(e.deltaY) * 50);
  cameraHeight = Math.min(500, cameraHeight);
  updateCamera();
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
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const z = (Math.random() - 0.5) * 1500;
    const r = Math.random() * Math.PI * 2;
    const size = 5 + Math.random() * 20;
    const cube = createBox(x, z, size);

    cube.rotation.y = r;

    scene.add(cube);
  }
}

function addCollectibles(scene: Scene): Object3D[] {
  const list: Object3D[] = new Array(200);
  for (let i = 0; i < list.length; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const z = (Math.random() - 0.5) * 1500;
    const c = createCollectible(x, z);

    scene.add(c);

    list[i] = c;
  }
  return list;
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

function createCollectible(x: number, z: number): Object3D {
  const geometry = new BoxBufferGeometry(4, 4, 4);
  const material = new MeshLambertMaterial({
    color: 0x00aa00,
  });
  const sphere = new Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.position.set(x, 3, z);
  return sphere;
}
