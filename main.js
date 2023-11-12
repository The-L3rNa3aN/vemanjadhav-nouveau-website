import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Player from "./Scripts/Player";
import IsoCamera from "./Scripts/IsoCamera";
import { Pathfinding, PathfindingHelper } from "three-pathfinding";

//Initialization of variables and objects.
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
var platform = undefined;
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const exporter = new GLTFExporter();
const loader = new GLTFLoader();
// const btn = document.getElementById("download-glb");
// const helper = new THREE.CameraHelper(dirLight.shadow.camera);
var player = new Player();
var mainCamera = new IsoCamera(75, 1, 0.1, 1000);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 500;

//Adding objects to the scene as children.
loader.load("./Assets/Scenes/testScene/testScene.glb", (gltf) =>
{
    platform = gltf;
    platform.scenes[0].children[0].castShadow = true;
    platform.scenes[0].children[0].receiveShadow = true;
    platform.scenes[0].children[0].material = new THREE.MeshStandardMaterial({ color: 0x808080 });

    console.log(player, platform);
    scene.add(platform.scene);
});

// scene.add(pillar);
scene.add(player);
// scene.add(helper);
scene.add(dirLight);
// scene.add(dirLight.target);

dirLight.position.set(3, 5, 1);
player.position.set(0, 1, 0);
mainCamera.position.set(-5, 5, 5);
mainCamera.lookAt(player.position);                 //Calling this on start so that the camera is always looking at the player.

const pf = new Pathfinding();
const pfHelper = new PathfindingHelper();
scene.add(pfHelper);
const ZONE = "level1";
const _speed = 5;
let navmesh; let groupID; let navpath;
loader.load("./Assets/Scenes/testScene/testlevelnavmesh.glb", (gltf) =>
{
    gltf.scene.traverse((node) =>
    {
        if(!navmesh && node.isObject3D && node.children && node.children.length > 0)
        {
            navmesh = node.children[0];
            pf.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry));
        }
    });
});

renderer.setSize(600, 600); // renderer.setSize(725, 725);
document.body.appendChild(renderer.domElement);
// document.addEventListener("keydown", player.MovePlayer.bind(player), false);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("mousedown", onMouseDown);
// btn.addEventListener("click", download);

function onPointerMove(event)
{
    pointer.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    pointer.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
}

function onMouseDown(event)
{
    raycaster.setFromCamera(pointer, mainCamera);
    const intersects = raycaster.intersectObject(platform.scene);

    // for(let i = 0; i < intersects.length; i++)
    // {
    //     // intersects[i].object.material.color.set(0xffffff);
    //     console.log(intersects[i].point);
    // }

    player.travelTo = intersects[0].point;

    //CODE FROM THE PATHFINDING TUTORIAL
    groupID = pf.getGroup(ZONE, player.position);
    let playerPos = new THREE.Vector3(player.position.x, player.position.y + 1, player.position.z);
    let targetPos = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y + 1, intersects[0].point.z);
    const closest = pf.getClosestNode(playerPos, ZONE, groupID);
    navpath = pf.findPath(closest.centroid, targetPos, ZONE, groupID);
    if(navpath)
    {
        pfHelper.reset();
        pfHelper.setPlayerPosition(playerPos);
        pfHelper.setTargetPosition(targetPos);
        pfHelper.setPath(navpath);
    }
}

// function animate()
// {
//     requestAnimationFrame(animate);
//     mainCamera.FollowTarget(player);
//     player.MovePlayerToPoint();
//     renderer.render(scene, mainCamera);
// }

// animate();

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

//CODE FROM THE PATHFINDING TUTORIAL
function move (delta) {
    if ( !navpath || navpath.length <= 0 ) return;

    let targetPosition = navpath[ 0 ];
    const distance = targetPosition.clone().sub( player.position );

    if (distance.lengthSq() > 0.05 * 0.05) {
        distance.normalize();
        // Move player to target
        player.position.add( distance.multiplyScalar( delta * 5 ) );
    } else {
        // Remove node from the path we calculated
        navpath.shift();
    }
}

const clock = new THREE.Clock();
let gameloop = () =>
{
    requestAnimationFrame(gameloop);
    mainCamera.FollowTarget(player);
    move(clock.getDelta());
    renderer.render(scene, mainCamera);
};
gameloop();