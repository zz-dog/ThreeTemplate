import {
  BoxGeometry,
  Camera,
  Mesh,
  MeshNormalMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats-gl";

import type { CameraType, Config, State } from "./type";
import { Timer } from "three/examples/jsm/Addons.js";

class App {
  readonly sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: () => {
      return this.sizes.width / this.sizes.height;
    },
    update() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
  };
  readonly state: State;
  readonly cameraType: CameraType;
  readonly TargetCanvas: HTMLCanvasElement;
  readonly camera: Camera;
  readonly scene = new Scene();
  readonly renderer: WebGLRenderer;
  readonly orbitControls: OrbitControls;
  readonly stats = new Stats();
  readonly textureLoader = new TextureLoader();
  readonly animateTasks: ((elapsedtime?: number) => void)[] = [];
  readonly clock = new Timer();
  constructor(config: Config) {
    const { targetCanvas, cameraType = "PerspectiveCamera", state } = config;
    this.TargetCanvas = targetCanvas;
    this.cameraType = cameraType;
    this.state = state || {
      enableOrbitControls: true,
      enableStats: true,
      customRender: false,
    };
    this.renderer = new WebGLRenderer({
      canvas: this.TargetCanvas,
      antialias: true,
    });
    this.camera = this.initCamera(this.cameraType);
    this.camera.position.set(0, 0, 5);
    this.orbitControls = new OrbitControls(this.camera, this.TargetCanvas);
    this.init();
  }
  testBox() {
    const Box = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
    this.scene.add(Box);
    return Box;
  }
  animate() {
    this.stats.update();
    this.orbitControls.update();
    const elapsedtime = this.clock.getElapsed();
    this.animateTasks.forEach((task) => {
      task(elapsedtime);
    });
    if (this.state.customRender) {
      return;
    }
    this.renderer.render(this.scene, this.camera);
  }
  addAnimateTask(task: (elapsedtime?: number) => void) {
    this.animateTasks.push(task);
  }
  resize() {
    window.addEventListener("resize", () => {
      this.sizes.update();
      if (this.cameraType === "PerspectiveCamera") {
        (this.camera as PerspectiveCamera).aspect = this.sizes.aspect();
        (this.camera as PerspectiveCamera).updateProjectionMatrix();
      }
      if (this.cameraType === "OrthographicCamera") {
        const aspect = this.sizes.aspect();
        (this.camera as OrthographicCamera).left = -aspect / 2;
        (this.camera as OrthographicCamera).right = aspect / 2;
        (this.camera as OrthographicCamera).top = aspect / 2;
        (this.camera as OrthographicCamera).bottom = -aspect / 2;
        (this.camera as OrthographicCamera).updateProjectionMatrix();
      }
      this.renderer.setSize(this.sizes.width, this.sizes.height);
    });
  }
  init() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.resize();
    document.body.appendChild(this.stats.dom);
    this.orbitControls.enableDamping = true;
    this.renderer.setAnimationLoop((time) => {
      this.clock.update(time);
      this.animate();
    });
  }
  initCamera(type: CameraType) {
    return createCamera(type);
  }
}

const createCamera = (type: CameraType) => {
  switch (type) {
    case "PerspectiveCamera":
      return new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
    case "OrthographicCamera":
      const aspect = window.innerWidth / window.innerHeight;
      return new OrthographicCamera(
        -aspect / 2,
        aspect / 2,
        aspect / 2,
        -aspect / 2,
        0.1,
        1000
      );
    default:
      throw new Error("Unsupported camera type");
  }
};

export default App;
