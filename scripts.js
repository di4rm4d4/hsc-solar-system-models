// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 30, 70);

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.getElementById('render-area').appendChild(renderer.domElement);
renderer.setSize(window.innerWidth - 300, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// General lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Helper function to clear previous models
function clearScene() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    scene.add(ambientLight);  // Keep the light in the scene
}

// Update info text
function updateInfo(text) {
    document.getElementById('concept-info').innerHTML = `<p>${text}</p>`;
}

// Load the selected model
function loadModel(concept) {
    if (concept === 'exodus') loadExodus();
    else if (concept === 'eccentric') loadEccentric();
    else if (concept === 'deferentEpicycle') loadDeferentEpicycle();
    else if (concept === 'equant') loadEquant();
    else if (concept === 'tusi') loadTusi();
}

// Exodus Model
function loadExodus() {
    clearScene();
    const info = "Exodus model as per the original specification provided.";

    // Your original Exodus model code goes here.
    const exodusGeometry = new THREE.SphereGeometry(5, 32, 32);
    const exodusMaterial = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
    const exodus = new THREE.Mesh(exodusGeometry, exodusMaterial);
    scene.add(exodus);

    function animateExodus() {
        exodus.rotation.y += 0.01;
        requestAnimationFrame(animateExodus);
        controls.update();
        renderer.render(scene, camera);
    }
    animateExodus();
    updateInfo(info);
}

// Eccentric model
function loadEccentric() {
    clearScene();
    const info = "In the Eccentric model, the Earth is slightly off-center, helping to explain the irregular planetary motions.";

    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(-10, 0, 0);
    scene.add(earth);

    const pathGeometry = new THREE.CircleGeometry(30, 64);
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const path = new THREE.LineLoop(pathGeometry, pathMaterial);
    path.rotation.x = Math.PI / 2;
    scene.add(path);

    const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    function animateEccentric() {
        planet.position.set(30 * Math.cos(Date.now() * 0.001), 0, 30 * Math.sin(Date.now() * 0.001));
        requestAnimationFrame(animateEccentric);
        controls.update();
        renderer.render(scene, camera);
    }
    animateEccentric();
    updateInfo(info);
}

// Other models such as loadDeferentEpicycle, loadEquant, and loadTusi would be similar, 
// just with their respective model geometries and animations.

// Deferent & Epicycle model
function loadDeferentEpicycle() {
    clearScene();
    const info = "The deferent and epicycle explain retrograde motion. The deferent is a large orbit, and the epicycle is a smaller orbit on it.";

    const deferentRadius = 20;
    const epicycleRadius = 5;

    const deferentGeometry = new THREE.CircleGeometry(deferentRadius, 64);
    const deferentMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const deferent = new THREE.LineLoop(deferentGeometry, deferentMaterial);
    deferent.rotation.x = Math.PI / 2;
    scene.add(deferent);

    const epicycleGeometry = new THREE.CircleGeometry(epicycleRadius, 32);
    const epicycleMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const epicycle = new THREE.LineLoop(epicycleGeometry, epicycleMaterial);

    const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    epicycle.add(planet);

    function animateDeferentEpicycle() {
        deferent.rotation.z += 0.002;
        epicycle.position.set(deferentRadius * Math.cos(deferent.rotation.z), 0, deferentRadius * Math.sin(deferent.rotation.z));
        epicycle.rotation.z += 0.05;
        planet.position.set(epicycleRadius * Math.cos(epicycle.rotation.z), 0, epicycleRadius * Math.sin(epicycle.rotation.z));

        requestAnimationFrame(animateDeferentEpicycle);
        controls.update();
        renderer.render(scene, camera);
    }
    scene.add(epicycle);
    animateDeferentEpicycle();
    updateInfo(info);
}

// Continue with Equant and Tusi couple models as previously defined...

// Adjust renderer on window resize
window.addEventListener('resize', () => {
    camera.aspect = (window.innerWidth - 300) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 300, window.innerHeight);
});
