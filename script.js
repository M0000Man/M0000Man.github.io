// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.5; // Eye level

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 }); // Gray ground
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Make it horizontal
scene.add(ground);

// Add Red Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Red
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0); // Place it above the ground
scene.add(cube);

// Add Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Movement Variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const speed = 0.1;

// Mouse Movement Variables
let yaw = 0; // Left/Right rotation
let pitch = 0; // Up/Down rotation
const pitchObject = new THREE.Object3D(); // Separate object for pitch
const yawObject = new THREE.Object3D(); // Separate object for yaw
yawObject.add(pitchObject); // Nest pitch inside yaw
yawObject.add(camera); // Add camera to pitchObject

// Pointer Lock API Setup
const canvas = renderer.domElement;

// Lock the pointer when clicking the canvas
canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});

// Listen for pointer lock changes
document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", onMouseMove);
  } else {
    document.removeEventListener("mousemove", onMouseMove);
  }
});

// Handle mouse movement
function onMouseMove(event) {
  const sensitivity = 0.002; // Adjust this for faster/slower mouse movement
  yaw -= event.movementX * sensitivity; // Horizontal rotation (yaw)
  pitch -= event.movementY * sensitivity; // Vertical rotation (pitch)

  // Clamp pitch to avoid flipping (90 degrees up/down)
  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

  // Update pitch and yaw object rotations
  yawObject.rotation.y = yaw;
  pitchObject.rotation.x = pitch;
}

// Handle Keyboard Input
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      moveForward = true;
      break;
    case "KeyS":
      moveBackward = true;
      break;
    case "KeyA":
      moveLeft = true;
      break;
    case "KeyD":
      moveRight = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
      moveForward = false;
      break;
    case "KeyS":
      moveBackward = false;
      break;
    case "KeyA":
      moveLeft = false;
      break;
    case "KeyD":
      moveRight = false;
      break;
  }
});

// Game Loop
function animate() {
  requestAnimationFrame(animate);

  // Handle Player Movement
  const forward = new THREE.Vector3(0, 0, -1); // Forward direction in local space
  const right = new THREE.Vector3(1, 0, 0); // Right direction in local space
  forward.applyQuaternion(yawObject.quaternion); // Adjust forward direction based on yaw
  right.applyQuaternion(yawObject.quaternion); // Adjust right direction based on yaw

  if (moveForward) yawObject.position.addScaledVector(forward, speed);
  if (moveBackward) yawObject.position.addScaledVector(forward, -speed);
  if (moveLeft) yawObject.position.addScaledVector(right, -speed);
  if (moveRight) yawObject.position.addScaledVector(right, speed);

  renderer.render(scene, camera);
}

animate();
