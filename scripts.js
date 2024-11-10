// Function to initialize each model only when its section is in view
function onScrollInitializeModels() {
    const eudoxusSection = document.getElementById('eudoxus-section');
    const hippopedeSection = document.getElementById('hippopede-section');
    const basicPlanetsSection = document.getElementById('basic-planets-section');

    const scrollPosition = window.scrollY + window.innerHeight;

    if (scrollPosition >= eudoxusSection.offsetTop && !eudoxusSection.dataset.initialized) {
        initEudoxusModel();
        eudoxusSection.dataset.initialized = true;
    }
    if (scrollPosition >= hippopedeSection.offsetTop && !hippopedeSection.dataset.initialized) {
        initHippopedeModel();
        hippopedeSection.dataset.initialized = true;
    }
    if (scrollPosition >= basicPlanetsSection.offsetTop && !basicPlanetsSection.dataset.initialized) {
        initBasicPlanetsModel();
        basicPlanetsSection.dataset.initialized = true;
    }
}

// Initialize the main Eudoxus model immediately
window.addEventListener('DOMContentLoaded', () => {
    initEudoxusModel();
    window.addEventListener('scroll', onScrollInitializeModels);
});

// Existing initEudoxusModel function

function initHippopedeModel() {
    const renderArea = document.getElementById('render-area-hippopede');
    renderArea.innerHTML = ''; // Clear previous content

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 20, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderArea.appendChild(renderer.domElement);
    resizeRenderer('render-area-hippopede', camera, renderer);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create hippopede motion path (simplified example)
    const hippopedeGeometry = new THREE.BufferGeometry();
    const points = [];
    const radius = 10;
    const tilt = Math.PI / 8;

    for (let t = 0; t < 2 * Math.PI; t += 0.05) {
        const x = radius * Math.cos(t) + 0.5 * Math.sin(2 * t);
        const y = radius * Math.sin(t) * Math.sin(tilt);
        const z = radius * Math.sin(2 * t) * Math.cos(tilt);

        points.push(x, y, z);
    }

    hippopedeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const hippopedeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const hippopedeLine = new THREE.Line(hippopedeGeometry, hippopedeMaterial);
    scene.add(hippopedeLine);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

function initBasicPlanetsModel() {
    const renderArea = document.getElementById('render-area-basic-planets');
    renderArea.innerHTML = ''; // Clear previous content

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 20, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderArea.appendChild(renderer.domElement);
    resizeRenderer('render-area-basic-planets', camera, renderer);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create basic planet motion around a central Earth
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x003366 });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    const orbitRadius = 10;
    const planetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planetMesh);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        // Rotate planet around Earth in a circular path
        const time = Date.now() * 0.001;
        planetMesh.position.set(
            orbitRadius * Math.cos(time),
            0,
            orbitRadius * Math.sin(time)
        );

        renderer.render(scene, camera);
    }

    animate();
}

function resizeRenderer(areaId, camera, renderer) {
    const renderArea = document.getElementById(areaId);
    const width = renderArea.clientWidth;
    const height = renderArea.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', () => {
    resizeRenderer('render-area-eudoxus', camera, renderer);
    resizeRenderer('render-area-hippopede', camera, renderer);
    resizeRenderer('render-area-basic-planets', camera, renderer);
});
