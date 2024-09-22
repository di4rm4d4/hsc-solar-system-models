// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Set the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('cube-container').appendChild(renderer.domElement);

// Create a cube geometry and a basic material, then combine them into a mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);

// Add the cube to the scene
scene.add(cube);

// Move the camera back so we can see the cube
camera.position.z = 5;

// Create an animation loop to render the scene and animate the cube
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube for some basic animation
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resizing to make the canvas responsive
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
