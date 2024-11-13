const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const eclipticSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
const thirdSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
const fourthSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(eclipticSphere, thirdSphere, fourthSphere);

// use like a white ball for a planet tracking the hippopede path
const planetGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const planet = new THREE.Mesh(planetGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
scene.add(planet);

// hippopede motion taken from wikipedia lolololol
let angle3 = 0;
let angle4 = 0;
const radius3 = 3; 
const radius4 = 1.5; 
const speed3 = 0.02; 
const speed4 = -0.02; 


function animate() {
    requestAnimationFrame(animate);

    angle3 += speed3;
    thirdSphere.position.set(radius3 * Math.cos(angle3), radius3 * Math.sin(angle3), 0);

    angle4 += speed4;
    fourthSphere.position.set(
        thirdSphere.position.x + radius4 * Math.cos(angle4),
        thirdSphere.position.y,
        radius4 * Math.sin(angle4)
    );

    planet.position.set(fourthSphere.position.x, fourthSphere.position.y, fourthSphere.position.z);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
