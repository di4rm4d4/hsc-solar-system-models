// Global settings and initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 300) / window.innerHeight, 1, 1000);
camera.position.set(0, 50, 70);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth - 300, window.innerHeight);
document.getElementById('render-area').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Current model animation function placeholder
let currentAnimation = null;

// Clear previous objects from the scene
function clearScene() {
    while (scene.children.length > 0) {
        const child = scene.children[0];
        if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
            child.geometry?.dispose();
            child.material?.dispose();
        }
        scene.remove(child);
    }
    scene.add(ambientLight);  // Ensure light remains in the scene
    currentAnimation = null;  // Stop previous animation
}

// Update sidebar info text
function updateInfo(text) {
    document.getElementById('concept-info').innerHTML = `<p>${text}</p>`;
}

// Load specific model based on the selected concept
function loadModel(concept) {
    clearScene(); // Clear previous model

    if (concept === 'exodus') loadExodus();
    else if (concept === 'eccentric') loadEccentric();
    else if (concept === 'deferentEpicycle') loadDeferentEpicycle();
    else if (concept === 'equant') loadEquant();
    else if (concept === 'tusi') loadTusi();
}

// Exodus Model
function loadExodus() {
    const info = "Exodus model demonstrating celestial spheres and hippopede motion.";
    updateInfo(info);

    const params = {
        speedFactor: 0.005,
        earthRadius: 5,
        sphereOpacity: 0.2,
        labelSize: 3
    };

    // Earth mesh
    const earthGeometry = new THREE.SphereGeometry(params.earthRadius, 64, 64);
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x8a2be2 });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Celestial bodies (Sun, Moon, Mercury)
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

        const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(body.radius, 0, 0);
        bodyGroup.add(planetMesh);

        planetObjects[body.name] = { mesh: planetMesh, radius: body.radius, tilt: body.tilt, speed: body.speed };
    });

    currentAnimation = function animateExodus() {
        Object.keys(planetObjects).forEach(name => {
            const planet = planetObjects[name];
            const t = Date.now() * planet.speed * params.speedFactor;
            const x = planet.radius * Math.cos(t) + 0.5 * Math.sin(2 * t);
            const y = planet.radius * Math.sin(t) * Math.sin(planet.tilt);
            const z = planet.radius * Math.sin(2 * t) * Math.cos(planet.tilt);

            planet.mesh.position.set(x, y, z);
        });

        controls.update();
        renderer.render(scene, camera);
        if (currentAnimation) requestAnimationFrame(currentAnimation);
    };
    requestAnimationFrame(currentAnimation);
}

// Placeholder models
function loadEccentric() {
    updateInfo("Eccentric model with Earth off-center.");
    // Setup 3D objects and animation for Eccentric model here
}

function loadDeferentEpicycle() {
    updateInfo("Deferent & Epicycle model with celestial body on epicycle.");
    // Setup 3D objects and animation for Deferent & Epicycle model here
}

function loadEquant() {
    updateInfo("Equant model with uniform motion around an off-center point.");
    // Setup 3D objects and animation for Equant model here
}

function loadTusi() {
    updateInfo("Tusi Couple with circular motion producing linear motion.");
    // Setup 3D objects and animation for Tusi Couple here
}

// Handle window resize
window.addEventListener('resize', resizeRenderer);
function resizeRenderer() {
    const width = window.innerWidth - 300;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

