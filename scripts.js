// Landing page buttons and model containers
const toggleButton = document.getElementById('toggle-button');
const ptolemyButton = document.getElementById('ptolemy-button');

const landingPage = document.getElementById('landing-page');
const eudoxusPage = document.getElementById('eudoxus-page');
const ptolemyPage = document.getElementById('ptolemy-page');

// Show Eudoxus model on button click
toggleButton.addEventListener('click', () => {
    landingPage.style.display = 'none';
    eudoxusPage.style.display = 'flex';
    initEudoxusModel();
});

// Show Ptolemy model on button click
ptolemyButton.addEventListener('click', () => {
    landingPage.style.display = 'none';
    ptolemyPage.style.display = 'flex';
    initPtolemyModel();
});

// Function to resize renderer for specific area
function resizeRenderer(areaId, camera, renderer) {
    const renderArea = document.getElementById(areaId);
    const width = window.innerWidth - 400;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Initialize Eudoxus model
function initEudoxusModel() {
    const renderArea = document.getElementById('render-area-eudoxus');
    renderArea.innerHTML = ''; // Clear previous content

    // Parameters for Eudoxus's Model
    const params = {
        speedFactor: 0.005,
        earthRadius: 5,
        sphereOpacity: 0.2,
        labelSize: 3
    };

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 400) / window.innerHeight, 1, 1000);
    camera.position.set(0, 50, 70);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 400, window.innerHeight);
    renderArea.appendChild(renderer.domElement);

    // Controls and lighting
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Earth and celestial bodies
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('land_ocean_ice_8192.png', (texture) => {
        const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(params.earthRadius, 64, 64), new THREE.MeshStandardMaterial({ map: texture }));
        scene.add(earthMesh);
    });

    const celestialGroups = new THREE.Group();
    scene.add(celestialGroups);

    const celestialBodies = [
        { name: 'Sun', radius: 20, speed: 0.02, color: 0xffff00, tilt: Math.PI / 180 * 7, bodyRadius: 0.8 },
        { name: 'Moon', radius: 6, speed: 0.055, color: 0xcccccc, tilt: Math.PI / 180 * 5, bodyRadius: 0.5 },
        { name: 'Mercury', radius: 22, speed: 0.047, color: 0xaaaaaa, tilt: Math.PI / 180 * 7, bodyRadius: 0.5 }
    ];

    celestialBodies.forEach(body => {
        const bodyGroup = new THREE.Group();
        celestialGroups.add(bodyGroup);

        const layerMesh = new THREE.Mesh(new THREE.SphereGeometry(body.radius, 64, 64), new THREE.MeshBasicMaterial({ color: body.color, transparent: true, opacity: params.sphereOpacity, wireframe: true }));
        bodyGroup.add(layerMesh);

        const label = document.createElement('canvas');
        const context = label.getContext('2d');
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.fillText(body.name, 0, 20);
        const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(label) }));
        labelSprite.scale.set(params.labelSize, params.labelSize / 2, 1);
        labelSprite.position.set(body.radius + 3, 0, 0);
        bodyGroup.add(labelSprite);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle resizing
    window.addEventListener('resize', () => resizeRenderer('render-area-eudoxus', camera, renderer));
}

// Initialize Ptolemy model
function initPtolemyModel() {
    const renderAreaPtolemy = document.getElementById('render-area-ptolemy');
    renderAreaPtolemy.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 400) / window.innerHeight, 1, 1000);
    camera.position.set(0, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 400, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderAreaPtolemy.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50).normalize();
    scene.add(directionalLight);

    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 64), new THREE.MeshStandardMaterial({ color: 0x123456 }));
    scene.add(earthMesh);

    const eccentricOrbit = new THREE.Mesh(new THREE.RingGeometry(20, 21, 64), new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }));
    eccentricOrbit.rotation.x = Math.PI / 2;
    eccentricOrbit.position.set(10, 0, 0);
    scene.add(eccentricOrbit);

    const epicycleOrbit = new THREE.Mesh(new THREE.RingGeometry(5, 5.5, 32), new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }));
    epicycleOrbit.rotation.x = Math.PI / 2;
    epicycleOrbit.position.set(20, 0, 0);
    scene.add(epicycleOrbit);

    function animatePtolemy() {
        requestAnimationFrame(animatePtolemy);
        epicycleOrbit.rotation.z += 0.01;
        controls.update();
        renderer.render(scene, camera);
    }
    animatePtolemy();

    window.addEventListener('resize', () => resizeRenderer('render-area-ptolemy', camera, renderer));
}

