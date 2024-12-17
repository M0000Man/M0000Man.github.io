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
let velocityY = 0; // Vertical velocity for gravity
const gravity = -0.01; // Gravity force
const jumpForce = 0.2; // Jump force

// Mouse Movement Variables
let yaw = 0; // Left/Right rotation (yaw)
let pitch = 0; // Up/Down rotation (pitch)
const player = new THREE.Object3D(); // Player object to encapsulate camera and its orientation
player.add(camera);
scene.add(player); // Add player to the scene

// Set Player's Initial Position
player.position.set(0, 1.5, 5); // Start slightly above the ground and away from the origin

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

    // Apply rotations to the player's quaternion
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, "YXZ")); // "YXZ" applies yaw first, then pitch
    player.quaternion.copy(quaternion);
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
        case "Space": // Jump when space is pressed
            if (isOnGround()) {
                velocityY += jumpForce;
            }
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

// Check if player is on the ground
function isOnGround() {
    return player.position.y <= 1.5; // Check if player's y position is at or below ground level
}

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    // Apply gravity to the player
    velocityY += gravity;

    // Update player's position based on vertical velocity
    player.position.y += velocityY;

    if (player.position.y < 1.5) { // Reset position if below ground level
        player.position.y = 1.5;
        velocityY = 0; // Reset vertical velocity when on the ground
    }

    // Handle Player Movement
    const forward = new THREE.Vector3(0, 0, -1); // Forward direction in local space
    const right = new THREE.Vector3(1, 0, 0); // Right direction in local space

    forward.applyQuaternion(player.quaternion); // Adjust forward direction based on player's quaternion
    right.applyQuaternion(player.quaternion); // Adjust right direction based on player's quaternion

    if (moveForward) player.position.addScaledVector(forward, speed);
    if (moveBackward) player.position.addScaledVector(forward, -speed);
    if (moveLeft) player.position.addScaledVector(right, -speed);
    if (moveRight) player.position.addScaledVector(right, speed);

    renderer.render(scene, camera);
}

animate();
