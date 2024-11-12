const eudoxusPage = document.getElementById('eudoxus-page');

// Initialize Eudoxus models on page load
window.addEventListener('load', () => {
    initEudoxusModels();
});

// Define celestial bodies globally
const celestialBodies = [
    { name: 'Sun', radius: 20, speed: 0.02, color: 0xffff00, tilt: Math.PI / 180 * 7, bodyRadius: 1 },
    { name: 'Moon', radius: 8, speed: 0.055, color: 0xcccccc, tilt: Math.PI / 180 * 5, bodyRadius: 0.6 },
    { name: 'Mercury', radius: 15, speed: 0.04, color: 0xaaaaaa, tilt: Math.PI / 180 * 7, bodyRadius: 0.5 }
];

// Function to initialize individual Eudoxus models for each celestial body
function initEudoxusModels() {
    const renderArea = document.getElementById('render-area-eudoxus');
    renderArea.innerHTML = ''; // Clear previous content

    const params = {
        speedFactor: 0.002, // Slower speed for detailed visualization
        sphereOpacity: 0.3,
        labelSize: 3,
        tiltAdjustments: [Math.PI / 20, Math.PI / 10, Math.PI / 15, Math.PI / 25]
    };

    // Loop through each celestial body and create its model
    celestialBodies.forEach(body => {
        createCelestialModel(renderArea, body, params);
    });
}

// Function to create a model for each celestial body
function createCelestialModel(renderArea, body, params) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, renderArea.clientWidth / renderArea.clientHeight, 1, 1000);
    camera.position.set(0, 60, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderArea.clientWidth / celestialBodies.length, renderArea.clientHeight);
    renderArea.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Add the planet itself
    const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(body.radius, 0, 0);
    bodyGroup.add(planetMesh);

    // Add label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.fillText(body.name, 0, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const labelSprite = new THREE.Sprite(labelMaterial);
    labelSprite.scale.set(params.labelSize, params.labelSize / 2, 1);
    labelSprite.position.set(body.radius + 3, 0, 0);
    bodyGroup.add(labelSprite);

    // Create layered rotating spheres and paths
    const spheres = [];
    for (let i = 0; i < 4; i++) {
        const sphereTilt = body.tilt + params.tiltAdjustments[i];
        const layerGeometry = new THREE.SphereGeometry(body.radius + i, 64, 64);
        const layerMaterial = new THREE.MeshBasicMaterial({
            color: body.color,
            transparent: true,
            opacity: params.sphereOpacity,
            wireframe: true
        });
        const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
        layerMesh.rotation.z = sphereTilt;
        layerMesh.userData = { speed: body.speed * (i + 1) * 0.1 };
        bodyGroup.add(layerMesh);
        spheres.push(layerMesh);

        // Draw retrograde path
        createRetrogradePath(bodyGroup, body.radius + i, sphereTilt, body.speed * 0.1 * (i + 1));
    }

    // Add toggle controls to show or hide each sphere
    spheres.forEach((sphere, index) => {
        const button = document.createElement('button');
        button.innerHTML = `${body.name} Sphere ${index + 1}`;
        button.style.margin = '5px';
        button.onclick = () => {
            sphere.visible = !sphere.visible;
        };
        document.body.appendChild(button);
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        spheres.forEach(sphere => {
            sphere.rotation.y += sphere.userData.speed * params.speedFactor;
        });
        renderer.render(scene, camera);
    }

    animate();
}

// Function to create a retrograde path (hippopede)
function createRetrogradePath(group, radius, tilt, speed) {
    const hippopedeGeometry = new THREE.BufferGeometry();
    const points = [];
    const angleStep = Math.PI / 180; // Small angle step for a smooth curve

    // Generate hippopede points using parametric equations
    for (let t = 0; t < 2 * Math.PI; t += angleStep) {
        const x = radius * Math.cos(t) + 0.4 * Math.sin(2 * t);
        const y = radius * Math.sin(t) * Math.sin(tilt) * 1.5;
        const z = radius * Math.sin(2 * t) * Math.cos(tilt) * 0.8;

        points.push(x, y, z);
    }

    hippopedeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const hippopedeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 1 });
    const hippopedeLine = new THREE.Line(hippopedeGeometry, hippopedeMaterial);
    hippopedeLine.rotation.z = tilt; // Adjust the tilt angle
    group.add(hippopedeLine);
}
