import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshPhongMaterial,
  Object3D,
} from "three";
import { keys } from "./keyboard";

const MAX_VELOCITY = 4;
const VELOCITY_ACCELLERATION = 7;
const VELOCITY_ACCELLERATION_DAMPING = 0.75;

const MAX_TURN_ANGLE = 85 * (Math.PI / 180); // 60 deg
const TURN_ACCELLERATION = 15;
const TURN_ACCELLERATION_DAMPING = 0.3

export class Car {
  object: Object3D;

  velocity: number = 0;
  accelleration: number = 0;
  turn: number = 0;

  constructor() {
    this.object = this.createObject();
  }

  update(dt: number) {
    const left = keys["KeyA"] || keys["left"] || keys["ArrowLeft"];
    const right = keys["KeyD"] || keys["right"] || keys["ArrowRight"];
    const up = keys["KeyW"] || keys["accellerate"] || keys["ArrowUp"];
    const down = keys["KeyS"] || keys["break"] || keys["ArrowDown"];

    if (left) {
      this.turn = Math.min(MAX_TURN_ANGLE, this.turn + TURN_ACCELLERATION * dt);
      this.turn = Math.max(-MAX_TURN_ANGLE, this.turn);
    } else if (right) {
      this.turn = Math.min(MAX_TURN_ANGLE, this.turn - TURN_ACCELLERATION * dt);
      this.turn = Math.max(-MAX_TURN_ANGLE, this.turn);
    } else {
      this.turn *= TURN_ACCELLERATION_DAMPING;
      if (Math.abs(this.turn) < 0.01) {
        this.turn = 0;
      }
    }

    if (up) {
      this.accelleration = VELOCITY_ACCELLERATION;
    } else if (down) {
      this.accelleration = -VELOCITY_ACCELLERATION;
    } else {
      this.accelleration = 0;
      this.velocity *= VELOCITY_ACCELLERATION_DAMPING;
      if (Math.abs(this.velocity) < 0.01) {
        this.velocity = 0;
      }
    }
    this.velocity = Math.min(
      MAX_VELOCITY,
      this.velocity + this.accelleration * dt
    );
    this.velocity = Math.max(-MAX_VELOCITY, this.velocity);

    if (this.velocity != 0) {
      if (this.turn != 0) {
        this.object.rotateY(this.turn * this.velocity * dt);
      }
      this.object.translateZ(this.velocity);
    }
  }

  get speedIndex() {
    return this.velocity / MAX_VELOCITY;
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
