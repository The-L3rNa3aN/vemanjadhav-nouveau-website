/* The name says it all. All stuff regarding the camera lies here. */
/* TO DO: -
     - Create a parameter for the object the camera needs to follow.
     - Logic for following the said object. */

import * as THREE from "three";

export default class IsoCamera extends THREE.PerspectiveCamera
{
    constructor(fov, aspect, near, far)
    {
        super(fov, aspect, near, far);
    }

    followTarget()
    {
        //Enter logic here.
    }
}