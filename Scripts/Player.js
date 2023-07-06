/* Everything about the player. */

import * as THREE from "three";

export default class Player extends THREE.Object3D
{
    constructor()
    {
        super();

        this.health = 100;
    }
}