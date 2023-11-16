/* Dummy enemy for pathfinding testing. */

import * as THREE from "three";
import Entity from "./Classes/Entity";

export default class DummyEnemy extends Entity
{
    constructor()
    {
        super();

        this.speed = 5;
        this.detectionSphere = undefined;

        this.Init();
    }

    Init()
    {
        let material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
        mesh.castShadow = true;
        mesh.enableShadow = true;
        this.castShadow = true;
        this.receiveShadow = true;
        mesh.position.set(0, 0.5, 0);

        let sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        this.detectionSphere = new THREE.Mesh(new THREE.SphereGeometry(3, 6, 6), sphereMaterial);
        this.detectionSphere.position.set(0, 0.5, 0);

        this.add(mesh);
        this.add(this.detectionSphere);
    }
}