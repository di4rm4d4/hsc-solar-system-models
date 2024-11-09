// Toggle for showing Eudoxus's model and landing page
const toggleButton = document.getElementById('toggle-button');
const landingPage = document.getElementById('landing-page');
const eudoxusPage = document.getElementById('eudoxus-page');

// Show Eudoxus model on button click
toggleButton.addEventListener('click', () => {
    landingPage.style.display = 'none';
    eudoxusPage.style.display = 'flex';
    initEudoxusModel();
    updateSidebar();
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

    const params = { speedFactor: 0.005, earthRadius: 5, sphereOpacity: 0.2, labelSize: 3 };
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 400) / window.innerHeight, 1, 1000);
    camera.position.set(0, 50, 120);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderArea.appendChild(renderer.domElement);
    resizeRenderer('render-area-eudoxus', camera, renderer);

    // Use OrbitControls imported directly
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Ambient and directional light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Earth's position as the center of the universe in Eudoxus's model
    const earthGeometry = new THREE.SphereGeometry(params.earthRadius, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2e7bf2 });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Container for celestial spheres and groups
    const celestialGroups = new THREE.Group();
    scene.add(celestialGroups);

    // Spheres for each principle in Eudoxus's model
    const sphereSettings = [
        { name: 'Fixed Stars Sphere', radius: 35, color: 0xaaaaaa, rotationSpeed: 0.001 },
        { name: 'Ecliptic Sphere', radius: 30, color: 0x0000ff, rotationSpeed: 0.0008 },
        { name: 'Synodic Sphere 1', radius: 25, color: 0xff0000, rotationSpeed: 0.0012 },
        { name: 'Synodic Sphere 2', radius: 20, color: 0x00ff00, rotationSpeed: -0.0012 },
    ];

    sphereSettings.forEach(settings => {
        const sphereGroup = new THREE.Group();
        celestialGroups.add(sphereGroup);

        const sphereGeometry = new THREE.SphereGeometry(settings.radius, 64, 64);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: settings.color,
            transparent: true,
            opacity: params.sphereOpacity,
            wireframe: true
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereGroup.add(sphereMesh);
        sphereMesh.userData = { speed: settings.rotationSpeed };

        const label = createTextLabel(settings.name, params.labelSize);
        label.position.set(settings.radius + 5, 0, 0);
        sphereGroup.add(label);

        // Add retrograde motion for planets on Synodic Spheres
        if (settings.name.includes('Synodic')) {
            const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
            const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetMesh.position.set(settings.radius, 0, 0);
            sphereGroup.add(planetMesh);

            createRetrogradeMotionPath(sphereGroup, settings.radius);
        }
    });

    // Resize renderer on window resize
    window.addEventListener('resize', () => resizeRenderer('render-area-eudoxus', camera, renderer));

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        celestialGroups.children.forEach(group => {
            group.rotation.y += group.children[0].userData.speed * params.speedFactor;
        });
        renderer.render(scene, camera);
    }

    animate();
}

// Function to create a retrograde motion path
function createRetrogradeMotionPath(group, radius) {
    const pathGeometry = new THREE.BufferGeometry();
    const points = [];
    for (let t = 0; t < 2 * Math.PI; t += Math.PI / 180) {
        const x = radius * Math.cos(t) + 0.5 * Math.sin(2 * t);
        const y = 0.5 * radius * Math.sin(t);
        const z = radius * Math.sin(2 * t) * Math.cos(t);
        points.push(x, y, z);
    }
    pathGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 });
    const pathLine = new THREE.Line(pathGeometry, pathMaterial);
    group.add(pathLine);
}

// Function to create text label for celestial sphere
function createTextLabel(text, size) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${size * 10}px Arial`;
    context.fillStyle = 'white';
    context.fillText(text, 0, size * 10);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size, size, 1);
    return sprite;
}

// Update sidebar content dynamically
function updateSidebar() {
    const sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML = `
        <h1>Eudoxus's Model - Celestial Spheres</h1>
        <h3>Overview</h3>
        <p>This model of celestial spheres describes planetary motions and provides a foundational approach to ancient astronomy.</p>
    `;
}
