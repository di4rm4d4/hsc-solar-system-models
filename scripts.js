// parameters based on the values
const params = {
    speedFactor: 0.005,       
    earthRadius: 5,           
    sphereOpacity: 0.2,      
    labelSize: 3              
};


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 300) / window.innerHeight, 1, 1000);
camera.position.set(0, 50, 70); 
//initial rendering stuffs
const renderer = new THREE.WebGLRenderer({ antialias: true });
document.getElementById('render-area').appendChild(renderer.domElement);
resizeRenderer();  

// camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// let there be lightttttt
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// earth texture
const textureLoader = new THREE.TextureLoader();
const earthGeometry = new THREE.SphereGeometry(params.earthRadius, 64, 64);
textureLoader.load('land_ocean_ice_8192.png', (texture) => {
    const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
});

const celestialGroups = new THREE.Group();
scene.add(celestialGroups);

// sun moon & mercury params
const celestialBodies = [
    { name: 'Sun', radius: 20, speed: 0.02, color: 0xffff00, tilt: Math.PI / 180 * 7, bodyRadius: 0.8 }, // Small sphere for Sun
    { name: 'Moon', radius: 6, speed: 0.055, color: 0xcccccc, tilt: Math.PI / 180 * 5, bodyRadius: 0.5 }, // Small sphere for Moon
    { name: 'Mercury', radius: 22, speed: 0.047, color: 0xaaaaaa, tilt: Math.PI / 180 * 7, bodyRadius: 0.5 } // Small sphere for Mercury
];

// object that holds orbit meshes
const planetObjects = {};

// planetary spheres
celestialBodies.forEach(body => {
    // Group for each celestial body
    const bodyGroup = new THREE.Group();
    celestialGroups.add(bodyGroup);

    // wireframe mesh
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

    // Create a label for each celestial body
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

    // the hippopede motion
    createHippopede(bodyGroup, body.radius, body.tilt, body.speed);

    // planets
    const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.set(body.radius, 0, 0); // Start at the edge of the orbit
    bodyGroup.add(planetMesh);

    // static storage for updating movements
    planetObjects[body.name] = { mesh: planetMesh, radius: body.radius, tilt: body.tilt, speed: body.speed, label: labelSprite };
});

// the visualisation of the hippopede
function createHippopede(group, radius, tilt, speed) {
    const hippopedeGeometry = new THREE.BufferGeometry();
    const points = [];
    const angleStep = Math.PI / 180; // RADIANS NOOOOO MY WORST ENEMYYYYYYYYYYY T-T

    // points of the hippopede bc its a figure eight
    for (let t = 0; t < 2 * Math.PI; t += angleStep) {
        const x = radius * Math.cos(t) + 0.5 * Math.sin(2 * t); //oscillating path
        const y = radius * Math.sin(t) * Math.sin(tilt);
        const z = radius * Math.sin(2 * t) * Math.cos(tilt); 

        points.push(x, y, z);
    }

    hippopedeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const hippopedeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const hippopedeLine = new THREE.Line(hippopedeGeometry, hippopedeMaterial);
    group.add(hippopedeLine);
}

// Get the slider element and the speed value display
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

// Update params.speedFactor when the slider value changes
speedSlider.addEventListener('input', () => {
    params.speedFactor = parseFloat(speedSlider.value);
    speedValue.textContent = speedSlider.value;
});

let time = 0;
function updatePlanetPositions() {
    time += params.speedFactor; // time progression - progresses with each frame

    Object.keys(planetObjects).forEach(name => {
        const planet = planetObjects[name];
        const t = time * planet.speed; // position changes w time

        // hippopede equations
        const x = planet.radius * Math.cos(t) + 0.5 * Math.sin(2 * t);
        const y = planet.radius * Math.sin(t) * Math.sin(planet.tilt);
        const z = planet.radius * Math.sin(2 * t) * Math.cos(planet.tilt);

        planet.mesh.position.set(x, y, z); 
        planet.label.position.set(x + 3, y, z); // make the label follow the planet
    });
}

// animateee
function animate() {
    requestAnimationFrame(animate);

    updatePlanetPositions();

    controls.update();
    renderer.render(scene, camera);
}

animate();

// window resize
window.addEventListener('resize', () => {
    resizeRenderer();
});

// resize canvas & window
function resizeRenderer() {
    const width = window.innerWidth - 300; // Sidebar is 300px wide
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
