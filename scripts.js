document.getElementById('btn-eudoxus').addEventListener('click', function() {
    document.getElementById('eudoxus-info').style.display = 'block';
    document.getElementById('render-area-eudoxus').style.display = 'block';
    document.getElementById('ptolemy-info').style.display = 'none';
    document.getElementById('render-area-ptolemy').style.display = 'none';
    initEudoxusModel();
});

document.getElementById('btn-ptolemy').addEventListener('click', function() {
    document.getElementById('eudoxus-info').style.display = 'none';
    document.getElementById('render-area-eudoxus').style.display = 'none';
    document.getElementById('ptolemy-info').style.display = 'block';
    document.getElementById('render-area-ptolemy').style.display = 'block';
    initPtolemyModel();
});

// Eudoxus Model Function
function initEudoxusModel() {
    const renderAreaEudoxus = document.getElementById('render-area-eudoxus');
    renderAreaEudoxus.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 400) / window.innerHeight, 1, 1000);
    camera.position.set(0, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 400, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderAreaEudoxus.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50).normalize();
    scene.add(directionalLight);

    // Eudoxus model
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 64), new THREE.MeshStandardMaterial({ color: 0x123456 }));
    scene.add(earthMesh);

    const outerSphereGeometry = new THREE.SphereGeometry(30, 64, 64);
    const outerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00, wireframe: true });
    const outerSphere = new THREE.Mesh(outerSphereGeometry, outerSphereMaterial);
    scene.add(outerSphere);

    const innerSphereGeometry = new THREE.SphereGeometry(25, 64, 64);
    const innerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
    scene.add(innerSphere);

    const epicycleOrbit = new THREE.Mesh(new THREE.RingGeometry(5, 5.5, 32), new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }));
    epicycleOrbit.rotation.x = Math.PI / 2;
    epicycleOrbit.position.set(20, 0, 0);
    scene.add(epicycleOrbit);

    function animateEudoxus() {
        requestAnimationFrame(animateEudoxus);
        epicycleOrbit.rotation.z += 0.01; // Rotate the epicycle
        outerSphere.rotation.y += 0.005; // Rotate the outer sphere
        innerSphere.rotation.y += 0.01; // Rotate the inner sphere
        controls.update();
        renderer.render(scene, camera);
    }
    animateEudoxus();

    window.addEventListener('resize', () => resizeRenderer('render-area-eudoxus', camera, renderer));
}

// Ptolemaic Model Function
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

// Resize Function
function resizeRenderer(renderAreaId, camera, renderer) {
    const renderArea = document.getElementById(renderAreaId);
    const width = window.innerWidth - 400;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
