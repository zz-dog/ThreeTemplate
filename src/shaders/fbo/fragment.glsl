varying vec2 vUv;
uniform sampler2D prevTexture;
uniform sampler2D currentTexture;
uniform float uTime;
#include '../common/perlin3D.glsl'

vec4 blendColor (vec4 color1, vec4 color2) {
  vec4 minColor = min(color1, color2);
  return minColor ;
}

vec4 mixBlendColor (vec4 color1, vec4 color2, float i) {
  return mix(color1, color2, i);
}
vec4 resetColor (vec4 color, vec4 newColor) {
  if(color.r < 0.9 && color.g < 0.9 && color.b < 0.9) {
    return vec4(1.0, 1.0, 1.0, 1.0);
  };
  // vec4 reset = step
 
  return newColor;
}


vec4 rainbow(float t) {
    float r = 0.5 + 0.5 * sin(t);
    float g = 0.5 + 0.5 * sin(t + 2.094); // 2π/3
    float b = 0.5 + 0.5 * sin(t + 4.188); // 4π/3
    return vec4(r, g, b,1.0);
}

void main() {
  // vec4 prevColor = texture2D(prevTexture, vUv);
  vec4 currentColor = texture2D(currentTexture, vUv);
  float noise = perlin3D(vec3(vUv * 8.0, uTime ));
  // float noise = perlin3D(vec3(vUv * 8.0, uTime * 0.1));
  vec2 aspect = (noise  + 1.0)* vec2(1.0,1.6) * 0.0003;
  vec4 texel = texture2D(prevTexture, vUv);
  vec4 texel1= texture2D(prevTexture, vec2(vUv.x + aspect.x, vUv.y+ aspect.y));
  vec4 texel2= texture2D(prevTexture, vec2(vUv.x - aspect.x, vUv.y- aspect.y));
  vec4 texel3= texture2D(prevTexture, vec2(vUv.x + aspect.x, vUv.y- aspect.y));
  vec4 texel4= texture2D(prevTexture, vec2(vUv.x - aspect.x, vUv.y+ aspect.y));
vec4 blend1 = blendColor(texel2, texel1);
vec4 blend2 = blendColor(texel3, texel4);
vec4 prevColor = mixBlendColor(blend1, blend2, 0.5);
prevColor = mixBlendColor(texel, prevColor, 0.6);
prevColor  = prevColor.rgba + 0.005;
// prevColor = (prevColor + currentColor) * 0.5;
// prevColor = max(prevColor, currentColor);
vec4 rColor = rainbow( uTime * 0.1);
vec4 reset = resetColor(currentColor, rColor);

  gl_FragColor = min(prevColor, reset);
  //  gl_FragColor =  waterColor(prevColor, currentColor,0.8)
  //  gl_FragColor =  currentColor + prevColor;
}