// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('earth-container').appendChild(renderer.domElement);

// Create a sphere for Earth
const earthGeometry = new THREE.SphereGeometry(5, 50, 50);

// Load a texture for Earth
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/earth.jpg')
});

// Combine geometry and material to create a mesh
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Add lighting (optional, if you want a more realistic look)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Set up OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional: enable damping for smoother rotation
controls.dampingFactor = 0.05;

// Position the camera to start
camera.position.z = 15;

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Earth
    earthMesh.rotation.y += 0.001;

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

animate();


