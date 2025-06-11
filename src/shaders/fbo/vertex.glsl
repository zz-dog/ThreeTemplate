varying vec2 vUv;

void main (){
  vec4 positionModel =   vec4(position, 1.0) ;
  vec4 viewModel= viewMatrix * positionModel;
  vec4 projectionModel = projectionMatrix * viewModel;

//uv
vUv = uv;

  gl_Position = projectionModel;
}