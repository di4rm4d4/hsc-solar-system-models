// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);  // Set a background color for contrast
document.getElementById('cube-container').appendChild(renderer.domElement);

// Create OrbitControls to allow user to interact with the cube
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create a cube geometry and material, then combine them into a mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });  // Basic material that doesn't require lighting
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Move the camera back so we can see the cube
camera.position.set(0, 0, 10);  // Move camera back 10 units
camera.lookAt(0, 0, 0);         // Point camera at the center of the scene (where the cube is)

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube for better visibility
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Update controls to reflect user interaction
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}
animate();

// Handle window resize to keep the aspect ratio correct
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
