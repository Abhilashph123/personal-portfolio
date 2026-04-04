import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13;

const scene = new THREE.Scene();
let bee;
let mixer;
const loader = new GLTFLoader();

// Updated relative path for local model
loader.load('/demon_bee_full_texture1.glb',
    function (gltf) {
        bee = gltf.scene;
        scene.add(bee);

        mixer = new THREE.AnimationMixer(bee);
        if (gltf.animations.length > 0) {
            mixer.clipAction(gltf.animations[0]).play();
        }
        modelMove();
    },
    function (xhr) { },
    function (error) { 
        console.error('Error loading 3D model:', error);
    }
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('container3D').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.016); // Standard frame rate update
};
reRender3D();

// Updated positions to match index.html section IDs
let arrPositionModel = [
    {
        id: 'hero',
        position: { x: 0, y: -1, z: 0 },
        rotation: { x: 0, y: 1.5, z: 0 }
    },
    {
        id: "about",
        position: { x: 1.5, y: -1, z: -5 },
        rotation: { x: 0.5, y: -0.5, z: 0 },
    },
    {
        id: "experience",
        position: { x: -1.5, y: -1, z: -5 },
        rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
        id: "projects",
        position: { x: 0, y: -0.5, z: -2 },
        rotation: { x: 0.2, y: -0.8, z: 0 },
    },
    {
        id: "project-1", // Content on Left
        position: { x: 1.8, y: -0.5, z: -2 }, // Bee on Right
        rotation: { x: 0.2, y: -1.2, z: 0 },
    },
    {
        id: "project-2", // Content on Right
        position: { x: -1.8, y: -0.5, z: -2 }, // Bee on Left
        rotation: { x: 0.2, y: 0.8, z: 0 },
    },
    {
        id: "education",
        position: { x: 0, y: -1, z: -5 },
        rotation: { x: 0, y: 0.5, z: 0 },
    },
    {
        id: "education-1", // Content on Left
        position: { x: 1.8, y: -1, z: -5 }, // Bee on Right
        rotation: { x: 0.4, y: -1, z: 0 },
    },
    {
        id: "education-2", // Content on Right
        position: { x: -1.8, y: -1, z: -5 }, // Bee on Left
        rotation: { x: 0.4, y: 1, z: 0 },
    },
    {
        id: "contact",
        position: { x: 0, y: -1, z: 2 },
        rotation: { x: 0.3, y: -0.5, z: 0 },
    },
];

const modelMove = () => {
    // Select sections and individual staggered items
    const triggerElements = document.querySelectorAll('.section, .parallax-section, .education-item, .project-item');
    let currentId = 'hero';
    
    triggerElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Use a smaller offset for individual items to ensure accurate detection
        if (rect.top <= window.innerHeight / 2) {
            currentId = el.id;
        }
    });

    let position_active = arrPositionModel.findIndex(
        (val) => val.id == currentId
    );

    if (position_active >= 0 && bee) {
        let new_coordinates = arrPositionModel[position_active];
        
        // Adjust for mobile viewport
        const isMobile = window.innerWidth <= 768;
        const xOffset = isMobile ? 0.3 : 1; // Drastically reduce horizontal movement on mobile

        gsap.to(bee.position, {
            x: new_coordinates.position.x * xOffset,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 2,
            ease: "power2.out"
        });

        // Scale down bee for mobile to avoid covering text
        const targetScale = isMobile ? 0.6 : 1;
        gsap.to(bee.scale, {
            x: targetScale,
            y: targetScale,
            z: targetScale,
            duration: 1
        });
        gsap.to(bee.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 2,
            ease: "power2.out"
        })
    }
}

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        modelMove();
    }
})

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});