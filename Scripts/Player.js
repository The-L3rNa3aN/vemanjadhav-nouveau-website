/* Everything about the player. */

import * as THREE from "three";

export default class Player extends THREE.Object3D
{
    constructor()
    {
        super();

        this.health = 100;
        this.speed = 5;
        this.travelTo = undefined;

        this.Init();
    }

    Init()
    {
        //Add something here.
        let material  = new THREE.MeshStandardMaterial({ color: 0xffffff });
        let mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
        mesh.castShadow = true;
        mesh.enableShadow = true;
        this.castShadow = true;
        this.receiveShadow = true;
        mesh.position.set(0, 0.5);

        this.add(mesh);
    }

    // MovePlayer(event)
    // {
    //     var _keyCode = event.which;

    //     switch(_keyCode)
    //     {
    //         case 87:                                        //W
    //             this.position.x += 1;
    //             break;
    
    //         case 65:                                        //A
    //             this.rotation.y += 25;
    //             break;

    //         case 83:                                        //S
    //             this.position.x -= 1;
    //             break;

    //         case 68:                                        //D
    //             this.rotation.y -= 25;
    //             break;
    //     }
    // }

    MovePlayerToPoint()
    {
        if(this.travelTo != undefined) 
        {
            this.position.lerp(new THREE.Vector3(this.travelTo.x, this.travelTo.y + 1, this.travelTo.z), 0.01);
        }
    }
}