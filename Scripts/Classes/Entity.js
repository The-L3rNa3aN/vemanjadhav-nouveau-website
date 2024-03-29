/* A class that enemies and the player object can inherit from. I figure this is tbe better way to program.
The purpose of the Entity class is to have basic things like taking damage, events like death and other basic things common. */

import * as THREE from "three";
import BasicHealthSystem from "./BasicHealthSystem";

export default class Entity extends THREE.Group
{
    constructor()
    {
        this.healthSystem;
        this.target = undefined;

        this.setHealthSystem();
    }

    setHealthSystem()
    {
        this.healthSystem = new BasicHealthSystem();
    }

    setTarget(_target)
    {
        this.target = _target;
    }
}