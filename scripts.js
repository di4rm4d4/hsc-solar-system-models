// Existing variables and functions...

// Show Eudoxus model and initialize additional models on button click
toggleButton.addEventListener('click', () => {
    landingPage.style.display = 'none';
    eudoxusPage.style.display = 'flex';
    initEudoxusModel();
    initBasicModel1();
    initBasicModel2();
});

// Function to initialize Basic Model 1
function initBasicModel1() {
    const renderArea = document.getElementById('render-area-basic1');
    renderArea.innerHTML = ''; // Clear previous content if any

    // Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, renderArea.clientWidth / renderArea.clientHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderArea.clientWidth, renderArea.clientHeight);
    renderArea.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Basic Model 1 (Single rotating sphere)
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff5733, wireframe: true });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMesh);

    function animate() {
        requestAnimationFrame(animate);
        sphereMesh.rotation.y += 0.01;
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

// Function to initialize Basic Model 2
function initBasicModel2() {
    const renderArea = document.getElementById('render-area-basic2');
    renderArea.innerHTML = ''; // Clear previous content if any

    // Scene & Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, renderArea.clientWidth / renderArea.clientHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderArea.clientWidth, renderArea.clientHeight);
    renderArea.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Basic Model 2 (Two concentric rotating spheres to illustrate basic motion)
    const innerSphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const outerSphereGeometry = new THREE.SphereGeometry(8, 32, 32);
    const innerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x337ab7, wireframe: true });
    const outerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x5bc0de, wireframe: true });

    const innerSphereMesh = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
    const outerSphereMesh = new THREE.Mesh(outerSphereGeometry, outerSphereMaterial);

    scene.add(innerSphereMesh);
    scene.add(outerSphereMesh);

    function animate() {
        requestAnimationFrame(animate);
        innerSphereMesh.rotation.y += 0.01;
        outerSphereMesh.rotation.y -= 0.005;
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
