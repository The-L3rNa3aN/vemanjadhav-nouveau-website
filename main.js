import * as THREE from "three";
// import OBJExporter from "three-obj-exporter";
// import OBJExporter from "./Scripts/Addons/OBJExporter";
// import _GLTFExporter from "three-gltf-exporter";
import GLTFExporter from "three-gltf-exporter";
import Player from "./Scripts/Player";
import IsoCamera from "./Scripts/IsoCamera";

//Initialization of variables and objects.
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const geometry = new THREE.BoxGeometry(7.5, 1, 7.5);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
const platform = new THREE.Mesh(geometry, material);
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
    console.log("PASSED TO DOWNLOAD");
    console.log(scene);
    exporter.parse(scene, (result) =>
    {
        console.log("RESULT");
        saveArrayBuffer(result, "testScene.glb");
    }, { binary: true });
}

function saveArrayBuffer(buffer, fileName)
{
    console.log("PASSED TO SAVEARRAYBUFFER");
    save(new Blob([buffer], {type: "application/octet-stream"}), fileName);
}

function save(_blob, fileName)
{
    console.log("PASSED TO SAVE");
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = URL.createObjectURL(_blob);
    link.dowload = fileName;
    link.click();
}