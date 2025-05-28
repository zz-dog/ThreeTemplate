import { Mesh, PlaneGeometry, TextureLoader } from "three";
import App from "./app";
import { NodeMaterial } from "three/webgpu";

import { vec4, Fn } from "three/tsl";
const app = new App();

const material = new NodeMaterial();
material.colorNode = Fn(() => vec4(1.0, 0.0, 0.0, 1.0))(); // 红色

const plane = new Mesh(new PlaneGeometry(5, 5), material);

app.scene.add(plane);
const textureLoader = new TextureLoader();
