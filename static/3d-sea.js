import * as  THREE from "three";

const vertexShader = `
uniform float size;
uniform float scale;
uniform float time;
varying float vFogDepth;

float random(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 st) {
  vec2 integerPart = floor(st);
  vec2 fractionalPart = fract(st);

  float s00 = random(integerPart);
  float s01 = random(integerPart + vec2(0.0, 1.0));
  float s10 = random(integerPart + vec2(1.0, 0.0));
  float s11 = random(integerPart + vec2(1.0, 1.0));

  float dx1 = s10 - s00;
  float dx2 = s11 - s01;
  float dy1 = s01 - s00;
  float dy2 = s11 - s10;

  float alpha = smoothstep(0.0, 1.0, fractionalPart.x);
  float beta = smoothstep(0.0, 1.0, fractionalPart.y);

  return s00 + alpha * dx1 + (1.0 - alpha) * beta * dy1 + alpha * beta * dy2; 
}

void main() {
	gl_PointSize = size;

    vec3 temp = position;
    temp.z = noise(temp.xy + vec2(0.0, time * 0.5)) * 0.3;

    vec4 mvPosition = modelViewMatrix * vec4(temp, 1.0);
    gl_PointSize *= ( scale / - mvPosition.z );

    vFogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}
`

const fragmentShader = `
uniform vec3 diffuse;

uniform float fogNear;
uniform float fogFar;
uniform float fogDensity;
uniform vec3  fogColor;
varying float vFogDepth;

void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);

    gl_FragColor = vec4(mix(diffuse, fogColor, 0.0), 1.4 / vFogDepth);
}
`

// Add a scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0, 5, 10);
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000)

// setup the canvas properly
const canv = document.getElementById('background')
const renderer = new THREE.WebGLRenderer({ canvas: canv })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();
})


// Generate a bunch of points
const geometry = new THREE.BufferGeometry();

const height = 12
const width = 5
const res = 180

const position = new Float32Array(res * res * 3);

for(let i = 0; i < res; i++) {
    for(let j = 0; j < res; j++) {

        const x = width * (2 * j / (res - 1) - 1)
        const y = height * i / (res - 1)

        const ang = Math.random();

        position[(i * res + j) * 3 + 0] = x + (i % 2 == 0 ? width / res : 0)
        position[(i * res + j) * 3 + 1] = y
        position[(i * res + j) * 3 + 2] = 0
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

let material = new THREE.ShaderMaterial(THREE.ShaderLib.points)
material.uniforms.diffuse.value = new THREE.Color(0xFFDA00)
material.uniforms.size.value = 20
material.uniforms.time = {value: 0}
material.defines.USE_SIZEATTENUATION = true
material.fog = true
material.transparent = true
material.fragmentShader = fragmentShader
material.vertexShader = vertexShader

console.log(material.fragmentShader)

const plane = new THREE.Points( geometry, material );
scene.add( plane );

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

camera.position.z = 0.3;
camera.position.y = 1;
camera.rotation.x = Math.PI/2;
camera.rotation.z = -Math.PI/6;

const clock = new THREE.Clock()

function animate() {
    material.uniforms.time.value += clock.getDelta() ;
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
