// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Add a Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red cube
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Grid Helper for Reference
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01; // Rotate the cube for visibility
    cube.rotation.y += 0.01;
    renderer.setClearColor(0x000000); // Set background to black
    renderer.render(scene, camera);
    }
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
