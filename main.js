import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Player from "./Scripts/Player";
import IsoCamera from "./Scripts/IsoCamera";

//Initialization of variables and objects.
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const platform = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1, 7.5), new THREE.MeshStandardMaterial({ color: 0xffffff }));
// const pillar = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const exporter = new GLTFExporter();
const btn = document.getElementById("download-glb");
// const helper = new THREE.CameraHelper(dirLight.shadow.camera);
var player = new Player();
var mainCamera = new IsoCamera(75, 1, 0.1, 1000);

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

//Adding objects to the scene as children.
scene.add(platform);

// for(let i = -2; i < 3; i++)
// {
//     if(i != 0)
//     {
//         let pillar = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
//         scene.add(pillar);
//         pillar.position.set(i, pillar.position.y, i);
//     }
// }

let pillar1 = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
pillar1.position.set(-2, 0, -2);
let pillar2 = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
pillar2.position.set(-2, 0, 2);
let pillar3 = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
pillar3.position.set(2, 0, -2);
let pillar4 = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }));
pillar4.position.set(2, 0, 2);

scene.add(pillar1, pillar2, pillar3, pillar4);

// scene.add(pillar);
scene.add(player);
// scene.add(helper);
scene.add(dirLight);
// scene.add(dirLight.target);

dirLight.position.set(3, 5, 1);
player.position.set(0, 1, 0);
mainCamera.position.set(-5, 5, 5);
mainCamera.lookAt(player.position);                 //Calling this on start so that the camera is always looking at the player.

renderer.setSize(600, 600); // renderer.setSize(725, 725);
document.body.appendChild(renderer.domElement);
// document.addEventListener("keydown", player.MovePlayer.bind(player), false);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("mousedown", onMouseDown);
btn.addEventListener("click", download);

function onPointerMove(event)
{
    pointer.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    pointer.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
}

function onMouseDown(event)
{
    raycaster.setFromCamera(pointer, mainCamera);
    const intersects = raycaster.intersectObject(platform);

    // for(let i = 0; i < intersects.length; i++)
    // {
    //     // intersects[i].object.material.color.set(0xffffff);
    //     console.log(intersects[i].point);
    // }

    player.travelTo = intersects[0].point;
}

function animate()
{
    requestAnimationFrame(animate);
    mainCamera.FollowTarget(player);
    player.MovePlayerToPoint();
    renderer.render(scene, mainCamera);
}

animate();

function download()
{
    exporter.parse(scene, (gltf) => { saveArrayBuffer(gltf, "testScene.glb"); }, (error) => { console.log("Encountered an error."); }, { binary: true });
}

function saveArrayBuffer(buffer, fileName)
{
    save(new Blob([buffer], {type: "application/octet-stream"}), fileName);
}

function save(_blob, fileName)
{
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = URL.createObjectURL(_blob);
    link.dowload = fileName;
    link.click();
}