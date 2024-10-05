const params = {
  sunIntensity: 1.8,     // Brightness of the sun
  speedFactor: 0.005     // Overall speed multiplier for celestial bodies
};

// Scene & Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('earth-container').appendChild(renderer.domElement);

// OrbitControls for camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Sunlight
const dirLight = new THREE.DirectionalLight(0xffffff, params.sunIntensity);
dirLight.position.set(-50, 0, 30);
scene.add(dirLight);

// Earth's Static Mesh
const textureLoader = new THREE.TextureLoader();
textureLoader.load('land_ocean_ice_8192.png', (texture) => {
  const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
  const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  
  // Earth's Axial Tilt Group
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);  // Axial tilt of the Earth
  earthGroup.add(earthMesh);
  scene.add(earthGroup);

  // Create a rotating Celestial Sphere
  const celestialTextureLoader = new THREE.TextureLoader();
  celestialTextureLoader.load('eso0932a.jpg', (texture) => {
    const celestialSphereGeometry = new THREE.SphereGeometry(40, 64, 64);  // Larger than Earth
    const celestialSphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide  // See the inside of the sphere
    });
    const celestialSphere = new THREE.Mesh(celestialSphereGeometry, celestialSphereMaterial);
    scene.add(celestialSphere);

    // Orbit Group for Celestial Layers
    const celestialLayers = new THREE.Group();

    // Add Spheres for Mercury, Venus, Mars, Jupiter, Saturn, and the Sun
    const layers = [
      { name: 'Mercury', radius: 15, color: 0xaaaaaa, speed: 0.47 },
      { name: 'Venus', radius: 18, color: 0xffcc33, speed: 0.35 },
      { name: 'Mars', radius: 21, color: 0xff3300, speed: 0.25 },
      { name: 'Jupiter', radius: 25, color: 0xff6600, speed: 0.15 },
      { name: 'Saturn', radius: 28, color: 0xffcc00, speed: 0.10 },
      { name: 'Sun', radius: 12, color: 0xffff33, speed: 0.30 },
      { name: 'Moon', radius: 13, color: 0xffffff, speed: 0.55 }
    ];

    layers.forEach((layer) => {
      const layerGeometry = new THREE.SphereGeometry(layer.radius, 64, 64);
      const layerMaterial = new THREE.MeshBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: 0.2,
        wireframe: true
      });
      const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
      layerMesh.rotation.x = THREE.MathUtils.degToRad(23.5);  // Align with Earth's tilt
      celestialLayers.add(layerMesh);

      // Attach a small "planet" to each layer to visualize motion
      const planetGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const planetMaterial = new THREE.MeshBasicMaterial({ color: layer.color });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

      // Position it at the radius of the sphere
      planetMesh.position.set(layer.radius, 0, 0);
      layerMesh.add(planetMesh);
      
      // Animate layer rotation to simulate motion
      layerMesh.userData.speed = layer.speed;
    });

    scene.add(celestialLayers);

    // Animate Function
    function animate() {
      requestAnimationFrame(animate);

      // Celestial Sphere Rotation
      celestialSphere.rotation.y += params.speedFactor * 0.01;

      // Rotate the inner celestial spheres to simulate planetary motion
      celestialLayers.children.forEach((layer) => {
        layer.rotation.y += params.speedFactor * layer.userData.speed;
      });

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
