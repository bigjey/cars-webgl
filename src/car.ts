import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshPhongMaterial,
  Object3D,
} from "three";
import { keys } from "./keyboard";

const MAX_VELOCITY = 4;
const MAX_TURN_ANGLE = Math.PI / 4;

export class Car {
  object: Object3D;

  velocity: number = 0;
  accelleration: number = 0;
  turn: number = 0;

  constructor() {
    this.object = this.createObject();
  }

  update(dt: number) {
    if (keys["KeyA"]) {
      this.turn = Math.min(MAX_TURN_ANGLE, this.turn + 0.1);
      this.turn = Math.max(-MAX_TURN_ANGLE, this.turn);
    } else if (keys["KeyD"]) {
      this.turn = Math.min(MAX_TURN_ANGLE, this.turn - 0.1);
      this.turn = Math.max(-MAX_TURN_ANGLE, this.turn);
    } else {
      this.turn *= 0.8;
      if (Math.abs(this.turn) < 0.01) {
        this.turn = 0;
      }
    }

    if (keys["KeyW"]) {
      this.accelleration = 0.1;
    } else if (keys["KeyS"]) {
      this.accelleration = -0.1;
    } else {
      this.accelleration = 0;
      this.velocity *= 0.95;
      if (Math.abs(this.velocity) < 0.01) {
        this.velocity = 0;
      }
    }
    this.velocity = Math.min(MAX_VELOCITY, this.velocity + this.accelleration);
    this.velocity = Math.max(-MAX_VELOCITY, this.velocity);

    if (this.velocity != 0) {
      if (this.turn != 0) {
        this.object.rotateY(this.turn * this.velocity * dt);
      }
    }

    this.object.translateZ(this.velocity);
  }

  createObject() {
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
      color: 0x119eae,
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
}
