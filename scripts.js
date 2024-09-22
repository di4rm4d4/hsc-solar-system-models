// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('cube-container').appendChild(renderer.domElement);

// Add OrbitControls to allow mouse interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create a cube geometry and material, then combine them into a mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Move the camera back so we can see the cube
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls so user interaction is reflected
    controls.update();

    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

