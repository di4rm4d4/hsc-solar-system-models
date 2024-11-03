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
        speedFactor: 0.005,       // Overall speed multiplier for celestial motions
        earthRadius: 5,           // Radius of Earth (center of the universe in the model)
        sphereOpacity: 0.2,       // Opacity for the transparent wireframe spheres
        labelSize: 3              // Size of the labels
    };

    // Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 400) / window.innerHeight, 1, 1000);
    camera.position.set(0, 50, 70); // Adjusted position to better view the geocentric model

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    document.getElementById('render-area-eudoxus').appendChild(renderer.domElement);
    resizeRenderer('render-area-eudoxus', camera, renderer); // Set initial canvas size

    // OrbitControls for camera movement
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Ambient Light to illuminate the scene uniformly
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Earth's Static Mesh with Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('land_ocean_ice_8192.png', (texture) => {
        const earthGeometry = new THREE.SphereGeometry(params.earthRadius, 64, 64);
        const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earthMesh);
    });

    // Group to hold all celestial spheres and motions
    const celestialGroups = new THREE.Group();
    scene.add(celestialGroups);

    // Define celestial bodies: Sun, Moon, and Mercury
    const celestialBodies = [
        { name: 'Sun', radius: 20, speed: 0.02, color: 0xffff00, tilt: Math.PI / 180 * 7, bodyRadius: 0.8 },
        { name: 'Moon', radius: 6, speed: 0.055, color: 0xcccccc, tilt: Math.PI / 180 * 5, bodyRadius: 0.5 },
        { name: 'Mercury', radius: 22, speed: 0.047, color: 0xaaaaaa, tilt: Math.PI / 180 * 7, bodyRadius: 0.5 }
    ];

    // Object to hold planet meshes for easy reference during movement
    const planetObjects = {};

    // Function to create planetary spheres, hippopede motion, and labels
    celestialBodies.forEach(body => {
        // Group for each celestial body
        const bodyGroup = new THREE.Group();
        celestialGroups.add(bodyGroup);

        // Create a single wireframe sphere for each celestial body (hippopede visualization)
        const layerGeometry = new THREE.SphereGeometry(body.radius, 64, 64);
        const layerMaterial = new THREE.MeshBasicMaterial({
            color: body.color,
            transparent: true,
            opacity: params.sphereOpacity,
            wireframe: true
        });
        const layerMesh = new THREE.Mesh(layerGeometry, layerMaterial);
        bodyGroup.add(layerMesh);

        // Add rotation speed
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

        // Create hippopede motion for the Sun, Moon, and Mercury
        createHippopede(bodyGroup, body.radius, body.tilt, body.speed);

        // Create small spheres (planets) to represent Sun, Moon, Mercury
        const planetGeometry = new THREE.SphereGeometry(body.bodyRadius, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: body.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.set(body.radius, 0, 0); // Start at the edge of the orbit
        bodyGroup.add(planetMesh);

        // Store reference for movement updates
        planetObjects[body.name] = { mesh: planetMesh, radius: body.radius, tilt: body.tilt, speed: body.speed, label: labelSprite };
    });

    // Function to create the hippopede motion visualization
    function createHippopede(group, radius, tilt, speed) {
        const hippopedeGeometry = new THREE.BufferGeometry();
        const points = [];
        const angleStep = Math.PI / 180; // Step size in radians

        // Generate points for the hippopede (figure-eight curve)
        for (let t = 0; t < 2 * Math.PI; t += angleStep) {
            const x = radius * Math.cos(t) + 0.5 * Math.sin(2 * t); // Slightly oscillating path
            const y = radius * Math.sin(t) * Math.sin(tilt);
            const z = radius * Math.sin(2 * t) * Math.cos(tilt); // Adjust for inclination

            points.push(x, y, z);
        }

        hippopedeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const hippopedeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const hippopedeLine = new THREE.Line(hippopedeGeometry, hippopedeMaterial);
        group.add(hippopedeLine);
    }

    // Update planet positions along the hippopede paths over time
    let time = 0;
    function updatePlanetPositions() {
        time += params.speedFactor; // Ensure time progresses with each frame

        Object.keys(planetObjects).forEach(name => {
            const planet = planetObjects[name];
            const t = time * planet.speed; // Calculate time-dependent position

            // Use the same equations from the hippopede generation for movement
            const x = planet.radius * Math.cos(t) + 0.5 * Math.sin(2 * t);
            const y = planet.radius * Math.sin(t) * Math.sin(planet.tilt);
            const z = planet.radius * Math.sin(2 * t) * Math.cos(planet.tilt);

            planet.mesh.position.set(x, y, z); // Update planet position
            planet.label.position.set(x + 3, y, z); // Make the label follow the planet
        });
    }

    // Animate Function
    function animate() {
        requestAnimationFrame(animate);

        // Update the position of the Sun, Moon, and Mercury along the hippopede paths
        updatePlanetPositions();

        // Render the scene
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeRenderer('render-area-eudoxus', camera, renderer);
    });
}

// Initialize Ptolemy model
function initPtolemyModel() {
    const renderAreaPtolemy = document.getElementById('render-area-ptolemy');
    renderAreaPtolemy.innerHTML = ''; // Clear previous content

    // Additional Ptolemy model code goes here...
}



