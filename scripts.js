// eudoxusModel.js

// Import necessary modules from THREE
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/controls/OrbitControls.js';

const params = {
  speedFactor: 0.005,
  earthRadius: 5,
  sphereOpacity: 0.2,
  labelSize: 3
};

// Function to initialize and start the model
export function initModel(container) {
  // Scene & Renderer Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 1000);
  camera.position.set(0, 50, 70);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  function resizeRenderer() {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  const textureLoader = new THREE.TextureLoader();
  const earthGeometry = new THREE.SphereGeometry(params.earthRadius, 64, 64);
  textureLoader.load(
    'land_ocean_ice_8192.png',
    (texture) => {
      const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
      const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earthMesh);
    },
    undefined,
    (error) => {
      console.error('Texture load error:', error);
    }
  );

  const celestialBodies = [
    { name: 'Sun', radius: 20, speed: 0.02, color: 0xffff00, tilt: Math.PI / 180 * 7, bodyRadius: 0.8 },
    { name: 'Moon', radius: 6, speed: 0.055, color: 0xcccccc, tilt: Math.PI / 180 * 5, bodyRadius: 0.5 },
    { name: 'Mercury', radius: 22, speed: 0.047, color: 0xaaaaaa, tilt: Math.PI / 180 * 7, bodyRadius: 0.5 }
  ];

  const planetObjects = {};

  celestialBodies.forEach(body => {
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    const layerGeometry = new THREE.SphereGeometry(body.radius, 64, 64);
    const layerMaterial = new THREE.MeshBasicMaterial({
      color: body.color,
      transparent: true,
      opacity: params.sphereOpacity,
      wireframe: true
    });
    const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
    bodyGroup.add(layerMesh);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.fillText(body.name, 0, 20);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.scale.set(params.labelSize, params.labelSize / 2, 1);
    labelSprite.position.set(body.radius + 3, 0, 0);
    bodyGroup.add(labelSprite);

    const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(body.radius, 0, 0);
    bodyGroup.add(planetMesh);

    planetObjects[body.name] = { mesh: planetMesh, radius: body.radius, tilt: body.tilt, speed: body.speed, label: labelSprite };
  });

  let time = 0;
  function updatePlanetPositions() {
    time += params.speedFactor;

    Object.keys(planetObjects).forEach(name => {
      const planet = planetObjects[name];
      const t = time * planet.speed;

      const x = planet.radius * Math.cos(t) + 0.5 * Math.sin(2 * t);
      const y = planet.radius * Math.sin(t) * Math.sin(planet.tilt);
      const z = planet.radius * Math.sin(2 * t) * Math.cos(planet.tilt);

      planet.mesh.position.set(x, y, z);
      planet.label.position.set(x + 3, y, z);
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    updatePlanetPositions();
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// Automatically attach initModel to button click event
document.getElementById('show-model').addEventListener('click', () => {
  const renderArea = document.getElementById('render-area');
  renderArea.style.display = 'block';
  initModel(renderArea);
});
