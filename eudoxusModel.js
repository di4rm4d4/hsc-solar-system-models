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
    scene.add(ambientLight);
    currentAnimation = null;
}

// Update sidebar info text
function updateInfo(text) {
    document.getElementById('concept-info').innerHTML = `<p>${text}</p>`;
}

// Load specific model based on the selected concept
function loadModel(concept) {
    clearScene();
    if (concept === 'exodus') loadExodus();
    else if (concept === 'eccentric') loadEccentric();
    else if (concept === 'deferentEpicycle') loadDeferentEpicycle();
    else if (concept === 'equant') loadEquant();
    else if (concept === 'tusi') loadTusi();
}

// Define loadExodus and other model functions here
function loadExodus() {
    // Contents of loadExodus function
    updateInfo("Exodus model loaded.");
    // Model setup code
}

// Placeholder models
function loadEccentric() { updateInfo("Eccentric model loaded."); }
function loadDeferentEpicycle() { updateInfo("Deferent & Epicycle model loaded."); }
function loadEquant() { updateInfo("Equant model loaded."); }
function loadTusi() { updateInfo("Tusi Couple model loaded."); }

window.addEventListener('resize', () => {
    const width = window.innerWidth - 300;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});



