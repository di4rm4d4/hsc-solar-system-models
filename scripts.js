// Ensure both buttons are defined
const toggleButton = document.getElementById('toggle-button');
const ptolemyButton = document.getElementById('ptolemy-button');

// Toggle between landing page and model pages
const landingPage = document.getElementById('landing-page');
const eudoxusPage = document.getElementById('eudoxus-page');
const ptolemyPage = document.getElementById('ptolemy-page');

toggleButton.addEventListener('click', () => {
    landingPage.style.display = 'none';
    eudoxusPage.style.display = 'flex';
});

ptolemyButton.addEventListener('click', () => {
    landingPage.style.display = 'none';
    ptolemyPage.style.display = 'flex';
    initPtolemyModel();
});

// Handle window resize for both pages
window.addEventListener('resize', () => {
    resizeRenderer('render-area');
    resizeRenderer('render-area-ptolemy');
});

// Function to resize the canvas in the render area
function resizeRenderer(areaId) {
    const renderArea = document.getElementById(areaId);
    const renderer = renderArea && renderArea.querySelector('canvas');
    if (renderer) {
        const width = window.innerWidth - 400;
        const height = window.innerHeight;
        renderer.width = width;
        renderer.height = height;
    }
}

// Define your Eudoxus model setup here...

// Initialize Ptolemy's model
function initPtolemyModel() {
    // Ensure the render area is cleared
    const renderAreaPtolemy = document.getElementById('render-area-ptolemy');
    renderAreaPtolemy.innerHTML = '';

    // Create scene, camera, and renderer for the Ptolemy model
    const ptolemyScene = new THREE.Scene();
    const ptolemyCamera = new THREE.PerspectiveCamera(45, (window.innerWidth - 400) / window.innerHeight, 1, 1000);
    ptolemyCamera.position.set(0, 50, 100);

    const ptolemyRenderer = new THREE.WebGLRenderer({ antialias: true });
    ptolemyRenderer.setSize(window.innerWidth - 400, window.innerHeight);
    ptolemyRenderer.setClearColor(0x000000, 1);
    renderAreaPtolemy.appendChild(ptolemyRenderer.domElement);

    // Orbit Controls
    const ptolemyControls = new THREE.OrbitControls(ptolemyCamera, ptolemyRenderer.domElement);
    ptolemyControls.enableDamping = true;
    ptolemyControls.dampingFactor = 0.05;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    ptolemyScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50).normalize();
    ptolemyScene.add(directionalLight);

    // Add Earth and orbit elements to the Ptolemy model
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x123456 });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    ptolemyScene.add(earthMesh);

    const eccentricGeometry = new THREE.RingGeometry(20, 21, 64);
    const eccentricMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const eccentricOrbit = new THREE.Mesh(eccentricGeometry, eccentricMaterial);
    eccentricOrbit.rotation.x = Math.PI / 2;
    eccentricOrbit.position.set(10, 0, 0);
    ptolemyScene.add(eccentricOrbit);

    const epicycleGeometry = new THREE.RingGeometry(5, 5.5, 32);
    const epicycleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const epicycleOrbit = new THREE.Mesh(epicycleGeometry, epicycleMaterial);
    epicycleOrbit.rotation.x = Math.PI / 2;
    epicycleOrbit.position.set(20, 0, 0);
    ptolemyScene.add(epicycleOrbit);

    // Animation loop
    function animatePtolemy() {
        requestAnimationFrame(animatePtolemy);
        epicycleOrbit.rotation.z += 0.01;
        ptolemyControls.update();
        ptolemyRenderer.render(ptolemyScene, ptolemyCamera);
    }
    animatePtolemy();
}
