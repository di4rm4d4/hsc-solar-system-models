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
    { radius: body.tertiaryRadius, speed: body.tertiarySpeed, color: 0x0000ff
