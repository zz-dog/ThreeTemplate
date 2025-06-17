import App from "template";
import "./index.css";
import "./html";
import {
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  WebGLRenderTarget,
} from "three";
import fboVertex from "./shaders/fbo/vertex.glsl";
import fboFragment from "./shaders/fbo/fragment.glsl";
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

const app = new App({ targetCanvas: canvas, state: { customRender: true } });
// background plane
const plane = new Mesh();
const planeGeometry = new PlaneGeometry(100, 100);
const planeMaterial = new MeshBasicMaterial({
  color: "skyblue",
});
plane.geometry = planeGeometry;
plane.material = planeMaterial;
// plane.visible = false;

//sphere
const sphereGeometry = new SphereGeometry(0.1, 32, 32);
const sphereMaterial = new MeshBasicMaterial({
  color: "#FFE74C",
});
const sphere = new Mesh(sphereGeometry, sphereMaterial);
app.scene.add(sphere);

//raycaster
const raycaster = new Raycaster();
const pointer = new Vector2();
const onPointerMove = (e: MouseEvent) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
};
window.addEventListener("pointermove", onPointerMove);

const pointerTask = () => {
  raycaster.setFromCamera(pointer, app.camera);
  const intersects = raycaster.intersectObject(plane);
  if (intersects.length > 0) {
    sphere.position.copy(intersects[0].point);
  }
};

app.addAnimateTask(pointerTask);

//renderpipeline
const sourceTarget = new WebGLRenderTarget(app.sizes.width, app.sizes.height);
let targetA = new WebGLRenderTarget(app.sizes.width, app.sizes.height);
let targetB = new WebGLRenderTarget(app.sizes.width, app.sizes.height);
const fboScene = new Scene();
const fboCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
// const fboMaterial = new NodeMaterial();
const fboMesh = new Mesh(
  new PlaneGeometry(2, 2),
  new ShaderMaterial({
    vertexShader: fboVertex,
    fragmentShader: fboFragment,
    uniforms: {
      prevTexture: { value: null },
      currentTexture: { value: targetB.texture },
      uTime: { value: 0 },
    },
  })
);
fboScene.add(fboMesh);
const finalScne = new Scene();
const finalMesh = new Mesh(
  new PlaneGeometry(2, 2),
  new MeshBasicMaterial({
    map: targetB.texture,
  })
);
finalScne.add(finalMesh);

// app.renderer.setRenderTarget(whiteTarget);
// app.renderer.render(whiteScene, app.camera);

const customRender = (elapsedtime?: number) => {
  // 1. 渲染主场景到 sourceTarget
  app.renderer.setRenderTarget(sourceTarget);
  app.renderer.render(app.scene, app.camera);
  // 2. 用上一帧结果 + 当前帧渲染到 targetB
  app.renderer.setRenderTarget(targetA);
  app.renderer.render(fboScene, fboCamera);
  fboMesh.material.uniforms.prevTexture.value = targetA.texture;
  fboMesh.material.uniforms.currentTexture.value = sourceTarget.texture;
  fboMesh.material.uniforms.uTime.value = elapsedtime || 0;
  // 3. 屏幕渲染
  finalMesh.material.map = targetA.texture;

  app.renderer.setRenderTarget(null);
  app.renderer.render(fboScene, fboCamera);
  // app.renderer.render(whiteScene, app.camera);
  // 4. 交换 prevTarget 和 targetB
  let temp = targetA;
  targetA = targetB;
  targetB = temp;
};

app.addAnimateTask(customRender);
