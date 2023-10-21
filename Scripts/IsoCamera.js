/* The name says it all. All stuff regarding the camera lies here. */

import * as THREE from "three";

export default class IsoCamera extends THREE.PerspectiveCamera
{
    constructor(fov, aspect, near, far)
    {
        super(fov, aspect, near, far);

        this.smoothing = 0.125;
        this.offset = new THREE.Vector3(-5, 5, 5);
    }

    FollowTarget(target)
    {
        // let targetPos = target.position + this.offset;
        let targetPos = new THREE.Vector3(target.position.x + this.offset.x, target.position.y + this.offset.y, target.position.z + this.offset.z);
        this.position.lerp(targetPos, this.smoothing);
        // this.lookAt(target.position);
    }
}