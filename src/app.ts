import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
} from "three";
import { WebGPURenderer } from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "stats-gl";
class App {
  sizes = {
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
  readonly TargetCanvas = document.querySelector(
    "canvas.webgpu"
  ) as HTMLCanvasElement;

  readonly camera = new PerspectiveCamera(75, this.sizes.aspect(), 0.1, 1000);
  readonly scene = new Scene();
  readonly renderer = new WebGPURenderer({
    canvas: this.TargetCanvas,
    antialias: true,
  });
  readonly orbitControls = new OrbitControls(this.camera, this.TargetCanvas);
  readonly stats = new Stats();
  constructor() {
    this.scene.add(this.camera);
    this.camera.position.set(0, 0, 5);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // const box = this.testBox();
    this.resize();
    document.body.appendChild(this.stats.dom);

    this.orbitControls.enableDamping = true;

    this.renderer.setAnimationLoop(() => {
      this.animate();
    });
  }
  testBox() {
    const Box = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
    return Box;
  }
  animate() {
    this.stats.update();
    this.orbitControls.update();
    this.renderer.renderAsync(this.scene, this.camera);
  }
  resize() {
    window.addEventListener("resize", () => {
      this.sizes.update();

      this.camera.aspect = this.sizes.aspect();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.sizes.width, this.sizes.height);
    });
  }
}

export default App;
