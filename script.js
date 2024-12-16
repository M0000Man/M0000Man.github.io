// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.5; // Eye level
camera.position.z = 5;

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
let rotationX = 0; // Up/Down rotation
let rotationY = 0; // Left/Right rotation

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
  rotationY -= event.movementX * sensitivity; // Horizontal (left/right) movement
  rotationX -= event.movementY * sensitivity; // Vertical (up/down) movement

  // Clamp vertical rotation to prevent flipping
  rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));
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

  // Update camera rotation
  camera.rotation.x = rotationX;
  camera.rotation.y = rotationY;

  // Handle Player Movement
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  // Forward/Backward Movement
  if (moveForward) {
    camera.position.addScaledVector(direction, speed);
  }
  if (moveBackward) {
    camera.position.addScaledVector(direction, -speed);
  }

  // Calculate Right and Left movement relative to the camera's orientation
  const right = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
  if (moveLeft) {
    camera.position.addScaledVector(right, -speed);
  }
  if (moveRight) {
    camera.position.addScaledVector(right, speed);
  }

  renderer.render(scene, camera);
}

animate();
