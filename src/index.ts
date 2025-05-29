import App from "template";
import "./index.css";
const canvas = document.querySelector<HTMLCanvasElement>("#root")!;

const app = new App(canvas);
app.testBox();
