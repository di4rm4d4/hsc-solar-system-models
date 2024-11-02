// Global settings and initialization
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 300) / window.innerHeight, 1, 1000);
camera.position.set(0, 50, 70);

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.getElementById('render-area').appendChild(renderer.domElement);
resizeRenderer();

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Utility functions
function clearScene() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    scene.add(ambientLight);
}

function updateInfo(text) {
    document.getElementById('concept-info').innerHTML = `<p>${text}</p>`;
}

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

    // Celestial spheres (Sun, Moon, Mercury)
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
        layerMesh.userData = { speed: body.speed };
        bodyGroup.add(layerMesh);

        const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(body.radius, 0, 0);
        bodyGroup.add(planetMesh);

        planetObjects[body.name] = { mesh: planetMesh, radius: body.radius, tilt: body.tilt, speed: body.speed };
    });

    function animateExodus() {
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
        requestAnimationFrame(animateExodus);
    }
    animateExodus();
}

// Placeholder for other models
function loadEccentric() {
    clearScene();
    updateInfo("Eccentric model with Earth off-center.");
    // Implement similar celestial object placements and rotations for Eccentric model
}

function loadDeferentEpicycle() {
    clearScene();
    updateInfo("Deferent & Epicycle model with celestial body on epicycle.");
    // Implement celestial objects and animations for Deferent & Epicycle model
}

function loadEquant() {
    clearScene();
    updateInfo("Equant model with uniform motion around an off-center point.");
    // Implement celestial objects and animations for Equant model
}

function loadTusi() {
    clearScene();
    updateInfo("Tusi Couple with circular motion producing linear motion.");
    // Implement celestial objects and animations for Tusi Couple
}

// Resize renderer on window resize
window.addEventListener('resize', resizeRenderer);
function resizeRenderer() {
    const width = window.innerWidth - 300;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

