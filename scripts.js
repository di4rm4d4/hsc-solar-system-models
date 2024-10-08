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

// Define celestial bodies based on Eudoxus's system
const celestialBodies = [
  { name: 'Sun', primaryRadius: 20, secondaryRadius: 15, tertiaryRadius: 5, fourthRadius: 0, primarySpeed: 0.02, secondarySpeed: -0.015, tertiarySpeed: 0.05, fourthSpeed: 0 },
  { name: 'Mars', primaryRadius: 25, secondaryRadius: 18, tertiaryRadius: 5, fourthRadius: 3, primarySpeed: 0.01, secondarySpeed: 0.008, tertiarySpeed: -0.015, fourthSpeed: 0.02 },
  // Add similar entries for other planets as needed
];

celestialBodies.forEach(body => {
  // Group for each celestial body
  const bodyGroup = new THREE.Group();
  celestialGroups.add(bodyGroup);

  // Create concentric spheres for each layer based on Eudoxus's model
  const layers = [
    { radius: body.primaryRadius, speed: body.primarySpeed, color: 0xff0000 },
    { radius: body.secondaryRadius, speed: body.secondarySpeed, color: 0x00ff00 },
    { radius: body.tertiaryRadius, speed: body.tertiarySpeed, color: 0x0000ff },
    { radius: body.fourthRadius, speed: body.fourthSpeed, color: 0xffff00 }
  ];

  let previousSphere = null;

  layers.forEach((layer, index) => {
    if (layer.radius > 0) {
      const layerGeometry = new THREE.SphereGeometry(layer.radius, 64, 64);
      const layerMaterial = new THREE.MeshBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: params.sphereOpacity,
        wireframe: true
      });
      const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);

      // Attach the sphere to the previous sphere if it exists, or to the body group
      if (previousSphere) {
        previousSphere.add(layerMesh);
      } else {
        bodyGroup.add(layerMesh);
      }

      previousSphere = layerMesh;

      // Attach a small "planet" or "Sun" to the innermost sphere to visualize its position
      if (index === layers.length - 1) {
        const planetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: layer.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(layer.radius, 0, 0);
        layerMesh.add(planetMesh);
      }

      // Store rotation speed in userData
      layerMesh.userData = { speed: layer.speed };
    }
  });

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
  labelSprite.position.set(body.primaryRadius + 2, 0, 0);
  bodyGroup.add(labelSprite);
});

// Animate Function
function animate() {
  requestAnimationFrame(animate);

  // Rotate each celestial group's primary, secondary, tertiary, and fourth spheres
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

