// Parameters for Eudoxus's Model
const params = {
  speedFactor: 0.005,       // Overall speed multiplier for celestial motions
  earthRadius: 5,           // Radius of Earth (center of the universe in the model)
  sphereOpacity: 0.2,       // Opacity for the transparent wireframe spheres
  labelSize: 3              // Size of the labels
};

// Scene & Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 50, 70); // Adjusted position to better view the geocentric model

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Ambient Light to illuminate the scene uniformly
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Earth's Static Mesh at the Center
const earthGeometry = new THREE.SphereGeometry(params.earthRadius, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

// Group to hold all celestial spheres and motions
const celestialGroups = new THREE.Group();
scene.add(celestialGroups);

// Define celestial bodies with spheres based on Eudoxus's system
const celestialBodies = [
  { name: 'Sun', spheres: 3, primaryRadius: 20, primarySpeed: 0.02, inclination: 0 },
  { name: 'Mercury', spheres: 3, primaryRadius: 22, primarySpeed: 0.047, inclination: 0.046 }, // Inclination ~ 2°
  { name: 'Venus', spheres: 3, primaryRadius: 24, primarySpeed: 0.036, inclination: 0.044 }, // Inclination ~ 3°
  { name: 'Earth', spheres: 1, primaryRadius: 5, primarySpeed: 0 }, // Earth is stationary
  { name: 'Moon', spheres: 3, primaryRadius: 6, primarySpeed: 0.055, inclination: 0.05 }, // Approximate
  { name: 'Mars', spheres: 4, primaryRadius: 26, primarySpeed: 0.017, inclination: 0.34 }, // Inclination ~ 5°
  { name: 'Jupiter', spheres: 4, primaryRadius: 30, primarySpeed: 0.0083, inclination: 0.215 }, // Approximate
  { name: 'Saturn', spheres: 4, primaryRadius: 34, primarySpeed: 0.0061, inclination: 0.06 } // Approximate
];

celestialBodies.forEach(body => {
  // Group for each celestial body
  const bodyGroup = new THREE.Group();
  celestialGroups.add(bodyGroup);

  // Create concentric spheres based on Eudoxus's model
  for (let i = 0; i < body.spheres; i++) {
    const layerRadius = body.primaryRadius + (i * 2); // Increase radius for each layer
    const layerMaterial = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xffcc00 : 0x00ccff,
      transparent: true,
      opacity: params.sphereOpacity,
      wireframe: true
    });
    const layerGeometry = new THREE.SphereGeometry(layerRadius, 64, 64);
    const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
    bodyGroup.add(layerMesh);

    // Store rotation speed in userData
    layerMesh.userData = { speed: body.primarySpeed / (i + 1) }; // Different speed for each layer
  }

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
  labelSprite.scale.set(params.labelSize, params.labelSize / 2, 1);
  labelSprite.position.set(body.primaryRadius + 3, 0, 0);
  bodyGroup.add(labelSprite);

  // Create hippopede motion if applicable (for Mars and outer planets)
  if (body.name === 'Mars') {
    createHippopede(bodyGroup, body.primaryRadius, 34); // Inclination ~ 34° for Mars
  }
});

// Function to create the hippopede motion
function createHippopede(group, radius, inclination) {
  const hippopedeGeometry = new THREE.BufferGeometry();
  const points = [];
  const angleStep = Math.PI / 180; // Step size in radians

  // Define the hippopede curve based on the inclination
  for (let theta = 0; theta < Math.PI * 2; theta += angleStep) {
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta) * Math.sin(inclination); // Adjust for inclination
    const z = radius * Math.sin(theta) * Math.cos(inclination); // Adjust for inclination
    points.push(x, y, z);
  }

  hippopedeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  const hippopedeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const hippopedeLine = new THREE.Line(hippopedeGeometry, hippopedeMaterial);
  group.add(hippopedeLine);
}

// Animate Function
function animate() {
  requestAnimationFrame(animate);

  // Rotate each celestial group's spheres
  celestialGroups.children.forEach(group => {
    group.children.forEach(layer => {
      layer.rotation.y += params.speedFactor * layer.userData.speed;
    });
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
