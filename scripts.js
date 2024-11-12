const eudoxusPage = document.getElementById('eudoxus-page');

// Initialize models on page load
window.addEventListener('load', () => {
    initEudoxusModel();
    initHippopedeModel();
    initPlanetarySpheresModel();
});

// Celestial bodies data
const celestialBodies = [
    { name: 'Sun', radius: 20, speed: 0.02, color: 0xffff00, tilt: Math.PI / 180 * 7, bodyRadius: 1 },
    { name: 'Moon', radius: 8, speed: 0.055, color: 0xcccccc, tilt: Math.PI / 180 * 5, bodyRadius: 0.6 },
    { name: 'Mercury', radius: 15, speed: 0.04, color: 0xaaaaaa, tilt: Math.PI / 180 * 7, bodyRadius: 0.5 }
];

// Initialize Eudoxus Model (Original Setup)
function initEudoxusModel() {
    const renderArea = document.getElementById('render-area-eudoxus');
    setupEudoxusScene(renderArea, celestialBodies);
}

// Function to setup the Eudoxus Scene
function setupEudoxusScene(renderArea, celestialBodies) {
    renderArea.innerHTML = ''; // Clear previous content

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, renderArea.clientWidth / renderArea.clientHeight, 1, 1000);
    camera.position.set(0, 50, 70);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderArea.clientWidth, renderArea.clientHeight);
    renderArea.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add Earth and Celestial Bodies
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    celestialBodies.forEach(body => {
        const bodyGroup = new THREE.Group();
        scene.add(bodyGroup);

        const orbitGeometry = new THREE.SphereGeometry(body.radius, 64, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: body.color,
            transparent: true,
            opacity: 0.2,
            wireframe: true
        });
        const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
        bodyGroup.add(orbitMesh);

        // Create planet
        const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(body.radius, 0, 0);
        bodyGroup.add(planetMesh);
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

// Initialize Hippopede Motion Model
function initHippopedeModel() {
    const renderArea = document.getElementById('render-area-hippopede');
    renderArea.innerHTML = ''; // Clear previous content

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, renderArea.clientWidth / renderArea.clientHeight, 1, 1000);
    camera.position.set(0, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderArea.clientWidth, renderArea.clientHeight);
    renderArea.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const bodyRadius = 20;  // Adjust radius as needed
    const tilt = Math.PI / 4;  // Adjust tilt angle as needed

    // Hippopede Path (Retrograde Motion)
    const hippopedeGeometry = new THREE.BufferGeometry();
    const points = [];
    const angleStep = Math.PI / 180;

    for (let t = 0; t < 2 * Math.PI; t += angleStep) {
        const x = bodyRadius * Math.cos(t) + 0.5 * Math.sin(2 * t);
        const y = bodyRadius * Math.sin(t) * Math.sin(tilt);
        const z = bodyRadius * Math.sin(2 * t) * Math.cos(tilt);
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

// Initialize Planetary Sphere Layers Model
function initPlanetarySpheresModel() {
    const renderArea = document.getElementById('render-area-planetary-spheres');
    renderArea.innerHTML = ''; // Clear previous content

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, renderArea.clientWidth / renderArea.clientHeight, 1, 1000);
    camera.position.set(0, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderArea.clientWidth, renderArea.clientHeight);
    renderArea.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    celestialBodies.forEach(body => {
        const bodyGroup = new THREE.Group();
        scene.add(bodyGroup);

        // Create 4 nested spheres for each planet
        for (let i = 1; i <= 4; i++) {
            const sphereRadius = body.radius * (1 + i * 0.1);
            const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: body.color,
                transparent: true,
                opacity: 0.2,
                wireframe: true
            });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphereMesh.rotation.z = body.tilt + (i * Math.PI / 16);
            bodyGroup.add(sphereMesh);
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}
