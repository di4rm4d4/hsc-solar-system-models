// Parameters for the scene
const params = {
  sunIntensity: 1.8, // brightness of the sun
  speedFactor: 2.0   // rotation speed of the earth
}

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 30);

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;  // Ensure correct color space
document.getElementById('earth-container').appendChild(renderer.domElement);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Directional Light as a virtual sun
const dirLight = new THREE.DirectionalLight(0xffffff, params.sunIntensity);
dirLight.position.set(-50, 0, 30);
scene.add(dirLight);

// Load Earth's texture and create the mesh
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./Downloads/002.jpg', (texture) => {
  const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
  const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

  // Create a group for the Earth mesh to handle rotation and tilt
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);  // Axial tilt
  earthGroup.add(earthMesh);
  scene.add(earthGroup);

  // GUI for tweaking parameters
  const gui = new dat.GUI();
  gui.add(params, 'sunIntensity', 0.0, 5.0, 0.1).onChange(val => dirLight.intensity = val).name('Sun Intensity');
  gui.add(params, 'speedFactor', 0.1, 20.0, 0.1).name('Rotation Speed');

  // Stats for monitoring performance
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotateY(0.005 * params.speedFactor);  // Rotate the Earth
    controls.update();
    stats.update();
    renderer.render(scene, camera);
  }
  animate();
});

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});



