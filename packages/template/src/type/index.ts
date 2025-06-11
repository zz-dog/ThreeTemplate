type CameraType = "PerspectiveCamera" | "OrthographicCamera";
type State = {
  enableOrbitControls?: boolean;
  enableStats?: boolean;
  customRender?: boolean;
};
type Config = {
  targetCanvas: HTMLCanvasElement;
  cameraType?: CameraType;
  state?: State;
};

export { CameraType, Config, State };
