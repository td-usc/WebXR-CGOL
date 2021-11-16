import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from './Experience.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.sim = this.experience.world.sim

        this.setInstance()
        this.setOrbitControls()


    }
    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.instance.position.set(0,this.sim.rows * this.sim.cellSize/2,5)
        this.scene.add(this.instance)
    }
    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.target = new THREE.Vector3(0, this.sim.rows * this.sim.cellSize/2 , 0)
    }
    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
    update()
    {
        this.controls.update()
    }
}