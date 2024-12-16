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
let turnLeft = false;
let turnRight = false;

const speed = 0.1;
const turnSpeed = 0.03;

// Handle Keyboard Input
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowLeft":
      turnLeft = true;
      break;
    case "ArrowRight":
      turnRight = true;
      break;
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
    case "ArrowLeft":
      turnLeft = false;
      break;
    case "ArrowRight":
      turnRight = false;
      break;
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
  if (moveForward) camera.position.z -= speed * Math.cos(camera.rotation.y);
  if (moveForward) camera.position.x -= speed * Math.sin(camera.rotation.y);
  if (moveBackward) camera.position.z += speed * Math.cos(camera.rotation.y);
  if (moveBackward) camera.position.x += speed * Math.sin(camera.rotation.y);
  if (moveLeft) camera.position.x -= speed * Math.cos(camera.rotation.y);
  if (moveLeft) camera.position.z += speed * Math.sin(camera.rotation.y);
  if (moveRight) camera.position.x += speed * Math.cos(camera.rotation.y);
  if (moveRight) camera.position.z -= speed * Math.sin(camera.rotation.y);
  if (turnLeft) camera.rotation.y += turnSpeed;
  if (turnRight) camera.rotation.y -= turnSpeed;

  renderer.render(scene, camera);
}

animate();
