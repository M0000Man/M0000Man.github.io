// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00); // Set background color to green

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5); // Position the camera to look forward

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera); // Render the scene
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
