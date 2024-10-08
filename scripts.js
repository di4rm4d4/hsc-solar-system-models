// Parameters for Eudoxus's Model
const params = {
  celestialIntensity: 1.8, // Brightness of celestial bodies like the Sun
  speedFactor: 0.005       // Overall speed multiplier for celestial motions
};

// Scene & Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 30, 50); // Adjusted position to better view the geocentric model

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('earth-container').appendChild(renderer.domElement);

// OrbitControls for camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Ambient Light to illuminate the scene uniformly
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Earth's Static Mesh at the Center
const textureLoader = new THREE.TextureLoader();
textureLoader.load('land_ocean_ice_8192.png', (texture) => {
  const earthGeometry = new THREE.SphereGeometry(5, 64, 64); // Reduced size for center
  const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  // Create a group for all celestial spheres (planets, Sun, Moon)
  const celestialGroups = new THREE.Group();
  scene.add(celestialGroups);

  // Define celestial bodies with their respective parameters
  const celestialBodies = [
    { name: 'Sun', color: 0xffff33, primaryRadius: 12, epicycleRadius: 2, primarySpeed: 0.02, epicycleSpeed: 0.05 }, // Increased Sun size
    { name: 'Mercury', color: 0xaaaaaa, primaryRadius: 12, epicycleRadius: 1.5, primarySpeed: 0.04, epicycleSpeed: 0.06 },
    { name: 'Venus', color: 0xffcc33, primaryRadius: 14, epicycleRadius: 1.8, primarySpeed: 0.03, epicycleSpeed: 0.05 },
    { name: 'Mars', color: 0xff3300, primaryRadius: 16, epicycleRadius: 1.6, primarySpeed: 0.025, epicycleSpeed: 0.045 },
    { name: 'Jupiter', color: 0xff6600, primaryRadius: 18, epicycleRadius: 2.2, primarySpeed: 0.015, epicycleSpeed: 0.035 },
    { name: 'Saturn', color: 0xffcc00, primaryRadius: 20, epicycleRadius: 2.5, primarySpeed: 0.01, epicycleSpeed: 0.03 },
    { name: 'Moon', color: 0xffffff, primaryRadius: 8, epicycleRadius: 1.2, primarySpeed: 0.05, epicycleSpeed: 0.07 }
  ];

  celestialBodies.forEach(body => {
    // Group for each celestial body
    const bodyGroup = new THREE.Group();
    celestialGroups.add(bodyGroup);

    // Primary Sphere: Transparent and wireframe
    const primaryGeometry = new THREE.SphereGeometry(body.primaryRadius, 32, 32);
    const primaryMaterial = new THREE.MeshBasicMaterial({
      color: body.color,
      transparent: true,
      opacity: 0.2,          // Make it see-through
      wireframe: true        // Enable wireframe for visual clarity
    });
    const primaryMesh = new THREE.Mesh(primaryGeometry, primaryMaterial);
    bodyGroup.add(primaryMesh);

    // Epicycle Sphere: Retain previous settings
    const epicycleGeometry = new THREE.SphereGeometry(body.epicycleRadius, 16, 16);
    const epicycleMaterial = new THREE.MeshBasicMaterial({
      color: body.color,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    const epicycleMesh = new THREE.Mesh(epicycleGeometry, epicycleMaterial);
    epicycleMesh.position.set(body.primaryRadius, 0, 0); // Position on the primary sphere
    primaryMesh.add(epicycleMesh);

    // Add a small "planet" to the epicycle for visualization
    const planetGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(body.epicycleRadius, 0, 0); // Position on the epicycle
    epicycleMesh.add(planetMesh);

    // Create a label for each celestial body
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.fillText(body.name, 0, 20);
    
    // Use canvas as texture for the label sprite
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);

    labelSprite.scale.set(5, 2.5, 1); // Adjust label size
    labelSprite.position.set(body.primaryRadius + 1, 0, 0); // Position label near the primary sphere
    primaryMesh.add(labelSprite);

    // Store rotation speeds in userData
    bodyGroup.userData = {
      primarySpeed: body.primarySpeed,
      epicycleSpeed: body.epicycleSpeed
    };
  });

  // Animate Function
  function animate() {
    requestAnimationFrame(animate);

    // Rotate each celestial group's primary sphere
    celestialGroups.children.forEach(group => {
      group.rotation.y += params.speedFactor * group.userData.primarySpeed;

      // Rotate the epicycle spheres
      group.children.forEach(child => {
        if (child.children.length > 0) { // Epicycle mesh
          child.rotation.y += params.speedFactor * group.userData.epicycleSpeed;
        }
      });
    });

    controls.update();
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
