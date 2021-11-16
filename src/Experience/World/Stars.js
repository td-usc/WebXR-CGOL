import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Stars {
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        const particlesGeometry = new THREE.BufferGeometry()
        const count = 700
        const positions = new Float32Array(count*3)
        const color = new Float32Array(count*3)

        // positions.forEach((e,i)=>{positions[i] = Math.random()})
        for(let i = 0; i < count * 3; i++){
            // color[i] = Math.random()
            color[i] = 1
        }
        // for(let i = 0; i < count * 3; i++){
        //     positions[i] = (Math.random() - 0.5) * 10
        // }
        for(let i = 0; i < count * 3; i+=3){
            positions[i] = (Math.random() - 0.5) * 30
            positions[i+1] = (Math.random() - 0.5) * 30
            positions[i+2] = (Math.random() -0.5) * 30
        }
        particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
        particlesGeometry.setAttribute('color',new THREE.BufferAttribute(color,3))
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.22,
            sizeAttenuation: true
        })
        particlesMaterial.color = new THREE.Color('white')
        particlesMaterial.vertexColors = true

        // particlesMaterial.map = particleTexture
        particlesMaterial.transparent = true
        particlesMaterial.alphaMap = this.resources.items.star
        particlesMaterial.alphaTest = 0.001
        // particlesMaterial.depthTest = false
        particlesMaterial.depthWrite = false

        //this one is a bigger performance impact

        particlesMaterial.blending = THREE.AdditiveBlending
        // Points
        this.particles = new THREE.Points(particlesGeometry,particlesMaterial)
        this.scene.add(this.particles)
           }
}