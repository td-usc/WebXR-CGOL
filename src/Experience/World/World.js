import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Sim from './Sim.js'
import Stars from './Stars.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sim = new Sim(50,50)
        this.floor = new Floor()
        // this.stars = new Stars()
        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            console.log('resources ready')
            this.stars = new Stars()
            this.environment = new Environment()
        })
        this.sim.randomize()
        this.sim.updateMeshes()
    }
    update() {

        if(this.stars){
            this.stars.particles.rotation.x += 0.0002
        }
    }
}