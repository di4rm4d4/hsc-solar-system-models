// script.js
import * as THREE from 'three';

const createEudoxusModel = (containerId, spheres) => {
  const container = document.getElementById(containerId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  camera.position.z = 8;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Lighting setup
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(10, 10, 10);
  scene.add(light);
  
  // Add each sphere layer in Eudoxus' model
  spheres.forEach(sphereData => {
    const { color, radius, speed, direction } = sphereData;
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color, wireframe: true });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    sphere.userData = { speed, direction };
    scene.add(sphere);
    
    const animate = () => {
      sphere.rotation.y += direction * speed;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  });
  
  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });
};

// Model configurations based on Eudoxus' spheres
const basicSpheres = [
  { color: 0x0000ff, radius: 1.5, speed: 0.01, direction: 1 },  // Ecliptic sphere
  { color: 0x00ff00, radius: 2.5, speed: 0.005, direction: -1 }, // Synodic sphere
  { color: 0xff0000, radius: 3.5, speed: 0.003, direction: 1 }   // Outer celestial sphere
];

const hippopedeSpheres = [
  { color: 0x0000ff, radius: 1.5, speed: 0.01, direction: 1 },
  { color: 0x00ff00, radius: 2.5, speed: 0.01, direction: -1 },
  { color: 0xff0000, radius: 3.5, speed: 0.003, direction: 1 },
  { color: 0xffffff, radius: 1, speed: 0.005, direction: -1 }    // Inner sphere with hippopede rotation
];

createEudoxusModel('model-1', basicSpheres);
createEudoxusModel('model-2', hippopedeSpheres);
