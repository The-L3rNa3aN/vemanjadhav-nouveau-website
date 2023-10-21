import * as THREE from "three";
import Player from "./Scripts/Player";
import IsoCamera from "./Scripts/IsoCamera";

//Initialization of variables.
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(5, 1, 5);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const platform = new THREE.Mesh(geometry, material);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
// const helper = new THREE.CameraHelper(dirLight.shadow.camera);
var player = new Player();
var mainCamera = new IsoCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 500;

platform.castShadow = true;
platform.receiveShadow = true;
// dirLight.target = testCube;

scene.add(platform);
scene.add(player);
// scene.add(helper);
scene.add(dirLight);
// scene.add(dirLight.target);

dirLight.position.set(3, 5, 1);
player.position.set(0, 1, 0);
mainCamera.position.set(-5, 5, 5);
mainCamera.lookAt(player.position);                 //Calling this on start so that the camera is always looking at the player.

renderer.setSize(725, 725);
document.body.appendChild(renderer.domElement);
document.addEventListener("keydown", player.MovePlayer.bind(player), false);
document.addEventListener("pointermove", onPointerMove);

raycaster.setFromCamera(pointer, mainCamera);
const intersects = raycaster.intersectObjects(scene.children);
for(let i = 0; i < intersects.length; i++)
{
    intersects[i].object.material.color.set(0xff0000);
}

function onPointerMove(event)
{
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate()
{
    requestAnimationFrame(animate);
    mainCamera.FollowTarget(player);
    renderer.render(scene, mainCamera);
}

animate();