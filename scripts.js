// Function to resize renderer for specific area
function resizeRenderer(areaId, camera, renderer) {
    const renderArea = document.getElementById(areaId);
    const width = renderArea.clientWidth;
    const height = renderArea.clientHeight;
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

    // Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, renderArea.clientWidth / renderArea.clientHeight, 1, 1000);
    camera.position.set(0, 50, 70);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderArea.appendChild(renderer.domElement);
    resizeRenderer('render-area-eudoxus', camera, renderer);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('land_ocean_ice_8192.png', (texture) => {
        const earthGeometry = new THREE.SphereGeometry(params.earthRadius, 64, 64);
        const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earthMesh);
    });

    const celestialGroups = new THREE.Group();
    scene.add(celestialGroups);

    const celestialBodies = [
        { name: 'Sun', radius: 20, speed: 0.02, color: 0xffff00, tilt: Math.PI / 180 * 7, bodyRadius: 0.8 },
        { name: 'Moon', radius: 6, speed: 0.055, color: 0xcccccc, tilt: Math.PI / 180 * 5, bodyRadius: 0.5 },
        { name: 'Mercury', radius: 22, speed: 0.047, color: 0xaaaaaa, tilt: Math.PI / 180 * 7, bodyRadius: 0.5 }
    ];

    const planetObjects = {};

    celestialBodies.forEach(body => {
        const bodyGroup = new THREE.Group();
        celestialGroups.add(bodyGroup);

        const layerGeometry = new THREE.SphereGeometry(body.radius, 64, 64);
        const layerMaterial = new THREE.MeshBasicMaterial({
            color: body.color,
            transparent: true,
            opacity: params.sphereOpacity,
            wireframe: true
        });
        const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
        bodyGroup.add(layerMesh);

        layerMesh.userData = { speed: body.speed };

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

        createHippopede(bodyGroup, body.radius, body.tilt, body.speed);

        const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(body.radius, 0, 0);
        bodyGroup.add(planetMesh);

        planetObjects[body.name] = { mesh: planetMesh, radius: body.radius, tilt: body.tilt, speed: body.speed, label: labelSprite };
    });

    function createHippopede(group, radius, tilt, speed) {
        const hippopedeGeometry = new THREE.BufferGeometry();
        const points = [];
        const angleStep = Math.PI / 180;

        for (let t = 0; t < 2 * Math.PI; t += angleStep) {
            const x = radius * Math.cos(t) + 0.5 * Math.sin(2 * t);
            const y = radius * Math.sin(t) * Math.sin(tilt);
            const z = radius * Math.sin(2 * t) * Math.cos(tilt);

            points.push(x, y, z);
        }

        hippopedeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const hippopedeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const hippopedeLine = new THREE.Line(hippopedeGeometry, hippopedeMaterial);
        group.add(hippopedeLine);
    }

    window.addEventListener('resize', () => resizeRenderer('render-area-eudoxus', camera, renderer));

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

// Initialize models directly on page load
window.addEventListener('DOMContentLoaded', () => {
    initEudoxusModel();
});
